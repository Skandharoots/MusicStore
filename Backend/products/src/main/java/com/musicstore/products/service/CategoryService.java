package com.musicstore.products.service;

import com.musicstore.products.dto.CategoryRequest;
import com.musicstore.products.dto.CategoryRequestBody;
import com.musicstore.products.model.Category;
import com.musicstore.products.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class CategoryService {

	private final CategoryRepository categoryRepository;

	private final RestTemplate restTemplate;

	public String createCategories(String token, CategoryRequestBody categories) {

		//TODO: Uncomment this for prod
//		if (token.isEmpty() || token == null || !token.startsWith("Bearer ")) {
//			throw new RuntimeException("Invalid token");
//		}
//
//		String jwtToken = token.substring("Bearer ".length());


//		if(!Objects.equals(
//				restTemplate
//						.getForObject("http://localhost:8222/api/v1/users/adminauthorize?token="
//								+ jwtToken, Boolean.class), true)) {
//
//			throw new IllegalArgumentException("No admin permissions");
//
//		}

		for(CategoryRequest categoryRequest : categories.getCategories()) {
			Category category = new Category(categoryRequest.getCategoryName());

			if (category.getCategoryName().isEmpty()) {
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
		return categoryRepository.findById(id).orElse(null);
	}

	public Category getCategoryByName(String name) {
		return categoryRepository.findByCategoryName(name).orElse(null);
	}

}
