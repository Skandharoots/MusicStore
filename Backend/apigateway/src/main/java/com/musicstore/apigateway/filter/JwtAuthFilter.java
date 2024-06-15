package com.musicstore.apigateway.filter;

import com.musicstore.apigateway.config.GatewayConfig;
import org.apache.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    private final RouteValidator routeValidator;

    @Autowired
    private RestTemplate restTemplate;

    public JwtAuthFilter(RouteValidator routeValidator) {
        super(Config.class);
        this.routeValidator = routeValidator;
    }

    public static class Config {

    }

    @Override
    public GatewayFilter apply(JwtAuthFilter.Config config) {
        return ((exchange, chain) -> {
            if (routeValidator.isSecured.test(exchange.getRequest())) {
                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    throw new IllegalStateException("Missing authorization priviledges");
                }

                String authorization = Objects.requireNonNull(exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION)).get(0);
                if (!authorization.startsWith("Bearer ")) {
                    throw new IllegalStateException("Invalid authorization header");
                } else {
                    authorization = authorization.substring("Bearer ".length());
                }
                try {
                    if (!Objects.equals(restTemplate.getForObject("http://localhost:8090/api/v1/users/validate?token=" + authorization, Boolean.class), true)) {
                        throw new IllegalStateException("Invalid token");
                    }
                } catch (Exception e) {
                    throw new IllegalStateException("Invalid access", e);
                }

            }
            return chain.filter(exchange);
        });
    }
}
