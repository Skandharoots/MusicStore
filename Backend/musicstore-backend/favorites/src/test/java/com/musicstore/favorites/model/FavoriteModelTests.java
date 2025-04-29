package com.musicstore.favorites.model;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.UUID;

@SpringBootTest
public class FavoriteModelTests {

    private UUID productUuid = UUID.randomUUID();
    private UUID userId = UUID.randomUUID();
    private String productName = "Strat";
    private BigDecimal price = BigDecimal.valueOf(50L);
    private Integer quantity = 2;

    @Test
    public void favoriteConstructorTest() {

        Favorite favorite = new Favorite(productUuid, userId, productName, price, quantity);

        Assertions.assertEquals(productUuid, favorite.getProductUuid());
        Assertions.assertEquals(userId, favorite.getUserUuid());
        Assertions.assertEquals(productName, favorite.getProductName());
        Assertions.assertEquals(price, favorite.getPrice());
        Assertions.assertEquals(quantity, favorite.getQuantity());
    }

    @Test
    public void favoriteSetterTest() {

        Favorite favorite = new Favorite(productUuid, userId, productName, price, quantity);
        Assertions.assertEquals(productUuid, favorite.getProductUuid());
        Assertions.assertEquals(userId, favorite.getUserUuid());
        Assertions.assertEquals(productName, favorite.getProductName());
        Assertions.assertEquals(price, favorite.getPrice());
        Assertions.assertEquals(quantity, favorite.getQuantity());

        favorite.setProductUuid(UUID.randomUUID());
        favorite.setUserUuid(UUID.randomUUID());
        favorite.setProductName(UUID.randomUUID().toString());
        favorite.setPrice(BigDecimal.valueOf(80L));
        favorite.setQuantity(6);

        Assertions.assertNotEquals(productUuid, favorite.getProductUuid());
        Assertions.assertNotEquals(userId, favorite.getUserUuid());
        Assertions.assertNotEquals(productName, favorite.getProductName());
        Assertions.assertNotEquals(price, favorite.getPrice());
        Assertions.assertNotEquals(quantity, favorite.getQuantity());


    }

}
