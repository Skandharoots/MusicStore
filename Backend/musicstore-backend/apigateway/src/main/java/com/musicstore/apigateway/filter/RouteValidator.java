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
                        "/api/users/refresh-token",
                        "/api/users/password/email/reset",
                        "/api/users/password/email",
                        "/api/products/items/get",
                        "/api/products/items/get/**",
                        "/api/products/categories/get",
                        "/api/products/countries/get",
                        "/api/products/manufacturers/get",
                        "/api/products/categories/get/**",
                        "/api/products/countries/get/**",
                        "/api/products/manufacturers/get/**",
                        "/api/products/subcategories/get/**",
                        "/api/products/subcategories/get",
                        "/api/products/subcategory_tier_two/get/**",
                        "/api/products/subcategory_tier_two/get",
                        "/api/cart/get/**",
                        "/api/opinions/get",
                        "/api/opinions/get/user",
                        "/api/opinions/get/opinion",
                        "/api/opinions/get/users",
                        "/api/favorites/get",
                        "/api/users/adminauthorize",
                        "/api/azure/read",
                        "/api/azure/list",
                        "/api/invoice/read",
                        "/api/invoice/list",
                        "/eureka/web",
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**",
                        "/swagger-resources/**",
                        "/api-docs/**",
                        "/invoice-svc/v3/api-docs",
                        "/users-svc/v3/api-docs",
                        "/order-svc/v3/api-docs",
                        "/azure-svc/v3/api-docs",
                        "/cart-svc/v3/api-docs",
                        "/products-svc/v3/api-docs",
                        "/opinions-svc/v3/api-docs"

        );

        public Predicate<ServerHttpRequest> isSecured = request -> openApiEndpoints
                        .stream()
                        .noneMatch(uri -> request
                                        .getURI()
                                        .getPath()
                                        .contains(uri));

}
