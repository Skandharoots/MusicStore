package com.musicstore.products.service;

import com.musicstore.products.dto.SubcategoryRequest;
import com.musicstore.products.model.Subcategory;
import com.musicstore.products.repository.SubcategoryRepository;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@AllArgsConstructor
public class SubcategoryService {

    private final SubcategoryRepository subcategoryRepository;

    private final CategoryService categoryService;

    private final WebClient.Builder webClient;

    public String createSubcategories(String token, SubcategoryRequest subcategory) {
        //TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

        if (subcategory.getName().isEmpty() || subcategory.getCategoryId().toString().isEmpty()) {
            throw new IllegalArgumentException("Subcategory name or category id cannot be empty");
        }

        Subcategory newSubcategory = new Subcategory();
        newSubcategory.setName(subcategory.getName());
        newSubcategory.setCategory(categoryService.getCategoryById(subcategory.getCategoryId()));

        subcategoryRepository.save(newSubcategory);


        return "Subcategories created";
    }

    public List<Subcategory> getAllSubcategories(Long id) {

        return subcategoryRepository.findAllByCategory_Id(id);
    }

    public Subcategory getSubcategoryById(Long id) {
        return subcategoryRepository
                .findById(id)
                .orElseThrow(
                        () -> new NotFoundException("Subcategory not found")
                );
    }

    public List<Subcategory> findAllBySearchParameters(Long categoryId, String country, String manufacturer) {
        return subcategoryRepository.findAllBySearchParameters(categoryId, country, manufacturer);
    }

    public ResponseEntity<String> updateSubcategory(String token, Long id, SubcategoryRequest subcategory) {

        //TODO: Uncomment this for prod
    //		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
    //			throw new RuntimeException("No admin authority");
    //		}

        Subcategory subcategoryToUpdate = subcategoryRepository
                .findById(id)
                .orElseThrow(
                        () -> new NotFoundException("Subcategory not found")
                );

        subcategoryToUpdate.setName(subcategory.getName());

        subcategoryRepository.save(subcategoryToUpdate);

        return ResponseEntity.ok("Subcategory updated");
    }

    public ResponseEntity<String> deleteSubcategory(String token, Long id) {
        //TODO: Uncomment this for prod
    //		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
    //			throw new RuntimeException("No admin authority");
    //		}

        Subcategory subcategoryToDelete = subcategoryRepository
                .findById(id)
                .orElseThrow(
                        () -> new NotFoundException("Subcategory not found")
                );

        subcategoryRepository.delete(subcategoryToDelete);

        return ResponseEntity.ok("Subcategory deleted");
    }

    private Boolean doesUserHaveAdminAuthorities(String token) {

        if (!token.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }

        String jwtToken = token.substring("Bearer ".length());

        return webClient
                .build()
                .get()
                .uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)
                .retrieve()
                .bodyToMono(Boolean.class)
                .block();

    }
}
