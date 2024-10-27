package com.musicstore.products.repository;

import com.musicstore.products.model.Subcategory;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {

    List<Subcategory> findAll();

    List<Subcategory> findAllByCategory_Id(Long id);

    Optional<Subcategory> findById(Long id);

    @Query(nativeQuery = true, value = "SELECT DISTINCT s.* FROM subcategory s "
            + "JOIN product p ON p.subcategory_id = s.id "
            + "JOIN category ca ON p.category_id = ca.id "
            + "JOIN country co ON p.country_id = co.id "
            + "JOIN manufacturer m ON p.manufacturer_id = m.id "
            + "WHERE ca.id = ?1 AND co.name LIKE %?2% AND m.name LIKE %?3%")
    List<Subcategory> findAllBySearchParameters(Long categoryId, String country, String manufacturer);
}
