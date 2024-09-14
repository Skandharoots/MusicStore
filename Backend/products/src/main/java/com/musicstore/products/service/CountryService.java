package com.musicstore.products.service;

import com.musicstore.products.dto.CountryRequest;
import com.musicstore.products.model.Country;
import com.musicstore.products.repository.CountryRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class CountryService {

	private final CountryRepository countryRepository;

	private final WebClient.Builder webClient;

	public String createCountry(String token, CountryRequest country) {

		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
		}

		if (country.getName() == null || country.getName().isEmpty()) {
			throw new IllegalArgumentException("Country name cannot be empty");
		}

		Country newCountry = new Country(country.getName());

		countryRepository.save(newCountry);


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
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
		}

		if (country.getName() == null || country.getName().isEmpty()) {
			throw new IllegalArgumentException("Country name cannot be empty");
		}

		Country countryToUpdate = countryRepository
				.findById(id)
				.orElseThrow(
						() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Country not found")
				);

		countryToUpdate.setName(country.getName());

		countryRepository.save(countryToUpdate);

		return ResponseEntity.ok("Country updated");
	}

	public ResponseEntity<String> deleteCountry(String token, Long id) {
		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
		}

		Country country = countryRepository
				.findById(id)
				.orElseThrow(
						() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Country not found")
				);

		countryRepository.delete(country);

		return ResponseEntity.ok("Country deleted");
	}

	private Boolean doesUserHaveAdminAuthorities(String token) {

		if (!token.startsWith("Bearer ")) {
			throw new RuntimeException("Invalid token");
		}

		String jwtToken = token.substring("Bearer ".length());

		return webClient
				.build()
				.get()
				.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)
				.retrieve()
				.bodyToMono(Boolean.class)
				.block();

	}
}
