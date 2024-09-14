package com.musicstore.products.repository;

import com.musicstore.products.model.Manufacturer;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long> {

	Optional<Manufacturer> findById(Long id);

	List<Manufacturer> findAll();

	@Query(nativeQuery = true, value = "SELECT DISTINCT m.* FROM manufacturer m " +
			"JOIN product p ON p.manufacturer_id = m.id " +
			"JOIN category ca ON p.category_id = ca.id " +
			"JOIN country c ON p.country_id = c.id " +
			"JOIN subcategory s ON p.subcategory_id=s.id " +
			"WHERE ca.id = ?1 AND c.name LIKE %?2% AND s.name LIKE %?3%")
	List<Manufacturer> findAllBySearchParameters(Long categoryId, String country, String subcategory);
}
