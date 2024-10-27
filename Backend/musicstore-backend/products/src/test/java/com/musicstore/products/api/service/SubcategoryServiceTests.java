package com.musicstore.products.api.service;

import com.musicstore.products.dto.SubcategoryRequest;
import com.musicstore.products.dto.SubcategoryUpdateRequest;
import com.musicstore.products.model.Category;
import com.musicstore.products.model.Subcategory;
import com.musicstore.products.repository.SubcategoryRepository;
import com.musicstore.products.security.config.VariablesConfiguration;
import com.musicstore.products.service.CategoryService;
import com.musicstore.products.service.SubcategoryService;
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

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SubcategoryServiceTests {

    @Mock
    private SubcategoryRepository subcategoryRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private VariablesConfiguration variablesConfiguration;

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
    private SubcategoryService subcategoryService;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    private Subcategory subcategory;

    private Category category;

    @BeforeEach
    public void setup() {
        category = new Category("Guitar");
        category.setId(1L);

        subcategory = new Subcategory("Electric");
        subcategory.setId(1L);
        subcategory.setCategory(category);
    }

    @Test
    public void addSubcategoryTest() {


        SubcategoryRequest subcategoryRequest = new SubcategoryRequest();
        subcategoryRequest.setName("Electric");
        subcategoryRequest.setCategoryId(1L);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(categoryService.getCategoryById(1L)).thenReturn(category);
        when(subcategoryRepository.save(Mockito.any(Subcategory.class))).thenReturn(subcategory);
        String response = subcategoryService.createSubcategories(token, subcategoryRequest);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isNotEmpty();

    }

    @Test
    public void addSubcategoryExceptionInvalidTokenTest() {

        SubcategoryRequest subcategoryRequest = new SubcategoryRequest();
        subcategoryRequest.setName("Electric");
        subcategoryRequest.setCategoryId(1L);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> subcategoryService.createSubcategories(token, subcategoryRequest));

    }
    @Test
    public void addSubcategoryExceptionEmptyNameTest() {

        SubcategoryRequest subcategoryRequest = new SubcategoryRequest();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        Assertions.assertThatThrownBy(() -> subcategoryService.createSubcategories(token, subcategoryRequest));
    }

    @Test
    public void addSubcategoryExceptionFaultyTokenTest() {
        Assertions.assertThatThrownBy(() -> subcategoryService.createSubcategories(token.substring(7), new SubcategoryRequest("Acoustic", 1L)));
    }

    @Test
    public void getAllSubcategoriesTest() {
        List<Subcategory> categories = new ArrayList<>();
        categories.add(subcategory);

        when(subcategoryRepository.findAll()).thenReturn(categories);
        List<Subcategory> response = subcategoryService.getAll();
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isNotEmpty();
        Assertions.assertThat(response).hasSize(1);
    }

    @Test
    public void getAllSubCategoriesByCategoryTest() {

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

        SubcategoryUpdateRequest subcategoryRequest = new SubcategoryUpdateRequest();
        subcategoryRequest.setName("Acoustasonic");

        Subcategory subcategoryUpdated = new Subcategory("Acoustasonic");
        subcategoryUpdated.setId(1L);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(subcategoryRepository.findById(1L)).thenReturn(Optional.of(subcategory));
        when(subcategoryRepository.save(Mockito.any(Subcategory.class))).thenReturn(subcategoryUpdated);

        ResponseEntity<String> response = subcategoryService.updateSubcategory(token, 1L, subcategoryRequest);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Subcategory updated");

    }

    @Test
    public void updateSubcategoryExceptionEmptyNameTest() {

        SubcategoryUpdateRequest subcategoryRequest = new SubcategoryUpdateRequest();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        Assertions.assertThatThrownBy(() -> subcategoryService.updateSubcategory(token, 1L, subcategoryRequest));

    }

    @Test
    public void updateSubcategoryExceptionNotFoundTest() {

        SubcategoryUpdateRequest subcategoryRequest = new SubcategoryUpdateRequest();
        subcategoryRequest.setName("Acoustasonic");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(subcategoryRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> subcategoryService.updateSubcategory(token, 1L, subcategoryRequest));

    }

    @Test
    public void updateSubcategoryExceptionInvalidTokenTest() {

        SubcategoryUpdateRequest subcategoryRequest = new SubcategoryUpdateRequest();
        subcategoryRequest.setName("Acoustasonic");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> subcategoryService.updateSubcategory(token, 1L, subcategoryRequest));
    }

    @Test
    public void deleteSubcategoryTest() {

        Subcategory subcategory = new Subcategory("Electric");
        subcategory.setId(1L);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(subcategoryRepository.findById(1L)).thenReturn(Optional.of(subcategory));
        ResponseEntity<String> response = subcategoryService.deleteSubcategory(token, 1L);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Subcategory deleted");

    }

    @Test
    public void deleteSubcategoryExceptionNotFoundTest() {

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(subcategoryRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> subcategoryService.deleteSubcategory(token, 1L));
    }

    @Test
    public void deleteSubcategoryExceptionInvalidTokenTest() {

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> subcategoryService.deleteSubcategory(token, 1L));

    }
}
