package com.musicstore.products.api.repository;

import com.musicstore.products.model.*;
import com.musicstore.products.repository.SubcategoryTierTwoRepository;
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
public class SubcategoryTierTwoRepositoryTests {

    @Autowired
    private SubcategoryTierTwoRepository subcategoryTierTwoRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void createTest() {

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Acoustic");

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setName("E-acoustic");
        subcategoryTierTwo.setSubcategory(subcategory);

        SubcategoryTierTwo s2 = subcategoryTierTwoRepository.save(subcategoryTierTwo);

        Assertions.assertThat(s2.getSubcategory().getId()).isEqualTo(subcategory.getId());
        Assertions.assertThat(s2.getSubcategory().getName()).isEqualTo("Acoustic");
        Assertions.assertThat(s2.getId()).isEqualTo(subcategoryTierTwo.getId());
        Assertions.assertThat(s2.getName()).isEqualTo("E-acoustic");
    }

    @Test
    public void findAllTest() {

        Category category = new Category();
        category.setName("Guitars");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Acoustic");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setName("E-acoustic");
        subcategoryTierTwo.setSubcategory(subcategory);
        entityManager.persist(subcategoryTierTwo);

        List<SubcategoryTierTwo> subcats = subcategoryTierTwoRepository.findAll();
        Assertions.assertThat(subcats.size()).isEqualTo(1);
        Assertions.assertThat(subcats.get(0).getId()).isEqualTo(subcategoryTierTwo.getId());
        Assertions.assertThat(subcats.get(0).getName()).isEqualTo("E-acoustic");
        Assertions.assertThat(subcats.get(0).getSubcategory().getId()).isEqualTo(subcategory.getId());
        Assertions.assertThat(subcats.get(0).getSubcategory().getName()).isEqualTo("Acoustic");

    }

    @Test
    public void findAllBySubcategoryTest() {

        Category category = new Category();
        category.setName("Guitars");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Acoustic");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setName("E-acoustic");
        subcategoryTierTwo.setSubcategory(subcategory);
        entityManager.persist(subcategoryTierTwo);

        List<SubcategoryTierTwo> subcats = subcategoryTierTwoRepository.findAllBySubcategory_Id(subcategory.getId());
        Assertions.assertThat(subcats.size()).isEqualTo(1);
        Assertions.assertThat(subcats.get(0).getId()).isEqualTo(subcategoryTierTwo.getId());
        Assertions.assertThat(subcats.get(0).getName()).isEqualTo("E-acoustic");
        Assertions.assertThat(subcats.get(0).getSubcategory().getId()).isEqualTo(subcategory.getId());
        Assertions.assertThat(subcats.get(0).getSubcategory().getName()).isEqualTo("Acoustic");

    }

    @Test
    public void findByIdTest() {

        Category category = new Category();
        category.setName("Guitars");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Acoustic");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setName("E-acoustic");
        subcategoryTierTwo.setSubcategory(subcategory);
        entityManager.persist(subcategoryTierTwo);

        Optional<SubcategoryTierTwo> subcat = subcategoryTierTwoRepository.findById(subcategoryTierTwo.getId());
        Assertions.assertThat(subcat.isPresent()).isTrue();
        Assertions.assertThat(subcat.get().getId()).isEqualTo(subcategoryTierTwo.getId());
        Assertions.assertThat(subcat.get().getName()).isEqualTo(subcategoryTierTwo.getName());
        Assertions.assertThat(subcat.get().getSubcategory().getId()).isEqualTo(subcategory.getId());

    }

    @Test
    public void findAllBySearchParameters() {

        Category category = new Category();
        category.setName("Guitars");
        entityManager.persist(category);

        Subcategory subcategory = new Subcategory();
        subcategory.setName("Acoustic");
        subcategory.setCategory(category);
        entityManager.persist(subcategory);

        Manufacturer manufacturer = new Manufacturer("Fender");
        entityManager.persist(manufacturer);

        Country country = new Country("USA");
        entityManager.persist(country);

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setName("E-acoustic");
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

        List<SubcategoryTierTwo> subcats = subcategoryTierTwoRepository.findAllBySearchParameters(
                category.getId(),
                "USA",
                "Acoustic",
                "Fender"
        );

        Assertions.assertThat(subcats.size()).isEqualTo(1);
        Assertions.assertThat(subcats.get(0).getId()).isEqualTo(subcategoryTierTwo.getId());
        Assertions.assertThat(subcats.get(0).getName()).isEqualTo(subcategoryTierTwo.getName());
    }

    
}
