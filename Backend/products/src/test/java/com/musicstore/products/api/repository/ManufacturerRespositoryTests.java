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
    private EntityManager entityManager;

    @Test
    public void createManufacturer() {

        Manufacturer manufacturer = new Manufacturer("Gretsch");
        Manufacturer savedManufacturer = manufacturerRepository.save(manufacturer);

        Assertions.assertThat(savedManufacturer).isNotNull();
        Assertions.assertThat(savedManufacturer.getName()).isEqualTo("Gretsch");
        Assertions.assertThat(savedManufacturer.getId()).isEqualTo(1L);
    }

    @Test
    public void findManufacturerById() {

        Manufacturer manufacturer = new Manufacturer("Gretsch");
        entityManager.persist(manufacturer);
        entityManager.flush();

        Optional<Manufacturer> foundManufacturer = manufacturerRepository.findById(1L);
        Assertions.assertThat(foundManufacturer).isPresent();
        Assertions.assertThat(foundManufacturer.get().getName()).isEqualTo("Gretsch");
        Assertions.assertThat(foundManufacturer.get().getId()).isEqualTo(1L);
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
    }

    @Test
    public void findAllManufacturersBySearchParameters() {
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

        List<Manufacturer> foundManufacturers = manufacturerRepository.findAllBySearchParameters(1L, "Poland");
        Assertions.assertThat(foundManufacturers).isNotEmpty();
        Assertions.assertThat(foundManufacturers.get(0).getName()).isEqualTo("Fender");
        Assertions.assertThat(foundManufacturers.get(0).getId()).isEqualTo(id);
    }
}
