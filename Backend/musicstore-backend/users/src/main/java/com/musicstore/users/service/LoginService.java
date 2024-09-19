package com.musicstore.users.service;

import com.musicstore.users.dto.LoginRequest;
import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.model.Users;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class LoginService {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResponse loginUser(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = (Users) userService.loadUserByUsername(request.getEmail());
        var userDetails = userService.loadUserByUsername(request.getEmail());
        return LoginResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .uuid(user.getUuid())
                .role(user.getUserRole())
                .token(jwtService.generateToken(userDetails))
                .build();

    }

    public Boolean validateLoginRequest(String token) {
        var user = userService.loadUserByUsername(jwtService.getUsername(token));
        return jwtService.validateToken(token, user);

    }

    public Boolean adminAuthorize(String token) {
        var user = userService.loadUserByUsername(jwtService.getUsername(token));
        return user.getAuthorities().contains(new SimpleGrantedAuthority("ADMIN"));
    }

}
