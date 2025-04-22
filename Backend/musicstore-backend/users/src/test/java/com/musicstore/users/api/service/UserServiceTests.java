package com.musicstore.users.api.service;

import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.users.dto.AuthenticationResponse;
import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.dto.PasswordResetRequest;
import com.musicstore.users.dto.PasswordResetRequestSettings;
import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.dto.UserInformationResponse;
import com.musicstore.users.mail.EmailService;
import com.musicstore.users.model.ConfirmationToken;
import com.musicstore.users.model.PasswordResetToken;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.UserRepository;
import com.musicstore.users.security.config.VariablesConfiguration;
import com.musicstore.users.service.ConfirmationTokenService;
import com.musicstore.users.service.JwtService;
import com.musicstore.users.service.PasswordResetTokenService;
import com.musicstore.users.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
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

    @Mock
    private HttpServletRequest request;

    @Mock
    private PasswordResetTokenService passwordResetTokenService;

    private ConfirmationToken confirmationToken;

    @Mock
    private ObjectMapper objectMapper;

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
                UserRole.USER);
        when(variablesConfiguration.getAccountConfirmUrl())
                .thenReturn("http://localhost:8222/api/v1/users/register/confirm?token=");
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
                UserRole.USER);

        String tokenUUID = UUID.randomUUID().toString();
        confirmationToken = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user);
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(confirmationTokenService.getConfirmationTokenByUserUuid(user.getUuid()))
                .thenReturn(Optional.of(confirmationToken));
        Assertions.assertThat(userService.signUpUser(user)).isEqualTo(confirmationToken.getToken());
    }

    @Test
    public void signUpUserExceptionEmailTakenTest() {

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER);
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
                UserRole.USER);

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
                UserRole.USER);
        Optional<Users> userOptional = Optional.of(user);
        RegisterRequest registerRequest = new RegisterRequest(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd");

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
                UserRole.USER);

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
                UserRole.USER);
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
                UserRole.USER);

        when(userRepository.findByUuid(user.getUuid())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> userService.deleteUser(user.getUuid())).isNotNull();
    }

    @Test
    public void refreshTest() throws StreamWriteException, DatabindException, IOException {

        String token = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiJ9.GE2q1gX6T-mcjf0xmIlGru1gzu-PQF1leFK4U3Kphj8ZLpQG3Rn8qyLLO38ilyvP2u03Ft7bEBAJqRS-86WXCg";
        String jwtToken = token.substring(7);

        MockHttpServletResponse response = new MockHttpServletResponse();

        Users user = new Users(
                "Marek",
                "Kopania",
                "mardok1825@gmail.com",
                "test",
                UserRole.USER);

        AuthenticationResponse authResp = new AuthenticationResponse(jwtToken, jwtToken);

        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(token);
        when(jwtService.getUsername(jwtToken)).thenReturn(user.getUsername());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.validateToken(jwtToken, (UserDetails) user)).thenReturn(true);
        when(jwtService.generateToken((UserDetails) user)).thenReturn(jwtToken);

        response.setStatus(200);
        response.getWriter().write(authResp.toString());
        response.getWriter().flush();

        userService.refresh(request, response);
        assertNotNull(userService);

    }

    @Test
    public void refreshAuthorizationNullTest() throws StreamWriteException, DatabindException, IOException {

        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);
        MockHttpServletResponse response = new MockHttpServletResponse();
        response.setStatus(400);

        Assertions.assertThatThrownBy(() -> userService.refresh(request, response));

    }

    @Test
    public void refreshUserNotFoundExceptionTest() throws StreamWriteException, DatabindException, IOException {

        String token = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiJ9.GE2q1gX6T-mcjf0xmIlGru1gzu-PQF1leFK4U3Kphj8ZLpQG3Rn8qyLLO38ilyvP2u03Ft7bEBAJqRS-86WXCg";
        String jwtToken = token.substring(7);

        MockHttpServletResponse response = new MockHttpServletResponse();

        Users user = new Users(
                "Marek",
                "Kopania",
                "mardok1825@gmail.com",
                "test",
                UserRole.USER);

        AuthenticationResponse authResp = new AuthenticationResponse(jwtToken, jwtToken);

        when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(token);
        when(jwtService.getUsername(jwtToken)).thenReturn(user.getUsername());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        response.setStatus(403);

        Assertions.assertThatThrownBy(() -> userService.refresh(request, response));

    }

    @Test
    public void generatePasswordResetTokenTest() {

        String email = "test@test";

        Users user = new Users(
                "Marek",
                "Kopania",
                email,
                "test",
                UserRole.USER);

        user.setEnabled(true);

        String token = UUID.randomUUID().toString();

        PasswordResetToken passTok = new PasswordResetToken(
                token,
                LocalDateTime.of(2025, 06, 12, 22, 0, 0),
                LocalDateTime.of(2025, 06, 12, 22, 10, 0),
                user);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordResetTokenService.getPasswordResetTokenByUserUuid(user.getUuid()))
                .thenReturn(Optional.of(passTok));
        when(variablesConfiguration.getPassResetUrl()).thenReturn("http:localhost:8222/api/test");

        String responseToken = userService.generatePasswordResetToken(email);

        Assertions.assertThat(responseToken.equals(token));

    }

    @Test
    public void generatePasswordResetTokenTokenNotPresentTest() {

        String email = "test@test";

        Users user = new Users(
                "Marek",
                "Kopania",
                email,
                "test",
                UserRole.USER);

        user.setEnabled(true);

        String token = UUID.randomUUID().toString();

        PasswordResetToken passTok = new PasswordResetToken(
                token,
                LocalDateTime.of(2025, 06, 12, 22, 0, 0),
                LocalDateTime.of(2025, 06, 12, 22, 10, 0),
                user);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordResetTokenService.getPasswordResetTokenByUserUuid(user.getUuid())).thenReturn(Optional.empty());
        when(variablesConfiguration.getPassResetUrl()).thenReturn("http:localhost:8222/api/test");

        String responseToken = userService.generatePasswordResetToken(email);

        Assertions.assertThat(!responseToken.isEmpty());
    }

    @Test
    public void generatePasswordResetTokenUserNotFoundTest() {
        String email = "test@test";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        Assertions.assertThatThrownBy(() -> userService.generatePasswordResetToken(email));
    }

    @Test
    public void generatePasswordResetTokenUserNotEnabledTest() {

        String email = "test@test";

        Users user = new Users(
                "Marek",
                "Kopania",
                email,
                "test",
                UserRole.USER);

        user.setEnabled(false);

        String token = UUID.randomUUID().toString();

        PasswordResetToken passTok = new PasswordResetToken(
                token,
                LocalDateTime.of(2025, 06, 12, 22, 0, 0),
                LocalDateTime.of(2025, 06, 12, 22, 10, 0),
                user);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        Assertions.assertThatThrownBy(() -> userService.generatePasswordResetToken(email));

    }

    @Test
    public void resetPasswordEmailTest() {

        String token = UUID.randomUUID().toString();

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "$hdj@Njsd",
                UserRole.USER);

        PasswordResetToken resTok = new PasswordResetToken(
                token,
                LocalDateTime.of(2025, 04, 22, 22, 0, 0),
                LocalDateTime.of(2025, 04, 22, 22, 10, 0),
                user);

        PasswordResetRequest request = new PasswordResetRequest(token, "N3wP$ssword", "N3wP$ssword");

        when(passwordResetTokenService.getPasswordResetToken(token)).thenReturn(Optional.of(resTok));
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        String response = userService.resetPasswordEmail(request);
        Assertions.assertThat(!response.isEmpty());

    }

    @Test
    public void resetPasswordEmailTokenNotPresentTest() {

        String token = UUID.randomUUID().toString();

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "$hdj@Njsd",
                UserRole.USER);

        PasswordResetRequest request = new PasswordResetRequest(token, "N3wP$ssword", "N3wP$ssword");

        when(passwordResetTokenService.getPasswordResetToken(token)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> userService.resetPasswordEmail(request));

    }

    @Test
    public void resetPasswordEmailPasswordsNotMatchingTest() {

        String token = UUID.randomUUID().toString();

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "$hdj@Njsd",
                UserRole.USER);

        PasswordResetToken resTok = new PasswordResetToken(
                token,
                LocalDateTime.of(2025, 04, 22, 22, 0, 0),
                LocalDateTime.of(2025, 04, 22, 22, 10, 0),
                user);

        PasswordResetRequest request = new PasswordResetRequest(token, "N3wP$ssword", "N3wP$sswo232rd");

        when(passwordResetTokenService.getPasswordResetToken(token)).thenReturn(Optional.of(resTok));
        Assertions.assertThatThrownBy(() -> userService.resetPasswordEmail(request));

    }

    @Test
    public void resetPasswordEmailPasswordUserNotFoundTest() {

        String token = UUID.randomUUID().toString();

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "$hdj@Njsd",
                UserRole.USER);

        PasswordResetToken resTok = new PasswordResetToken(
                token,
                LocalDateTime.of(2025, 04, 22, 22, 0, 0),
                LocalDateTime.of(2025, 04, 22, 22, 10, 0),
                user);

        PasswordResetRequest request = new PasswordResetRequest(token, "N3wP$ssword", "N3wP$ssword");
        when(passwordResetTokenService.getPasswordResetToken(token)).thenReturn(Optional.of(resTok));
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        Assertions.assertThatThrownBy(() -> userService.resetPasswordEmail(request));

    }

    @Test
    public void resetPasswordSettingsTest() {

        String token = UUID.randomUUID().toString();

        String pass = bCryptPasswordEncoder.encode("$hdj@Njsd");

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                pass,
                UserRole.USER);

        PasswordResetRequestSettings request = new PasswordResetRequestSettings(
                "$hdj@Njsd", "89asd@#$#Asda", "89asd@#$#Asda");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.getUsername(token)).thenReturn(user.getEmail());
        when(bCryptPasswordEncoder.matches(request.getCurrent(), user.getPassword())).thenReturn(true);
        String response = userService.resetPasswordSettings(request, token);
        Assertions.assertThat(!response.isEmpty());

    }

    @Test
    public void resetPasswordSettingsPasswordAndConfirmationDoesNotMatchTest() {

        String token = UUID.randomUUID().toString();

        String pass = bCryptPasswordEncoder.encode("$hdj@Njsd");

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                pass,
                UserRole.USER);

        PasswordResetRequestSettings request = new PasswordResetRequestSettings(
                "$hdj@Njsd", "89asd@#$#2323Asda", "89asd@#$#Asda");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.getUsername(token)).thenReturn(user.getEmail());
        Assertions.assertThatThrownBy(() -> userService.resetPasswordSettings(request, token));

    }

    @Test
    public void resetPasswordSettingsUserNotFoundTest() {

        String token = UUID.randomUUID().toString();
        PasswordResetRequestSettings request = new PasswordResetRequestSettings(
                "$hdj@Njsd", "89asd@#$#Asda", "89asd@#$#Asda");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.empty());
        when(jwtService.getUsername(token)).thenReturn("test@test.com");
        Assertions.assertThatThrownBy(() -> userService.resetPasswordSettings(request, token));

    }

    @Test
    public void resetPasswordSettingsCurrentPasswordDoesNotMatch() {

        String token = UUID.randomUUID().toString();

        String pass = bCryptPasswordEncoder.encode("$hdj@Njsd");

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                pass,
                UserRole.USER);

        PasswordResetRequestSettings request = new PasswordResetRequestSettings(
                "$hdj2345@Njsd", "89asd@#$#Asda", "89asd@#$#Asda");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.getUsername(token)).thenReturn(user.getEmail());
        when(bCryptPasswordEncoder.matches(request.getCurrent(), user.getPassword())).thenReturn(false);
        Assertions.assertThatThrownBy(() -> userService.resetPasswordSettings(request, token));

    }


}
