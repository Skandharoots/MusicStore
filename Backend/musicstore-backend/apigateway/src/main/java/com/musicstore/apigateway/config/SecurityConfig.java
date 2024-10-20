package com.musicstore.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${my.security.username}")
    private String username;

    @Value("${my.security.password}")
    private String password;

    @Bean
    public BCryptPasswordEncoder discoveryPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public MapReactiveUserDetailsService discoveryUserDetailsService() {
        UserDetails admin = User.builder()
                .username(username)
                .password(discoveryPasswordEncoder().encode(password))
                .authorities("ROLE_ADMIN")
                .build();

        return new MapReactiveUserDetailsService(admin);
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

        http
                .cors(ServerHttpSecurity.CorsSpec::disable)
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .headers(ServerHttpSecurity.HeaderSpec::disable)
                .authorizeExchange(exchange -> {
                    exchange.pathMatchers("/swagger-ui.html").hasRole("ADMIN");
                    exchange.pathMatchers("/eureka/web").hasRole("ADMIN");
                    exchange.pathMatchers("/**").permitAll();
                })
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }


}
