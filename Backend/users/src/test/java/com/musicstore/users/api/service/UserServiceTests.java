package com.musicstore.users.api.service;

import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.mail.EmailService;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.UserRepository;
import com.musicstore.users.service.ConfirmationTokenService;
import com.musicstore.users.service.JWTService;
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

import java.util.Optional;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Mock
    private EmailService emailService;

    @Mock
    private ConfirmationTokenService confirmationTokenService;

    @Mock
    private JWTService jwtService;


    @Test
    public void userServiceSignUpUserTestReturnsConfirmationToken() {

        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        when(userRepository.save(Mockito.any(Users.class))).thenReturn(user);
        String token = userService.signUpUser(user);
        Assertions.assertThat(token).isNotNull();

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

}
