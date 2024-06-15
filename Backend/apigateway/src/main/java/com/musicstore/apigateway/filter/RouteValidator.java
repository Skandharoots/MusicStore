package com.musicstore.apigateway.filter;


import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/api/v1/users/register",
            "/api/v1/users/login",
            "/api/v1/users/validate",
            "/api/v1/users/register/**",
            "/api/v1/users/csrf/token",
            "/api/v1/products/test",
            "/eureka"
    );

    public Predicate<ServerHttpRequest> isSecured =
         request -> openApiEndpoints
                .stream()
                .noneMatch(uri -> request
                        .getURI()
                        .getPath()
                        .contains(uri)
                );

}
