package com.musicstore.products.controller;

import com.musicstore.products.dto.CountryRequest;
import com.musicstore.products.model.Country;
import com.musicstore.products.service.CountryService;
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
@RequestMapping("/api/products/countries")
@AllArgsConstructor
public class CountryController {

    private final CountryService countryService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public String addCountry(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @Valid @RequestBody CountryRequest countryRequest
    ) {
        return countryService.createCountry(token, countryRequest);
    }

    @GetMapping("/get")
    public List<Country> getAllCountries() {
        return countryService.getAllCountries();
    }

    @GetMapping("/get/{id}")
    public Country getCountryById(@PathVariable(name = "id") Long id) {
        return countryService.getCountryById(id);
    }

    @GetMapping("/get/search/{category}")
    public List<Country> getCountryBySearchParameters(
            @PathVariable(value = "category") Long categoryId,
            @RequestParam(value = "manufacturer") String manufacturer,
            @RequestParam(value = "subcategory") String subcategory
    ) {
        return countryService.findAllBySearchParameters(categoryId, manufacturer, subcategory);
    }

    @PutMapping("/update/{countryId}")
    public ResponseEntity<String> updateCountry(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable(name = "countryId") Long id,
            @Valid @RequestBody CountryRequest country
    ) {
        return countryService.updateCountry(token, id, country);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCountry(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable(name = "id") Long id) {
        return countryService.deleteCountry(token, id);
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
