package com.musicstore.products.api.service;

import com.musicstore.products.dto.CategoryRequest;
import com.musicstore.products.model.Category;
import com.musicstore.products.repository.CategoryRepository;
import com.musicstore.products.service.CategoryService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTests {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private WebClient.Builder webClient;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    public void addCategoryTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        Category category = new Category("Guitar");
        category.setId(1L);

        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setCategoryName("Guitar");

        when(categoryRepository.save(Mockito.any(Category.class))).thenReturn(category);
        String response = categoryService.createCategories(token, categoryRequest);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isNotEmpty();

    }

    @Test
    public void getAllCategoriesTest() {

        Category category = new Category("Guitar");
        category.setId(1L);

        List<Category> categories = new ArrayList<>();
        categories.add(category);

        when(categoryRepository.findAll()).thenReturn(categories);
        List<Category> response = categoryService.getAllCategories();
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isNotEmpty();
        Assertions.assertThat(response).hasSize(1);

    }

    @Test
    public void getCategoryByIdTest() {

        Category category = new Category("Guitar");
        category.setId(1L);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        Category response = categoryService.getCategoryById(1L);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getName()).isEqualTo("Guitar");
        Assertions.assertThat(response.getId()).isEqualTo(1L);

    }

    @Test
    public void getCategoryByIdExceptionTest() {

        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> categoryService.getCategoryById(1L));

    }

    @Test
    public void updateCategoryTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        Category category = new Category("Guitar");
        category.setId(1L);

        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setCategoryName("Drums");

        Category categoryUpdated = new Category("Drums");
        category.setId(1L);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(Mockito.any(Category.class))).thenReturn(categoryUpdated);

        ResponseEntity<String> response = categoryService.updateCategory(token, 1L, categoryRequest);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Category updated");

    }

    @Test
    public void deleteCategoryTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        Category category = new Category("Guitar");
        category.setId(1L);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        ResponseEntity<String> response = categoryService.deleteCategory(token, 1L);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Category deleted successfully");

    }
}
