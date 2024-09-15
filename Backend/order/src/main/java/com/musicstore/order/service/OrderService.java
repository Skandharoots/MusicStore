package com.musicstore.order.service;

import com.musicstore.order.dto.*;
import com.musicstore.order.model.Order;
import com.musicstore.order.model.OrderLineItems;
import com.musicstore.order.repository.OrderRepository;
import com.musicstore.order.security.config.VariablesConfiguration;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@AllArgsConstructor
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order request");
        }

        List<String> itemsNotAvailable = new ArrayList<>();

        if (!jwtToken.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid token");
        }

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
                        itemsNotAvailable.add(item.getProductSkuId().toString());
                    }
                });

        if (!itemsNotAvailable.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not all items are available. Items not available - " + itemsNotAvailable);
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

        return "Order placed successfully";

    }

    public ResponseEntity<Page<OrderResponse>> getAllOrdersByUserId(UUID userId, Integer page, Integer pageSize) {

        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("dateCreated").descending());

        Page<Order> orders = orderRepository.findAllByUserIdentifier(userId, pageable);

        List<OrderResponse> orderResponsesList = orders
                .stream()
                .map(this::mapToOrderListDTO)
                .toList();

        Page<OrderResponse> orderResponses = new PageImpl<>(orderResponsesList, pageable, orderResponsesList.size());

        return ResponseEntity.ok(orderResponses);
    }

    public ResponseEntity<Order> getOrderDetails(UUID orderId) {

        Order order = orderRepository.findByOrderIdentifier(orderId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found")
                );

        return ResponseEntity.ok(order);
    }

    public ResponseEntity<String> updateOrderStatus(UUID orderId, String token, OrderUpdateRequest request) {

		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
		}

        if (request.getStatus() == null || request.getStatus().toString().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }

        Order order = orderRepository
                .findByOrderIdentifier(orderId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found")
                );

        order.setStatus(request.getStatus());
        orderRepository.save(order);
        return ResponseEntity.ok("Order status updated successfully");
    }

    private OrderLineItems mapToDto(OrderLineItemsDTO orderLineItemsDTO) {
        OrderLineItems orderLineItems = new OrderLineItems();
        orderLineItems.setProductSkuId(orderLineItemsDTO.getProductSkuId());
        orderLineItems.setQuantity(orderLineItemsDTO.getQuantity());
        orderLineItems.setUnitPrice(orderLineItemsDTO.getUnitPrice());
        return orderLineItems;
    }

    private OrderLineItemsDTO mapToOrderLineItemsDTO(OrderLineItems orderLineItems) {
        OrderLineItemsDTO orderLineItemsDTO = new OrderLineItemsDTO();
        orderLineItemsDTO.setProductSkuId(orderLineItems.getProductSkuId());
        orderLineItemsDTO.setQuantity(orderLineItems.getQuantity());
        orderLineItemsDTO.setUnitPrice(orderLineItems.getUnitPrice());
        return orderLineItemsDTO;
    }

    private OrderResponse mapToOrderListDTO(Order order) {

        List<OrderLineItemsDTO> items = order
                .getOrderItems()
                .stream()
                .map(this::mapToOrderLineItemsDTO)
                .toList();

        return OrderResponse.builder()
                .orderIdentifier(order.getOrderIdentifier())
                .orderDateTime(order.getDateCreated())
                .items(items)
                .build();
    }

    private Boolean doesUserHaveAdminAuthorities(String token) {

        if (!token.startsWith("Bearer ")) {
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
