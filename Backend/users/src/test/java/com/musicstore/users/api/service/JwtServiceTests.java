package com.musicstore.users.api.service;

import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.security.config.VariablesConfiguration;
import com.musicstore.users.service.JwtService;
import io.jsonwebtoken.Claims;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class JwtServiceTests {

    @Mock
    private VariablesConfiguration variablesConfiguration;

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
        when(variablesConfiguration.getJwtSecret())
                .thenReturn("197f63323bd49f9ed451d0ef6b93bf376d45cae7ce567" +
                        "54c45e6f519c7676632cee836f0fb10f2b326329853cf75b28fa" +
                        "fd34de99f24aec7f34fa0432b47cd5dc4889e0f438ceb03b8bf5" +
                        "6420305ded8fc915f18ba6ff7bd89dbcc2c31acfd01857967356e" +
                        "e1d5922d66e3d1cfc9cf2a4a3b1c3bd2f4e34aea639b7ebfa04bed" +
                        "c22e5e0f2f943f457e91999bb8591c952b1638dc4581b5359b4bc" +
                        "5075f4ccc32bc9f1cc27d52e44a77cec8e5beec74a1ccbd2893a98" +
                        "43b0d1ef5c254442832d93e06469a860eebf88ceb2f1eb38f4c63e1" +
                        "a1c87836c79838f564ed25e9af0eab7e2741cfa13aa23cb3dadc923" +
                        "ec03a6ebdffc4813d3c656a13d64823c41859e9");
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
        when(variablesConfiguration.getJwtSecret())
                .thenReturn("197f63323bd49f9ed451d0ef6b93bf376d45cae7ce" +
                        "56754c45e6f519c7676632cee836f0fb10f2b326329853cf75b2" +
                        "8fafd34de99f24aec7f34fa0432b47cd5dc4889e0f438ceb03b8" +
                        "bf56420305ded8fc915f18ba6ff7bd89dbcc2c31acfd01857967" +
                        "356ee1d5922d66e3d1cfc9cf2a4a3b1c3bd2f4e34aea639b7ebfa" +
                        "04bedc22e5e0f2f943f457e91999bb8591c952b1638dc4581b5359" +
                        "b4bc5075f4ccc32bc9f1cc27d52e44a77cec8e5beec74a1ccbd2893" +
                        "a9843b0d1ef5c254442832d93e06469a860eebf88ceb2f1eb38f4c6" +
                        "3e1a1c87836c79838f564ed25e9af0eab7e2741cfa13aa23cb3dadc9" +
                        "23ec03a6ebdffc4813d3c656a13d64823c41859e9");
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
        when(variablesConfiguration.getJwtSecret())
                .thenReturn("197f63323bd49f9ed451d0ef6b93bf376d45cae7ce" +
                        "56754c45e6f519c7676632cee836f0fb10f2b326329853cf75b2" +
                        "8fafd34de99f24aec7f34fa0432b47cd5dc4889e0f438ceb03b8" +
                        "bf56420305ded8fc915f18ba6ff7bd89dbcc2c31acfd01857967" +
                        "356ee1d5922d66e3d1cfc9cf2a4a3b1c3bd2f4e34aea639b7ebfa" +
                        "04bedc22e5e0f2f943f457e91999bb8591c952b1638dc4581b5359" +
                        "b4bc5075f4ccc32bc9f1cc27d52e44a77cec8e5beec74a1ccbd2893" +
                        "a9843b0d1ef5c254442832d93e06469a860eebf88ceb2f1eb38f4c6" +
                        "3e1a1c87836c79838f564ed25e9af0eab7e2741cfa13aa23cb3dadc9" +
                        "23ec03a6ebdffc4813d3c656a13d64823c41859e9");
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
        when(variablesConfiguration.getJwtSecret())
                .thenReturn("197f63323bd49f9ed451d0ef6b93bf376d45cae7ce" +
                        "56754c45e6f519c7676632cee836f0fb10f2b326329853cf75b2" +
                        "8fafd34de99f24aec7f34fa0432b47cd5dc4889e0f438ceb03b8" +
                        "bf56420305ded8fc915f18ba6ff7bd89dbcc2c31acfd01857967" +
                        "356ee1d5922d66e3d1cfc9cf2a4a3b1c3bd2f4e34aea639b7ebfa" +
                        "04bedc22e5e0f2f943f457e91999bb8591c952b1638dc4581b5359" +
                        "b4bc5075f4ccc32bc9f1cc27d52e44a77cec8e5beec74a1ccbd2893" +
                        "a9843b0d1ef5c254442832d93e06469a860eebf88ceb2f1eb38f4c6" +
                        "3e1a1c87836c79838f564ed25e9af0eab7e2741cfa13aa23cb3dadc9" +
                        "23ec03a6ebdffc4813d3c656a13d64823c41859e9");
        String token = jwtService.generateToken(user);
        Boolean validation = jwtService.validateToken(token, user);
        Assertions.assertThat(validation).isTrue();
    }

}
