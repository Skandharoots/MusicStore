package com.musicstore.opinions.repository;

import com.musicstore.opinions.model.Opinion;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface OpinionRepository extends JpaRepository<Opinion, Long> {

    Optional<Opinion> findById(Long id);

    Page<Opinion> findAllByUserId(UUID userId, Pageable pageable);

    Optional<Opinion> findByProductUuidAndUserId(UUID productId, UUID userId);

    Page<Opinion> findAllByProductUuid(UUID productId, Pageable pageable);

}
