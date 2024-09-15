package com.musicstore.order.repository;

import com.musicstore.order.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findAllByUserIdentifier(UUID userId, Pageable pageable);

    Optional<Order> findByOrderIdentifier(UUID orderIdentifier);
}
