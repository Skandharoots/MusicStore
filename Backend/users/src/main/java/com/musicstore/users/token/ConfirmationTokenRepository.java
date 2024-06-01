package com.musicstore.users.token;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {

    Optional<ConfirmationToken> findByToken(String token);

    @Query("SELECT DISTINCT c.id FROM ConfirmationToken c WHERE c.user.uuid = ?1")
    Optional<ConfirmationToken> findByUserUUID(UUID uuid);

    @Transactional
    @Modifying
    @Query("UPDATE ConfirmationToken token " +
            "SET token.confirmedAt = ?2 " +
            "WHERE token.token = ?1")
    void updateConfirmationToken(String token, LocalDateTime confirmedAt);

    @Transactional
    @Modifying
    @Query("DELETE FROM ConfirmationToken c WHERE c.user.uuid = ?1")
    void deleteConfirmationToken(UUID uuid);
}
