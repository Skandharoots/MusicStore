package com.musicstore.apigateway.filter;

import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpHeaders;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

@Component
@Slf4j
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    private final RouteValidator routeValidator;

    private final WebClient.Builder webClient;

    public JwtAuthFilter(RouteValidator routeValidator, WebClient.Builder webClient) {
        super(Config.class);
        this.routeValidator = routeValidator;
        this.webClient = webClient;
    }

    public static class Config {

    }

    @Override
    public GatewayFilter apply(JwtAuthFilter.Config config) {
        return ((exchange, chain) -> {
            if (routeValidator.isSecured.test(exchange.getRequest())) {

                if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    log.error("Missing authorization priviledges for exchange - "
                            + exchange.getRequest().getPath());
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                            "Missing authorization priviledges");
                }

                String authorization = Objects.requireNonNull(exchange.getRequest()
                        .getHeaders().get(HttpHeaders.AUTHORIZATION)).get(0);

                if (!authorization.startsWith("Bearer ")) {
                    log.error("Invalid authorization header for exchange - "
                            + exchange.getRequest().getPath());
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                            "Invalid authorization header");
                } else {
                    authorization = authorization.substring("Bearer ".length());
                }

                return webClient
                        .build()
                        .get()
                        .uri("http://USERS/api/users/validate?token=" + authorization)
                        .retrieve()
                        .bodyToMono(Boolean.class)
                        .flatMap(response -> {
                            if (response) {
                                return chain.filter(exchange);
                            } else {
                                log.error("Unauthorized access for exchange - "
                                        + exchange.getRequest().getPath());
                                return reactor.core.publisher.Mono.error(
                                        new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                                                "Unauthorized access")
                                );
                            }
                        })
                        .onErrorResume(throwable -> {
                            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                                    "Unauthorized access", throwable);
                        });
            }
            return chain.filter(exchange);
        });
    }
}
