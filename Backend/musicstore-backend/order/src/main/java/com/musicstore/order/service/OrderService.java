package com.musicstore.order.service;

import com.musicstore.order.dto.OrderAvailabilityListItem;
import com.musicstore.order.dto.OrderAvailabilityResponse;
import com.musicstore.order.dto.OrderCancelRequest;
import com.musicstore.order.dto.OrderLineItemsDto;
import com.musicstore.order.dto.OrderRequest;
import com.musicstore.order.dto.OrderUpdateRequest;
import com.musicstore.order.model.Order;
import com.musicstore.order.model.OrderLineItems;
import com.musicstore.order.model.OrderStatus;
import com.musicstore.order.repository.OrderRepository;
import com.musicstore.order.security.config.VariablesConfiguration;
import jakarta.transaction.Transactional;
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

    @Transactional
    public String createOrder(OrderRequest request, String csrfToken, String jwtToken) {

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
                    "We could not complete your order. Not all items are available.");
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
                        .toList());

        orderRepository.save(order);
        log.info("Order created - " + order.getOrderIdentifier());

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

    public ResponseEntity<Page<Order>> getAllOrders(Integer page, Integer pageSize) {

        Pageable pageable = PageRequest.of(
                page,
                pageSize,
                Sort.by("dateCreated").descending());

        Page<Order> orders = orderRepository.findAll(pageable);

        return ResponseEntity.ok(orders);
    }

    public ResponseEntity<Order> getOrderDetails(UUID orderId) {

        Order order = orderRepository.findByOrderIdentifier(orderId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Order not found"));

        return ResponseEntity.ok(order);
    }

    @Transactional
    public ResponseEntity<String> updateOrderStatus(
            UUID orderId, String token,
            String csrfToken, OrderUpdateRequest request) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "No admin authority");
        }

        Order order = orderRepository
                .findByOrderIdentifier(orderId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Order not found"));

        if (request.getStatus().equals(OrderStatus.CANCELED)
                || request.getStatus().equals(OrderStatus.RETURNED)) {
            OrderCancelRequest orderCancelRequest = new OrderCancelRequest();
            orderCancelRequest.setItems(request.getItemsToCancel());
            Boolean response = webClient.build()
                    .post()
                    .uri(variablesConfiguration.getOrderCancellationUrl())
                    .header("X-XSRF-TOKEN", csrfToken)
                    .cookie("XSRF-TOKEN", csrfToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(orderCancelRequest)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();

            if (!Boolean.TRUE.equals(response)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Order update failed because of bad products in list");
            }

        }
        List<OrderStatus> statuses = order.getStatus();
        statuses.add(request.getStatus());
        order.setStatus(statuses);
        orderRepository.save(order);
        log.info("Order updated - " + order.getOrderIdentifier());
        return ResponseEntity.ok("Order status updated successfully");
    }

    private OrderLineItems mapToDto(OrderLineItemsDto orderLineItemsDto) {
        OrderLineItems orderLineItems = new OrderLineItems();
        orderLineItems.setProductSkuId(orderLineItemsDto.getProductSkuId());
        orderLineItems.setProductName(orderLineItemsDto.getProductName());
        orderLineItems.setQuantity(orderLineItemsDto.getQuantity());
        orderLineItems.setUnitPrice(orderLineItemsDto.getUnitPrice());
        return orderLineItems;
    }

    private Boolean doesUserHaveAdminAuthorities(String token) {

        if (!token.startsWith("Bearer ")) {
            log.error("Invalid token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid token");
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
