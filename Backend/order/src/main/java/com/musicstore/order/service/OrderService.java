package com.musicstore.order.service;

import com.musicstore.order.dto.*;
import com.musicstore.order.model.Order;
import com.musicstore.order.model.OrderLineItems;
import com.musicstore.order.repository.OrderRepository;
import com.musicstore.order.security.config.VariablesConfiguration;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    private final WebClient.Builder webClient;

    private final VariablesConfiguration variablesConfiguration;

    public String createOrder(OrderRequest request, String csrfToken, String jwtToken) {

        List<String> itemsNotAvailable = new ArrayList<>();

        if (!jwtToken.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }

        String jwt = jwtToken.substring("Bearer ".length());

        OrderAvailabilityResponse response = webClient.build()
                .post()
                .uri(variablesConfiguration.getOrderCheckUrl())
                .headers(httpHeaders -> {
                    httpHeaders.setBearerAuth(jwt);
                    httpHeaders.set("X-XSRF-TOKEN", csrfToken);
                })
                .cookie("XSRF-TOKEN", csrfToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(OrderAvailabilityResponse.class)
                .block();

        assert response != null;
        response.getAvailableItems().forEach(
                item -> {
                    if (!item.getIsAvailable()) {
                        itemsNotAvailable.add(item.getProductSkuId().toString());
                    }
                });

        if (!itemsNotAvailable.isEmpty()) {
            throw new IllegalArgumentException("Not all items are available. Items not available - " + itemsNotAvailable);
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

        return "Order places successfully";

    }

    public ResponseEntity<List<OrderResponse>> getAllOrdersByUserId(UUID userId) {

        List<Order> orders = orderRepository.findAllByUserIdentifier(userId);

        List<OrderResponse> orderResponses = orders
                .stream()
                .map(this::mapToOrderListDTO)
                .toList();

        return ResponseEntity.ok(orderResponses);
    }

    public ResponseEntity<Order> getOrderDetails(UUID orderId) {

        Order order = orderRepository.findByOrderIdentifier(orderId)
                .orElseThrow(
                        () -> new NotFoundException("Order not found")
                );

        return ResponseEntity.ok(order);
    }

    public ResponseEntity<String> updateOrderStatus(UUID orderId, String token, OrderUpdateRequest request) {

        //TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

        Order order = orderRepository
                .findByOrderIdentifier(orderId)
                .orElseThrow(
                        () -> new NotFoundException("Order not found")
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
