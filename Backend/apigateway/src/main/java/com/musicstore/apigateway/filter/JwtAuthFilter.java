package com.musicstore.apigateway.filter;

import org.apache.http.HttpHeaders;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    private final RouteValidator routeValidator;

    private final JwtUtility jwtUtility;

    public JwtAuthFilter(RouteValidator routeValidator, JwtUtility jwtUtility) {
        super(Config.class);
        this.routeValidator = routeValidator;
        this.jwtUtility = jwtUtility;
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
                    jwtUtility.validateToken(authorization);
                } catch (Exception e) {
                    throw new IllegalStateException("Invalid access", e);
                }

            }
            return chain.filter(exchange);
        });
    }
}
