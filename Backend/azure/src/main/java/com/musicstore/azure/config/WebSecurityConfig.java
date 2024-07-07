package com.musicstore.azure.config;

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

@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class WebSecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
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
						.anyRequest()
						.authenticated()
				)
				.sessionManagement(customizer -> customizer.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.formLogin(AbstractHttpConfigurer::disable);
		return http.build();
	}
}
