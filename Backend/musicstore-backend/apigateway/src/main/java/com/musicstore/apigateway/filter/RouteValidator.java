package com.musicstore.apigateway.filter;

import java.util.List;
import java.util.function.Predicate;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

@Component
public class RouteValidator {

    public static final List<String> openApiEndpoints = List.of(
            "/api/users/register",
            "/api/users/login",
            "/api/users/validate",
            "/api/users/register/**",
            "/api/users/csrf/token",
            "/api/products/items/get",
            "/api/products/items/get/**",
            "/api/products/categories/get",
            "/api/products/countries/get",
            "/api/products/manufacturers/get",
            "/api/products/categories/get/**",
            "/api/products/countries/get/**",
            "/api/products/manufacturers/get/**",
            "/api/users/adminauthorize",
            "/api/azure/read",
            "/api/azure/list",
            "/api/order/get/**",
            "/eureka/web"
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
