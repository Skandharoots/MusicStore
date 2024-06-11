package com.musicstore.users.controller;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("api/v1/users")
public class CsrfController {

    @GetMapping(path = "csrf/token")
    public CsrfToken getCsrfToken(CsrfToken token) {
        return token;
    }
}
