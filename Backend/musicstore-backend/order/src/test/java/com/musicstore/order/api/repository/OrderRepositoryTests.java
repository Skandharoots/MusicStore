package com.musicstore.order.api.repository;

import com.musicstore.order.model.Order;
import com.musicstore.order.model.OrderLineItems;
import com.musicstore.order.model.OrderStatus;
import com.musicstore.order.repository.OrderRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class OrderRepositoryTests {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TestEntityManager entityManager;

    private Order order;

    private OrderLineItems orderLineItems;

    private UUID productSkuId;

    private UUID userId;

    private LocalDateTime orderDate;

    @BeforeEach
    public void setup() {
        productSkuId = UUID.randomUUID();
        userId = UUID.randomUUID();
        orderDate = LocalDateTime.now();

        orderLineItems = new OrderLineItems();
        orderLineItems.setQuantity(10);
        orderLineItems.setUnitPrice(BigDecimal.valueOf(3672.00));
        orderLineItems.setProductSkuId(productSkuId);

        List<OrderLineItems> orderLineItemsList = new ArrayList<>();
        orderLineItemsList.add(orderLineItems);

        List<OrderStatus> statuses = new ArrayList<>();
        statuses.add(OrderStatus.RECEIVED);

        order = new Order();
        order.setStatus(statuses);
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
    public void createOrder() {

        Order savedOrder = orderRepository.save(order);

        Assertions.assertThat(savedOrder.getId()).isEqualTo(order.getId());
        Assertions.assertThat(savedOrder.getStatus().get(0)).isEqualTo(OrderStatus.RECEIVED);
        Assertions.assertThat(savedOrder.getOrderIdentifier()).isEqualTo(order.getOrderIdentifier());
        Assertions.assertThat(savedOrder.getName()).isEqualTo("Test");
        Assertions.assertThat(savedOrder.getCity()).isEqualTo("Test");
        Assertions.assertThat(savedOrder.getCountry()).isEqualTo("Test");
        Assertions.assertThat(savedOrder.getDateCreated()).isEqualTo(orderDate);
        Assertions.assertThat(savedOrder.getCountry()).isEqualTo("Test");
        Assertions.assertThat(savedOrder.getEmail()).isEqualTo("test@test.com");
        Assertions.assertThat(savedOrder.getPhone()).isEqualTo("+48 739 847 394");
        Assertions.assertThat(savedOrder.getStreetAddress()).isEqualTo("Test");
        Assertions.assertThat(savedOrder.getSurname()).isEqualTo("Test");
        Assertions.assertThat(savedOrder.getUserIdentifier()).isEqualTo(userId);
        Assertions.assertThat(savedOrder.getZipCode()).isEqualTo("83-234");
        Assertions.assertThat(savedOrder.getTotalPrice()).isEqualTo(BigDecimal.valueOf(3672.00));
        Assertions.assertThat(savedOrder.getOrderItems()).isNotNull();
        Assertions.assertThat(savedOrder.getOrderItems()).isNotEmpty();
        Assertions.assertThat(savedOrder.getOrderItems()).hasSize(1);
        Assertions.assertThat(savedOrder.getOrderItems().get(0).getId()).isEqualTo(orderLineItems.getId());
    }

    @Test
    public void findAllOrdersForUserUuidTest() {

        entityManager.persist(order);
        entityManager.flush();

        Pageable pageable = (Pageable) PageRequest.of(0, 10, Sort.by("dateCreated").descending());
        Page<Order> orders = orderRepository.findAllByUserIdentifier(userId, pageable);

        Assertions.assertThat(orders).hasSize(1);
        Assertions.assertThat(orders.getContent().get(0).getId()).isEqualTo(order.getId());
        Assertions.assertThat(orders.getContent().get(0)).isEqualTo(order);

    }

    @Test
    public void findAllOrdersTest() {

        entityManager.persist(order);
        entityManager.flush();

        Pageable pageable = (Pageable) PageRequest.of(0, 10, Sort.by("dateCreated").descending());
        Page<Order> orders = orderRepository.findAll(pageable);

        Assertions.assertThat(orders).hasSize(1);
        Assertions.assertThat(orders.getContent().get(0).getId()).isEqualTo(order.getId());
        Assertions.assertThat(orders.getContent().get(0)).isEqualTo(order);

    }

    @Test
    public void findOrderByIdentifierTest() {
        entityManager.persist(order);
        entityManager.flush();

        Optional<Order> orderFound = orderRepository.findByOrderIdentifier(order.getOrderIdentifier());
        Assertions.assertThat(orderFound).isPresent();
        Assertions.assertThat(orderFound.get().getId()).isEqualTo(order.getId());
        Assertions.assertThat(orderFound.get().getStatus()).isEqualTo(order.getStatus());
        Assertions.assertThat(orderFound.get().getOrderIdentifier()).isEqualTo(order.getOrderIdentifier());
        Assertions.assertThat(orderFound.get().getDateCreated()).isEqualTo(orderDate);
        Assertions.assertThat(orderFound.get().getCountry()).isEqualTo(order.getCountry());
        Assertions.assertThat(orderFound.get().getEmail()).isEqualTo(order.getEmail());
        Assertions.assertThat(orderFound.get().getPhone()).isEqualTo(order.getPhone());
        Assertions.assertThat(orderFound.get().getStreetAddress()).isEqualTo(order.getStreetAddress());
        Assertions.assertThat(orderFound.get().getSurname()).isEqualTo(order.getSurname());
        Assertions.assertThat(orderFound.get().getUserIdentifier()).isEqualTo(userId);
        Assertions.assertThat(orderFound.get().getZipCode()).isEqualTo(order.getZipCode());
        Assertions.assertThat(orderFound.get().getTotalPrice()).isEqualTo(order.getTotalPrice());
        Assertions.assertThat(orderFound.get().getOrderItems()).isNotNull();
        Assertions.assertThat(orderFound.get().getOrderItems()).isNotEmpty();
        Assertions.assertThat(orderFound.get().getOrderItems()).hasSize(1);
        Assertions.assertThat(orderFound.get().getOrderItems().get(0).getId()).isEqualTo(orderLineItems.getId());
    }
}
