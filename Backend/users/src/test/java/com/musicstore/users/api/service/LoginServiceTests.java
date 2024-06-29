package com.musicstore.users.api.service;

import com.musicstore.users.dto.LoginRequest;
import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.model.ConfirmationToken;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.UserRepository;
import com.musicstore.users.service.JWTService;
import com.musicstore.users.service.LoginService;
import com.musicstore.users.service.UserService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class LoginServiceTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private JWTService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private LoginService loginService;

    private Users user;

    private Authentication authentication;


    @BeforeEach
    public void setUp() {
        user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );

        authentication = Mockito.mock(Authentication.class);
        authentication.setAuthenticated(true);

    }

    @Test
    public void loginUserTest() {
        LoginRequest loginRequest = new LoginRequest(
                "test@test.com",
                "testpasswd"
        );
        when(authenticationManager.authenticate(Mockito.any(Authentication.class))).thenReturn(authentication);
        when(userService.loadUserByUsername("test@test.com")).thenReturn(user);
        LoginResponse loginResponse = loginService.loginUser(loginRequest);
        Assertions.assertThat(loginResponse).isNotNull();
    }

    @Test
    public void validateLoginRequestTest() {
        String tokenUUID = UUID.randomUUID().toString();

        ConfirmationToken confirmationToken = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
        when(userService.loadUserByUsername("test@test.com")).thenReturn(user);
        when(jwtService.getUsername(tokenUUID)).thenReturn("test@test.com");
        when(jwtService.validateToken(tokenUUID, user)).thenReturn(true);
        Boolean result = loginService.validateLoginRequest(tokenUUID);
        Assertions.assertThat(result).isTrue();
    }

    @Test
    public void adminAuthorizeTestReturnsBoolean() {

        Users admin = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.ADMIN
        );

        UserDetails userDetails = Mockito.mock(UserDetails.class);

        String tokenUUID = UUID.randomUUID().toString();

        ConfirmationToken confirmationToken = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                admin
        );


        when(jwtService.getUsername(tokenUUID)).thenReturn("test@test.com");
        when(userService.loadUserByUsername("test@test.com")).thenReturn(admin);
        Boolean result = loginService.adminAuthorize(tokenUUID);
        Assertions.assertThat(result).isTrue();
    }
}
