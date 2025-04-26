package com.musicstore.opinions.repository;

import com.musicstore.opinions.model.Opinion;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface OpinionRepository extends JpaRepository<Opinion, Long> {

    Optional<Opinion> findById(Long id);

    List<Opinion> findAllByUserId(UUID userId);

    Optional<Opinion> findByProductUuidAndUserId(UUID productId, UUID userId);

    List<Opinion> findAllByProductUuid(UUID productId);

}
