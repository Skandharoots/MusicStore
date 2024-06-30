package com.musicstore.users.api.repository;

import com.musicstore.users.model.ConfirmationToken;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.ConfirmationTokenRepository;
import com.musicstore.users.repository.UserRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ConfirmationTokenRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Autowired
    private TestEntityManager testEntityManager;

    @Test
    public void createConfirmationToken() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER);
        userRepository.save(user);

        String tokenUUID = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        ConfirmationToken savedToken = confirmationTokenRepository.save(confirmationToken);
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
        ConfirmationToken confirmationToken = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        confirmationTokenRepository.save(confirmationToken);
        Optional<ConfirmationToken> searchedToken = confirmationTokenRepository.findByToken(tokenUUID);
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
        ConfirmationToken confirmationToken = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        confirmationTokenRepository.save(confirmationToken);
        Optional<ConfirmationToken> searchedToken = confirmationTokenRepository.findByUser_Id(user.getId());
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
        ConfirmationToken confirmationToken = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        confirmationTokenRepository.save(confirmationToken);
        Optional<ConfirmationToken> searchedToken = confirmationTokenRepository.findByUser_Uuid(savedUser.getUuid());
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
        ConfirmationToken confirmationToken = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        ConfirmationToken savedToken = confirmationTokenRepository.save(confirmationToken);
        Assertions.assertThat(savedToken.getToken()).isEqualTo(tokenUUID);
        testEntityManager.clear();
        confirmationTokenRepository.deleteById(savedUser.getId());
        Assertions.assertThat(confirmationTokenRepository.findByToken(tokenUUID)).isEmpty();
    }

    @Test
    public void updateConfirmationToken() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER);
        userRepository.save(user);

        String tokenUUID = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        confirmationTokenRepository.save(confirmationToken);
        confirmationTokenRepository.updateConfirmationToken(tokenUUID, LocalDateTime.of(
                2030,
                6,
                29,
                20,
                0,
                0
        ));
        testEntityManager.clear();

        Optional<ConfirmationToken> updatedToken = confirmationTokenRepository.findByToken(tokenUUID);
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
