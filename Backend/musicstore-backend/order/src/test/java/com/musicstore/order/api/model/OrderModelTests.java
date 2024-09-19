package com.musicstore.order.api.model;

import com.musicstore.order.model.Order;
import com.musicstore.order.model.OrderLineItems;
import com.musicstore.order.model.OrderStatus;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@SpringBootTest
public class OrderModelTests {

    private Order order;

    private OrderLineItems orderLineItems;

    private UUID orderId;

    private UUID productSkuId;

    private UUID userId;

    private LocalDateTime orderDate;

    @BeforeEach
    public void setup() {
        orderId = UUID.randomUUID();
        productSkuId = UUID.randomUUID();
        userId = UUID.randomUUID();
        orderDate = LocalDateTime.now();

        orderLineItems = new OrderLineItems();
        orderLineItems.setId(1L);
        orderLineItems.setQuantity(10);
        orderLineItems.setUnitPrice(BigDecimal.valueOf(3672.00));
        orderLineItems.setProductSkuId(productSkuId);

        List<OrderLineItems> orderLineItemsList = new ArrayList<>();
        orderLineItemsList.add(orderLineItems);

        order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.IN_PROGRESS);
        order.setOrderIdentifier(orderId);
        order.setName("Test");
        order.setCity("Test");
        order.setCountry("Test");
        order.setDateCreated(orderDate);
        order.setCountry("Test");
        order.setEmail("test@test.com");
        order.setPhone("+48 739 847 394");
        order.setStreetAddress("Test");
        order.setSurname("Test");
        order.setUserIdentifier(userId);
        order.setZipCode("83-234");
        order.setTotalPrice(BigDecimal.valueOf(3672.00));
        order.setOrderItems(orderLineItemsList);


    }

    @Test
    public void orderLineItemsSettersTest() {
        Assertions.assertThat(orderLineItems.getId()).isEqualTo(1L);
        Assertions.assertThat(orderLineItems.getQuantity()).isEqualTo(10);
        Assertions.assertThat(orderLineItems.getUnitPrice()).isEqualTo(BigDecimal.valueOf(3672.00));
        Assertions.assertThat(orderLineItems.getProductSkuId()).isEqualTo(productSkuId);
    }

    @Test
    public void orderConstructorTest() {

        List<OrderLineItems> items = new ArrayList<>();
        items.add(orderLineItems);

        Order orderConstructor = new Order(
                userId,
                "test",
                "test",
                "test@test.com",
                "+48 637 829 200",
                "test",
                "test",
                "test",
                "test",
                BigDecimal.valueOf(100.00),
                items
        );

        Assertions.assertThat(orderConstructor.getId()).isEqualTo(null);
        Assertions.assertThat(orderConstructor.getStatus()).isEqualTo(OrderStatus.IN_PROGRESS);
        Assertions.assertThat(orderConstructor.getOrderIdentifier()).isNotNull();
        Assertions.assertThat(orderConstructor.getName()).isEqualTo("test");
        Assertions.assertThat(orderConstructor.getCity()).isEqualTo("test");
        Assertions.assertThat(orderConstructor.getCountry()).isEqualTo("test");
        Assertions.assertThat(orderConstructor.getDateCreated()).isNotNull();
        Assertions.assertThat(orderConstructor.getCountry()).isEqualTo("test");
        Assertions.assertThat(orderConstructor.getEmail()).isEqualTo("test@test.com");
        Assertions.assertThat(orderConstructor.getPhone()).isEqualTo("+48 637 829 200");
        Assertions.assertThat(orderConstructor.getStreetAddress()).isEqualTo("test");
        Assertions.assertThat(orderConstructor.getSurname()).isEqualTo("test");
        Assertions.assertThat(orderConstructor.getUserIdentifier()).isEqualTo(userId);
        Assertions.assertThat(orderConstructor.getZipCode()).isEqualTo("test");
        Assertions.assertThat(orderConstructor.getTotalPrice()).isEqualTo(BigDecimal.valueOf(100.00));
        Assertions.assertThat(orderConstructor.getOrderItems()).isNotNull();
        Assertions.assertThat(orderConstructor.getOrderItems()).isNotEmpty();
        Assertions.assertThat(orderConstructor.getOrderItems()).hasSize(1);
        Assertions.assertThat(orderConstructor.getOrderItems().get(0).getId()).isEqualTo(1L);


    }

    @Test
    public void orderSettersTest() {

        Assertions.assertThat(order.getId()).isEqualTo(1L);
        Assertions.assertThat(order.getStatus()).isEqualTo(OrderStatus.IN_PROGRESS);
        Assertions.assertThat(order.getOrderIdentifier()).isEqualTo(orderId);
        Assertions.assertThat(order.getName()).isEqualTo("Test");
        Assertions.assertThat(order.getCity()).isEqualTo("Test");
        Assertions.assertThat(order.getCountry()).isEqualTo("Test");
        Assertions.assertThat(order.getDateCreated()).isEqualTo(orderDate);
        Assertions.assertThat(order.getCountry()).isEqualTo("Test");
        Assertions.assertThat(order.getEmail()).isEqualTo("test@test.com");
        Assertions.assertThat(order.getPhone()).isEqualTo("+48 739 847 394");
        Assertions.assertThat(order.getStreetAddress()).isEqualTo("Test");
        Assertions.assertThat(order.getSurname()).isEqualTo("Test");
        Assertions.assertThat(order.getUserIdentifier()).isEqualTo(userId);
        Assertions.assertThat(order.getZipCode()).isEqualTo("83-234");
        Assertions.assertThat(order.getTotalPrice()).isEqualTo(BigDecimal.valueOf(3672.00));
        Assertions.assertThat(order.getOrderItems()).isNotNull();
        Assertions.assertThat(order.getOrderItems()).isNotEmpty();
        Assertions.assertThat(order.getOrderItems()).hasSize(1);
        Assertions.assertThat(order.getOrderItems().get(0).getId()).isEqualTo(1L);



    }
}
