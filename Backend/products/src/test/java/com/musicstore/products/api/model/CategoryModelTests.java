package com.musicstore.products.api.model;

import com.musicstore.products.model.Category;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class CategoryModelTests {

    @Test
    public void categoryModelTest() {
        Long id = 1L;

        Category category = new Category("Drums");

        category.setId(id);
        Assertions.assertThat(category.getId()).isEqualTo(id);
        Assertions.assertThat(category.getName()).isEqualTo("Drums");

        category.setName("Guitar");
        Assertions.assertThat(category.getName()).isEqualTo("Guitar");
    }
}
