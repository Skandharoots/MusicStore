package com.musicstore.products.controller;

import com.musicstore.products.dto.SubcategoryTierTwoRequest;
import com.musicstore.products.dto.SubcategoryTierTwoUpdateRequest;
import com.musicstore.products.model.SubcategoryTierTwo;
import com.musicstore.products.service.SubcategoryTierTwoService;
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
@AllArgsConstructor
@RequestMapping("/api/products/subcategory_tier_two")
public class SubcategoryTierTwoController {

    private final SubcategoryTierTwoService subcategoryTierTwoService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public String addSubcategory(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @Valid @RequestBody SubcategoryTierTwoRequest subcategoryRequest
    ) {
        return subcategoryTierTwoService.createSubcategoryTierTwo(token, subcategoryRequest);
    }

    @GetMapping("/get")
    public List<SubcategoryTierTwo> getSubcategoriesTierTwo() {
        return subcategoryTierTwoService.getAll();
    }

    @GetMapping("/get/subcategory")
    public List<SubcategoryTierTwo> getAllSubcategoriesTierTwoBySubcategoryId(
            @RequestParam(name = "subcategory") Long subcategoryId
    ) {
        return subcategoryTierTwoService.getAllSubcategoriesTierTwo(subcategoryId);
    }

    @GetMapping("/get/{id}")
    public SubcategoryTierTwo getSubcategoryById(@PathVariable(name = "id") Long id) {
        return subcategoryTierTwoService.getSubcategoryTierTwoById(id);
    }

    @GetMapping("/get/search/{category}")
    public List<SubcategoryTierTwo> getAllBySearchParameters(
            @PathVariable(value = "category") Long categoryId,
            @RequestParam(value = "country") String country,
            @RequestParam(value = "manufacturer") String manufacturer,
            @RequestParam(value = "subcategory") String subcategory
    ) {
        return subcategoryTierTwoService.findAllBySearchParameters(categoryId, country, subcategory, manufacturer);
    }

    @PutMapping("/update/{subcategoryId}")
    public ResponseEntity<String> updateCategory(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable(name = "subcategoryId") Long id,
            @Valid @RequestBody SubcategoryTierTwoUpdateRequest subcategory
    ) {
        return subcategoryTierTwoService.updateSubcategoryTierTwo(token, id, subcategory);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteSubcategory(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable(name = "id") Long id
    ) {
        return subcategoryTierTwoService.deleteSubcategoryTierTwo(token, id);
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
