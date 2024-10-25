package com.musicstore.azureservice.config;

import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(List.of("http://localhost:3000",
                "http://prometheus.default.svc.cluster.local:9090",
                "http://loki.default.svc.cluster.local:3100"));
        configuration.setMaxAge(3600L);
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setExposedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(c -> c.configurationSource(corsConfigurationSource()))
                .csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer
                    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                    .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler())
                )
                .authorizeHttpRequests((requests) -> requests
                    .requestMatchers(HttpMethod.POST, "/api/azure/upload").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/azure/read").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/azure/list").permitAll()
                    .requestMatchers(HttpMethod.PUT, "/api/azure/update").permitAll()
                    .requestMatchers(HttpMethod.DELETE, "/api/azure/delete").permitAll()
                    .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers("/actuator/prometheus").permitAll()
                    .requestMatchers("/azure-svc/api-docs/**",
                            "/azure-svc/v3/api-docs/**").permitAll()
                    .requestMatchers("/error").permitAll()
                    .anyRequest()
                    .authenticated()
                )
                .sessionManagement(customizer -> customizer
                    .sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS)
                )
                .formLogin(AbstractHttpConfigurer::disable);
        return http.build();
    }
}
