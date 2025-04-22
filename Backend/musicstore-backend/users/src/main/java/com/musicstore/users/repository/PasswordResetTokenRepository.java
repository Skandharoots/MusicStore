package com.musicstore.users.repository;

import com.musicstore.users.model.PasswordResetToken;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUser_Id(Long userId);

    Optional<PasswordResetToken> findByUser_Uuid(UUID uuid);

    @Transactional
    @Modifying
    void deleteByUser_Id(Long id);

    @Transactional
    @Modifying
    @Query("UPDATE PasswordResetToken token "
            + "SET token.confirmedAt = ?2 "
            + "WHERE token.token = ?1")
    void updatePasswordResetToken(String token, LocalDateTime confirmedAt);

}
