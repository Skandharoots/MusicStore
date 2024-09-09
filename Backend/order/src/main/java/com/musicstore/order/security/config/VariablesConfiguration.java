package com.musicstore.order.security.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VariablesConfiguration {

    @Value("${my.admin_url}")
    private String adminUrl;

    @Value("${my.order_check_url}")
    private String orderCheckUrl;

    @Bean
    public String getAdminVerificationUrl() {
        return adminUrl;
    }

    @Bean
    public String getOrderCheckUrl() {
        return orderCheckUrl;
    }
}
