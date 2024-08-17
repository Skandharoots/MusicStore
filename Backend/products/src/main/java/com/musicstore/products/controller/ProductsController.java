package com.musicstore.products.controller;

import com.musicstore.products.dto.ProductRequest;
import com.musicstore.products.dto.ProductRequestBody;
import com.musicstore.products.model.Product;
import com.musicstore.products.service.ProductService;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products/items")
@AllArgsConstructor
public class ProductsController {

    private final ProductService productService;

    @PostMapping("/create")
    public String createProducts(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody ProductRequestBody products
    ) {
        return productService.createProducts(token, products);
    }

    @GetMapping("/get")
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(value = "p", defaultValue = "0", required = false) int page,
            @RequestParam(value = "ps", defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(productService.getAllProducts(page, pageSize));
    }

    @GetMapping("/get/values/{category}")
    public ResponseEntity<Page<Product>> getAllProductsByCategory(
            @PathVariable(value = "category") Long category,
            @RequestParam(value = "co") String country,
            @RequestParam(value = "ma") String manufacturer,
            @RequestParam(value = "lp", defaultValue = "0.00", required = false) BigDecimal lp,
            @RequestParam(value = "hp", defaultValue = "1000000.00", required = false) BigDecimal hp,
            @RequestParam(value = "sb", defaultValue = "id", required = false) String sortBy,
            @RequestParam(value = "dir", defaultValue = "DESC", required = false) String direction,
            @RequestParam(value = "p", defaultValue = "0", required = false) int page,
            @RequestParam(value = "ps", defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(productService
                .getAllProductsByCategoryAndCountryAndManufacturer(
                        page,
                        pageSize,
                        sortBy,
                        direction,
                        category,
                        country,
                        manufacturer,
                        lp,
                        hp
                )
        );
    }

    @GetMapping("/get/search")
    public ResponseEntity<Page<Product>> getAllProductsBySearchName(
            @RequestParam(value = "n") String productName,
            @RequestParam(value = "p", defaultValue = "0", required = false) int page,
            @RequestParam(value = "ps", defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(productService.getAllProductsBySearchedName(page, pageSize, productName));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateProduct(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable(name = "id") Long id,
            @RequestBody ProductRequest product
    ) {
        return productService.updateProduct(token, id, product);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteProduct(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable(name = "id") Long id
    ) {
        return productService.deleteProduct(token, id);
    }
    

}
