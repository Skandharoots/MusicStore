package com.musicstore.products.controller;

import com.musicstore.products.dto.SubcategoryRequest;
import com.musicstore.products.model.Subcategory;
import com.musicstore.products.service.SubcategoryService;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products/subcategories")
@AllArgsConstructor
public class SubcategoryController {

    private final SubcategoryService subcategoryService;

    @PostMapping("/create")
    public String addSubcategory(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @RequestBody SubcategoryRequest subcategoryRequest
    ) {
        return subcategoryService.createSubcategories(token, subcategoryRequest);
    }

    @GetMapping("/get")
    public List<Subcategory> getAllSubcategories(
            @RequestParam(name = "category") Long categoryId
    ) {

        return subcategoryService.getAllSubcategories(categoryId);
    }

    @GetMapping("/get/{id}")
    public Subcategory getSubcategoryById(@PathVariable(name = "id") Long id) {
        return subcategoryService.getSubcategoryById(id);
    }

    @GetMapping("/get/search/{category}")
    public List<Subcategory> getAllBySearchParameters(
            @PathVariable(value = "category") Long categoryId,
            @RequestParam(value = "country") String country,
            @RequestParam(value = "manufacturer") String manufacturer
    ) {
        return subcategoryService.findAllBySearchParameters(categoryId, country, manufacturer);
    }

    @PutMapping("/update/{subcategoryId}")
    public ResponseEntity<String> updateCategory(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable(name = "subcategoryId") Long id,
            @RequestBody SubcategoryRequest subcategory
    ) {
        return subcategoryService.updateSubcategory(token, id, subcategory);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSubcategory(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable(name = "id") Long id
    ) {
        return subcategoryService.deleteSubcategory(token, id);
    }
}
