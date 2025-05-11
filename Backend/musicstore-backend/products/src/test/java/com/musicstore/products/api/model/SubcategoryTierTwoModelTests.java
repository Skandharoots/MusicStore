package com.musicstore.products.api.model;

import com.musicstore.products.model.Subcategory;
import com.musicstore.products.model.SubcategoryTierTwo;
import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class SubcategoryTierTwoModelTests {

    @Test
    public void testSubcategoryTierTwoModel() {

        Subcategory subcategory = new Subcategory();
        subcategory.setId(1L);
        subcategory.setName("Subcategory");

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setId(1L);
        subcategoryTierTwo.setName("SubcategoryTierTwo");
        subcategoryTierTwo.setSubcategory(subcategory);

        Assertions.assertEquals(1L, subcategoryTierTwo.getId());
        Assertions.assertEquals("SubcategoryTierTwo", subcategoryTierTwo.getName());
        Assertions.assertEquals(subcategory, subcategoryTierTwo.getSubcategory());



    }

}
