package com.musicstore.users.api.service;

import com.musicstore.users.dto.LoginRequest;
import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.service.JwtService;
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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import java.util.UUID;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class LoginServiceTests {


    @Mock
    private UserService userService;

    @Mock
    private JwtService jwtService;

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

        String tokenUUID = UUID.randomUUID().toString();

        when(jwtService.getUsername(tokenUUID)).thenReturn("test@test.com");
        when(userService.loadUserByUsername("test@test.com")).thenReturn(admin);
        Boolean result = loginService.adminAuthorize(tokenUUID);
        Assertions.assertThat(result).isTrue();
    }
}
