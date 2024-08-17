package com.musicstore.products.service;

import com.musicstore.products.dto.CategoryRequest;
import com.musicstore.products.dto.CategoryRequestBody;
import com.musicstore.products.model.Category;
import com.musicstore.products.repository.CategoryRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService {

	private final CategoryRepository categoryRepository;

	private final WebClient.Builder webClient;

	public String createCategories(String token, CategoryRequestBody categories) {

		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

		for (CategoryRequest categoryRequest : categories.getCategories()) {
			Category category = new Category(categoryRequest.getCategoryName());

			if (category.getName().isEmpty()) {
				throw new IllegalArgumentException("Category name cannot be empty");
			}

			categoryRepository.save(category);
		}

		return "Categories created";
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

		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

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

		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

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
