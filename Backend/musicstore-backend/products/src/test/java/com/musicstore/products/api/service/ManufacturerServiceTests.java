package com.musicstore.products.api.service;

import com.musicstore.products.dto.ManufacturerRequest;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.repository.ManufacturerRepository;
import com.musicstore.products.security.config.VariablesConfiguration;
import com.musicstore.products.service.ManufacturerService;
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
public class ManufacturerServiceTests {

    @Mock
    private ManufacturerRepository manufacturerRepository;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private VariablesConfiguration variablesConfiguration;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @InjectMocks
    private ManufacturerService manufacturerService;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    private Manufacturer manufacturer;

    @BeforeEach
    public void setup() {
        manufacturer = new Manufacturer("Fender");
        manufacturer.setId(1L);
    }

    @Test
    public void addManufacturerTest() {

        ManufacturerRequest manufacturerRequest = new ManufacturerRequest();
        manufacturerRequest.setName("Fender");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(manufacturerRepository.save(Mockito.any(Manufacturer.class))).thenReturn(manufacturer);
        String response = manufacturerService.createManufacturers(token, manufacturerRequest);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isNotEmpty();

    }

    @Test
    public void addManufacturerExceptionInvalidTokenTest() {

        ManufacturerRequest manufacturerRequest = new ManufacturerRequest();
        manufacturerRequest.setName("Fender");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> manufacturerService.createManufacturers(token, manufacturerRequest));

    }

    @Test
    public void addManufacturerExceptionFaultyTokenTest() {
        Assertions.assertThatThrownBy(() -> manufacturerService.createManufacturers(token.substring(7), new ManufacturerRequest("Fender")));
    }

    @Test
    public void getAllManufacturersTest() {

        List<Manufacturer> categories = new ArrayList<>();
        categories.add(manufacturer);

        when(manufacturerRepository.findAll()).thenReturn(categories);
        List<Manufacturer> response = manufacturerService.getAllManufacturers();
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isNotEmpty();
        Assertions.assertThat(response).hasSize(1);

    }

    @Test
    public void getManufacturerByIdTest() {

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.of(manufacturer));
        Manufacturer response = manufacturerService.getManufacturerById(1L);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getName()).isEqualTo("Fender");
        Assertions.assertThat(response.getId()).isEqualTo(1L);

    }

    @Test
    public void findAllManufacturersBySearchParametersTest() {

        List<Manufacturer> manufacturers = new ArrayList<>();
        manufacturers.add(manufacturer);

        when(manufacturerRepository.findAllBySearchParameters(1L, "USA", "Electric")).thenReturn(manufacturers);
        List<Manufacturer> response = manufacturerService.findAllBySearchParameters(1L, "USA", "Electric");
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.size()).isEqualTo(1);
        Assertions.assertThat(response.get(0)).isEqualTo(manufacturer);

    }

    @Test
    public void getManufacturerByIdExceptionTest() {

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> manufacturerService.getManufacturerById(1L));

    }

    @Test
    public void updateManufacturerTest() {

        ManufacturerRequest manufacturerRequest = new ManufacturerRequest();
        manufacturerRequest.setName("Gretsch");

        Manufacturer manufacturerUpdated = new Manufacturer("Gretsch");
        manufacturer.setId(1L);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.of(manufacturer));
        when(manufacturerRepository.save(Mockito.any(Manufacturer.class))).thenReturn(manufacturerUpdated);

        ResponseEntity<String> response = manufacturerService.updateManufacturer(token, 1L, manufacturerRequest);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Manufacturer updated");

    }

    @Test
    public void updateManufacturerExceptionNotFoundTest() {

        ManufacturerRequest manufacturerRequest = new ManufacturerRequest("Fender");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> manufacturerService.updateManufacturer(token, 1L, manufacturerRequest));

    }

    @Test
    public void updateManufacturerExceptionInvalidTokenTest() {

        ManufacturerRequest manufacturerRequest = new ManufacturerRequest();
        manufacturerRequest.setName("Gretsch");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> manufacturerService.updateManufacturer(token, 1L, manufacturerRequest));

    }

    @Test
    public void deleteManufacturerTest() {

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.of(manufacturer));
        ResponseEntity<String> response = manufacturerService.deleteManufacturer(token, 1L);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Manufacturer deleted");

    }

    @Test
    public void deleteManufacturerExceptionNotFoundTest() {

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> manufacturerService.deleteManufacturer(token, 1L));

    }

    @Test
    public void deleteManufacturerExceptionInvalidTokenTest() {

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> manufacturerService.deleteManufacturer(token, 1L));
    }
}
