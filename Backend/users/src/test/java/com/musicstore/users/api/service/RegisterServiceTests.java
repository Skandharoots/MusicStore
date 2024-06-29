package com.musicstore.users.api.service;

import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.model.ConfirmationToken;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.security.EmailValidator;
import com.musicstore.users.service.ConfirmationTokenService;
import com.musicstore.users.service.RegisterService;
import com.musicstore.users.service.UserService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class RegisterServiceTests {


    @Mock
    private UserService userService;

    @Mock
    private EmailValidator emailValidator;

    @Mock
    private ConfirmationTokenService confirmationTokenService;

    @InjectMocks
    private RegisterService registerService;

    private Users user;


    @BeforeEach
    public void setUp() {
        user = new Users(
                "Marek",
                "Kopania",
                "marek@gmail.com",
                "testpasswd",
                UserRole.USER
        );

    }

    @Test
    public void registerUserTest() {
        RegisterRequest registerRequest = new RegisterRequest(
                "Marek",
                "Kopania",
                "marek@gmail.com",
                "testpasswd"
        );
        when(emailValidator.test(registerRequest.getEmail())).thenReturn(true);
        when(userService.signUpUser(Mockito.any(Users.class))).thenReturn(String.valueOf(String.class));
        String result = registerService.register(registerRequest);
        Assertions.assertThat(result).isNotNull();

    }

    @Test
    public void confirmTokenTest() {
        String tokenUUID = UUID.randomUUID().toString();

        ConfirmationToken confirmationToken = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );

        when(confirmationTokenService.getConfirmationToken(tokenUUID)).thenReturn(Optional.of(confirmationToken));
        String result = registerService.confirmToken(tokenUUID);
        Assertions.assertThat(result).isNotNull();
    }

}
