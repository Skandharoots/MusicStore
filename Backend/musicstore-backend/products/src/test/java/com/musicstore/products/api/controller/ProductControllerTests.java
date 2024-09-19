package com.musicstore.products.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.products.controller.ProductsController;
import com.musicstore.products.dto.*;
import com.musicstore.products.model.*;
import com.musicstore.products.service.ProductService;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;

@WebMvcTest(controllers = ProductsController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@RunWith(SpringRunner.class)
public class ProductControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    private Product product;

    private Category category;

    private Subcategory subcategory;

    private Manufacturer manufacturer;

    private Country country;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    @Before
    public void setUp() throws Exception {

        Long id = 1L;
        BigDecimal price = BigDecimal.valueOf(2699.99);

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
        product.setDateAdded(LocalDateTime.now());
        product.setProductSkuId(UUID.randomUUID());

        product.setId(id);

    }

    @Test
    public void createProductTest() throws Exception {

        ProductRequest productRequest = new ProductRequest();
        productRequest.setProductName("Test");
        productRequest.setDescription("Test");
        productRequest.setPrice(BigDecimal.valueOf(299.99));
        productRequest.setQuantity(1);
        productRequest.setCategoryId(1L);
        productRequest.setSubcategoryId(1L);
        productRequest.setCountryId(1L);
        productRequest.setManufacturerId(1L);

        when(productService.createProducts(token, productRequest)).thenReturn(product.getProductSkuId());

        ResultActions resultActions = mockMvc.perform(post("/api/products/items/create")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isCreated());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(product.getProductSkuId())));

    }

    @Test
    public void getAllProductsTest() throws Exception {

        Pageable pageable = PageRequest.of(0, 10, Sort.by("dateAdded").descending());
        List<Product> products = new ArrayList<>();
        products.add(product);
        Page<Product> productsPage = new PageImpl<>(products, pageable, products.size());

        when(productService.getAllProducts(0, 10)).thenReturn(productsPage);

        ResultActions resultActions = mockMvc.perform(get("/api/products/items/get?page=0&pageSize=10"));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(productsPage)));

    }

    @Test
    public void getProductByIdTest() throws Exception {

        when(productService.getProductById(product.getProductSkuId())).thenReturn(ResponseEntity.ok(product));

        ResultActions resultActions = mockMvc.perform(get("/api/products/items/get/{uuid}", product.getProductSkuId()));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(product)));
    }

    @Test
    public void getMaxPriceTest() throws Exception {

        when(productService.getMaxPriceForProducts(1L, "USA", "Fender", "Electric")).thenReturn(ResponseEntity.ok(BigDecimal.valueOf(299.99)));

        ResultActions resultActions = mockMvc.perform(get("/api/products/items/get/max_price/{category}?country=USA&manufacturer=Fender&subcategory=Electric", 1L));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string("299.99"));

    }

    @Test
    public void getAllProductsByCategoryTest() throws Exception {

        Pageable pageable = PageRequest.of(0, 10, Sort.by("dateAdded").ascending());
        List<Product> products = new ArrayList<>();
        products.add(product);
        Page<Product> productsPage = new PageImpl<>(products, pageable, products.size());

        when(productService.getAllProductsByCategoryAndCountryAndManufacturerAndSubcategory(
                0,
                10,
                "dateAdded",
                "asc",
                1L,
                "Poland",
                "Fender",
                "Electric",
                new BigDecimal("100.00"),
                new BigDecimal("4000.00")
        )).thenReturn(productsPage);

        ResultActions resultActions = mockMvc
                .perform(get("/api/products/items/get/values/{category}?country=Poland" +
                        "&manufacturer=Fender&subcategory=Electric&lowPrice=100.00&highPrice=4000.00" +
                        "&sortBy=dateAdded&sortDir=asc&page=0&pageSize=10", 1L));

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(productsPage)));
    }

    @Test
    public void getAllProductsBySearchPhraseTest() throws Exception {

        Pageable pageable = PageRequest.of(0, 10, Sort.by("dateAdded").descending());
        List<Product> products = new ArrayList<>();
        products.add(product);
        Page<Product> productsPage = new PageImpl<>(products, pageable, products.size());

        when(productService.getAllProductsBySearchedPhrase(0, 10, "Strat")).thenReturn(productsPage);

        ResultActions resultActions = mockMvc.perform(get("/api/products/items/get/search?searchPhrase=Strat&page=0&pageSize=10"));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(productsPage)));

    }

    @Test
    public void verifyAvailabilityTest() throws Exception {

        OrderLineItemsDto orderLineItemsDTO = new OrderLineItemsDto();
        orderLineItemsDTO.setProductSkuId(product.getProductSkuId());
        orderLineItemsDTO.setQuantity(1);
        orderLineItemsDTO.setUnitPrice(product.getProductPrice());
        List<OrderLineItemsDto> items = new ArrayList<>();
        items.add(orderLineItemsDTO);

        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setItems(items);

        OrderAvailabilityListItem orderAvailabilityListItem = new OrderAvailabilityListItem();
        orderAvailabilityListItem.setIsAvailable(true);
        orderAvailabilityListItem.setProductSkuId(product.getProductSkuId());
        List<OrderAvailabilityListItem> availableItems = new ArrayList<>();
        availableItems.add(orderAvailabilityListItem);

        OrderAvailabilityResponse orderAvailabilityResponse = new OrderAvailabilityResponse();
        orderAvailabilityResponse.setAvailableItems(availableItems);

        when(productService.verifyAvailabilityOfOrderProducts(orderRequest)).thenReturn(ResponseEntity.ok(orderAvailabilityResponse));

        ResultActions resultActions = mockMvc.perform(post("/api/products/items/verify_availability")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(orderAvailabilityResponse)));

    }

    @Test
    public void updateProductTest() throws Exception {

        ProductRequest productRequest = new ProductRequest();
        productRequest.setProductName("Test");
        productRequest.setDescription("Test");
        productRequest.setPrice(BigDecimal.valueOf(299.99));
        productRequest.setQuantity(1);
        productRequest.setCategoryId(1L);
        productRequest.setSubcategoryId(1L);
        productRequest.setCountryId(1L);
        productRequest.setManufacturerId(1L);

        when(productService.updateProduct(token, 1L, productRequest)).thenReturn(ResponseEntity.ok("Product updated"));

        ResultActions resultActions = mockMvc.perform(put("/api/products/items/update/{id}", 1L)
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(productRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Product updated"));
    }

    @Test
    public void deleteProductTest() throws Exception {

        when(productService.deleteProduct(token, 1L)).thenReturn(ResponseEntity.ok("Product deleted"));

        ResultActions resultActions = mockMvc.perform(delete("/api/products/items/delete/{id}", 1L)
                .header("Authorization", token));

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Product deleted"));
    }

}
