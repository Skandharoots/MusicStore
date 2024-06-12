package com.musicstore.users.service;

import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class LoginService {

    private final UserService userService;
    private final JWTService jwtService;

    public LoginResponse loginUser(String username) {

        Users user = (Users) userService.loadUserByUsername(username);
        String token = jwtService.generateToken(username);

        return new LoginResponse(user.getUuid(), user.getFirstName(), user.getLastName(), user.getUserRole(), token);

    }

    public void validateLoginRequest(String username) {
        jwtService.validateToken(username);
    }

}
