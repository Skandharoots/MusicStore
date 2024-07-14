package com.musicstore.products.service;

import com.musicstore.products.dto.*;
import com.musicstore.products.model.Category;
import com.musicstore.products.model.Country;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.model.Product;
import com.musicstore.products.repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;

@Service
@AllArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;

	private final CategoryService categoryService;

	private final CountryService countryService;

	private final ManufacturerService manufacturerService;

	private final WebClient.Builder webClient;

	public String createProducts(String token, ProductRequestBody products) {

		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

		for (ProductRequest productRequest : products.getProducts()) {

			Category category = categoryService.getCategoryById(productRequest.getCategoryId());

			Country country = countryService.getCountryById(productRequest.getCountryId());

			Manufacturer manufacturer = manufacturerService.getManufacturerById(productRequest.getManufacturerId());

			Product product = new Product(
					productRequest.getProductName(),
					productRequest.getDescription(),
					productRequest.getPrice(),
					manufacturer,
					country,
					category
			);

			productRepository.save(product);
		}

		return "Products created";
	}

	public Page<Product> getAllProducts(Integer page, Integer pageSize) {

		Pageable pageable = PageRequest.of(page, pageSize, Sort.by("dateAdded").descending());
		Page<Product> products = productRepository.findAll(pageable);

		return products;

	}

	public Page<Product> getAllProductsByCategoryAndCountryAndManufacturer(
			Integer page,
			Integer pageSize,
			String sortBy,
			String direction,
			Long category,
			String country,
			String manufacturer,
			BigDecimal lowPrice,
			BigDecimal highPrice
	) {

		Pageable pageable;
		if (direction.equals("asc")) {
			 pageable = PageRequest.of(page, pageSize, Sort.by(sortBy).ascending());
		} else {
			pageable = PageRequest.of(page, pageSize, Sort.by(sortBy).descending());
		}

		Page<Product> products = productRepository
				.findAllByCategory_IdAndBuiltinCountry_NameContainingAndManufacturer_NameContainingAndProductPriceBetween(
						category, country, manufacturer, lowPrice, highPrice, pageable);


		return products;
	}

	public Page<Product> getAllProductsBySearchedName(Integer page, Integer pageSize, String productName) {

		Pageable pageable = PageRequest.of(page, pageSize, Sort.by("dateAdded").descending());
		Page<Product> products = productRepository
				.findAllByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(productName, productName, pageable);

		return products;
	}

	private Boolean doesUserHaveAdminAuthorities(String token) {

		if (token.isEmpty() || !token.startsWith("Bearer ")) {
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
