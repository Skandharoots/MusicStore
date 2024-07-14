package com.musicstore.products.controller;

import com.musicstore.products.dto.CountryRequest;
import com.musicstore.products.dto.CountryRequestBody;
import com.musicstore.products.model.Country;
import com.musicstore.products.service.CountryService;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.AllArgsConstructor;
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
			@RequestBody CountryRequestBody countryRequestBody
	) {
		return countryService.createCountry(token, countryRequestBody);
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
			@RequestParam(value = "manufacturer") String manufacturer
	) {
		return countryService.findAllBySearchParameters(categoryId, manufacturer);
	}

	@PutMapping("/update/{countryId}")
	public String updateCategory(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@PathVariable(name = "countryId") Long id,
			@RequestBody CountryRequest country
	) {
		return countryService.updateCountry(token, id, country);
	}
}
