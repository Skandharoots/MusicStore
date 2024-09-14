package com.musicstore.products.service;

import com.musicstore.products.dto.*;
import com.musicstore.products.model.*;
import com.musicstore.products.repository.ProductRepository;
import com.musicstore.products.security.config.VariablesConfiguration;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@AllArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;

	private final CategoryService categoryService;

	private final CountryService countryService;

	private final ManufacturerService manufacturerService;

	private final SubcategoryService subcategoryService;

	private final WebClient.Builder webClient;

	private final VariablesConfiguration variablesConfiguration;

	public String createProducts(String token, ProductRequest productRequest) {


		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
		}

		if (productRequest.getProductName() == null || productRequest.getProductName().isEmpty()
				|| productRequest.getPrice() == null || productRequest.getQuantity() == null
				|| productRequest.getDescription() == null || productRequest.getDescription().isEmpty()
				|| productRequest.getManufacturerId() == null || productRequest.getCategoryId() == null
				|| productRequest.getCountryId() == null || productRequest.getSubcategoryId() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid and empty product request parameters");
		}

		Category category = categoryService.getCategoryById(productRequest.getCategoryId());

		Country country = countryService.getCountryById(productRequest.getCountryId());

		Manufacturer manufacturer = manufacturerService.getManufacturerById(productRequest.getManufacturerId());

		Subcategory subcategory = subcategoryService.getSubcategoryById(productRequest.getSubcategoryId());

		Product product = new Product(
				productRequest.getProductName(),
				productRequest.getDescription(),
				productRequest.getPrice(),
				productRequest.getQuantity(),
				manufacturer,
				country,
				category,
				subcategory
		);

		productRepository.save(product);


		return "Product created";
	}

	public Page<Product> getAllProducts(Integer page, Integer pageSize) {

		Pageable pageable = PageRequest.of(page, pageSize, Sort.by("dateAdded").descending());

        return productRepository.findAll(pageable);

	}

	public ResponseEntity<Product> getProductById(UUID id) {
		Product product = productRepository.findByProductSkuId(id)
				.orElseThrow(
						() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")
				);

		return ResponseEntity.ok(product);
	}

	public Page<Product> getAllProductsByCategoryAndCountryAndManufacturerAndSubcategory(
			Integer page,
			Integer pageSize,
			String sortBy,
			String direction,
			Long category,
			String country,
			String manufacturer,
			String subcategory,
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
				.findAllByCategory_IdAndBuiltinCountry_NameContainingAndManufacturer_NameContainingAndSubcategory_NameContainingAndProductPriceBetween(
						category, country, manufacturer, subcategory, lowPrice, highPrice, pageable);
	}

	public Page<Product> getAllProductsBySearchedPhrase(Integer page, Integer pageSize, String searchPhrase) {

		Pageable pageable = PageRequest.of(page, pageSize, Sort.by("dateAdded").descending());

        return productRepository
				.findAllByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(
						searchPhrase,
						searchPhrase,
						pageable
				);
	}

	public ResponseEntity<OrderAvailabilityResponse> verifyAvailabilityOfOrderProducts(OrderRequest orderRequest) {

		OrderAvailabilityResponse orderAvailabilityResponse = new OrderAvailabilityResponse();
		List<OrderAvailabilityListItem> items = new ArrayList<>();
		AtomicBoolean allAreAvailable = new AtomicBoolean(true);
		List<Product> productsToUpdateIfAllAvailable = new ArrayList<>();

		orderRequest.getItems()
				.forEach(orderLineItemsDTO -> {
					Product product = productRepository.findByProductSkuId(
							orderLineItemsDTO.getProductSkuId())
							.orElseThrow(
									() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")
							);
					OrderAvailabilityListItem orderAvailabilityListItem;
					if (product.getInStock() - orderLineItemsDTO.getQuantity() >= 0) {
							orderAvailabilityListItem =
								new OrderAvailabilityListItem(
										product.getProductSkuId(),
										true
								);
							productsToUpdateIfAllAvailable.add(product);
					} else {
							orderAvailabilityListItem =
								new OrderAvailabilityListItem(
										product.getProductSkuId(),
										false
								);
							allAreAvailable.set(false);
					}
					items.add(orderAvailabilityListItem);
				});
		orderAvailabilityResponse.setAvailableItems(items);

		if (allAreAvailable.get()) {
			int index = 0;
			orderRequest.getItems()
					.forEach(orderLineItemsDTO -> {
						Product product = productsToUpdateIfAllAvailable.get(index);
						product.setInStock(product.getInStock() - orderLineItemsDTO.getQuantity());
						productRepository.save(product);
					});
		}

		return ResponseEntity.ok(orderAvailabilityResponse);

	}

	public ResponseEntity<BigDecimal> getMaxPriceForProducts(Long category, String country, String manufacturer, String subcategory) {
		return ResponseEntity.ok(productRepository
				.findMaxProductPrice(
						category,
						country,
						manufacturer,
						subcategory
				)
		);
	}

	public ResponseEntity<String> updateProduct(String token, Long id, ProductRequest product) {

		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
		}

		if (product.getProductName() == null || product.getProductName().isEmpty()
				|| product.getPrice() == null || product.getQuantity() == null
				|| product.getDescription() == null || product.getDescription().isEmpty()
				|| product.getManufacturerId() == null || product.getCategoryId() == null
				|| product.getCountryId() == null || product.getSubcategoryId() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid and empty product request parameters");
		}

		Product productToUpdate = productRepository.findById(id)
				.orElseThrow(
					() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")
				);

		productToUpdate.setProductName(product.getProductName());
		productToUpdate.setProductPrice(product.getPrice());
		productToUpdate.setProductDescription(product.getDescription());
		productToUpdate.setBuiltinCountry(countryService.getCountryById(product.getCountryId()));
		productToUpdate.setCategory(categoryService.getCategoryById(product.getCategoryId()));
		productToUpdate.setManufacturer(manufacturerService.getManufacturerById(product.getManufacturerId()));
		productToUpdate.setSubcategory(subcategoryService.getSubcategoryById(product.getSubcategoryId()));

		productRepository.save(productToUpdate);

		return ResponseEntity.ok("Product updated");
	}

	public ResponseEntity<String> deleteProduct(String token, Long id) {

		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
		}

		Product productToDelete = productRepository.findById(id)
				.orElseThrow(
						() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")
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
				.uri(variablesConfiguration.getAdminUrl() + jwtToken)
				.retrieve()
				.bodyToMono(Boolean.class)
				.block();

	}

}
