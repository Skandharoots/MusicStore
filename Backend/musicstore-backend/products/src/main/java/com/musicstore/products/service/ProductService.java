package com.musicstore.products.service;

import com.musicstore.products.dto.CancelOrderRequest;
import com.musicstore.products.dto.OrderAvailabilityListItem;
import com.musicstore.products.dto.OrderAvailabilityResponse;
import com.musicstore.products.dto.OrderRequest;
import com.musicstore.products.dto.ProductBoughtCountDto;
import com.musicstore.products.dto.ProductRequest;
import com.musicstore.products.model.Category;
import com.musicstore.products.model.Country;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.model.Product;
import com.musicstore.products.model.Subcategory;
import com.musicstore.products.repository.ProductRepository;
import com.musicstore.products.security.config.VariablesConfiguration;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    private final CategoryService categoryService;

    private final CountryService countryService;

    private final ManufacturerService manufacturerService;

    private final SubcategoryService subcategoryService;

    private final WebClient.Builder webClient;

    private final VariablesConfiguration variablesConfiguration;

    public UUID createProducts(String token, ProductRequest productRequest) {


        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
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

        Product savedProduct = productRepository.save(product);
        log.info("Product created: " + savedProduct.getProductName());


        return savedProduct.getProductSkuId();
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

    public Page<Product> getTopBoughtProducts(int page, int pageSize) {
        
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("boughtCount").descending());

        return productRepository.findAll(pageable);

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

    @Transactional
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
            AtomicInteger index = new AtomicInteger();
            orderRequest.getItems()
                .forEach(orderLineItemsDTO -> {
                    Product product = productsToUpdateIfAllAvailable.get(index.get());
                    product.setInStock(product.getInStock() - orderLineItemsDTO.getQuantity());
                    productRepository.save(product);
                    index.getAndIncrement();
                });
        } else {
            log.error("Not all products from order - " + orderRequest.getItems().toString() + " are available");
        }

        return ResponseEntity.ok(orderAvailabilityResponse);

    }

    public ResponseEntity<Boolean> cancelOrderProducts(CancelOrderRequest request) {
        request.getItems()
                .forEach(orderLineItemsDto -> {
                    Product product = productRepository.findByProductSkuId(
                                    orderLineItemsDto.getProductSkuId())
                            .orElseThrow(
                                    () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                            "Product not found")
                            );
                    product.setInStock(product.getInStock() + orderLineItemsDto.getQuantity());
                });

        return ResponseEntity.ok(true);
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

    @Transactional
    public ResponseEntity<String> updateProduct(String token, UUID id, ProductRequest product) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        Product productToUpdate = productRepository.findByProductSkuId(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")
                );

        productToUpdate.setProductName(product.getProductName());
        productToUpdate.setProductPrice(product.getPrice());
        productToUpdate.setProductDescription(product.getDescription());
        productToUpdate.setInStock(product.getQuantity());
        productToUpdate.setBuiltinCountry(countryService.getCountryById(product.getCountryId()));
        productToUpdate.setCategory(categoryService.getCategoryById(product.getCategoryId()));
        productToUpdate.setManufacturer(manufacturerService.getManufacturerById(product.getManufacturerId()));
        productToUpdate.setSubcategory(subcategoryService.getSubcategoryById(product.getSubcategoryId()));

        productRepository.save(productToUpdate);
        log.info("Product updated: " + productToUpdate.getProductName());

        return ResponseEntity.ok("Product updated");

    }

    @Transactional
    public ResponseEntity<String> updateProductBoughtCount(UUID id, ProductBoughtCountDto product) {
        
        Product productToUpdate = productRepository.findByProductSkuId(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")
                );
        productToUpdate.setBoughtCount(productToUpdate.getBoughtCount() + product.getBoughtCount());
        productRepository.save(productToUpdate);
        log.info("Product bought count updated: " + productToUpdate.getProductName() + " - " + productToUpdate.getProductSkuId());

        return ResponseEntity.ok("Product bought count updated");
    }

    @Transactional
    public ResponseEntity<String> deleteProduct(String token, UUID id) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        Product productToDelete = productRepository.findByProductSkuId(id)
            .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")
            );

        productRepository.delete(productToDelete);
        log.info("Product deleted: " + productToDelete.getProductName());

        return ResponseEntity.ok("Product deleted");
    }

    private Boolean doesUserHaveAdminAuthorities(String token) {

        if (!token.startsWith("Bearer ")) {
            log.error("Invalid token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid token");
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
