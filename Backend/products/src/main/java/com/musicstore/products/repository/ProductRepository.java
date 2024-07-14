package com.musicstore.products.repository;

import com.musicstore.products.model.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional
public interface ProductRepository extends JpaRepository<Product, Long> {

	List<Product> findAll();

	Optional<Product> findById(Long id);

	Page<Product> findAllByCategory_IdAndBuiltinCountry_NameContainingAndManufacturer_NameContaining(Long category, String country, String manufacturer, Pageable pageable);

}
