package com.musicstore.products.controller;

import com.musicstore.products.dto.ManufacturerRequest;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.service.ManufacturerService;
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
@RequestMapping("/api/products/manufacturers")
@AllArgsConstructor
public class ManufacturerController {

    private final ManufacturerService manufacturerService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public String addManufacturer(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @Valid @RequestBody ManufacturerRequest manufacturerRequest
    ) {
        return manufacturerService.createManufacturers(token, manufacturerRequest);
    }

    @GetMapping("/get")
    public List<Manufacturer> getAllManufacturers() {
        return manufacturerService.getAllManufacturers();
    }

    @GetMapping("/get/{id}")
    public Manufacturer getManufacturerById(@PathVariable(name = "id") Long id) {
        return manufacturerService.getManufacturerById(id);
    }

    @GetMapping("/get/search/{category}")
    public List<Manufacturer> getAllBySearchParameters(
            @PathVariable(value = "category") Long categoryId,
            @RequestParam(value = "country") String country,
            @RequestParam(value = "subcategory") String subcategory
    ) {
        return manufacturerService.findAllBySearchParameters(categoryId, country, subcategory);
    }

    @PutMapping("/update/{manufacturerId}")
    public ResponseEntity<String> updateCategory(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable(name = "manufacturerId") Long id,
            @Valid @RequestBody ManufacturerRequest manufacturer
    ) {
        return manufacturerService.updateManufacturer(token, id, manufacturer);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteManufacturer(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @PathVariable(name = "id") Long id
    ) {
        return manufacturerService.deleteManufacturer(token, id);
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
