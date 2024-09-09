package com.musicstore.products.repository;

import com.musicstore.products.model.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional
public interface ProductRepository extends JpaRepository<Product, Long> {

	List<Product> findAll();

	Optional<Product> findByProductSkuId(UUID id);

	Page<Product> findAllByCategory_IdAndBuiltinCountry_NameContainingAndManufacturer_NameContainingAndProductPriceBetween(
			Long category, String country, String manufacturer, BigDecimal lp, BigDecimal hp, Pageable pageable
	);

	Page<Product> findAllByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(
			String productName, String description, Pageable pageable
	);

	@Query(nativeQuery = true, value = "SELECT MAX(p.product_price) FROM product p " +
			"LEFT JOIN category ca ON p.category_id = ca.id " +
			"LEFT JOIN country co ON p.country_id = co.id " +
			"LEFT JOIN manufacturer ma ON p.manufacturer_id = ma.id " +
			"WHERE p.category_id = ?1 AND co.name LIKE %?2% AND ma.name LIKE %?3%")
	BigDecimal findMaxProductPrice(Long category, String country, String manufacturer);
}
