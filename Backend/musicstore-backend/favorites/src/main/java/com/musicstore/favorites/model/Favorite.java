package com.musicstore.favorites.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID productUuid;

    private UUID userUuid;

    private String productName;

    private LocalDateTime dateAdded = LocalDateTime.now();

    private BigDecimal price;

    private Integer quantity;

    public Favorite(UUID productUuid, UUID userUuid, String productName, BigDecimal price, Integer quantity) {
        this.productUuid = productUuid;
        this.userUuid = userUuid;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
    }
}
