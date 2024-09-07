package com.musicstore.shoppingcart.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@ToString
@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private UUID userUuid;

    @NonNull
    private UUID productSgid;

    @NonNull
    private BigDecimal productPrice;

    @NonNull
    private String productName;

    @NonNull
    private Integer quantity;

    public Cart(UUID userUuid, UUID productSgid, BigDecimal productPrice, String productName, Integer quantity) {
        this.userUuid = userUuid;
        this.productSgid = productSgid;
        this.productPrice = productPrice;
        this.productName = productName;
        this.quantity = quantity;
    }
}
