package com.musicstore.users.controller;

import com.musicstore.users.dto.LoginRequest;
import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.service.LoginService;
import com.musicstore.users.service.RegisterService;
import com.musicstore.users.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping( "/api/v1/users")
@AllArgsConstructor
public class RegisterController {

    private final RegisterService registerService;
    private final LoginService loginService;
    private final UserService userService;

    @PostMapping( "/register")
    @ResponseStatus(HttpStatus.CREATED)
    public String register(@RequestBody RegisterRequest request) {
        return registerService.register(request);
    }

    @GetMapping( "/register/confirm")
    @ResponseStatus(HttpStatus.OK)
    public String confirm(@RequestParam("token") String token) {
        return registerService.confirmToken(token);
    }

    @PostMapping( "/login")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(loginService.loginUser(request));
    }

    @GetMapping( "/validate")
    @ResponseStatus(HttpStatus.OK)
    public Boolean validateToken(@RequestParam("token") String token) {
        return loginService.validateLoginRequest(token);
    }

    @PutMapping( "/update/{uuid}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public String updateUser(@PathVariable("uuid") UUID uuid, @RequestBody RegisterRequest request) {
        return userService.updateUser(uuid, request);
    }

    @DeleteMapping( "/delete/{uuid}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public String deleteUser(@PathVariable("uuid") UUID uuid) {
        return userService.deleteUser(uuid);
    }


}
