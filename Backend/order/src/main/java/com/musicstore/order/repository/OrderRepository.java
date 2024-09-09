package com.musicstore.order.repository;

import com.musicstore.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByUserIdentifier(UUID userId);

    Optional<Order> findByOrderIdentifier(UUID orderIdentifier);
}
