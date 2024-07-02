package com.musicstore.users.api.service;

import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.service.JwtService;
import io.jsonwebtoken.Claims;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;


@ExtendWith(MockitoExtension.class)
public class JwtServiceTests {

    @InjectMocks
    private JwtService jwtService;

    @Test
    public void generateTokenTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        String result = jwtService.generateToken(user);
        Assertions.assertThat(result).isNotNull();
    }

    @Test
    public void getUsernameTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        String token = jwtService.generateToken(user);
        String result = jwtService.getUsername(token);
        Assertions.assertThat(result).isNotNull();

    }

    @Test
    public void getClaimTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        String token = jwtService.generateToken(user);
        String email = jwtService.getClaim(token, Claims::getSubject);
        Assertions.assertThat(email).isEqualTo("test@test.com");
    }

    @Test
    public void validateTokenTest() {
        Users user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );
        String token = jwtService.generateToken(user);
        Boolean validation = jwtService.validateToken(token, user);
        Assertions.assertThat(validation).isTrue();
    }

}
