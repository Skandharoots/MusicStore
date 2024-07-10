package com.musicstore.apigateway.filter;

import com.musicstore.apigateway.config.GatewayConfig;
import org.apache.http.HttpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Objects;

@Component
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
                    throw new IllegalStateException("Missing authorization priviledges");
                }

                String authorization = Objects.requireNonNull(exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION)).get(0);
                if (!authorization.startsWith("Bearer ")) {
                    throw new IllegalStateException("Invalid authorization header");
                } else {
                    authorization = authorization.substring("Bearer ".length());
                }
                return webClient
                        .build()
                        .get()
                        .uri("http://USERS/api/v1/users/validate?token=" + authorization)
                        .retrieve()
                        .bodyToMono(Boolean.class)
                        .flatMap(response -> {
                            if (response) {
                                return chain.filter(exchange);
                            } else {
                                return reactor.core.publisher.Mono.error(new RuntimeException("Unauthorized access"));
                            }
                        })
                        .onErrorResume(throwable -> {
                            throw new RuntimeException("Unauthorized access", throwable);
                        });
                }
                return chain.filter(exchange);
            });
        }
    }
