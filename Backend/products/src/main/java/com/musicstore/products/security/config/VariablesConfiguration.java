package com.musicstore.products.security.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VariablesConfiguration {

    @Value("${my.admin_url}")
    private String adminUrl;

    @Bean
    public String getAdminUrl() {
        return adminUrl;
    }
}
