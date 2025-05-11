package com.musicstore.products.api.model;

import com.musicstore.products.model.*;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.UUID;

@SpringBootTest
public class ProductModelTests {

    @Test
    public void productModelTest() {

        Long id = 1L;
        BigDecimal price = BigDecimal.valueOf(2699.99);
        BigDecimal newPrice = BigDecimal.valueOf(12659.99);

        Country country = new Country("Poland");
        country.setId(id);

        Manufacturer manufacturer = new Manufacturer("Fender");
        manufacturer.setId(id);

        Category category = new Category("Guitar");
        category.setId(id);

        Subcategory subcategory = new Subcategory();
        subcategory.setId(id);
        subcategory.setCategory(category);
        subcategory.setName("Electric");

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setId(id);
        subcategoryTierTwo.setSubcategory(subcategory);
        subcategoryTierTwo.setName("Electronic");

        Product product = new Product(
                "Stratocaster Player MX",
                "Something about this guitar",
                price,
                57,
                manufacturer,
                country,
                category,
                subcategory,
                subcategoryTierTwo
        );

        product.setId(id);

        Assertions.assertThat(product.getId()).isEqualTo(id);
        Assertions.assertThat(product.getProductName()).isEqualTo("Stratocaster Player MX");
        Assertions.assertThat(product.getProductDescription()).isEqualTo("Something about this guitar");
        Assertions.assertThat(product.getProductPrice()).isEqualTo(price);
        Assertions.assertThat(product.getInStock()).isEqualTo(57);
        Assertions.assertThat(product.getManufacturer().getName()).isEqualTo("Fender");
        Assertions.assertThat(product.getManufacturer().getId()).isEqualTo(id);
        Assertions.assertThat(product.getCategory().getName()).isEqualTo("Guitar");
        Assertions.assertThat(product.getCategory().getId()).isEqualTo(id);
        Assertions.assertThat(product.getBuiltinCountry().getName()).isEqualTo("Poland");
        Assertions.assertThat(product.getBuiltinCountry().getId()).isEqualTo(id);
        Assertions.assertThat(product.getSubcategory().getName()).isEqualTo("Electric");
        Assertions.assertThat(product.getSubcategory().getId()).isEqualTo(id);

        product.setProductName("Telecaster");
        product.setProductDescription("Telecaster new description");
        product.setProductPrice(newPrice);
        product.setInStock(2);
        product.setManufacturer(manufacturer);
        product.setCategory(category);
        product.setBuiltinCountry(country);
        product.setSubcategory(subcategory);

        Assertions.assertThat(product.getId()).isEqualTo(id);
        Assertions.assertThat(product.getProductName()).isEqualTo("Telecaster");
        Assertions.assertThat(product.getProductDescription()).isEqualTo("Telecaster new description");
        Assertions.assertThat(product.getProductPrice()).isEqualTo(newPrice);
        Assertions.assertThat(product.getInStock()).isEqualTo(2);
        Assertions.assertThat(product.getManufacturer().getName()).isEqualTo("Fender");
        Assertions.assertThat(product.getManufacturer().getId()).isEqualTo(id);
        Assertions.assertThat(product.getCategory().getName()).isEqualTo("Guitar");
        Assertions.assertThat(product.getCategory().getId()).isEqualTo(id);
        Assertions.assertThat(product.getBuiltinCountry().getName()).isEqualTo("Poland");
        Assertions.assertThat(product.getBuiltinCountry().getId()).isEqualTo(id);
        Assertions.assertThat(product.getSubcategory().getName()).isEqualTo("Electric");
        Assertions.assertThat(product.getSubcategory().getId()).isEqualTo(id);
    }
}
