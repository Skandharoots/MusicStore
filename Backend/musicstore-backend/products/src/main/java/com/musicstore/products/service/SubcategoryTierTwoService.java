package com.musicstore.products.service;

import com.musicstore.products.dto.SubcategoryTierTwoRequest;
import com.musicstore.products.dto.SubcategoryTierTwoUpdateRequest;
import com.musicstore.products.model.SubcategoryTierTwo;
import com.musicstore.products.repository.SubcategoryTierTwoRepository;
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
@AllArgsConstructor
@Slf4j
public class SubcategoryTierTwoService {

    private final SubcategoryTierTwoRepository subcategoryTierTwoRepository;

    private final SubcategoryService subcategoryService;

    private final WebClient.Builder webClient;
    
    private final VariablesConfiguration variablesConfiguration;

    public String createSubcategoryTierTwo(String token, SubcategoryTierTwoRequest subcategory) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        SubcategoryTierTwo newSubcategoryT2 = new SubcategoryTierTwo();
        newSubcategoryT2.setName(subcategory.getName());
        newSubcategoryT2.setSubcategory(subcategoryService.getSubcategoryById(subcategory.getSubcategoryId()));

        subcategoryTierTwoRepository.save(newSubcategoryT2);
        log.info("Subcategory created: " + newSubcategoryT2.getName());


        return "Subcategory tier two created";
    }

    public List<SubcategoryTierTwo> getAll() {
        return subcategoryTierTwoRepository.findAll();
    }

    public List<SubcategoryTierTwo> getAllSubcategoriesTierTwo(Long id) {

        return subcategoryTierTwoRepository.findAllBySubcategory_Id(id);
    }

    public SubcategoryTierTwo getSubcategoryTierTwoById(Long id) {
        return subcategoryTierTwoRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subcategory tier two not found")
                );
    }

    public List<SubcategoryTierTwo> findAllBySearchParameters(Long categoryId, String country, String subcategory, String manufacturer) {
        return subcategoryTierTwoRepository.findAllBySearchParameters(categoryId, country, subcategory, manufacturer);
    }

    @Transactional
    public ResponseEntity<String> updateSubcategoryTierTwo(String token, Long id, SubcategoryTierTwoUpdateRequest subcategoryTierTwo) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        SubcategoryTierTwo subcategoryTierTwoToUpdate = subcategoryTierTwoRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subcategory tier two not found")
                );

        subcategoryTierTwoToUpdate.setName(subcategoryTierTwo.getName());

        subcategoryTierTwoRepository.save(subcategoryTierTwoToUpdate);
        log.info("Subcategory tier two updated: " + subcategoryTierTwoToUpdate.getName());

        return ResponseEntity.ok("Subcategory tier two updated");

    }

    @Transactional
    public ResponseEntity<String> deleteSubcategoryTierTwo(String token, Long id) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        SubcategoryTierTwo subcategoryTierTwoToDelete = subcategoryTierTwoRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subcategory tier two not found")
                );

        subcategoryTierTwoRepository.delete(subcategoryTierTwoToDelete);
        log.info("Subcategory tier two deleted: " + subcategoryTierTwoToDelete.getName());

        return ResponseEntity.ok("Subcategory tier two deleted");
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
