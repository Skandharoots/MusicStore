package com.musicstore.products.service;

import com.musicstore.products.dto.SubcategoryRequest;
import com.musicstore.products.dto.SubcategoryUpdateRequest;
import com.musicstore.products.model.Subcategory;
import com.musicstore.products.repository.SubcategoryRepository;
import com.musicstore.products.security.config.VariablesConfiguration;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class SubcategoryService {


    private final SubcategoryRepository subcategoryRepository;

    private final CategoryService categoryService;

    private final WebClient.Builder webClient;

    private final VariablesConfiguration variablesConfiguration;

    public String createSubcategories(String token, SubcategoryRequest subcategory) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        Subcategory newSubcategory = new Subcategory();
        newSubcategory.setName(subcategory.getName());
        newSubcategory.setCategory(categoryService.getCategoryById(subcategory.getCategoryId()));

        subcategoryRepository.save(newSubcategory);
        log.info("Subcategory created: " + newSubcategory.getName());


        return "Subcategories created";
    }

    public List<Subcategory> getAll() {
        return subcategoryRepository.findAll();
    }

    public List<Subcategory> getAllSubcategories(Long id) {

        return subcategoryRepository.findAllByCategory_Id(id);
    }

    public Subcategory getSubcategoryById(Long id) {
        return subcategoryRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subcategory not found")
                );
    }

    public List<Subcategory> findAllBySearchParameters(Long categoryId, String country, String manufacturer, String subcategoryTierTwo) {
        return subcategoryRepository.findAllBySearchParameters(categoryId, country, manufacturer, subcategoryTierTwo);
    }

    @Transactional
    public ResponseEntity<String> updateSubcategory(String token, Long id, SubcategoryUpdateRequest subcategory) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        Subcategory subcategoryToUpdate = subcategoryRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subcategory not found")
                );

        subcategoryToUpdate.setName(subcategory.getName());

        subcategoryRepository.save(subcategoryToUpdate);
        log.info("Subcategory updated: " + subcategoryToUpdate.getName());

        return ResponseEntity.ok("Subcategory updated");

    }

    @Transactional
    public ResponseEntity<String> deleteSubcategory(String token, Long id) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        Subcategory subcategoryToDelete = subcategoryRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subcategory not found")
                );

        subcategoryRepository.delete(subcategoryToDelete);
        log.info("Subcategory deleted: " + subcategoryToDelete.getName());

        return ResponseEntity.ok("Subcategory deleted");
    }

    private Boolean doesUserHaveAdminAuthorities(String token) {

        if (!token.startsWith("Bearer ")) {
            log.error("Invalid token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid token");
        }

        String jwtToken = token.substring("Bearer ".length());

        return webClient
                .build()
                .get()
                .uri(variablesConfiguration.getAdminUrl() + jwtToken)
                .retrieve()
                .bodyToMono(Boolean.class)
                .block();

    }
}
