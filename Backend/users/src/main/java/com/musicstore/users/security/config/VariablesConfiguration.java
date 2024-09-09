package com.musicstore.users.security.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VariablesConfiguration {

    @Value("${my.jwt_secret}")
    private String jwtSecret;

    @Value("${my.account_confirm_url}")
    private String accountConfirmUrl;

    @Bean
    public String getJwtSecret() {
        return jwtSecret;
    }

    @Bean
    public String getAccountConfirmUrl() {
        return accountConfirmUrl;
    }
}
