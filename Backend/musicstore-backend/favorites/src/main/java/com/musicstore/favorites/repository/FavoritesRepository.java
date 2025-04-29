package com.musicstore.favorites.repository;

import com.musicstore.favorites.model.Favorite;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoritesRepository extends JpaRepository<Favorite, Long> {

    Page<Favorite> findAllByUserUuid(UUID userUuid, Pageable pageable);

    Optional<Favorite> findById(Long id);

    Optional<Favorite> findByUserUuidAndProductUuidAndProductNameAndPrice(UUID userUuid, UUID productUuid, String productName, BigDecimal price);

}
