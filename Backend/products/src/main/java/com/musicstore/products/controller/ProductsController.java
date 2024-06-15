package com.musicstore.products.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/products")
public class ProductsController {

    @PostMapping("test")
    public String test() {
        return "Products!";
    }
}
