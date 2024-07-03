package com.musicstore.products.controller;

import com.musicstore.products.dto.ManufacturerRequestBody;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.service.ManufacturerService;
import jakarta.ws.rs.core.HttpHeaders;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products/manufacturers")
@AllArgsConstructor
public class ManufacturerController {

	private final ManufacturerService manufacturerService;

	@PostMapping
	public String addManufacturer(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@RequestBody ManufacturerRequestBody manufacturerRequestBody) {
		return manufacturerService.createManufacturers(token, manufacturerRequestBody);
	}

	@GetMapping
	public List<Manufacturer> getAllManufacturers() {
		return manufacturerService.getAllManufacturers();
	}

	@GetMapping("/{id}")
	public Manufacturer getManufacturerById(@PathVariable(name = "id") Long id) {
		return manufacturerService.getManufacturerById(id);
	}

	@GetMapping("/{manufacturerName}")
	public Manufacturer getManufacturerByName(@PathVariable(name = "manufacturerName") String manufacturerName) {
		return manufacturerService.getManufacturerByName(manufacturerName);
	}

}
