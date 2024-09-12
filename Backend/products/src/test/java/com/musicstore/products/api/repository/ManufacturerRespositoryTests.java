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

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class ManufacturerRespositoryTests {

    @Autowired
    private ManufacturerRepository manufacturerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    public void createManufacturer() {

        Manufacturer manufacturer = new Manufacturer("Gretsch");
        Manufacturer savedManufacturer = manufacturerRepository.save(manufacturer);

        Assertions.assertThat(savedManufacturer).isNotNull();
        Assertions.assertThat(savedManufacturer.getName()).isEqualTo("Gretsch");
    }

    @Test
    public void findManufacturerById() {

        Manufacturer manufacturer = new Manufacturer("Gretsch");
        entityManager.persist(manufacturer);
        entityManager.flush();

        Optional<Manufacturer> foundManufacturer = manufacturerRepository.findById(manufacturer.getId());
        Assertions.assertThat(foundManufacturer).isPresent();
        Assertions.assertThat(foundManufacturer.get().getName()).isEqualTo("Gretsch");

        entityManager.clear();

    }

    @Test
    public void findAllManufacturers() {
        Manufacturer manufacturer = new Manufacturer("Gretsch");
        Manufacturer manufacturer1 = new Manufacturer("Fender");
        entityManager.persist(manufacturer);
        entityManager.persist(manufacturer1);
        entityManager.flush();

        List<Manufacturer> manufacturers = manufacturerRepository.findAll();
        Assertions.assertThat(manufacturers).isNotEmpty();
        Assertions.assertThat(manufacturers.get(1).getName()).isEqualTo("Fender");
        Assertions.assertThat(manufacturers.get(0).getName()).isEqualTo("Gretsch");

        entityManager.clear();

    }

    @Test
    public void findAllManufacturersBySearchParameters() {
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

        Product product = new Product(
                "Stratocaster Player MX",
                "Something about this guitar",
                price,
                57,
                manufacturer,
                country,
                category,
                subcategory
        );
        productRepository.save(product);
        entityManager.flush();

        List<Manufacturer> foundManufacturers = manufacturerRepository.findAllBySearchParameters(category.getId(), "Poland", "Electric");
        Assertions.assertThat(foundManufacturers).isNotEmpty();
        Assertions.assertThat(foundManufacturers.get(0).getName()).isEqualTo("Fender");

    }
}
