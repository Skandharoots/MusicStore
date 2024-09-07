package com.example.order.service;

import com.example.order.dto.OrderLineItemsDTO;
import com.example.order.dto.OrderRequest;
import com.example.order.dto.OrderResponse;
import com.example.order.dto.OrderUpdateRequest;
import com.example.order.model.Order;
import com.example.order.model.OrderLineItems;
import com.example.order.repository.OrderRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    private final WebClient.Builder webClient;


    public String createOrder(OrderRequest request) {

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
                .uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)
                .retrieve()
                .bodyToMono(Boolean.class)
                .block();

    }
}
