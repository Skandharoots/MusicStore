package com.musicstore.products.controller;

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

	@PostMapping
	public String addCountry(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
							 @RequestBody CountryRequestBody countryRequestBody) {
		return countryService.createCountry(token, countryRequestBody);
	}

	@GetMapping
	public List<Country> getAllCountries() {
		return countryService.getAllCountries();
	}

	@GetMapping("/{id}")
	public Country getCountryById(@PathVariable(name = "id") Long id) {
		return countryService.getCountryById(id);
	}

	@GetMapping("/{countryName}")
	public Country getCountryByName(@PathVariable(name = "countryName") String countryName) {
		return countryService.getCountryByName(countryName);
	}
}
