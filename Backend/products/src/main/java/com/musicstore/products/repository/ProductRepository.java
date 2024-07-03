package com.musicstore.products.repository;

import com.musicstore.products.model.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional
public interface ProductRepository extends JpaRepository<Product, Long> {

	Optional<Product> findById(Long id);

	Optional<Product> findByProductSgid(UUID productSgid);


}
