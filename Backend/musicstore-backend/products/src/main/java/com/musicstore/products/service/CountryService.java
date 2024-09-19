package com.musicstore.products.service;

import com.musicstore.products.dto.CountryRequest;
import com.musicstore.products.model.Country;
import com.musicstore.products.repository.CountryRepository;
import com.musicstore.products.security.config.VariablesConfiguration;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class CountryService {

    private final CountryRepository countryRepository;

    private final WebClient.Builder webClient;

    private final VariablesConfiguration variablesConfiguration;

    public String createCountry(String token, CountryRequest country) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        if (country.getName() == null || country.getName().isEmpty()) {
            log.error("Bad request for country creation.");
            throw new IllegalArgumentException("Country name cannot be empty");
        }

        Country newCountry = new Country(country.getName());

        countryRepository.save(newCountry);
        log.info("Country created: " + newCountry);

        return "Country created";
    }

    public List<Country> getAllCountries() {
        return countryRepository.findAll();
    }

    public Country getCountryById(Long id) {
        return countryRepository
                .findById(id)
                .orElseThrow(
                         () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Country not found")
                );
    }

    public List<Country> findAllBySearchParameters(Long categoryId, String manufacturer, String subcategory) {
        return countryRepository.findAllBySearchParameters(categoryId, manufacturer, subcategory);
    }

    public ResponseEntity<String> updateCountry(String token, Long id, CountryRequest country) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        if (country.getName() == null || country.getName().isEmpty()) {
            log.error("Bad request for country update.");
            throw new IllegalArgumentException("Country name cannot be empty");
        }

        Country countryToUpdate = countryRepository
                .findById(id)
                .orElseThrow(
                         () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Country not found")
                );

        countryToUpdate.setName(country.getName());

        countryRepository.save(countryToUpdate);
        log.info("Country updated: " + countryToUpdate);

        return ResponseEntity.ok("Country updated");
    }

    public ResponseEntity<String> deleteCountry(String token, Long id) {
        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        Country country = countryRepository
                .findById(id)
                .orElseThrow(
                         () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Country not found")
                );

        countryRepository.delete(country);
        log.info("Country deleted: " + country);

        return ResponseEntity.ok("Country deleted");
    }

    private Boolean doesUserHaveAdminAuthorities(String token) {

        if (!token.startsWith("Bearer ")) {
            log.error("Invalid token - " + token);
            throw new RuntimeException("Invalid token");
        }

        String jwtToken = token.substring("Bearer ".length());

        return webClient
                .build()
                .get()
                .uri(variablesConfiguration.getAdminUrl() + jwtToken)
                .retrieve()
                .bodyToMono(Boolean.class)
                .block();

    }
}
