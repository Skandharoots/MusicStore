package com.musicstore.products.api.model;

import com.musicstore.products.model.Manufacturer;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ManufacturerModelTests {

    @Test
    public void manufacturerModelTest() {

        Long id = 1L;

        Manufacturer manufacturer = new Manufacturer("Fender");
        manufacturer.setId(id);

        Assertions.assertThat(manufacturer.getId()).isEqualTo(id);
        Assertions.assertThat(manufacturer.getName()).isEqualTo("Fender");

        manufacturer.setName("Gibson");
        Assertions.assertThat(manufacturer.getName()).isEqualTo("Gibson");
    }
}
