package com.musicstore.products.api.service;

import com.musicstore.products.dto.SubcategoryRequest;
import com.musicstore.products.model.Category;
import com.musicstore.products.model.Subcategory;
import com.musicstore.products.repository.SubcategoryRepository;
import com.musicstore.products.service.CategoryService;
import com.musicstore.products.service.SubcategoryService;
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
public class SubcategoryServiceTests {

    @Mock
    private SubcategoryRepository subcategoryRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private WebClient.Builder webClient;

    @InjectMocks
    private SubcategoryService subcategoryService;

    @Test
    public void addSubcategoryTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        Category category = new Category("Guitar");
        category.setId(1L);

        Subcategory subcategory = new Subcategory("Electric");
        subcategory.setId(1L);
        subcategory.setCategory(category);

        SubcategoryRequest subcategoryRequest = new SubcategoryRequest();
        subcategoryRequest.setName("Electric");
        subcategoryRequest.setCategoryId(1L);

        when(categoryService.getCategoryById(1L)).thenReturn(category);
        when(subcategoryRepository.save(Mockito.any(Subcategory.class))).thenReturn(subcategory);
        String response = subcategoryService.createSubcategories(token, subcategoryRequest);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isNotEmpty();

    }

    @Test
    public void addSubcategoryExceptionTest() {
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        SubcategoryRequest subcategoryRequest = new SubcategoryRequest();


        Assertions.assertThatThrownBy(() -> subcategoryService.createSubcategories(token, subcategoryRequest));
    }

    @Test
    public void getAllSubCategoriesTest() {

        Category category = new Category("Guitar");
        category.setId(1L);

        Subcategory subcategory = new Subcategory("Electric");
        subcategory.setId(1L);
        subcategory.setCategory(category);

        List<Subcategory> categories = new ArrayList<>();
        categories.add(subcategory);

        when(subcategoryRepository.findAllByCategory_Id(1L)).thenReturn(categories);
        List<Subcategory> response = subcategoryService.getAllSubcategories(1L);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isNotEmpty();
        Assertions.assertThat(response).hasSize(1);

    }

    @Test
    public void getSubcategoryByIdTest() {

        Category category = new Category("Guitar");
        category.setId(1L);

        Subcategory subcategory = new Subcategory("Electric");
        subcategory.setId(1L);
        subcategory.setCategory(category);

        when(subcategoryRepository.findById(1L)).thenReturn(Optional.of(subcategory));
        Subcategory response = subcategoryService.getSubcategoryById(1L);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getName()).isEqualTo("Electric");
        Assertions.assertThat(response.getId()).isEqualTo(1L);

    }

    @Test
    public void getSubcategoryByIdExceptionTest() {

        when(subcategoryRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> subcategoryService.getSubcategoryById(1L));

    }

    @Test
    public void findAllSubcategoriesBySearchParametersTest() {

        Category category = new Category("Guitar");
        category.setId(1L);

        Subcategory subcategory = new Subcategory("Electric");
        subcategory.setId(1L);
        subcategory.setCategory(category);

        List<Subcategory> categories = new ArrayList<>();
        categories.add(subcategory);

        when(subcategoryRepository.findAllBySearchParameters(1L, "USA", "Fender")).thenReturn(categories);
        List<Subcategory> response = subcategoryService.findAllBySearchParameters(1L, "USA", "Fender");
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.size()).isEqualTo(1);
        Assertions.assertThat(response.get(0)).isEqualTo(subcategory);

    }

    @Test
    public void updateSubcategoryTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        Category category = new Category("Guitar");
        category.setId(1L);

        Subcategory subcategory = new Subcategory("Electric");
        subcategory.setId(1L);
        subcategory.setCategory(category);

        SubcategoryRequest subcategoryRequest = new SubcategoryRequest();
        subcategoryRequest.setName("Acoustasonic");

        Subcategory subcategoryUpdated = new Subcategory("Acoustasonic");
        subcategory.setId(1L);

        when(subcategoryRepository.findById(1L)).thenReturn(Optional.of(subcategory));
        when(subcategoryRepository.save(Mockito.any(Subcategory.class))).thenReturn(subcategoryUpdated);

        ResponseEntity<String> response = subcategoryService.updateSubcategory(token, 1L, subcategoryRequest);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Subcategory updated");

    }

    @Test
    public void updateSubcategoryExceptionTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        SubcategoryRequest subcategoryRequest = new SubcategoryRequest();

        when(subcategoryRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> subcategoryService.updateSubcategory(token, 1L, subcategoryRequest));

    }

    @Test
    public void deleteSubcategoryTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        Subcategory subcategory = new Subcategory("Electric");
        subcategory.setId(1L);

        when(subcategoryRepository.findById(1L)).thenReturn(Optional.of(subcategory));
        ResponseEntity<String> response = subcategoryService.deleteSubcategory(token, 1L);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Subcategory deleted");

    }

    @Test
    public void deleteSubcategoryExceptionTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        when(subcategoryRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> subcategoryService.deleteSubcategory(token, 1L));
    }
}
