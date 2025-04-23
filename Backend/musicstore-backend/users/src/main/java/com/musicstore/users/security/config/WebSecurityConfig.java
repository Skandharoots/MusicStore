package com.musicstore.users.security.config;

import com.musicstore.users.security.JwtFilter;
import com.musicstore.users.service.UserService;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@AllArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

        private final UserService userService;
        private final BCryptPasswordEncoder bcryptPasswordEncoder;

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowCredentials(true);
                configuration.setAllowedOrigins(List.of("http://localhost:4000",
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
                                                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
                                .authorizeHttpRequests((requests) -> requests
                                                .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/users/register/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/users/validate").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/users/login").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/users/get/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/users/csrf/token").permitAll()
                                                .requestMatchers(HttpMethod.PUT, "/api/users/update/**").permitAll()
                                                .requestMatchers(HttpMethod.DELETE, "api/users/delete/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/users/adminauthorize")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/users/refresh-token")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/users/password/email/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/users/password/email/reset")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/users/password/settings/reset")
                                                .permitAll()
                                                .requestMatchers("/actuator/**").permitAll()
                                                .requestMatchers("/users-svc/api-docs/**",
                                                                "/users-svc/v3/api-docs/**")
                                                .permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .anyRequest()
                                                .authenticated())
                                .sessionManagement(customizer -> customizer
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .formLogin(AbstractHttpConfigurer::disable)
                                .authenticationProvider(daoAuthenticationProvider())
                                .addFilterBefore(authenticationTokenFilter(),
                                                UsernamePasswordAuthenticationFilter.class);
                return http.build();
        }

        @Bean
        public DaoAuthenticationProvider daoAuthenticationProvider() {
                DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
                provider.setPasswordEncoder(bcryptPasswordEncoder);
                provider.setUserDetailsService(userService);
                return provider;
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
                        throws Exception {
                return config.getAuthenticationManager();
        }

        @Bean
        public JwtFilter authenticationTokenFilter() {
                return new JwtFilter();
        }
}
