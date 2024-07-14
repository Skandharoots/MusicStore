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

import java.util.ArrayList;
import java.util.List;

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

		return "Categories created";
	}

	public ProductResponseBody getAllProducts(Integer page, Integer pageSize) {

		Pageable pageable = PageRequest.of(page, pageSize);
		Page<Product> products = productRepository.findAll(pageable);

		List<ProductResponse> productResponses = new ArrayList<>();

		for (Product product : products.getContent()) {

			ProductResponse response = ProductResponse
					.builder()
					.id(product.getId())
					.productSgid(product.getProductSgid())
					.name(product.getProductName())
					.description(product.getProductDescription())
					.price(product.getProductPrice())
					.category(product.getCategory().getName())
					.country(product.getBuiltinCountry().getName())
					.manufacturer(product.getManufacturer().getName())
					.build();

			productResponses.add(response);

		}

		ProductResponseBody productResponseBody = new ProductResponseBody();
		productResponseBody.setProducts(productResponses);
		return productResponseBody;

	}

	public ProductResponseBody getAllProductsByCategoryAndCountryAndManufacturer(Integer page,
																				 Integer pageSize,
																				 String sortBy,
																				 String direction,
																				 String category,
																				 String country,
																				 String manufacturer
	) {

		Pageable pageable;
		if (direction.equals("asc")) {
			 pageable = PageRequest.of(page, pageSize, Sort.by(sortBy).ascending());
		} else {
			pageable = PageRequest.of(page, pageSize, Sort.by(sortBy).descending());
		}

		Page<Product> products = productRepository
				.findAllByCategory_NameContainingAndBuiltinCountry_NameContainingAndManufacturer_NameContaining(
						category, country, manufacturer, pageable);

		List<ProductResponse> productResponses = new ArrayList<>();

		for (Product product : products.getContent()) {

			ProductResponse response = ProductResponse
					.builder()
					.id(product.getId())
					.productSgid(product.getProductSgid())
					.name(product.getProductName())
					.description(product.getProductDescription())
					.price(product.getProductPrice())
					.category(product.getCategory().getName())
					.country(product.getBuiltinCountry().getName())
					.manufacturer(product.getManufacturer().getName())
					.build();

			productResponses.add(response);

		}
		ProductResponseBody productResponseBody = new ProductResponseBody();
		productResponseBody.setProducts(productResponses);
		return productResponseBody;
	}


}
