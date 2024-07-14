package com.musicstore.products.service;

import com.musicstore.products.dto.CategoryRequest;
import com.musicstore.products.dto.CategoryRequestBody;
import com.musicstore.products.model.Category;
import com.musicstore.products.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Objects;

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
						() -> new IllegalArgumentException("Category not found")
				);
	}

	public String updateCategory(Long id, CategoryRequest category) {

		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

		Category categoryToUpdate = categoryRepository
				.findById(id)
				.orElseThrow(
						() -> new IllegalArgumentException("Category not found")
				);

		categoryToUpdate.setName(category.getCategoryName());

		categoryRepository.save(categoryToUpdate);

		return "Category updated";
	}

	private Boolean doesUserHaveAdminAuthorities(String token) {

		if (token.isEmpty() || !token.startsWith("Bearer ")) {
			throw new RuntimeException("Invalid token");
		}

		String jwtToken = token.substring("Bearer ".length());

		Boolean authorized = webClient
				.build()
				.get()
				.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)
				.retrieve()
				.bodyToMono(Boolean.class)
				.block();

		return authorized;
	}

}
