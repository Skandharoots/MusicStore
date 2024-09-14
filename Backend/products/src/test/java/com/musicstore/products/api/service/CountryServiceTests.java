package com.musicstore.products.api.service;

import com.musicstore.products.dto.CountryRequest;
import com.musicstore.products.model.Country;
import com.musicstore.products.repository.CountryRepository;
import com.musicstore.products.service.CountryService;
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
public class CountryServiceTests {

    @Mock
    private CountryRepository countryRepository;

    @Mock
    private WebClient.Builder webClient;

    @InjectMocks
    private CountryService countryService;

    @Test
    public void addCountryTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        Country country = new Country("Poland");
        country.setId(1L);

        CountryRequest countryRequest = new CountryRequest();
        countryRequest.setName("Poland");

        when(countryRepository.save(Mockito.any(Country.class))).thenReturn(country);
        String response = countryService.createCountry(token, countryRequest);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isNotEmpty();

    }

    @Test
    public void addCountryExceptionTest() {
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        CountryRequest countryRequest = new CountryRequest();


        Assertions.assertThatThrownBy(() -> countryService.createCountry(token, countryRequest));
    }

    @Test
    public void getAllCategoriesTest() {

        Country country = new Country("Poland");
        country.setId(1L);

        List<Country> categories = new ArrayList<>();
        categories.add(country);

        when(countryRepository.findAll()).thenReturn(categories);
        List<Country> response = countryService.getAllCountries();
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isNotEmpty();
        Assertions.assertThat(response).hasSize(1);

    }

    @Test
    public void getCountryByIdTest() {

        Country country = new Country("Poland");
        country.setId(1L);

        when(countryRepository.findById(1L)).thenReturn(Optional.of(country));
        Country response = countryService.getCountryById(1L);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getName()).isEqualTo("Poland");
        Assertions.assertThat(response.getId()).isEqualTo(1L);

    }

    @Test
    public void getCountryByIdExceptionTest() {

        when(countryRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> countryService.getCountryById(1L));

    }

    @Test
    public void updateCountryTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        Country country = new Country("Poland");
        country.setId(1L);

        CountryRequest countryRequest = new CountryRequest();
        countryRequest.setName("England");

        Country countryUpdated = new Country("England");
        country.setId(1L);

        when(countryRepository.findById(1L)).thenReturn(Optional.of(country));
        when(countryRepository.save(Mockito.any(Country.class))).thenReturn(countryUpdated);

        ResponseEntity<String> response = countryService.updateCountry(token, 1L, countryRequest);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Country updated");

    }

    @Test
    public void updateCountryExceptionTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        CountryRequest countryRequest = new CountryRequest();

        when(countryRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> countryService.updateCountry(token, 1L, countryRequest));

    }

    @Test
    public void deleteCountryTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        Country country = new Country("Poland");
        country.setId(1L);

        when(countryRepository.findById(1L)).thenReturn(Optional.of(country));
        ResponseEntity<String> response = countryService.deleteCountry(token, 1L);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Country deleted");

    }

    @Test
    public void deleteCountryExceptionTest() {

        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
                "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
                "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
                "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        when(countryRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> countryService.deleteCountry(token, 1L));
    }
}
