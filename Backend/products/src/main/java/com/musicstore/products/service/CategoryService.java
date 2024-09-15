package com.musicstore.products.service;

import com.musicstore.products.dto.CategoryRequest;
import com.musicstore.products.model.Category;
import com.musicstore.products.repository.CategoryRepository;
import com.musicstore.products.security.config.VariablesConfiguration;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService {

	private final CategoryRepository categoryRepository;

	private final WebClient.Builder webClient;

	private final VariablesConfiguration variablesConfiguration;

	public String createCategories(String token, CategoryRequest category) {

		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
		}

		if (category.getCategoryName() == null || category.getCategoryName().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name cannot be empty");
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
						() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found")
				);
	}

	public ResponseEntity<String> updateCategory(String token, Long id, CategoryRequest category) {

		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
		}

		if (category.getCategoryName() == null || category.getCategoryName().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category name cannot be empty");
		}

		Category categoryToUpdate = categoryRepository
				.findById(id)
				.orElseThrow(
						() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found")
				);

		categoryToUpdate.setName(category.getCategoryName());

		categoryRepository.save(categoryToUpdate);

		return ResponseEntity.ok("Category updated");
	}

	public ResponseEntity<String> deleteCategory(String token, Long id) {

		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
		}

		Category category = categoryRepository.findById(id)
						.orElseThrow(
								() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found")
						);

		categoryRepository.delete(category);

		return ResponseEntity.ok("Category deleted successfully");
	}

	private Boolean doesUserHaveAdminAuthorities(String token) {

		if (!token.startsWith("Bearer ")) {
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
