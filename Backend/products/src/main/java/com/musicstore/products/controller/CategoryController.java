package com.musicstore.products.controller;

import com.musicstore.products.dto.CategoryRequest;
import com.musicstore.products.model.Category;
import com.musicstore.products.service.CategoryService;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products/categories")
@AllArgsConstructor
public class CategoryController {

	private final CategoryService categoryService;


	@PostMapping("/create")
	public String addCategory(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@RequestBody CategoryRequest category) {
		return categoryService.createCategories(token, category);
	}

	@GetMapping("/get")
	public List<Category> getAllCategories() {
		return categoryService.getAllCategories();
	}

	@GetMapping("/get/{id}")
	public Category getCategoryById(@PathVariable(name = "id") Long id) {
		return categoryService.getCategoryById(id);
	}

	@PutMapping("/{categoryId}")
	public ResponseEntity<String> updateCategory(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@PathVariable(name = "categoryId") Long id,
			@RequestBody CategoryRequest category
	) {
		return categoryService.updateCategory(token, id, category);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteCategory(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@PathVariable(name = "id") Long id) {
		return categoryService.deleteCategory(token, id);
	}

}
