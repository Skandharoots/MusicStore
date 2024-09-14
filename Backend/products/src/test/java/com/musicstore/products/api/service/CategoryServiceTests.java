package com.musicstore.products.api.service;

import com.musicstore.products.dto.CategoryRequest;
import com.musicstore.products.model.Category;
import com.musicstore.products.repository.CategoryRepository;
import com.musicstore.products.service.CategoryService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTests {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @InjectMocks
    private CategoryService categoryService;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    private Category category;

    @BeforeEach
    public void setup() {
        category = new Category("Guitar");
        category.setId(1L);
    }


    @Test
    public void addCategoryTest() {

        String jwtToken = token.substring(7);

        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setCategoryName("Guitar");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(categoryRepository.save(Mockito.any(Category.class))).thenReturn(category);
        String response2 = categoryService.createCategories(token, categoryRequest);

        Assertions.assertThat(response2).isNotNull();
        Assertions.assertThat(response2).isNotEmpty();

    }

    @Test
    public void addCategoryExceptionEmptyNameTest() {

        String jwtToken = token.substring(7);

        CategoryRequest categoryRequest = new CategoryRequest();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        Assertions.assertThatThrownBy(() -> categoryService.createCategories(token, categoryRequest));
    }

    @Test
    public void addCategoryExceptionInvalidTokenTest() {

        String jwtToken = token.substring(7);
        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setCategoryName("Guitar");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> categoryService.createCategories(token, categoryRequest));

    }

    @Test
    public void addCategoryFaultyTokenTest() {
        Assertions.assertThatThrownBy(() -> categoryService.createCategories(token.substring(7), new CategoryRequest("Guitar")));
    }

    @Test
    public void getAllCategoriesTest() {

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

        String jwtToken = token.substring(7);

        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setCategoryName("Drums");

        Category categoryUpdated = new Category("Drums");
        category.setId(1L);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(Mockito.any(Category.class))).thenReturn(categoryUpdated);

        ResponseEntity<String> response = categoryService.updateCategory(token, 1L, categoryRequest);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Category updated");

    }

    @Test
    public void updateCategoryExceptionEmptyNameTest() {

        String jwtToken = token.substring(7);

        CategoryRequest categoryRequest = new CategoryRequest();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        Assertions.assertThatThrownBy(() -> categoryService.updateCategory(token, 1L, categoryRequest));

    }

    @Test
    public void updateCategoryExceptionNotFoundTest() {

        String jwtToken = token.substring(7);
        CategoryRequest categoryRequest = new CategoryRequest("Guitar");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> categoryService.updateCategory(token, 1L, categoryRequest));

    }

    @Test
    public void updateCategoryExceptionInvalidTokenTest() {

        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setCategoryName("Drums");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("http://USERS/api/v1/users/adminauthorize?token=" + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> categoryService.updateCategory(token, 1L, categoryRequest));

    }

    @Test
    public void deleteCategoryTest() {

        String jwtToken = token.substring(7);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        ResponseEntity<String> response = categoryService.deleteCategory(token, 1L);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Category deleted successfully");

    }

    @Test
    public void deleteCategoryExceptionNotFoundTest() {

        String jwtToken = token.substring(7);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> categoryService.deleteCategory(token, 1L));

    }

    @Test
    public void deleteCategoryExceptionInvalidTokenTest() {

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri("http://USERS/api/v1/users/adminauthorize?token=" + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> categoryService.deleteCategory(token, 1L));

    }
}
