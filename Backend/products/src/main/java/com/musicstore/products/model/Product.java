package com.musicstore.products.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NonNull;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.UUID;

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
	private String productDescription;

	@NonNull
	private BigDecimal productPrice;

	private LocalDateTime dateAdded = LocalDateTime.now();

	private Integer inStock = 0;

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

	public Product(
			String productName,
			String productDescription,
			BigDecimal productPrice,
			Integer inStock,
			Manufacturer manufacturer,
			Country builtInCountry,
			Category category
	) {
		this.productName = productName;
		this.productDescription = productDescription;
		this.productPrice = productPrice;
		this.inStock = inStock;
		this.manufacturer = manufacturer;
		this.builtinCountry = builtInCountry;
		this.category = category;
	}


}
