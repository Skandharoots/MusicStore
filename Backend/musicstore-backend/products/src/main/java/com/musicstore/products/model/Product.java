package com.musicstore.products.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity
public class Product {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    private UUID productSkuId = UUID.randomUUID();

    @NonNull
    private String productName;

    @NonNull
    @Column(columnDefinition = "TEXT")
    private String productDescription;

    @NonNull
    private BigDecimal productPrice;

    private LocalDateTime dateAdded = LocalDateTime.now();

    private Integer inStock = 0;

    private Long boughtCount = 0L;

    @ManyToOne
    @JoinColumn(
            nullable = false,
            name = "manufacturer_id"
    )
    private Manufacturer manufacturer;

    @ManyToOne
    @JoinColumn(
            nullable = false,
            name = "country_id"
    )
    private Country builtinCountry;

    @ManyToOne
    @JoinColumn(
            nullable = false,
            name = "category_id"
    )
    private Category category;

    @ManyToOne
    @JoinColumn(
            name = "subcategory_id"
    )
    private Subcategory subcategory;

    @ManyToOne
    @JoinColumn(
            name = "subcategory_tier_two_id"
    )
    private SubcategoryTierTwo subcategoryTierTwo;

    public Product(
            String productName,
            String productDescription,
            BigDecimal productPrice,
            Integer inStock,
            Manufacturer manufacturer,
            Country builtInCountry,
            Category category,
            Subcategory subcategory,
            SubcategoryTierTwo subcategoryTierTwo
    ) {
        this.productName = productName;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.inStock = inStock;
        this.manufacturer = manufacturer;
        this.builtinCountry = builtInCountry;
        this.category = category;
        this.subcategory = subcategory;
        this.subcategoryTierTwo = subcategoryTierTwo;
    }


}
