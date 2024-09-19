package com.musicstore.shoppingcart.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NonNull
    private UUID userUuid;

    @NonNull
    private UUID productSkuId;

    @NonNull
    private BigDecimal productPrice;

    @NonNull
    private String productName;

    @NonNull
    private Integer quantity;

    public Cart(UUID userUuid, UUID productSkuId,
                BigDecimal productPrice, String productName,
                Integer quantity) {
        this.userUuid = userUuid;
        this.productSkuId = productSkuId;
        this.productPrice = productPrice;
        this.productName = productName;
        this.quantity = quantity;
    }
}
