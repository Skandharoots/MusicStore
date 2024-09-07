package com.example.order.controller;

import com.example.order.dto.OrderRequest;
import com.example.order.dto.OrderResponse;
import com.example.order.dto.OrderUpdateRequest;
import com.example.order.model.Order;
import com.example.order.service.OrderService;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/order")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public String createOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.createOrder(orderRequest);
    }

    @GetMapping("/get/all/{user-id}")
    public ResponseEntity<List<OrderResponse>> getAllOrdersForUser(
            @PathVariable(name = "user-id") UUID userId
    ) {
        return orderService.getAllOrdersByUserId(userId);
    }

    @GetMapping("/get/{order-id}")
    public ResponseEntity<Order> getOrderDetails(
            @PathVariable(name = "order-id") UUID orderId
    ) {
        return orderService.getOrderDetails(orderId);
    }

    @PutMapping("/update/{order-id}")
    public ResponseEntity<String> updateOrderDetails(
            @PathVariable(name = "order-id") UUID orderId,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody OrderUpdateRequest request
    ) {
        return orderService.updateOrderStatus(orderId, token, request);
    }


}
