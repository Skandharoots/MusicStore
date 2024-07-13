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
                        .requestMatchers(HttpMethod.GET, "/api/v*/products/test").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v*/products/categories/create").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v*/products/categories/get").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v*/products/categories/get/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v*/products/categories/update/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v*/products/manufacturers/create").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v*/products/manufacturers/get").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v*/products/manufacturers/get/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v*/products/manufacturers/update/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v*/products/countries/create").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v*/products/countries/get").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v*/products/countries/get/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v*/products/countries/update/**").permitAll()
                        .anyRequest()
                        .authenticated()
                )
                .sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(AbstractHttpConfigurer::disable);
        return http.build();
    }
}
