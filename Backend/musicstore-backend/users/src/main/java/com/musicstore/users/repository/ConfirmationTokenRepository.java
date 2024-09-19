package com.musicstore.users.repository;

import com.musicstore.users.model.ConfirmationToken;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {

    Optional<ConfirmationToken> findByToken(String token);

    Optional<ConfirmationToken> findByUser_Id(Long userId);

    Optional<ConfirmationToken> findByUser_Uuid(UUID uuid);

    @Transactional
    @Modifying
    void deleteByUser_Id(Long id);

    @Transactional
    @Modifying
    @Query("UPDATE ConfirmationToken token "
            + "SET token.confirmedAt = ?2 "
            + "WHERE token.token = ?1")
    void updateConfirmationToken(String token, LocalDateTime confirmedAt);

}
