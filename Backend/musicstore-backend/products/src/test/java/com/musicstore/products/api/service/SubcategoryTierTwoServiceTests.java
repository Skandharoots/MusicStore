package com.musicstore.products.api.service;

import com.musicstore.products.dto.SubcategoryTierTwoRequest;
import com.musicstore.products.dto.SubcategoryTierTwoUpdateRequest;
import com.musicstore.products.model.Category;
import com.musicstore.products.model.Subcategory;
import com.musicstore.products.model.SubcategoryTierTwo;
import com.musicstore.products.repository.SubcategoryTierTwoRepository;
import com.musicstore.products.security.config.VariablesConfiguration;
import com.musicstore.products.service.SubcategoryService;
import com.musicstore.products.service.SubcategoryTierTwoService;
import org.apache.coyote.Response;
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
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SubcategoryTierTwoServiceTests {

    @Mock
    private SubcategoryTierTwoRepository subcategoryTierTwoRepository;

    @Mock
    private SubcategoryService subcategoryService;

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
    private SubcategoryTierTwoService subcategoryTierTwoService;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    private Subcategory subcategory;

    private SubcategoryTierTwo subcategoryTierTwo;

    @BeforeEach
    public void setup() {
        Category category = new Category();
        category.setId(1L);
        category.setName("Guitars");

        subcategory = new Subcategory();
        subcategory.setId(1L);
        subcategory.setName("Acoustic");
        subcategory.setCategory(category);

        subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setId(1L);
        subcategoryTierTwo.setName("Acoustic strings");
        subcategoryTierTwo.setSubcategory(subcategory);

    }

    @Test
    public void addSubcategoryTierTwoTest() {

        SubcategoryTierTwoRequest subcategoryTierTwoRequest = new SubcategoryTierTwoRequest();
        subcategoryTierTwoRequest.setSubcategoryId(1L);
        subcategoryTierTwoRequest.setName("Acoustic strings");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(subcategoryService.getSubcategoryById(1L)).thenReturn(subcategory);
        when(subcategoryTierTwoRepository.save(Mockito.any())).thenReturn(subcategoryTierTwo);

        String response = subcategoryTierTwoService.createSubcategoryTierTwo(token, subcategoryTierTwoRequest);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isEqualTo("Subcategory tier two created");

    }

    @Test
    public void createSubcategoryTierTwoNoAdminAuthorityExceptionTest() {
        SubcategoryTierTwoRequest subcategoryTierTwoRequest = new SubcategoryTierTwoRequest();
        subcategoryTierTwoRequest.setSubcategoryId(1L);
        subcategoryTierTwoRequest.setName("Acoustic strings");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> subcategoryTierTwoService.createSubcategoryTierTwo(token, subcategoryTierTwoRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("No admin authority");
    }

    @Test
    public void createSubcategoryTierTwoInvalidTokenExceptionTest() {
        SubcategoryTierTwoRequest subcategoryTierTwoRequest = new SubcategoryTierTwoRequest();
        subcategoryTierTwoRequest.setSubcategoryId(1L);
        subcategoryTierTwoRequest.setName("Acoustic strings");
        Assertions.assertThatThrownBy(() -> subcategoryTierTwoService.createSubcategoryTierTwo(token.substring(7), subcategoryTierTwoRequest))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Invalid token");


    }

    @Test
    public void getAllTest() {
        List<SubcategoryTierTwo> subcategoryTierTwoList = new ArrayList<>();
        subcategoryTierTwoList.add(subcategoryTierTwo);
        when(subcategoryTierTwoRepository.findAll()).thenReturn(subcategoryTierTwoList);
        Assertions.assertThat(subcategoryTierTwoService.getAll()).isEqualTo(subcategoryTierTwoList);
    }

    @Test
    public void getAllSubcategoriesTierTwoTest() {
        List<SubcategoryTierTwo> subcategoryTierTwoList = new ArrayList<>();
        subcategoryTierTwoList.add(subcategoryTierTwo);
        when(subcategoryTierTwoRepository.findAllBySubcategory_Id(1L)).thenReturn(subcategoryTierTwoList);
        Assertions.assertThat(subcategoryTierTwoService.getAllSubcategoriesTierTwo(1L)).isEqualTo(subcategoryTierTwoList);
    }

    @Test
    public void getSubcategoryTierTwoByIdTest() {
        when(subcategoryTierTwoRepository.findById(1L)).thenReturn(Optional.of(subcategoryTierTwo));
        Assertions.assertThat(subcategoryTierTwoService.getSubcategoryTierTwoById(1L)).isEqualTo(subcategoryTierTwo);

    }

    @Test
    public void findAllBySearchParametersTest() {
        List<SubcategoryTierTwo> subcategoryTierTwoList = new ArrayList<>();
        subcategoryTierTwoList.add(subcategoryTierTwo);
        when(subcategoryTierTwoRepository.findAllBySearchParameters(1L, "USA", "Acoustic", "Fender")).thenReturn(subcategoryTierTwoList);
        Assertions.assertThat(subcategoryTierTwoService.findAllBySearchParameters(1L, "USA", "Acoustic", "Fender")).isEqualTo(subcategoryTierTwoList);

    }

    @Test
    public void updateSubcategoryTierTwoByIdTest() {

        SubcategoryTierTwo subcategoryTierTwoUpdated = new SubcategoryTierTwo();
        subcategoryTierTwoUpdated.setId(1L);
        subcategoryTierTwoUpdated.setName("Acoustic strings");
        subcategoryTierTwoUpdated.setSubcategory(subcategory);

        SubcategoryTierTwoUpdateRequest subcategoryTierTwoUpdateRequest = SubcategoryTierTwoUpdateRequest
                .builder()
                .name("Acoustic strings")
                .build();


        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(subcategoryTierTwoRepository.findById(1L)).thenReturn(Optional.of(subcategoryTierTwo));
        when(subcategoryTierTwoRepository.save(Mockito.any())).thenReturn(subcategoryTierTwoUpdated);

        Assertions.assertThat(subcategoryTierTwoService.updateSubcategoryTierTwo(token, 1L, subcategoryTierTwoUpdateRequest)).isEqualTo(ResponseEntity.ok("Subcategory tier two updated"));

    }

    @Test
    public void updateSubcategoryTierTwoByIdNotFoundTest() {

        SubcategoryTierTwoUpdateRequest subcategoryTierTwoUpdateRequest = SubcategoryTierTwoUpdateRequest
                .builder()
                .name("Acoustic strings")
                .build();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(subcategoryTierTwoRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> subcategoryTierTwoService.updateSubcategoryTierTwo(token, 1L, subcategoryTierTwoUpdateRequest)).isInstanceOf(ResponseStatusException.class);

    }

    @Test
    public void updateSubcategoryTierTwoByIdNoAdminAuthorityExceptionTest() {
        SubcategoryTierTwoUpdateRequest subcategoryTierTwoUpdateRequest = SubcategoryTierTwoUpdateRequest
                .builder()
                .name("Acoustic strings")
                .build();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> subcategoryTierTwoService.updateSubcategoryTierTwo(token, 1L, subcategoryTierTwoUpdateRequest)).isInstanceOf(ResponseStatusException.class).hasMessageContaining("No admin authority");
    }

    @Test
    public void deleteSubcategoryTierTwoByIdTest() {

        SubcategoryTierTwo subcategoryTierTwoUpdated = new SubcategoryTierTwo();
        subcategoryTierTwoUpdated.setId(1L);
        subcategoryTierTwoUpdated.setName("Acoustic strings");
        subcategoryTierTwoUpdated.setSubcategory(subcategory);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(subcategoryTierTwoRepository.findById(1L)).thenReturn(Optional.of(subcategoryTierTwo));
        Assertions.assertThat(subcategoryTierTwoService.deleteSubcategoryTierTwo(token, 1L)).isEqualTo(ResponseEntity.ok("Subcategory tier two deleted"));

    }

    @Test
    public void deleteSubcategoryTierTwoByIdNotFoundTest() {
        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(subcategoryTierTwoRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> subcategoryTierTwoService.deleteSubcategoryTierTwo(token, 1L)).isInstanceOf(ResponseStatusException.class).hasMessageContaining("Subcategory tier two not found");

    }

    @Test
    public void deleteSubcategoryTierTwoByIdNoAdminAuthorityExceptionTest() {
        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> subcategoryTierTwoService.deleteSubcategoryTierTwo(token, 1L)).isInstanceOf(ResponseStatusException.class).hasMessageContaining("No admin authority");
    }



}
