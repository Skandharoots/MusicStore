package com.musicstore.users.controller;

import com.musicstore.users.model.LoginRequest;
import com.musicstore.users.model.RegisterRequest;
import com.musicstore.users.service.LoginService;
import com.musicstore.users.service.RegisterService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1")
@AllArgsConstructor
public class RegisterController {

    private final RegisterService registerService;
    private final LoginService loginService;

    @PostMapping(path = "register")
    public String register(@RequestBody RegisterRequest request) {
        return registerService.register(request);
    }

    @GetMapping(path = "register/confirm")
    public String confirm(@RequestParam("token") String token) {
        return registerService.confirmToken(token);
    }

    @PostMapping(path = "login")
    public String login(@RequestBody LoginRequest request) {
        return loginService.loginUser(request);
    }

}
