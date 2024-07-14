package com.musicstore.products.service;

import com.musicstore.products.dto.ManufacturerRequest;
import com.musicstore.products.dto.ManufacturerRequestBody;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.repository.ManufacturerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@AllArgsConstructor
public class ManufacturerService {

	private final ManufacturerRepository manufacturerRepository;

	private final WebClient.Builder webClient;

	public String createManufacturers(String token, ManufacturerRequestBody manufacturers) {
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

		for (ManufacturerRequest manufacturer: manufacturers.getManufacturers()) {
			Manufacturer newManufacturer = new Manufacturer(manufacturer.getName());

			if (newManufacturer.getName().isEmpty()) {
				throw new IllegalArgumentException("Manufacturer name cannot be empty");
			}

			manufacturerRepository.save(newManufacturer);
		}

		return "Manufacturers created";
	}

	public List<Manufacturer> getAllManufacturers() {
		return manufacturerRepository.findAll();
	}

	public Manufacturer getManufacturerById(Long id) {
		return manufacturerRepository
				.findById(id)
				.orElseThrow(
						() -> new IllegalArgumentException("Manufacturer not found")
				);
	}

	public List<Manufacturer> findAllBySearchParameters(Long categoryId, String country) {
		return manufacturerRepository.findAllBySearchParameters(categoryId, country);
	}

	public String updateManufacturer(Long id, ManufacturerRequest manufacturer) {

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

		Manufacturer manufacurerToUpdate = manufacturerRepository
				.findById(id)
				.orElseThrow(
						() -> new IllegalArgumentException("Manufacturer not found")
				);

		manufacurerToUpdate.setName(manufacturer.getName());

		manufacturerRepository.save(manufacurerToUpdate);

		return "Manufacturer updated";
	}
}
