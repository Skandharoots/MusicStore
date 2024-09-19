package com.musicstore.products.controller;

import com.musicstore.products.dto.CancelOrderRequest;
import com.musicstore.products.dto.OrderAvailabilityResponse;
import com.musicstore.products.dto.OrderRequest;
import com.musicstore.products.dto.ProductRequest;
import com.musicstore.products.model.Product;
import com.musicstore.products.service.ProductService;
import jakarta.ws.rs.core.HttpHeaders;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products/items")
@AllArgsConstructor
public class ProductsController {

    private final ProductService productService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public UUID createProducts(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody ProductRequest product
    ) {
        return productService.createProducts(token, product);
    }

    @GetMapping("/get")
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(productService.getAllProducts(page, pageSize));
    }

    @GetMapping("/get/{uuid}")
    public ResponseEntity<Product> getProductById(
            @PathVariable(name = "uuid") UUID id
    ) {
        return productService.getProductById(id);
    }

    @GetMapping("/get/max_price/{category}")
    public ResponseEntity<BigDecimal> getMaxPrice(
            @PathVariable(value = "category") Long category,
            @RequestParam(value = "country") String country,
            @RequestParam(value = "manufacturer") String manufacturer,
            @RequestParam(value = "subcategory") String subcategory
    ) {
        return productService.getMaxPriceForProducts(category, country, manufacturer, subcategory);
    }

    @GetMapping("/get/values/{category}")
    public ResponseEntity<Page<Product>> getAllProductsByCategory(
            @PathVariable(value = "category") Long category,
            @RequestParam(value = "country") String country,
            @RequestParam(value = "manufacturer") String manufacturer,
            @RequestParam(value = "subcategory") String subcategory,
            @RequestParam(value = "lowPrice", defaultValue = "0.00", required = false) BigDecimal lp,
            @RequestParam(value = "highPrice", defaultValue = "1000000.00", required = false) BigDecimal hp,
            @RequestParam(value = "sortBy", defaultValue = "id", required = false) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC", required = false) String direction,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(productService
                .getAllProductsByCategoryAndCountryAndManufacturerAndSubcategory(
                        page,
                        pageSize,
                        sortBy,
                        direction,
                        category,
                        country,
                        manufacturer,
                        subcategory,
                        lp,
                        hp
                )
        );
    }

    @GetMapping("/get/search")
    public ResponseEntity<Page<Product>> getAllProductsBySearchName(
            @RequestParam(value = "searchPhrase") String searchPhrase,
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return ResponseEntity.ok(productService.getAllProductsBySearchedPhrase(page, pageSize, searchPhrase));
    }

    @PostMapping("/verify_availability")
    public ResponseEntity<OrderAvailabilityResponse> verifyAvailabilityOfOrderProducts(
            @RequestBody OrderRequest orderRequest
    ) {
        return productService.verifyAvailabilityOfOrderProducts(orderRequest);
    }

    @PostMapping("/cancel_order")
    public ResponseEntity<Boolean> cancelOrderItems(
            @RequestBody CancelOrderRequest cancelOrderRequest
    ) {
        return productService.cancelOrderProducts(cancelOrderRequest);
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
