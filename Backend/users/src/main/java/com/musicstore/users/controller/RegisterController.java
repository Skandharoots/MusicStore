package com.musicstore.users.controller;

import com.musicstore.users.dto.LoginRequest;
import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.service.LoginService;
import com.musicstore.users.service.RegisterService;
import com.musicstore.users.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping(path = "api/v1/users")
@AllArgsConstructor
public class RegisterController {

    private final RegisterService registerService;
    private final LoginService loginService;
    private final UserService userService;

    @PostMapping(path = "register")
    @ResponseStatus(HttpStatus.CREATED)
    public String register(@RequestBody RegisterRequest request) {
        return registerService.register(request);
    }

    @GetMapping(path = "register/confirm")
    @ResponseStatus(HttpStatus.OK)
    public String confirm(@RequestParam("token") String token) {
        return registerService.confirmToken(token);
    }

    @PostMapping(path = "login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse login(@RequestBody LoginRequest request) {
        return loginService.loginUser(request);
    }

    @PutMapping(path = "update/{uuid}")
    @ResponseStatus(HttpStatus.OK)
    public String updateUser(@PathVariable("uuid") UUID uuid, @RequestBody RegisterRequest request) {
        return userService.updateUser(uuid, request);
    }

    @DeleteMapping(path = "delete/{uuid}")
    @ResponseStatus(HttpStatus.OK)
    public String deleteUser(@PathVariable("uuid") UUID uuid) {
        return userService.deleteUser(uuid);
    }


}
