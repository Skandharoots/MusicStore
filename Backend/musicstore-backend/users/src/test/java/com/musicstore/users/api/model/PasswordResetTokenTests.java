package com.musicstore.users.api.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.musicstore.users.model.ConfirmationToken;
import com.musicstore.users.model.PasswordResetToken;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;

@SpringBootTest
public class PasswordResetTokenTests {

    private PasswordResetToken resetToken;

    @Test
    public void passwordResetTokenTest() {

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );

        String tokenUUID = UUID.randomUUID().toString();

        resetToken = new PasswordResetToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );

        Assertions.assertThat(resetToken.getToken()).isEqualTo(tokenUUID);
        Assertions.assertThat(resetToken.getId()).isNull();
        Assertions.assertThat(resetToken.getConfirmedAt()).isNull();
        Assertions.assertThat(resetToken.getUser()).isEqualTo(user);
        Assertions.assertThat(resetToken.getExpiresAt()).isAfter(LocalDateTime.now());
        Assertions.assertThat(resetToken.getCreatedAt()).isNotNull();
    }

    @Test
    public void resetTokenSettersTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );

        String tokenUUID = UUID.randomUUID().toString();
        Long id = 1L;
        resetToken = new PasswordResetToken();
        resetToken.setId(id);
        resetToken.setToken(tokenUUID);
        resetToken.setConfirmedAt(LocalDateTime.now().plusMinutes(2));
        resetToken.setUser(user);
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(20));
        resetToken.setCreatedAt(LocalDateTime.now());
        Assertions.assertThat(resetToken.getToken()).isEqualTo(tokenUUID);
        Assertions.assertThat(resetToken).isNotNull();

    }

}
