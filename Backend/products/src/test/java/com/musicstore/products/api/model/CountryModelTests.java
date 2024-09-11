package com.musicstore.products.api.model;

import com.musicstore.products.model.Country;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class CountryModelTests {

    @Test
    public void countryModelTest() {

        Long id = 1L;

        Country country = new Country("Slovenia");
        country.setId(id);

        Assertions.assertThat(country.getId()).isEqualTo(id);
        Assertions.assertThat(country.getName()).isEqualTo("Slovenia");

        country.setName("Poland");
        Assertions.assertThat(country.getName()).isEqualTo("Poland");
    }
}
