package com.musicstore.products.repository;

import com.musicstore.products.model.SubcategoryTierTwo;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface SubcategoryTierTwoRepository extends JpaRepository<SubcategoryTierTwo, Long> {

    List<SubcategoryTierTwo> findAll();

    List<SubcategoryTierTwo> findAllBySubcategory_Id(Long id);

    Optional<SubcategoryTierTwo> findById(Long id);

    @Query(nativeQuery = true, value = "SELECT DISTINCT st.* FROM subcategory_tier_two st "
            + "JOIN product p ON p.subcategory_tier_two_id = st.id "
            + "JOIN subcategory s ON p.subcategory_id = s.id "
            + "JOIN category ca ON p.category_id = ca.id "
            + "JOIN country co ON p.country_id = co.id "
            + "JOIN manufacturer m ON p.manufacturer_id = m.id "
            + "WHERE ca.id = ?1 AND co.name LIKE %?2% AND s.name LIKE %?3% AND m.name LIKE %?4%")
    List<SubcategoryTierTwo> findAllBySearchParameters(Long categoryId, String country, String subcategory, String manufacturer);

}
