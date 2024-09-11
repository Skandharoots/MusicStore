package com.musicstore.products.api.repository;

import com.musicstore.products.model.Category;
import com.musicstore.products.model.Country;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.model.Product;
import com.musicstore.products.repository.CategoryRepository;
import com.musicstore.products.repository.CountryRepository;
import com.musicstore.products.repository.ManufacturerRepository;
import com.musicstore.products.repository.ProductRepository;
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
    private EntityManager entityManager;

    @Test
    public void createCountryTest() {

        Country country = new Country("Poland");
        Country savedCountry = countryRepository.save(country);

        Assertions.assertThat(country).isNotNull();
        Assertions.assertThat(savedCountry.getName()).isEqualTo("Poland");
        Assertions.assertThat(savedCountry.getId()).isEqualTo(1L);
    }

    @Test
    public void findCountryByIdTest() {
        Country country = new Country("Poland");
        entityManager.persist(country);
        entityManager.flush();

        Optional<Country> foundCountry = countryRepository.findById(1L);
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

        Long id = 1L;
        BigDecimal price = BigDecimal.valueOf(2699.99);

        Country country = new Country("Poland");
        country.setId(id);
        countryRepository.save(country);

        Manufacturer manufacturer = new Manufacturer("Fender");
        manufacturer.setId(id);
        manufacturerRepository.save(manufacturer);

        Category category = new Category("Guitar");
        category.setId(id);
        categoryRepository.save(category);

        Product product = new Product(
                "Stratocaster Player MX",
                "Something about this guitar",
                price,
                57,
                manufacturer,
                country,
                category
        );
        productRepository.save(product);

        List<Country> countries = countryRepository.findAllBySearchParameters(1L, "Fender");
        Assertions.assertThat(countries).isNotEmpty();
        Assertions.assertThat(countries.size()).isEqualTo(1);
        Assertions.assertThat(countries.get(0).getName()).isEqualTo("Poland");
        Assertions.assertThat(countries.get(0).getId()).isEqualTo(id);

    }
}
