package com.musicstore.products.api.repository;

import com.musicstore.products.model.*;
import com.musicstore.products.repository.SubcategoryRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class SubcategoryRepositoryTests {

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void SubcategoryCreateTest() {

        Category category = new Category("Guitar");

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Subcategory");
        subcategory.setCategory(category);
        Subcategory savedSubcategory = subcategoryRepository.save(subcategory);

        Assertions.assertThat(savedSubcategory.getName()).isEqualTo("Subcategory");
        Assertions.assertThat(savedSubcategory.getCategory()).isEqualTo(category);
        Assertions.assertThat(savedSubcategory.getCategory().getName()).isEqualTo("Guitar");

    }

    @Test
    public void findAllTest() {
        Category category = new Category("Guitar");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Subcategory");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        List<Subcategory> subcats = subcategoryRepository.findAll();
        Assertions.assertThat(subcats).hasSize(1);
        Assertions.assertThat(subcats.get(0).getName()).isEqualTo("Subcategory");
        Assertions.assertThat(subcats.get(0).getCategory()).isEqualTo(category);
        Assertions.assertThat(subcats.get(0).getCategory().getName()).isEqualTo("Guitar");
    }

    @Test
    public void findAllByCategoryIdTest() {

        Category category = new Category("Guitar");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Subcategory");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        List<Subcategory> subcats = subcategoryRepository.findAllByCategory_Id(category.getId());
        Assertions.assertThat(subcats).hasSize(1);
        Assertions.assertThat(subcats.get(0).getName()).isEqualTo("Subcategory");
        Assertions.assertThat(subcats.get(0).getCategory()).isEqualTo(category);
        Assertions.assertThat(subcats.get(0).getCategory().getName()).isEqualTo("Guitar");

    }

    @Test
    public void findByIdTest() {

        Category category = new Category("Guitar");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Subcategory");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        Optional<Subcategory> subcategoryOptional = subcategoryRepository.findById(subcategory.getId());
        Assertions.assertThat(subcategoryOptional.isPresent()).isTrue();
        Assertions.assertThat(subcategoryOptional.get().getName()).isEqualTo("Subcategory");
        Assertions.assertThat(subcategoryOptional.get().getCategory()).isEqualTo(category);
        Assertions.assertThat(subcategoryOptional.get().getCategory().getName()).isEqualTo("Guitar");

    }

    @Test
    public void findAllBySearchParametersTest() {

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

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setName("SubcategoryTierTwo");
        subcategoryTierTwo.setSubcategory(subcategory);
        entityManager.persist(subcategoryTierTwo);

        BigDecimal price = new BigDecimal(2669.99);
        Product product = new Product(
                "Stratocaster",
                "Desc",
                price,
                23,
                manufacturer,
                country,
                category,
                subcategory,
                subcategoryTierTwo
        );
        entityManager.persist(product);

        List<Subcategory> subcats = subcategoryRepository.findAllBySearchParameters(category.getId(), "USA", "Fender", "SubcategoryTierTwo");
        Assertions.assertThat(subcats).hasSize(1);
        Assertions.assertThat(subcats.get(0).getName()).isEqualTo("Subcategory");
        Assertions.assertThat(subcats.get(0).getCategory()).isEqualTo(category);
        Assertions.assertThat(subcats.get(0).getCategory().getName()).isEqualTo("Guitar");

    }
}
