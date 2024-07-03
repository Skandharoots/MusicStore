package com.musicstore.products.controller;

import com.musicstore.products.dto.CategoryRequestBody;
import com.musicstore.products.model.Category;
import com.musicstore.products.service.CategoryService;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products/categories")
@AllArgsConstructor
public class CategoryController {

	private final CategoryService categoryService;


	@PostMapping
	public String addCategory(@RequestHeader(HttpHeaders.AUTHORIZATION) String token, @RequestBody CategoryRequestBody categories) {
		return categoryService.createCategories(token, categories);
	}

	@GetMapping
	public List<Category> getAllCategories() {
		return categoryService.getAllCategories();
	}

	@GetMapping("/{id}")
	public Category getCategoryById(@PathVariable(name = "id") Long id) {
		return categoryService.getCategoryById(id);
	}

	@GetMapping("/{categoryName}")
	public Category getCategoryByName(@PathVariable(name = "categoryName") String categoryName) {
		return categoryService.getCategoryByName(categoryName);
	}

}
