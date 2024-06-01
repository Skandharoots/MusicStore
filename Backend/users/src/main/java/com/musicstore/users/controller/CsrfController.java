package com.musicstore.users.controller;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.aspectj.weaver.tools.cache.SimpleCacheFactory.path;

@RestController
public class CsrfController {

    @GetMapping(path = "/csrf/token")
    public CsrfToken getCsrfToken(CsrfToken token) {
        return token;
    }
}
