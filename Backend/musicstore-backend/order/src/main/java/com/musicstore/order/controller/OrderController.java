package com.musicstore.order.controller;

import com.musicstore.order.dto.OrderRequest;
import com.musicstore.order.dto.OrderUpdateRequest;
import com.musicstore.order.model.Order;
import com.musicstore.order.service.OrderService;
import jakarta.ws.rs.core.HttpHeaders;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/order")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public String createOrder(
            @RequestBody OrderRequest orderRequest,
            @CookieValue("XSRF-TOKEN") String csrfToken,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String jwtToken
    ) {
        return orderService.createOrder(orderRequest, csrfToken, jwtToken);
    }

    @PostMapping("/get/all")
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam(value = "page") Integer page,
            @RequestParam(value = "pageSize") Integer pageSize
    ) {
        return orderService.getAllOrders(page, pageSize);
    }

    @PostMapping("/get/all/{user-id}")
    public ResponseEntity<Page<Order>> getAllOrdersForUser(
            @PathVariable(name = "user-id") UUID userId,
            @RequestParam(value = "page") Integer page,
            @RequestParam(value = "pageSize") Integer pageSize
    ) {
        return orderService.getAllOrdersByUserId(userId, page, pageSize);
    }

    @PostMapping("/get/{order-id}")
    public ResponseEntity<Order> getOrderDetails(
            @PathVariable(name = "order-id") UUID orderId
    ) {
        return orderService.getOrderDetails(orderId);
    }

    @PutMapping("/update/{order-id}")
    public ResponseEntity<String> updateOrderDetails(
            @PathVariable(name = "order-id") UUID orderId,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @CookieValue("XSRF-TOKEN") String csrfToken,
            @RequestBody OrderUpdateRequest request
    ) {
        return orderService.updateOrderStatus(orderId, token, csrfToken, request);
    }


}
