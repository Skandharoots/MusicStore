package com.musicstore.products.api.repository;

import com.musicstore.products.model.Category;
import com.musicstore.products.repository.CategoryRepository;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class CategoryRepositoryTests {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void createCategoryTest() {

        Category category = new Category("Microphones");
        Category savedCategory = categoryRepository.save(category);
        Assertions.assertThat(savedCategory).isNotNull();
        Assertions.assertThat(savedCategory.getName()).isEqualTo("Microphones");
        Assertions.assertThat(savedCategory.getId()).isEqualTo(1L);

    }

    @Test
    public void findCategoryByIdTest() {

        Category category = new Category("Microphones");
        entityManager.persist(category);
        entityManager.flush();

        Optional<Category> foundCategory = categoryRepository.findById(1L);
        Assertions.assertThat(foundCategory.isPresent()).isTrue();
        Assertions.assertThat(foundCategory.get().getName()).isEqualTo("Microphones");

    }

    @Test
    public void findAllCategoriesTest() {
        Category category = new Category("Microphones");
        Category category2 = new Category("Fender");
        entityManager.persist(category);
        entityManager.persist(category2);
        entityManager.flush();

        List<Category> categories = categoryRepository.findAll();
        Assertions.assertThat(categories).isNotNull();
        Assertions.assertThat(categories.size()).isEqualTo(2);
        Assertions.assertThat(categories.get(0).getName()).isEqualTo("Microphones");
        Assertions.assertThat(categories.get(1).getName()).isEqualTo("Fender");

    }

}
