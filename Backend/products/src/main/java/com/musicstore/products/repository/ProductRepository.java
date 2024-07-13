package com.musicstore.products.repository;

import com.musicstore.products.model.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@Transactional
public interface ProductRepository extends JpaRepository<Product, Long> {

	List<Product> findAll();

	Optional<Product> findById(Long id);

	Optional<Product> findByProductSgid(UUID productSgid);


}
