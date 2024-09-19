package com.musicstore.order.service;

import com.musicstore.order.dto.*;
import com.musicstore.order.model.Order;
import com.musicstore.order.model.OrderLineItems;
import com.musicstore.order.model.OrderStatus;
import com.musicstore.order.repository.OrderRepository;
import com.musicstore.order.security.config.VariablesConfiguration;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;

    private final WebClient.Builder webClient;

    private final VariablesConfiguration variablesConfiguration;

    public String createOrder(OrderRequest request, String csrfToken, String jwtToken) {

        if (request.getCity() == null || request.getCity().isEmpty()
                || request.getCountry() == null || request.getCountry().isEmpty()
                || request.getName() == null || request.getName().isEmpty()
                || request.getPhone() == null || request.getPhone().isEmpty()
                || request.getEmail() == null || request.getEmail().isEmpty()
                || request.getOrderTotalPrice() == null || request.getSurname() == null
                || request.getSurname().isEmpty() || request.getStreetAddress() == null
                || request.getStreetAddress().isEmpty() || request.getUserIdentifier() == null
                || request.getZipCode() == null || request.getZipCode().isEmpty()
                || request.getItems().isEmpty()
        ) {
            log.error("Bad order creation request");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order request");
        }

        if (!jwtToken.startsWith("Bearer ")) {
            log.error("No admin authority for token - " + jwtToken);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid token");
        }

        List<OrderAvailabilityListItem> itemsNotAvailable = new ArrayList<>();

        OrderAvailabilityResponse response;

        response = webClient.build()
                .post()
                .uri(variablesConfiguration.getOrderCheckUrl())
                .header("X-XSRF-TOKEN", csrfToken)
                .cookie("XSRF-TOKEN", csrfToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OrderAvailabilityResponse.class)
                .block();

        Objects.requireNonNull(response);

        response.getAvailableItems().forEach(
                item -> {
                    if (!item.getIsAvailable()) {
                        itemsNotAvailable.add(item);
                    }
                });

        if (!itemsNotAvailable.isEmpty()) {
            log.error("Not all items are available for order - " + request);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Not all items are available. Items not available - " + itemsNotAvailable);
        }

        Order order = new Order(
                request.getUserIdentifier(),
                request.getName(),
                request.getSurname(),
                request.getEmail(),
                request.getPhone(),
                request.getCountry(),
                request.getStreetAddress(),
                request.getCity(),
                request.getZipCode(),
                request.getOrderTotalPrice(),
                request.getItems()
                        .stream()
                        .map(this::mapToDto)
                        .toList()
        );

        orderRepository.save(order);
        log.info("Order created - " + order);

        return "Order placed successfully";

    }

    public ResponseEntity<Page<Order>> getAllOrdersByUserId(
            UUID userId,
            Integer page,
            Integer pageSize) {

        Pageable pageable = PageRequest.of(
                page,
                pageSize,
                Sort.by("dateCreated")
                        .descending());

        Page<Order> orders = orderRepository.findAllByUserIdentifier(userId, pageable);

        return ResponseEntity.ok(orders);
    }

    public ResponseEntity<Order> getOrderDetails(UUID orderId) {

        Order order = orderRepository.findByOrderIdentifier(orderId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Order not found")
                );

        return ResponseEntity.ok(order);
    }

    public ResponseEntity<String> updateOrderStatus(
            UUID orderId, String token,
            String csrfToken, OrderUpdateRequest request) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "No admin authority");
        }

        if (request.getStatus() == null
                || request.getStatus().toString().isEmpty()
                || request.getItemsToCancel() == null
                || request.getItemsToCancel().isEmpty()
        ) {
            log.error("Bad order status update request");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid status");
        }

        Order order = orderRepository
                .findByOrderIdentifier(orderId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Order not found")
                );

        Boolean response = null;

        if (
                request.getStatus().equals(OrderStatus.CANCELED)
                || request.getStatus().equals(OrderStatus.FAILED)
        ) {
            OrderCancelRequest orderCancelRequest = new OrderCancelRequest();
            orderCancelRequest.setItems(request.getItemsToCancel());
            response = webClient.build()
                    .post()
                    .uri(variablesConfiguration.getOrderCancellationUrl())
                    .header("X-XSRF-TOKEN", csrfToken)
                    .cookie("XSRF-TOKEN", csrfToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(orderCancelRequest)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();

        }

        if (!Boolean.TRUE.equals(response)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Order update failed because of bad products in list");
        }

        order.setStatus(request.getStatus());
        orderRepository.save(order);
        log.info("Order updated - " + order);
        return ResponseEntity.ok("Order status updated successfully");
    }

    private OrderLineItems mapToDto(OrderLineItemsDto orderLineItemsDto) {
        OrderLineItems orderLineItems = new OrderLineItems();
        orderLineItems.setProductSkuId(orderLineItemsDto.getProductSkuId());
        orderLineItems.setQuantity(orderLineItemsDto.getQuantity());
        orderLineItems.setUnitPrice(orderLineItemsDto.getUnitPrice());
        return orderLineItems;
    }

    private Boolean doesUserHaveAdminAuthorities(String token) {

        if (!token.startsWith("Bearer ")) {
            log.error("Invalid token - " + token);
            throw new RuntimeException("Invalid token");
        }

        String jwtToken = token.substring("Bearer ".length());

        return webClient
                .build()
                .get()
                .uri(variablesConfiguration.getAdminVerificationUrl() + jwtToken)
                .retrieve()
                .bodyToMono(Boolean.class)
                .block();

    }
}
