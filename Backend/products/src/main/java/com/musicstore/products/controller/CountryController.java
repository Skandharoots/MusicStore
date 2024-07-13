package com.musicstore.products.controller;

import com.musicstore.products.dto.CountryRequest;
import com.musicstore.products.dto.CountryRequestBody;
import com.musicstore.products.model.Country;
import com.musicstore.products.service.CountryService;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products/countries")
@AllArgsConstructor
public class CountryController {

	private final CountryService countryService;

	@PostMapping("/create")
	public String addCountry(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
							 @RequestBody CountryRequestBody countryRequestBody) {
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

	@PutMapping("/update/{countryId}")
	public String updateCategory(@PathVariable(name = "countryId") Long id, @RequestBody CountryRequest country) {
		return countryService.updateCountry(id, country);
	}
}
