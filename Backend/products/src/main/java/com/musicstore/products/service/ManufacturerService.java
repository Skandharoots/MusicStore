package com.musicstore.products.service;

import com.musicstore.products.dto.ManufacturerRequest;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.repository.ManufacturerRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ManufacturerService {

	private final ManufacturerRepository manufacturerRepository;

	private final WebClient.Builder webClient;

	public String createManufacturers(String token, ManufacturerRequest manufacturer) {
		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

		Manufacturer newManufacturer = new Manufacturer(manufacturer.getName());

		if (newManufacturer.getName().isEmpty()) {
			throw new IllegalArgumentException("Manufacturer name cannot be empty");
		}

		manufacturerRepository.save(newManufacturer);


		return "Manufacturers created";
	}

	public List<Manufacturer> getAllManufacturers() {
		return manufacturerRepository.findAll();
	}

	public Manufacturer getManufacturerById(Long id) {
		return manufacturerRepository
				.findById(id)
				.orElseThrow(
						() -> new NotFoundException("Manufacturer not found")
				);
	}

	public List<Manufacturer> findAllBySearchParameters(Long categoryId, String country, String subcategory) {
		return manufacturerRepository.findAllBySearchParameters(categoryId, country, subcategory);
	}

	public ResponseEntity<String> updateManufacturer(String token, Long id, ManufacturerRequest manufacturer) {

		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

		Manufacturer manufacurerToUpdate = manufacturerRepository
				.findById(id)
				.orElseThrow(
						() -> new NotFoundException("Manufacturer not found")
				);

		manufacurerToUpdate.setName(manufacturer.getName());

		manufacturerRepository.save(manufacurerToUpdate);

		return ResponseEntity.ok("Manufacturer updated");
	}

	public ResponseEntity<String> deleteManufacturer(String token, Long id) {
		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

		Manufacturer manufacurerToDelete = manufacturerRepository
				.findById(id)
				.orElseThrow(
						() -> new NotFoundException("Manufacturer not found")
				);

		manufacturerRepository.delete(manufacurerToDelete);

		return ResponseEntity.ok("Manufacturer deleted");
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
