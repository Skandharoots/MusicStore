package com.musicstore.products.service;

import com.musicstore.products.dto.CountryRequest;
import com.musicstore.products.dto.CountryRequestBody;
import com.musicstore.products.model.Country;
import com.musicstore.products.repository.CountryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@AllArgsConstructor
public class CountryService {

	private final CountryRepository countryRepository;

	private final RestTemplate restTemplate;

	public String createCountry(String token, CountryRequestBody countries) {
		//TODO: Uncomment this for prod
//		if (token.isEmpty() || token == null || !token.startsWith("Bearer ")) {
//			throw new RuntimeException("Invalid token");
//		}
//
//		String jwtToken = token.substring("Bearer ".length());


//		if(!Objects.equals(
//				restTemplate
//						.getForObject("http://localhost:8222/api/v1/users/adminauthorize?token="
//								+ jwtToken, Boolean.class), true)) {
//
//			throw new IllegalArgumentException("No admin permissions");
//
//		}

		for (CountryRequest country : countries.getCountries()) {
			Country newCountry = new Country(country.getName());

			if (newCountry.getCountryName().isEmpty()) {
				throw new IllegalArgumentException("Country name cannot be empty");
			}

			countryRepository.save(newCountry);
		}

		return "Countries created";
	}

	public List<Country> getAllCountries() {
		return countryRepository.findAll();
	}

	public Country getCountryById(Long id) {
		return countryRepository.findById(id).orElse(null);
	}

	public Country getCountryByName(String name) {
		return countryRepository.findByCountryName(name).orElse(null);
	}
}
