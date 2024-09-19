package com.musicstore.products.api.model;

import com.musicstore.products.model.Category;
import com.musicstore.products.model.Subcategory;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

@SpringBootTest
public class SubcategoryModelTests {

    @Test
    public void subcategoryModelTest() {


        Category category = new Category();
        category.setId(1L);
        category.setName("Test Category");

        Subcategory subcategory = new Subcategory(
                "Electric"
        );
        subcategory.setId(1L);
        subcategory.setCategory(category);

        Assertions.assertThat(subcategory.getId()).isEqualTo(1L);
        Assertions.assertThat(subcategory.getName()).isEqualTo("Electric");
        Assertions.assertThat(subcategory.getCategory()).isEqualTo(category);

    }
}
