package com.musicstore.users.api.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.musicstore.users.model.PasswordResetToken;
import com.musicstore.users.model.PasswordResetToken;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.PasswordResetTokenRepository;
import com.musicstore.users.repository.UserRepository;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class PasswordResetTokenRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private TestEntityManager testEntityManager;

    @Test
    public void createPasswordResetToken() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER);
        userRepository.save(user);

        String tokenUUID = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        PasswordResetToken savedToken = passwordResetTokenRepository.save(passwordResetToken);
        Assertions.assertThat(savedToken.getToken()).isNotNull();
        Assertions.assertThat(savedToken.getToken()).isEqualTo(tokenUUID);
    }

    @Test
    public void findByTokenTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER);
        userRepository.save(user);

        String tokenUUID = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        passwordResetTokenRepository.save(passwordResetToken);
        Optional<PasswordResetToken> searchedToken = passwordResetTokenRepository.findByToken(tokenUUID);
        Assertions.assertThat(searchedToken.isPresent()).isTrue();
    }

    @Test
    public void findByUserIdTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER);
        userRepository.save(user);

        String tokenUUID = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        passwordResetTokenRepository.save(passwordResetToken);
        Optional<PasswordResetToken> searchedToken = passwordResetTokenRepository.findByUser_Id(user.getId());
        Assertions.assertThat(searchedToken.isPresent()).isTrue();
    }

    @Test
    public void findByUserUuidTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER);
        Users savedUser = userRepository.save(user);

        String tokenUUID = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        passwordResetTokenRepository.save(passwordResetToken);
        Optional<PasswordResetToken> searchedToken = passwordResetTokenRepository.findByUser_Uuid(savedUser.getUuid());
        Assertions.assertThat(searchedToken.isPresent()).isTrue();
    }

    @Test
    public void deleteByUserId() {

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER);
        Users savedUser = userRepository.save(user);

        String tokenUUID = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        PasswordResetToken savedToken = passwordResetTokenRepository.save(passwordResetToken);
        Assertions.assertThat(savedToken.getToken()).isEqualTo(tokenUUID);
        testEntityManager.clear();
        passwordResetTokenRepository.deleteById(savedUser.getId());
        Assertions.assertThat(passwordResetTokenRepository.findByToken(tokenUUID)).isEmpty();
    }

    @Test
    public void updatePasswordResetToken() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER);
        userRepository.save(user);

        String tokenUUID = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        passwordResetTokenRepository.save(passwordResetToken);
        passwordResetTokenRepository.updatePasswordResetToken(tokenUUID, LocalDateTime.of(
                2030,
                6,
                29,
                20,
                0,
                0
        ));
        testEntityManager.clear();

        Optional<PasswordResetToken> updatedToken = passwordResetTokenRepository.findByToken(tokenUUID);
        Assertions.assertThat(updatedToken.isPresent()).isTrue();
        Assertions.assertThat(updatedToken.get().getConfirmedAt()).isEqualTo(LocalDateTime.of(
                2030,
                6,
                29,
                20,
                0,
                0
        ).toString());
    }

}
