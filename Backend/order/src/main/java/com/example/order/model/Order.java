package com.example.order.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "order_forms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private UUID orderIdentifier = UUID.randomUUID();

    private UUID userIdentifier;

    private LocalDateTime dateCreated = LocalDateTime.now();

    private String name;

    private String surname;

    private String email;

    private String phone;

    private String country;

    private String streetAddress;

    private String city;

    private String zipCode;

    private OrderStatus status = OrderStatus.IN_PROGRESS;

    @OneToMany(cascade = CascadeType.ALL)
    private List<OrderLineItems> orderItems;

    public Order(
            UUID userIdentifier,
            String name,
            String surname,
            String email,
            String phone,
            String country,
            String streetAddress,
            String city,
            String zipCode,
            List<OrderLineItems> orderItems
    ) {
        this.userIdentifier = userIdentifier;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phone = phone;
        this.country = country;
        this.streetAddress = streetAddress;
        this.city = city;
        this.zipCode = zipCode;
        this.orderItems = orderItems;
    }
}
