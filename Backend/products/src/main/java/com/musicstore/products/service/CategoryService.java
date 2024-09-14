package com.musicstore.products.service;

import com.musicstore.products.dto.CategoryRequest;
import com.musicstore.products.model.Category;
import com.musicstore.products.model.Subcategory;
import com.musicstore.products.repository.CategoryRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.security.InvalidParameterException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CategoryService {

	private final CategoryRepository categoryRepository;

	private final WebClient.Builder webClient;

	public String createCategories(String token, CategoryRequest category) {

		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
			throw new RuntimeException("No admin authority");
		}

		if (category.getCategoryName() == null || category.getCategoryName().isEmpty()) {
			throw new InvalidParameterException("Category name cannot be empty");
		}

		Category categoryEntity = new Category();
		categoryEntity.setName(category.getCategoryName());

		categoryRepository.save(categoryEntity);

		return "Category created";
	}

	public List<Category> getAllCategories() {
		return categoryRepository.findAll();
	}

	public Category getCategoryById(Long id) {
		return categoryRepository
				.findById(id)
				.orElseThrow(
						() -> new NotFoundException("Category not found")
				);
	}

	public ResponseEntity<String> updateCategory(String token, Long id, CategoryRequest category) {

		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
			throw new RuntimeException("No admin authority");
		}

		if (category.getCategoryName() == null || category.getCategoryName().isEmpty()) {
			throw new InvalidParameterException("Category name cannot be empty");
		}

		Category categoryToUpdate = categoryRepository
				.findById(id)
				.orElseThrow(
						() -> new NotFoundException("Category not found")
				);

		categoryToUpdate.setName(category.getCategoryName());

		categoryRepository.save(categoryToUpdate);

		return ResponseEntity.ok("Category updated");
	}

	public ResponseEntity<String> deleteCategory(String token, Long id) {

		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
			throw new RuntimeException("No admin authority");
		}

		Category category = categoryRepository.findById(id)
						.orElseThrow(
								() -> new NotFoundException("Category not found")
						);

		categoryRepository.delete(category);

		return ResponseEntity.ok("Category deleted successfully");
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
