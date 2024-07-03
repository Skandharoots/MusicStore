package com.musicstore.products.repository;

import com.musicstore.products.model.Country;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface CountryRepository extends JpaRepository<Country, Long> {

	Optional<Country> findByCountryName(String name);

	Optional<Country> findById(Long id);

	List<Country> findAll();
}
