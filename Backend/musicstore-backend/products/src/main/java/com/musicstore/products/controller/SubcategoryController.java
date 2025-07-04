package com.musicstore.products.controller;

import com.musicstore.products.dto.SubcategoryRequest;
import com.musicstore.products.dto.SubcategoryUpdateRequest;
import com.musicstore.products.model.Subcategory;
import com.musicstore.products.service.SubcategoryService;
import jakarta.validation.Valid;
import jakarta.ws.rs.core.HttpHeaders;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
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
@RequestMapping("/api/products/subcategories")
@AllArgsConstructor
public class SubcategoryController {

    private final SubcategoryService subcategoryService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public String addSubcategory(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @Valid @RequestBody SubcategoryRequest subcategoryRequest
    ) {
        return subcategoryService.createSubcategories(token, subcategoryRequest);
    }

    @GetMapping("/get")
    public List<Subcategory> getSubcategories() {
        return subcategoryService.getAll();
    }

    @GetMapping("/get/category")
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
            @RequestParam(value = "manufacturer") String manufacturer,
            @RequestParam(value = "subcategoryTierTwo") String subcategoryTierTwo
    ) {
        return subcategoryService.findAllBySearchParameters(categoryId, country, manufacturer, subcategoryTierTwo);
    }

    @PutMapping("/update/{subcategoryId}")
    public ResponseEntity<String> updateCategory(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable(name = "subcategoryId") Long id,
            @Valid @RequestBody SubcategoryUpdateRequest subcategory
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

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}
