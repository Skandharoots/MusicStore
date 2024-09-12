package com.musicstore.products.controller;

import com.musicstore.products.dto.CountryRequest;
import com.musicstore.products.model.Country;
import com.musicstore.products.service.CountryService;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/countries")
@AllArgsConstructor
public class CountryController {

	private final CountryService countryService;

	@PostMapping("/create")
	public String addCountry(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@RequestBody CountryRequest countryRequest
	) {
		return countryService.createCountry(token, countryRequest);
	}

	@GetMapping("/get")
	public List<Country> getAllCountries() {
		return countryService.getAllCountries();
	}

	@GetMapping("/get/{id}")
	public Country getCountryById(@PathVariable(name = "id") Long id) {
		return countryService.getCountryById(id);
	}

	@GetMapping("/get/search/{category}")
	public List<Country> getCountryBySearchParameters(
			@PathVariable(value = "category") Long categoryId,
			@RequestParam(value = "manufacturer") String manufacturer,
			@RequestParam(value = "subcategory") String subcategory
	) {
		return countryService.findAllBySearchParameters(categoryId, manufacturer, subcategory);
	}

	@PutMapping("/update/{countryId}")
	public ResponseEntity<String> updateCountry(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@PathVariable(name = "countryId") Long id,
			@RequestBody CountryRequest country
	) {
		return countryService.updateCountry(token, id, country);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteCountry(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@PathVariable(name = "id") Long id) {
		return countryService.deleteCountry(token, id);
	}
}
