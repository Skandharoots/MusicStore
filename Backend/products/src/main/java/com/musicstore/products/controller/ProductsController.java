package com.musicstore.products.controller;

import com.musicstore.products.dto.ProductRequestBody;
import com.musicstore.products.dto.ProductResponseBody;
import com.musicstore.products.service.ProductService;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products/items")
@AllArgsConstructor
public class ProductsController {

    private final ProductService productService;

    @PostMapping("/create")
    public String createProducts(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
                                 @RequestBody ProductRequestBody products) {
        return productService.createProducts(token, products);
    }

    @GetMapping("/get")
    public ResponseEntity<ProductResponseBody> getAllProducts(
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(productService.getAllProducts(page, pageSize));
    }

    @GetMapping("/get/values")
    public ResponseEntity<ProductResponseBody> getAllProductsByCategory(
            @RequestParam(value = "category") String category,
            @RequestParam(value = "country") String country,
            @RequestParam(value = "manufacturer") String manufacturer,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(productService
                .getAllProductsByCategoryAndCountryAndManufacturer(
                        page,
                        pageSize,
                        category,
                        country,
                        manufacturer
                )
        );
    }


}
