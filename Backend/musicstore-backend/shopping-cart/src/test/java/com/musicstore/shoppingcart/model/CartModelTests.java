package com.musicstore.shoppingcart.model;


import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.UUID;

@SpringBootTest
public class CartModelTests {

    @Test
    public void cartConstructorTest() {

        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);

        Cart cart = new Cart(
                userUuid,
                productSkuId,
                productPrice,
                "Stratocaster Player MX Modern C",
                2
        );

        Assertions.assertThat(cart.getUserUuid()).isEqualTo(userUuid);
        Assertions.assertThat(cart.getProductSkuId()).isEqualTo(productSkuId);
        Assertions.assertThat(cart.getProductPrice()).isEqualTo(productPrice);
        Assertions.assertThat(cart.getQuantity()).isEqualTo(2);

        Long id = 3L;

        cart.setQuantity(3);
        cart.setId(id);
        cart.setUserUuid(userUuid);
        cart.setProductSkuId(productSkuId);
        cart.setProductPrice(productPrice);
        cart.setProductName("Waba dubba");

        Assertions.assertThat(cart.getUserUuid()).isEqualTo(userUuid);
        Assertions.assertThat(cart.getProductSkuId()).isEqualTo(productSkuId);
        Assertions.assertThat(cart.getProductPrice()).isEqualTo(productPrice);
        Assertions.assertThat(cart.getQuantity()).isEqualTo(3);
        Assertions.assertThat(cart.getId()).isEqualTo(id);

    }

    @Test
    public void cartConstructorTest2() {
        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);
        Long id = 1L;
        Cart cart = new Cart(
                id,
                userUuid,
                productSkuId,
                productPrice,
                "sd",
                2
        );

        Assertions.assertThat(cart).isNotNull();
        Assertions.assertThat(cart.getUserUuid()).isEqualTo(userUuid);
        Assertions.assertThat(cart.getProductSkuId()).isEqualTo(productSkuId);
        Assertions.assertThat(cart.getProductPrice()).isEqualTo(productPrice);
        Assertions.assertThat(cart.getQuantity()).isEqualTo(2);
        Assertions.assertThat(cart.getId()).isEqualTo(id);

        Long id2 = 3L;

        cart.setQuantity(3);
        cart.setId(id2);
        cart.setUserUuid(userUuid);
        cart.setProductSkuId(productSkuId);
        cart.setProductPrice(productPrice);
        cart.setProductName("Waba dubba");

        Assertions.assertThat(cart.getUserUuid()).isEqualTo(userUuid);
        Assertions.assertThat(cart.getProductSkuId()).isEqualTo(productSkuId);
        Assertions.assertThat(cart.getProductPrice()).isEqualTo(productPrice);
        Assertions.assertThat(cart.getQuantity()).isEqualTo(3);
        Assertions.assertThat(cart.getId()).isEqualTo(id2);
        Assertions.assertThat(cart.getProductName()).isEqualTo("Waba dubba");
    }

    @Test
    public void cartToStringTest() {
        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);

        Cart cart = new Cart(
                userUuid,
                productSkuId,
                productPrice,
                "Stratocaster Player MX Modern C",
                2
        );

        Assertions.assertThat(cart.toString()).isNotNull();
    }
}
