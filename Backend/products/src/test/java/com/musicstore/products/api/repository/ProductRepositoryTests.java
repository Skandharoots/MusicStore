package com.musicstore.products.api.repository;

import com.musicstore.products.model.*;
import com.musicstore.products.repository.ProductRepository;
import org.assertj.core.api.Assertions;
import org.springframework.data.domain.Page;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ProductRepositoryTests {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void createProductTest() {

        Category category = new Category("Guitar");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Subcategory");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        Manufacturer manufacturer = new Manufacturer("Fender");
        entityManager.persist(manufacturer);

        Country country = new Country("USA");
        entityManager.persist(country);

        BigDecimal price = BigDecimal.valueOf(2699.99);
        Product product = new Product(
                "Stratocaster",
                "Desc",
                price,
                23,
                manufacturer,
                country,
                category,
                subcategory
        );

        Product savedProduct = productRepository.save(product);

        Assertions.assertThat(savedProduct.getId()).isNotNull();
        Assertions.assertThat(product.getProductName()).isEqualTo("Stratocaster");
        Assertions.assertThat(product.getProductDescription()).isEqualTo("Desc");
        Assertions.assertThat(product.getProductPrice()).isEqualTo(price);
        Assertions.assertThat(product.getManufacturer().getName()).isEqualTo("Fender");
        Assertions.assertThat(product.getInStock()).isEqualTo(23);
        Assertions.assertThat(product.getCategory()).isEqualTo(category);
        Assertions.assertThat(product.getCategory().getName()).isEqualTo("Guitar");
        Assertions.assertThat(product.getSubcategory()).isEqualTo(subcategory);
        Assertions.assertThat(product.getSubcategory().getName()).isEqualTo("Subcategory");
        Assertions.assertThat(product.getSubcategory().getCategory()).isEqualTo(category);

    }

    @Test
    public void findAllProductsTest() {

        Category category = new Category("Guitar");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Subcategory");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        Manufacturer manufacturer = new Manufacturer("Fender");
        entityManager.persist(manufacturer);

        Country country = new Country("USA");
        entityManager.persist(country);

        BigDecimal price = BigDecimal.valueOf(2699.99);
        Product product = new Product(
                "Stratocaster",
                "Desc",
                price,
                23,
                manufacturer,
                country,
                category,
                subcategory
        );
        entityManager.persist(product);

        List<Product> products = productRepository.findAll();
        Assertions.assertThat(products.size()).isEqualTo(1);

    }

    @Test
    public void findProductBySkuIdTest() {

        Category category = new Category("Guitar");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Subcategory");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        Manufacturer manufacturer = new Manufacturer("Fender");
        entityManager.persist(manufacturer);

        Country country = new Country("USA");
        entityManager.persist(country);

        BigDecimal price = BigDecimal.valueOf(2699.99);
        Product product = new Product(
                "Stratocaster",
                "Desc",
                price,
                23,
                manufacturer,
                country,
                category,
                subcategory
        );
        UUID skuId = UUID.randomUUID();
        product.setProductSkuId(skuId);
        entityManager.persist(product);

        Optional<Product> foundProduct = productRepository.findByProductSkuId(skuId);
        Assertions.assertThat(foundProduct.isPresent()).isTrue();
        Assertions.assertThat(foundProduct.get().getProductSkuId()).isEqualTo(skuId);

    }

    @Test
    public void findAllByCategory_IdAndBuiltinCountry_NameContainingAndManufacturer_NameContainingAndSubcategory_NameContainingAndProductPriceBetweenTest() {

        Category category = new Category("Guitar");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Subcategory");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        Manufacturer manufacturer = new Manufacturer("Fender");
        entityManager.persist(manufacturer);

        Country country = new Country("USA");
        entityManager.persist(country);

        BigDecimal price = BigDecimal.valueOf(2699.99);
        Product product = new Product(
                "Stratocaster",
                "Desc",
                price,
                23,
                manufacturer,
                country,
                category,
                subcategory
        );
        UUID skuId = UUID.randomUUID();
        product.setProductSkuId(skuId);
        entityManager.persist(product);

        BigDecimal lp = new BigDecimal("200.00");
        BigDecimal hp = new BigDecimal("3000.00");
        Pageable pageable = (Pageable) PageRequest.of(0, 10, Sort.by("productPrice").ascending());

        Page<Product> foundProducts =
                productRepository.findAllByCategory_IdAndBuiltinCountry_NameContainingAndManufacturer_NameContainingAndSubcategory_NameContainingAndProductPriceBetween(
                        category.getId(),
                        country.getName(),
                        manufacturer.getName(),
                        subcategory.getName(),
                        lp,
                        hp,
                        pageable
                );

        Assertions.assertThat(foundProducts.getTotalElements()).isEqualTo(1);

    }

    @Test
    public void searchByStringContainingTest() {

        Category category = new Category("Guitar");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Subcategory");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        Manufacturer manufacturer = new Manufacturer("Fender");
        entityManager.persist(manufacturer);

        Country country = new Country("USA");
        entityManager.persist(country);

        BigDecimal price = BigDecimal.valueOf(2699.99);
        Product product = new Product(
                "Stratocaster",
                "Desc",
                price,
                23,
                manufacturer,
                country,
                category,
                subcategory
        );
        UUID skuId = UUID.randomUUID();
        product.setProductSkuId(skuId);
        entityManager.persist(product);

        Pageable pageable = (Pageable) PageRequest.of(0, 10, Sort.by("productPrice").ascending());
        String searchPhrase = "Stra";
        Page<Product> foundProducts =
                productRepository.findAllByProductNameContainingIgnoreCaseOrProductDescriptionContainingIgnoreCase(
                       searchPhrase,
                       searchPhrase,
                       pageable
                );

        Assertions.assertThat(foundProducts.getTotalElements()).isEqualTo(1);

    }

    @Test
    public void findMaxProductPriceTest() {

        Category category = new Category("Guitar");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Subcategory");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        Manufacturer manufacturer = new Manufacturer("Fender");
        entityManager.persist(manufacturer);

        Country country = new Country("USA");
        entityManager.persist(country);

        BigDecimal price = BigDecimal.valueOf(2699.99);
        Product product = new Product(
                "Stratocaster",
                "Desc",
                price,
                23,
                manufacturer,
                country,
                category,
                subcategory
        );
        UUID skuId = UUID.randomUUID();
        product.setProductSkuId(skuId);
        entityManager.persist(product);

        BigDecimal maxPrice = productRepository
                .findMaxProductPrice(category.getId(), country.getName(), manufacturer.getName(), subcategory.getName());

        Assertions.assertThat(maxPrice).isEqualTo(price);

    }


}
