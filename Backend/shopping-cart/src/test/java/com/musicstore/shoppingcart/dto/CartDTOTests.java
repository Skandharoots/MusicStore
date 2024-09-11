package com.musicstore.shoppingcart.dto;

import com.musicstore.shoppingcart.model.Cart;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@SpringBootTest
public class CartDTOTests {

    @Test
    public void cartRequestTest() {

        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);

        CartRequest cartRequest = CartRequest.builder()
                .userUuid(userUuid)
                .productSkuId(productSkuId)
                .productPrice(productPrice)
                .productName("Stratocaster Player MX Modern C")
                .quantity(2)
                .build();

        CartRequest cartRequest2 = CartRequest.builder()
                .userUuid(userUuid)
                .productSkuId(productSkuId)
                .productPrice(productPrice)
                .productName("Stratocaster Player MX Modern C")
                .quantity(2)
                .build();

        CartRequest cartRequest3 = CartRequest.builder()
                .userUuid(userUuid)
                .productSkuId(productSkuId)
                .productPrice(productPrice)
                .productName("Stratocaster Player MX Modern C")
                .quantity(56)
                .build();

        Assertions.assertThat(cartRequest).isNotNull();
        Assertions.assertThat(cartRequest.getUserUuid()).isEqualTo(userUuid);
        Assertions.assertThat(cartRequest.getProductSkuId()).isEqualTo(productSkuId);
        Assertions.assertThat(cartRequest.getProductPrice()).isEqualTo(productPrice);
        Assertions.assertThat(cartRequest.getProductName()).isEqualTo("Stratocaster Player MX Modern C");
        Assertions.assertThat(cartRequest.getQuantity()).isEqualTo(2);
        Assertions.assertThat(cartRequest.equals(cartRequest2)).isTrue();
        Assertions.assertThat(cartRequest.equals(cartRequest3)).isFalse();

    }

    @Test
    public void cartUpdateRequestTest() {

        CartUpdateRequest cartUpdateRequest = CartUpdateRequest.builder()
                .quantity(23)
                .build();

        CartUpdateRequest cartUpdateRequest2 = CartUpdateRequest.builder()
                .quantity(23)
                .build();

        CartUpdateRequest cartUpdateRequest3 = CartUpdateRequest.builder()
                .quantity(2)
                .build();

        Assertions.assertThat(cartUpdateRequest).isNotNull();
        Assertions.assertThat(cartUpdateRequest.getQuantity()).isEqualTo(23);
        Assertions.assertThat(cartUpdateRequest.toString()).isNotNull();
        Assertions.assertThat(cartUpdateRequest.equals(cartUpdateRequest2)).isTrue();
        Assertions.assertThat(cartUpdateRequest.equals(cartUpdateRequest3)).isFalse();
    }

    @Test
    public void cartListResponseTest() {

        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        UUID productSkuId2 = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);
        BigDecimal productPrice2 = BigDecimal.valueOf(449.99);

        Cart cart = new Cart(
                userUuid,
                productSkuId,
                productPrice,
                "Stratocaster Player MX Modern C",
                2
        );

        Cart cart2 = new Cart(
                userUuid,
                productSkuId2,
                productPrice2,
                "Telecaster Player MX",
                4
        );

        List<Cart> cartList = new ArrayList<>();
        cartList.add(cart);
        cartList.add(cart2);

        List<Cart> carts2 = new ArrayList<>();

        CartListResponse cartListResponse = CartListResponse
                .builder()
                        .carts(cartList)
                                .build();

        CartListResponse cartListResponse2 = CartListResponse
                .builder()
                .carts(cartList)
                .build();

        CartListResponse cartListResponse3 = CartListResponse
                .builder()
                .carts(carts2)
                .build();

        Assertions.assertThat(cartListResponse).isNotNull();
        Assertions.assertThat(cartListResponse.toString()).isNotNull();
        Assertions.assertThat(cartListResponse.getCarts()).hasSize(2);
        Assertions.assertThat(cartListResponse.getCarts().get(0).getProductSkuId()).isEqualTo(productSkuId);
        Assertions.assertThat(cartListResponse.getCarts().get(0).getProductPrice()).isEqualTo(productPrice);
        Assertions.assertThat(cartListResponse.getCarts().get(1).getProductSkuId()).isEqualTo(productSkuId2);
        Assertions.assertThat(cartListResponse.getCarts().get(1).getProductPrice()).isEqualTo(productPrice2);
        Assertions.assertThat(cartListResponse.equals(cartListResponse2)).isTrue();
        Assertions.assertThat(cartListResponse.equals(cartListResponse3)).isFalse();
    }
}
