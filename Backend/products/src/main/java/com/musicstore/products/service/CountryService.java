package com.musicstore.products.service;

import com.musicstore.products.dto.CountryRequest;
import com.musicstore.products.dto.CountryRequestBody;
import com.musicstore.products.model.Country;
import com.musicstore.products.repository.CountryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@AllArgsConstructor
public class CountryService {

	private final CountryRepository countryRepository;

	private final WebClient.Builder webClient;

	public String createCountry(String token, CountryRequestBody countries) {
		//TODO: Uncomment this for prod
//		if (token.isEmpty() || token == null || !token.startsWith("Bearer ")) {
//			throw new RuntimeException("Invalid token");
//		}
//
//		String jwtToken = token.substring("Bearer ".length());
//
//		Boolean authorized = webClient
//				.build()
//				.get()
//				.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)
//				.retrieve()
//				.bodyToMono(Boolean.class)
//				.block();
//
//		if (Boolean.FALSE.equals(authorized)) {
//			throw new RuntimeException("No admin authority");
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
		return countryRepository
				.findById(id)
				.orElseThrow(
						() -> new IllegalArgumentException("Country not found")
				);
	}

	public String updateCountry(Long id, CountryRequest country) {

		//TODO: Uncomment this for prod
//		if (token.isEmpty() || token == null || !token.startsWith("Bearer ")) {
//			throw new RuntimeException("Invalid token");
//		}
//
//		String jwtToken = token.substring("Bearer ".length());
//
//		Boolean authorized = webClient
//				.build()
//				.get()
//				.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)
//				.retrieve()
//				.bodyToMono(Boolean.class)
//				.block();
//
//		if (Boolean.FALSE.equals(authorized)) {
//			throw new RuntimeException("No admin authority");
//		}

		Country countryToUpdate = countryRepository
				.findById(id)
				.orElseThrow(
						() -> new IllegalArgumentException("Country not found")
				);

		countryToUpdate.setCountryName(country.getName());

		countryRepository.save(countryToUpdate);

		return "Country updated";
	}
}
