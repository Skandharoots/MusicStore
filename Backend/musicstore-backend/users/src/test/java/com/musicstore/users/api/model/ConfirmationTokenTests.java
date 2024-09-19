package com.musicstore.users.api.model;

import com.musicstore.users.model.ConfirmationToken;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.UUID;

@SpringBootTest
public class ConfirmationTokenTests {

    private ConfirmationToken confirmationToken;

    @Test
    public void confirmationTokenTest() {

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );

        String tokenUUID = UUID.randomUUID().toString();

        confirmationToken = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );

        Assertions.assertThat(confirmationToken.getToken()).isEqualTo(tokenUUID);
        Assertions.assertThat(confirmationToken.getId()).isNull();
        Assertions.assertThat(confirmationToken.getConfirmedAt()).isNull();
        Assertions.assertThat(confirmationToken.getUser()).isEqualTo(user);
        Assertions.assertThat(confirmationToken.getExpiresAt()).isAfter(LocalDateTime.now());
        Assertions.assertThat(confirmationToken.getCreatedAt()).isNotNull();
    }

    @Test
    public void confirmationTokenSettersTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );

        String tokenUUID = UUID.randomUUID().toString();
        Long id = 1L;
        confirmationToken = new ConfirmationToken();
        confirmationToken.setId(id);
        confirmationToken.setToken(tokenUUID);
        confirmationToken.setConfirmedAt(LocalDateTime.now().plusMinutes(2));
        confirmationToken.setUser(user);
        confirmationToken.setExpiresAt(LocalDateTime.now().plusMinutes(20));
        confirmationToken.setCreatedAt(LocalDateTime.now());
        Assertions.assertThat(confirmationToken.getToken()).isEqualTo(tokenUUID);
        Assertions.assertThat(confirmationToken).isNotNull();

    }
}
