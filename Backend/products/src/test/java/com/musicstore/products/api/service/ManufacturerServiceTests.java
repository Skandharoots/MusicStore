package com.musicstore.products.api.service;

import com.musicstore.products.dto.ManufacturerRequest;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.repository.ManufacturerRepository;
import com.musicstore.products.service.ManufacturerService;
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
public class ManufacturerServiceTests {

    @Mock
    private ManufacturerRepository manufacturerRepository;

    @Mock
    private WebClient.Builder webClient;

    @InjectMocks
    private ManufacturerService manufacturerService;

    @Test
    public void addManufacturerTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        Manufacturer manufacturer = new Manufacturer("Fender");
        manufacturer.setId(1L);

        ManufacturerRequest manufacturerRequest = new ManufacturerRequest();
        manufacturerRequest.setName("Fender");

        when(manufacturerRepository.save(Mockito.any(Manufacturer.class))).thenReturn(manufacturer);
        String response = manufacturerService.createManufacturers(token, manufacturerRequest);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isNotEmpty();

    }

    @Test
    public void addManufacturerExceptionTest() {
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        ManufacturerRequest manufacturerRequest = new ManufacturerRequest();


        Assertions.assertThatThrownBy(() -> manufacturerService.createManufacturers(token, manufacturerRequest));
    }

    @Test
    public void getAllCategoriesTest() {

        Manufacturer manufacturer = new Manufacturer("Fender");
        manufacturer.setId(1L);

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

        Manufacturer manufacturer = new Manufacturer("Fender");
        manufacturer.setId(1L);

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.of(manufacturer));
        Manufacturer response = manufacturerService.getManufacturerById(1L);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getName()).isEqualTo("Fender");
        Assertions.assertThat(response.getId()).isEqualTo(1L);

    }

    @Test
    public void getManufacturerByIdExceptionTest() {

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> manufacturerService.getManufacturerById(1L));

    }

    @Test
    public void updateManufacturerTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        Manufacturer manufacturer = new Manufacturer("Fender");
        manufacturer.setId(1L);

        ManufacturerRequest manufacturerRequest = new ManufacturerRequest();
        manufacturerRequest.setName("Gretsch");

        Manufacturer manufacturerUpdated = new Manufacturer("Gretsch");
        manufacturer.setId(1L);

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.of(manufacturer));
        when(manufacturerRepository.save(Mockito.any(Manufacturer.class))).thenReturn(manufacturerUpdated);

        ResponseEntity<String> response = manufacturerService.updateManufacturer(token, 1L, manufacturerRequest);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Manufacturer updated");

    }

    @Test
    public void updateManufacturerExceptionTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        ManufacturerRequest manufacturerRequest = new ManufacturerRequest();

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> manufacturerService.updateManufacturer(token, 1L, manufacturerRequest));

    }

    @Test
    public void deleteManufacturerTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        Manufacturer manufacturer = new Manufacturer("Fender");
        manufacturer.setId(1L);

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.of(manufacturer));
        ResponseEntity<String> response = manufacturerService.deleteManufacturer(token, 1L);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Manufacturer deleted");

    }

    @Test
    public void deleteManufacturerExceptionTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> manufacturerService.deleteManufacturer(token, 1L));
    }
}
