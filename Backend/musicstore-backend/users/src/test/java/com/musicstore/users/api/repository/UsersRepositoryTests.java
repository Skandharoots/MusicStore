package com.musicstore.users.api.repository;

import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.UserRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class UsersRepositoryTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestEntityManager testEntityManager;

    @Test
    public void createUserTest() {

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        Users savedUser = userRepository.save(user);
        Assertions.assertThat(savedUser).isNotNull();
        Assertions.assertThat(savedUser.getId()).isGreaterThan(0);
        Assertions.assertThat(savedUser.getFirstName()).isEqualTo("Marek");
        Assertions.assertThat(savedUser.getLastName()).isEqualTo("Kopania");
        Assertions.assertThat(savedUser.getEmail()).isEqualTo(user.getEmail());

    }

    @Test
    public void findByEmailTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        Optional<Users> savedUser = Optional.of(userRepository.save(user));
        Assertions.assertThat(userRepository.findByEmail(user.getEmail())).isEqualTo(savedUser);
    }

    @Test
    public void findByUuidTest() {
        Users user = new Users("Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        Optional<Users> savedUser = Optional.of(userRepository.save(user));
        Assertions.assertThat(userRepository.findByUuid(user.getUuid())).isEqualTo(savedUser);
    }

    @Test
    public void updateUserInformationTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        Optional<Users> savedUser = Optional.of(userRepository.save(user));
        userRepository.updateUser(
                user.getUuid(),
                "Konrad",
                "Kurzejamski",
                "test@test.com"
                );
        testEntityManager.clear();
        Optional<Users> updatedUser = userRepository.findByEmail(savedUser.get().getEmail());
        Assertions.assertThat(updatedUser.isPresent()).isTrue();
        Assertions.assertThat(updatedUser.get().getFirstName()).isEqualTo("Konrad");
        Assertions.assertThat(updatedUser.get().getLastName()).isEqualTo("Kurzejamski");
    }

    @Test
    public void enableUserTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        Optional<Users> savedUser = Optional.of(userRepository.save(user));
        userRepository.enableUser(user.getEmail());
        testEntityManager.clear();
        Optional<Users> enabledUser = userRepository.findByEmail(savedUser.get().getEmail());
        Assertions.assertThat(enabledUser.isPresent()).isTrue();
        Assertions.assertThat(enabledUser.get().isAccountNonLocked()).isTrue();
        Assertions.assertThat(enabledUser.get().isEnabled()).isTrue();
    }

    @Test
    public void deleteUserTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        userRepository.save(user);
        userRepository.deleteByUuid(user.getUuid());
        Assertions.assertThat(userRepository.findByEmail(user.getEmail())).isEmpty();
    }
}
