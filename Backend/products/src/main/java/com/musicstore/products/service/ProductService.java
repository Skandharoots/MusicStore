package com.musicstore.products.service;

import com.musicstore.products.dto.*;
import com.musicstore.products.model.Category;
import com.musicstore.products.model.Country;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.model.Product;
import com.musicstore.products.repository.ProductRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
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

        return productRepository.findAll(pageable);

	}

	public ResponseEntity<Product> getProductById(Long id) {
		Product product = productRepository.findById(id)
				.orElseThrow(
						() -> new NotFoundException("Product not found")
				);

		return ResponseEntity.ok(product);
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


        return productRepository
				.findAllByCategory_IdAndBuiltinCountry_NameContainingAndManufacturer_NameContainingAndProductPriceBetween(
						category, country, manufacturer, lowPrice, highPrice, pageable);
	}

	public Page<Product> getAllProductsBySearchedName(Integer page, Integer pageSize, String productName) {

		Pageable pageable = PageRequest.of(page, pageSize, Sort.by("dateAdded").descending());

        return productRepository
				.findAllByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(productName, productName, pageable);
	}

	public ResponseEntity<BigDecimal> getMaxPriceForProducts(Long category, String country, String manufacturer) {
		return ResponseEntity.ok(productRepository.findMaxProductPrice(category, country, manufacturer));
	}

	public ResponseEntity<String> updateProduct(String token, Long id, ProductRequest product) {
		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

		Product productToUpdate = productRepository.findById(id)
				.orElseThrow(
					() -> new NotFoundException("Product not found")
				);

		productToUpdate.setProductName(product.getProductName());
		productToUpdate.setProductPrice(product.getPrice());
		productToUpdate.setProductDescription(product.getDescription());
		productToUpdate.setBuiltinCountry(countryService.getCountryById(product.getCountryId()));
		productToUpdate.setCategory(categoryService.getCategoryById(product.getCategoryId()));
		productToUpdate.setManufacturer(manufacturerService.getManufacturerById(product.getManufacturerId()));

		productRepository.save(productToUpdate);

		return ResponseEntity.ok("Product updated");
	}

	public ResponseEntity<String> deleteProduct(String token, Long id) {

		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

		Product productToDelete = productRepository.findById(id)
				.orElseThrow(
						() -> new NotFoundException("Product not found")
				);

		productRepository.delete(productToDelete);

		return ResponseEntity.ok("Product deleted");
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
