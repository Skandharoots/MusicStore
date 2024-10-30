package com.musicstore.users.api.service;

import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.dto.UserInformationResponse;
import com.musicstore.users.mail.EmailService;
import com.musicstore.users.model.ConfirmationToken;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.UserRepository;
import com.musicstore.users.security.config.VariablesConfiguration;
import com.musicstore.users.service.ConfirmationTokenService;
import com.musicstore.users.service.JwtService;
import com.musicstore.users.service.UserService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VariablesConfiguration variablesConfiguration;

    @InjectMocks
    private UserService userService;

    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Mock
    private EmailService emailService;

    @Mock
    private ConfirmationTokenService confirmationTokenService;

    @Mock
    private JwtService jwtService;

    private ConfirmationToken confirmationToken;

    @Test
    public void loadUserByUsernameExceptionTest() {

        when(userRepository.findByEmail(Mockito.anyString())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> userService.loadUserByUsername(Mockito.anyString()));
    }

    @Test
    public void userServiceSignUpUserTestReturnsConfirmationToken() {

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        when(variablesConfiguration.getAccountConfirmUrl()).thenReturn("http://localhost:8222/api/v1/users/register/confirm?token=");
        when(userRepository.save(Mockito.any(Users.class))).thenReturn(user);
        String token = userService.signUpUser(user);
        Assertions.assertThat(token).isNotNull();

    }

    @Test
    public void singUpUserAlreadyRegisteredTest() {

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
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(confirmationTokenService.getConfirmationTokenByUserUuid(user.getUuid())).thenReturn(Optional.of(confirmationToken));
        Assertions.assertThat(userService.signUpUser(user)).isEqualTo(confirmationToken.getToken());
    }

    @Test
    public void signUpUserExceptionEmailTakenTest() {

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        user.setEnabled(true);
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        Assertions.assertThatThrownBy(() -> userService.signUpUser(user)).isNotNull();

    }

    @Test
    public void singUpUserExceptionConfirmationTokenNotFoundTest() {

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(confirmationTokenService.getConfirmationTokenByUserUuid(user.getUuid())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> userService.signUpUser(user)).isNotNull();
    }

    @Test
    public void loadUserByUsernameTestReturnsUserDetails() {

        Users user = new Users();
        user.setEmail("test@test.com");
        Optional<Users> userOptional = Optional.of(user);
        when(userRepository.findByEmail("test@test.com")).thenReturn(userOptional);
        UserDetails userDetails = userService.loadUserByUsername("test@test.com");
        Assertions.assertThat(userDetails).isNotNull();

    }

    @Test
    public void getUserInfoTest() {
        UUID uuid = UUID.randomUUID();
        Users user = new Users();
        user.setUuid(uuid);
        user.setEmail("test@test.com");
        user.setFirstName("Marek");
        user.setLastName("Kopania");
        Optional<Users> userOptional = Optional.of(user);

        when(userRepository.findByUuid(uuid)).thenReturn(userOptional);
        UserInformationResponse info = userService.getUserInfo(uuid);
        Assertions.assertThat(info).isNotNull();
        Assertions.assertThat(info.getEmail()).isEqualTo(user.getEmail());
        Assertions.assertThat(info.getFirstName()).isEqualTo(user.getFirstName());
        Assertions.assertThat(info.getLastName()).isEqualTo(user.getLastName());
    }

    @Test
    public void getUserInfoExceptionNotFoundTest() {
        Optional<Users> userOptional = Optional.empty();
        UUID uuid = UUID.randomUUID();

        when(userRepository.findByUuid(uuid)).thenReturn(userOptional);
        Assertions.assertThatThrownBy(() -> userService.getUserInfo(uuid)).isNotNull();
    }

    @Test
    public void enableUserTestReturnsString() {
        Users user = new Users();
        user.setEmail("test@test.com");
        userService.enableUser(user.getEmail());
        Mockito.verify(userRepository, Mockito.times(1)).enableUser(user.getEmail());
    }

    @Test
    public void updateUserTestReturnsSuccessMessage() {

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        Optional<Users> userOptional = Optional.of(user);
        RegisterRequest registerRequest = new RegisterRequest(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd"
        );

        when(userRepository.findByUuid(user.getUuid())).thenReturn(userOptional);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(userOptional);

        LoginResponse loginResponse = userService.updateUser(user.getUuid(), registerRequest);
        Assertions.assertThat(loginResponse).isNotNull();
    }

    @Test
    public void updateUserExceptionNotFoundTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );

        when(userRepository.findByUuid(user.getUuid())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> userService.updateUser(user.getUuid(), null)).isNotNull();
    }

    @Test
    public void deleteUserByUuidTestReturnsSuccessMessage() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        Optional<Users> userOptional = Optional.of(user);

        when(userRepository.findByUuid(user.getUuid())).thenReturn(userOptional);
        String successMsg = userService.deleteUser(user.getUuid());
        Assertions.assertThat(successMsg).isNotNull();
    }

    @Test
    public void deleteUserExceptionNotFoundTest() {

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );

        when(userRepository.findByUuid(user.getUuid())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> userService.deleteUser(user.getUuid())).isNotNull();
    }

}
