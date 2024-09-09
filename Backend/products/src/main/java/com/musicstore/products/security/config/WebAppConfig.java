package com.musicstore.products.security.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
@AllArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
public class WebAppConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                )
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers(HttpMethod.POST, "/api/products/items/create").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/items/get").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/items/get/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/products/items/update/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/products/items/delete/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/products/categories/create").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/categories/get").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/categories/get/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/products/categories/update/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/products/categories/delete/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/products/manufacturers/create").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/manufacturers/get").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/manufacturers/get/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/products/manufacturers/update/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/products/manufacturers/delete/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/products/countries/create").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/products/items/verify_availability").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/countries/get").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/countries/get/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/products/countries/update/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/products/countries/delete/**").permitAll()
                        .anyRequest()
                        .authenticated()
                )
                .sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(AbstractHttpConfigurer::disable);
        return http.build();
    }
}
