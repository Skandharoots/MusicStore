package com.musicstore.products.controller;

import com.musicstore.products.dto.CategoryRequest;
import com.musicstore.products.dto.ManufacturerRequest;
import com.musicstore.products.dto.ManufacturerRequestBody;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.service.ManufacturerService;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/manufacturers")
@AllArgsConstructor
public class ManufacturerController {

	private final ManufacturerService manufacturerService;

	@PostMapping("/create")
	public String addManufacturer(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@RequestBody ManufacturerRequestBody manufacturerRequestBody
	) {
		return manufacturerService.createManufacturers(token, manufacturerRequestBody);
	}

	@GetMapping("/get")
	public List<Manufacturer> getAllManufacturers() {
		return manufacturerService.getAllManufacturers();
	}

	@GetMapping("/get/{id}")
	public Manufacturer getManufacturerById(@PathVariable(name = "id") Long id) {
		return manufacturerService.getManufacturerById(id);
	}

	@GetMapping("/get/search/{category}")
	public List<Manufacturer> getAllBySearchParameters(
			@PathVariable(value = "category") Long categoryId,
			@RequestParam(value = "country") String country
	) {
		return manufacturerService.findAllBySearchParameters(categoryId, country);
	}

	@PutMapping("/update/{manufacturerId}")
	public String updateCategory(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@PathVariable(name = "manufacturerId") Long id,
			@RequestBody ManufacturerRequest manufacturer
	) {
		return manufacturerService.updateManufacturer(token, id, manufacturer);
	}
}
