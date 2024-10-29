package com.musicstore.products.api.service;

import com.musicstore.products.dto.*;
import com.musicstore.products.model.*;
import com.musicstore.products.repository.ProductRepository;
import com.musicstore.products.security.config.VariablesConfiguration;
import com.musicstore.products.service.*;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class ProductServiceTests {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private CountryService countryService;

    @Mock
    private ManufacturerService manufacturerService;

    @Mock
    private SubcategoryService subcategoryService;

    @Mock
    private VariablesConfiguration variablesConfiguration;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @InjectMocks
    private ProductService productService;

    private Product product;

    private Category category;

    private Country country;

    private Manufacturer manufacturer;

    private Subcategory subcategory;

    private ProductRequest productRequest;

    private ProductRequest faultyProductRequest;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";


    @BeforeEach
    public void setUp() {
        Long id = 1L;
        BigDecimal price = BigDecimal.valueOf(2699.99);
        BigDecimal newPrice = BigDecimal.valueOf(12659.99);

        country = new Country("Poland");
        country.setId(id);

        manufacturer = new Manufacturer("Fender");
        manufacturer.setId(id);

        category = new Category("Guitar");
        category.setId(id);

        subcategory = new Subcategory();
        subcategory.setId(id);
        subcategory.setCategory(category);
        subcategory.setName("Electric");

        product = new Product(
                "Stratocaster Player MX",
                "Something about this guitar",
                price,
                57,
                manufacturer,
                country,
                category,
                subcategory
        );

        product.setId(id);

        productRequest = new ProductRequest(
                "Strat",
                "Desc",
                price,
                57,
                1L,
                1L,
                1L,
                1L
        );

        faultyProductRequest = new ProductRequest();

    }

    @Test
    public void createProductTest() {

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(categoryService.getCategoryById(1L)).thenReturn(category);
        when(countryService.getCountryById(1L)).thenReturn(country);
        when(manufacturerService.getManufacturerById(1L)).thenReturn(manufacturer);
        when(subcategoryService.getSubcategoryById(1L)).thenReturn(subcategory);
        when(productRepository.save(Mockito.any(Product.class))).thenReturn(product);
        UUID response = productService.createProducts(token, productRequest);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isEqualTo(product.getProductSkuId());
    }

    @Test
    public void createProductInvalidTokenTest() {

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> productService.createProducts(token, productRequest));
    }

    @Test
    public void createProductFaultyRequestTest() {

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        Assertions.assertThatThrownBy(() -> productService.createProducts(token, faultyProductRequest));

    }

    @Test
    public void createProductFaultyTokenTest() {
        Assertions.assertThatThrownBy(() -> productService.createProducts(token.substring(7), productRequest));
    }

    @Test
    public void getAllProductsTest() {

        Pageable pageable = PageRequest.of(0, 10, Sort.by("dateAdded").descending());
        List<Product> products = new ArrayList<>();
        products.add(product);
        Page<Product> productsPage = new PageImpl<>(products, pageable, products.size());

        when(productRepository.findAll(pageable)).thenReturn(productsPage);
        Page<Product> foundProducts = productService.getAllProducts(0, 10);
        Assertions.assertThat(foundProducts.getTotalElements()).isEqualTo(1);

    }

    @Test
    public void getProductByIdTest() {

        UUID skuId = UUID.randomUUID();
        product.setProductSkuId(skuId);
        when(productRepository.findByProductSkuId(skuId)).thenReturn(Optional.of(product));

        ResponseEntity<Product> foundProduct = productService.getProductById(product.getProductSkuId());
        Assertions.assertThat(foundProduct).isNotNull();
        Assertions.assertThat(foundProduct.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(foundProduct.getBody()).isEqualTo(product);

    }

    @Test
    public void getProductByIdNotFoundTest() {

        UUID skuId = UUID.randomUUID();
        when(productRepository.findByProductSkuId(skuId)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> productService.getProductById(skuId));

    }

    @Test
    public void getAllProductsByCategoryAndCountryAndManufacturerAndSubcategoryTest() {

        Pageable pageable1 = PageRequest.of(0, 10, Sort.by("dateAdded").descending());
        Pageable pageable2 = PageRequest.of(0, 10, Sort.by("dateAdded").ascending());

        List<Product> products = new ArrayList<>();
        products.add(product);
        Page<Product> productsPage1 = new PageImpl<>(products, pageable1, products.size());
        Page<Product> productsPage2 = new PageImpl<>(products, pageable2, products.size());
        BigDecimal hp = BigDecimal.valueOf(2699.99);
        BigDecimal lp = BigDecimal.valueOf(100.00);
        when(productRepository
                .findAllByCategory_IdAndBuiltinCountry_NameContainingAndManufacturer_NameContainingAndSubcategory_NameContainingAndProductPriceBetween(
                1L,
                        "USA",
                        "Fender",
                        "Electric",
                        lp,
                        hp,
                        pageable1

        )).thenReturn(productsPage1);
        when(productRepository
                .findAllByCategory_IdAndBuiltinCountry_NameContainingAndManufacturer_NameContainingAndSubcategory_NameContainingAndProductPriceBetween(
                        1L,
                        "USA",
                        "Fender",
                        "Electric",
                        lp,
                        hp,
                        pageable2

                )).thenReturn(productsPage2);

        Page<Product> foundProducts1 = productService
                .getAllProductsByCategoryAndCountryAndManufacturerAndSubcategory(
                      0,
                      10,
                      "dateAdded",
                      "desc",
                      1L,
                      "USA",
                      "Fender",
                      "Electric",
                      lp,
                      hp
                );
        Page<Product> foundProducts2 = productService
                .getAllProductsByCategoryAndCountryAndManufacturerAndSubcategory(
                        0,
                        10,
                        "dateAdded",
                        "asc",
                        1L,
                        "USA",
                        "Fender",
                        "Electric",
                        lp,
                        hp
                );

        Assertions.assertThat(foundProducts1.getTotalElements()).isEqualTo(1);
        Assertions.assertThat(foundProducts1.getContent().get(0).getProductSkuId()).isEqualTo(product.getProductSkuId());

        Assertions.assertThat(foundProducts2.getTotalElements()).isEqualTo(1);
        Assertions.assertThat(foundProducts2.getContent().get(0).getProductSkuId()).isEqualTo(product.getProductSkuId());
    }

    @Test
    public void getAllProductsBySearchPhraseTest() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("dateAdded").descending());
        List<Product> products = new ArrayList<>();
        products.add(product);
        Page<Product> productsPage = new PageImpl<>(products, pageable, products.size());

        when(productRepository
                .findAllByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(
                        "Stra",
                        "Stra",
                        pageable
                )).thenReturn(productsPage);

        Page<Product> foundProducts = productService
                .getAllProductsBySearchedPhrase(0, 10, "Stra");

        Assertions.assertThat(foundProducts.getTotalElements()).isEqualTo(1);
        Assertions.assertThat(foundProducts.getContent().get(0).getProductName()).isEqualTo("Stratocaster Player MX");

    }

    @Test
    public void verifyAvailabilityOfOrderProductsAllAvailableTest() {

        UUID skuId = UUID.randomUUID();
        product.setProductSkuId(skuId);

        OrderAvailabilityResponse orderAvailabilityResponse = new OrderAvailabilityResponse();
        OrderAvailabilityListItem orderAvailabilityListItem = new OrderAvailabilityListItem();
        OrderLineItemsDto orderLineItemsDTO = new OrderLineItemsDto();
        OrderRequest orderRequest = new OrderRequest();

        orderLineItemsDTO.setQuantity(1);
        orderLineItemsDTO.setProductSkuId(product.getProductSkuId());
        orderLineItemsDTO.setUnitPrice(BigDecimal.valueOf(2699.99));
        List<OrderLineItemsDto> orderItems = new ArrayList<>();
        orderItems.add(orderLineItemsDTO);
        orderRequest.setItems(orderItems);

        orderAvailabilityListItem.setProductSkuId(product.getProductSkuId());
        orderAvailabilityListItem.setIsAvailable(true);
        List<OrderAvailabilityListItem> items = new ArrayList<>();
        items.add(orderAvailabilityListItem);
        orderAvailabilityResponse.setAvailableItems(items);

        when(productRepository.findByProductSkuId(orderLineItemsDTO.getProductSkuId())).thenReturn(Optional.of(product));
        when(productRepository.save(Mockito.any(Product.class))).thenReturn(product);

        ResponseEntity<OrderAvailabilityResponse> responseEntity = productService.verifyAvailabilityOfOrderProducts(orderRequest);
        Assertions.assertThat(responseEntity).isNotNull();
        Assertions.assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(responseEntity.getBody()).isNotNull();
        Assertions.assertThat(responseEntity.getBody().getAvailableItems()).isNotNull();
        Assertions.assertThat(responseEntity.getBody().getAvailableItems().get(0).getProductSkuId()).isEqualTo(product.getProductSkuId());

    }

    @Test
    public void verifyAvailabilityOfOrderProductsProductNotFoundTest() {
        UUID skuId = UUID.randomUUID();
        UUID badSkuId = UUID.randomUUID();
        product.setProductSkuId(skuId);


        OrderLineItemsDto orderLineItemsDTO = new OrderLineItemsDto();
        OrderRequest orderRequest = new OrderRequest();

        orderLineItemsDTO.setQuantity(1);
        orderLineItemsDTO.setProductSkuId(badSkuId);
        orderLineItemsDTO.setUnitPrice(BigDecimal.valueOf(2699.99));
        List<OrderLineItemsDto> orderItems = new ArrayList<>();
        orderItems.add(orderLineItemsDTO);
        orderRequest.setItems(orderItems);

        when(productRepository.findByProductSkuId(badSkuId)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> productService.verifyAvailabilityOfOrderProducts(orderRequest));

    }

    @Test
    public void verifyAvailabilityOfOrderProductsProductNotInStockTest() {

        UUID skuId = UUID.randomUUID();
        product.setProductSkuId(skuId);

        OrderAvailabilityResponse orderAvailabilityResponse = new OrderAvailabilityResponse();
        OrderAvailabilityListItem orderAvailabilityListItem = new OrderAvailabilityListItem();
        OrderLineItemsDto orderLineItemsDTO = new OrderLineItemsDto();
        OrderRequest orderRequest = new OrderRequest();

        orderLineItemsDTO.setQuantity(2000);
        orderLineItemsDTO.setProductSkuId(product.getProductSkuId());
        orderLineItemsDTO.setUnitPrice(BigDecimal.valueOf(2699.99));
        List<OrderLineItemsDto> orderItems = new ArrayList<>();
        orderItems.add(orderLineItemsDTO);
        orderRequest.setItems(orderItems);

        orderAvailabilityListItem.setProductSkuId(product.getProductSkuId());
        orderAvailabilityListItem.setIsAvailable(true);
        List<OrderAvailabilityListItem> items = new ArrayList<>();
        items.add(orderAvailabilityListItem);
        orderAvailabilityResponse.setAvailableItems(items);

        when(productRepository.findByProductSkuId(orderLineItemsDTO.getProductSkuId())).thenReturn(Optional.of(product));

        ResponseEntity<OrderAvailabilityResponse> responseEntity = productService.verifyAvailabilityOfOrderProducts(orderRequest);
        Assertions.assertThat(responseEntity).isNotNull();
        Assertions.assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(responseEntity.getBody()).isNotNull();
        Assertions.assertThat(responseEntity.getBody().getAvailableItems()).isNotNull();
        Assertions.assertThat(responseEntity.getBody().getAvailableItems().get(0).getProductSkuId()).isEqualTo(product.getProductSkuId());
        Assertions.assertThat(responseEntity.getBody().getAvailableItems().get(0).getIsAvailable()).isEqualTo(false);

    }

    @Test
    public void cancelOrderProductTest() {

        OrderLineItemsDto orderLineItemsDTO = new OrderLineItemsDto();
        orderLineItemsDTO.setQuantity(2000);
        orderLineItemsDTO.setProductSkuId(product.getProductSkuId());
        orderLineItemsDTO.setUnitPrice(BigDecimal.valueOf(2699.99));
        List<OrderLineItemsDto> orderItems = new ArrayList<>();
        orderItems.add(orderLineItemsDTO);

        CancelOrderRequest cancelOrderRequest = new CancelOrderRequest();
        cancelOrderRequest.setItems(orderItems);

        when(productRepository.findByProductSkuId(product.getProductSkuId())).thenReturn(Optional.of(product));

        ResponseEntity<Boolean> result = productService.cancelOrderProducts(cancelOrderRequest);
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(result.getBody()).isNotNull();
        Assertions.assertThat(result.getBody()).isTrue();
    }

    @Test
    public void cancelOrderProductNotFoundTest() {

        OrderLineItemsDto orderLineItemsDTO = new OrderLineItemsDto();
        orderLineItemsDTO.setQuantity(2000);
        orderLineItemsDTO.setProductSkuId(product.getProductSkuId());
        orderLineItemsDTO.setUnitPrice(BigDecimal.valueOf(2699.99));
        List<OrderLineItemsDto> orderItems = new ArrayList<>();
        orderItems.add(orderLineItemsDTO);

        CancelOrderRequest cancelOrderRequest = new CancelOrderRequest();
        cancelOrderRequest.setItems(orderItems);

        when(productRepository.findByProductSkuId(product.getProductSkuId())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> productService.cancelOrderProducts(cancelOrderRequest));


    }

    @Test
    public void getMaxPriceForProductTest() {

        when(productRepository.findMaxProductPrice(1L, "USA", "Fender", "Electric")).thenReturn(BigDecimal.valueOf(2699.99));
        ResponseEntity<BigDecimal> result = productService.getMaxPriceForProducts(1L, "USA", "Fender", "Electric");

        Assertions.assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(result.getBody()).isEqualTo(BigDecimal.valueOf(2699.99));

    }

    @Test
    public void updateProductTest() {

        UUID skuId = UUID.randomUUID();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(productRepository.findByProductSkuId(skuId)).thenReturn(Optional.of(product));
        when(categoryService.getCategoryById(1L)).thenReturn(category);
        when(countryService.getCountryById(1L)).thenReturn(country);
        when(manufacturerService.getManufacturerById(1L)).thenReturn(manufacturer);
        when(subcategoryService.getSubcategoryById(1L)).thenReturn(subcategory);

        ResponseEntity<String> response = productService.updateProduct(token, skuId, productRequest);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Product updated");

    }

    @Test
    public void updateProductInvalidTokenTest() {

        UUID skuId = UUID.randomUUID();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> productService.updateProduct(token, skuId, productRequest));

    }

    @Test
    public void updateProductNotFoundTest() {

        UUID skuId = UUID.randomUUID();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(productRepository.findByProductSkuId(skuId)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> productService.updateProduct(token, skuId, productRequest));

    }

    @Test
    public void updateProductFaultyRequestBodyTest() {

        UUID skuId = UUID.randomUUID();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        Assertions.assertThatThrownBy(() -> productService.updateProduct(token, skuId, faultyProductRequest));

    }

    @Test
    public void deleteProductTest() {
        UUID skuId = UUID.randomUUID();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(productRepository.findByProductSkuId(skuId)).thenReturn(Optional.of(product));
        ResponseEntity<String> response = productService.deleteProduct(token, skuId);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isEqualTo("Product deleted");

    }

    @Test
    public void deleteProductNotFoundTest() {

        UUID skuId = UUID.randomUUID();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(productRepository.findByProductSkuId(skuId)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> productService.deleteProduct(token, skuId));

    }

    @Test
    public void deleteProductInvalidTokenTest() {

        UUID skuId = UUID.randomUUID();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> productService.deleteProduct(token, skuId));
    }
}
