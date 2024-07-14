package com.musicstore.products.repository;

import com.musicstore.products.model.Manufacturer;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long> {

	Optional<Manufacturer> findByName(String manufacturerName);

	Optional<Manufacturer> findById(Long id);

	List<Manufacturer> findAll();


}
