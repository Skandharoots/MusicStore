package com.musicstore.products.api.repository;

import com.musicstore.products.model.*;
import com.musicstore.products.repository.*;
import jakarta.persistence.EntityManager;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class CountryRepositoryTests {

    @Autowired
    private ManufacturerRepository manufacturerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private SubcategoryTierTwoRepository subcategoryTierTwoRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Test
    public void createCountryTest() {

        Country country = new Country("Poland");
        Country savedCountry = countryRepository.save(country);

        Assertions.assertThat(country).isNotNull();
        Assertions.assertThat(savedCountry.getName()).isEqualTo("Poland");
    }

    @Test
    public void findCountryByIdTest() {

        Country country = new Country("Poland");

        entityManager.persist(country);
        entityManager.flush();

        Optional<Country> foundCountry = countryRepository.findById(country.getId());
        Assertions.assertThat(foundCountry.isPresent()).isTrue();
        Assertions.assertThat(foundCountry.get().getName()).isEqualTo("Poland");


    }

    @Test
    public void findAllCountriesTest() {
        Country country = new Country("Poland");
        Country country2 = new Country("England");
        entityManager.persist(country);
        entityManager.persist(country2);
        entityManager.flush();

        List<Country> countries = countryRepository.findAll();
        Assertions.assertThat(countries).isNotEmpty();
        Assertions.assertThat(countries.size()).isEqualTo(2);
        Assertions.assertThat(countries.get(0).getName()).isEqualTo("Poland");
        Assertions.assertThat(countries.get(1).getName()).isEqualTo("England");

    }

    @Test
    public void findAllBySearchParametersTest() {

        BigDecimal price = BigDecimal.valueOf(2699.99);

        Country country = new Country("Poland");
        countryRepository.save(country);

        Manufacturer manufacturer = new Manufacturer("Fender");
        manufacturerRepository.save(manufacturer);

        Category category = new Category("Guitar");
        categoryRepository.save(category);

        Subcategory subcategory = new Subcategory("Electric");
        subcategory.setCategory(category);
        subcategoryRepository.save(subcategory);

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setName("SubcategoryTierTwo");
        subcategoryTierTwo.setSubcategory(subcategory);
        subcategoryTierTwoRepository.save(subcategoryTierTwo);

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
        productRepository.save(product);

        List<Country> countries = countryRepository.findAllBySearchParameters(category.getId(), "Fender", "Electric", "SubcategoryTierTwo");
        Assertions.assertThat(countries).isNotEmpty();
        Assertions.assertThat(countries.size()).isEqualTo(1);
        Assertions.assertThat(countries.get(0).getName()).isEqualTo("Poland");

    }
}
