package com.musicstore.users.controller;

import com.musicstore.users.model.LoginRequest;
import com.musicstore.users.model.LoginResponse;
import com.musicstore.users.model.RegisterRequest;
import com.musicstore.users.service.LoginService;
import com.musicstore.users.service.RegisterService;
import com.musicstore.users.service.UserService;
import lombok.AllArgsConstructor;
import net.minidev.json.JSONObject;
import netscape.javascript.JSObject;
import org.hibernate.annotations.SQLUpdate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(path = "api/v1")
@AllArgsConstructor
public class RegisterController {

    private final RegisterService registerService;
    private final LoginService loginService;
    private final UserService userService;

    @PostMapping(path = "register")
    public String register(@RequestBody RegisterRequest request) {
        return registerService.register(request);
    }

    @GetMapping(path = "register/confirm")
    public String confirm(@RequestParam("token") String token) {
        return registerService.confirmToken(token);
    }

    @PostMapping(path = "login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return loginService.loginUser(request);
    }

    @PutMapping(path = "update/{uuid}")
    public String updateUser(@PathVariable("uuid") UUID uuid, @RequestBody RegisterRequest request) {
        return userService.updateUser(uuid, request);
    }


}
