package com.musicstore.products.service;

import com.musicstore.products.dto.CategoryRequest;
import com.musicstore.products.dto.CategoryRequestBody;
import com.musicstore.products.model.Category;
import com.musicstore.products.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService {

	private final CategoryRepository categoryRepository;

	public String createCategories(CategoryRequestBody categories) {

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
