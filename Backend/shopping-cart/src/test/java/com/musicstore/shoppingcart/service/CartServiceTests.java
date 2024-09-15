package com.musicstore.shoppingcart.service;

import com.musicstore.shoppingcart.dto.CartRequest;
import com.musicstore.shoppingcart.dto.CartUpdateRequest;
import com.musicstore.shoppingcart.model.Cart;
import com.musicstore.shoppingcart.repository.CartRepository;
import jakarta.ws.rs.NotFoundException;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CartServiceTests {

    @Mock
    private CartRepository cartRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    public void addCartTest() {

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

        CartRequest cartRequest = CartRequest.builder()
                .userUuid(userUuid)
                .productSkuId(productSkuId)
                .productPrice(productPrice)
                .productName("Stratocaster Player MX Modern C")
                .quantity(2)
                .build();

        when(cartRepository.save(Mockito.any(Cart.class))).thenReturn(cart);
        String response = cartService.addCart(cartRequest);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isEqualTo("Cart item added successfully");

    }

    @Test
    public void addCartThatExistsTest() {

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

        Cart cart2 = new Cart(
                userUuid,
                productSkuId,
                productPrice,
                "Stratocaster Player MX Modern C",
                6
        );

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
                .quantity(4)
                .build();

        when(cartRepository.save(Mockito.any(Cart.class))).thenReturn(cart);
        String response = cartService.addCart(cartRequest);

        when(cartRepository.findCartByUserUuidAndProductSkuId(userUuid, productSkuId)).thenReturn(Optional.of(cart));
        when(cartRepository.save(Mockito.any(Cart.class))).thenReturn(cart2);
        String response2 = cartService.addCart(cartRequest2);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isEqualTo("Cart item added successfully");


    }

    @Test
    public void findCartByIdSuccessTest() {

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

        CartRequest cartRequest = CartRequest.builder()
                .userUuid(userUuid)
                .productSkuId(productSkuId)
                .productPrice(productPrice)
                .productName("Stratocaster Player MX Modern C")
                .quantity(2)
                .build();

        when(cartRepository.save(Mockito.any(Cart.class))).thenReturn(cart);
        cartService.addCart(cartRequest);

        when(cartRepository.findCartById(cart.getId())).thenReturn(Optional.of(cart));
        Cart cartFound = cartService.findById(cart.getId());
        Assertions.assertThat(cartFound).isNotNull();
        Assertions.assertThat(cartFound.getUserUuid()).isEqualTo(userUuid);
        Assertions.assertThat(cartFound.getProductSkuId()).isEqualTo(productSkuId);
        Assertions.assertThat(cartFound.getProductPrice()).isEqualTo(productPrice);
        Assertions.assertThat(cartFound.getQuantity()).isEqualTo(2);

    }

    @Test
    public void findCartByIdFailTest() {

        when(cartRepository.findCartById(Mockito.anyLong())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> cartService.findById(Mockito.anyLong()));

    }

    @Test
    public void findAllCartsByUserUuidTest() {

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

        when(cartRepository.findAllByUserUuid(userUuid)).thenReturn(cartList);
        ResponseEntity<List<Cart>> resultList = cartService.findAllCartsByUserUuid(userUuid);
        Assertions.assertThat(resultList).isNotNull();
        Assertions.assertThat(resultList.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(resultList.getBody()).isNotNull();
        Assertions.assertThat(resultList.getBody().size()).isEqualTo(2);

    }

    @Test
    public void updateCartSuccessTest() {

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

        Cart cart2 = new Cart(
                userUuid,
                productSkuId,
                productPrice,
                "Stratocaster Player MX Modern C",
                56
        );

        CartRequest cartRequest = CartRequest.builder()
                .userUuid(userUuid)
                .productSkuId(productSkuId)
                .productPrice(productPrice)
                .productName("Stratocaster Player MX Modern C")
                .quantity(2)
                .build();

        CartUpdateRequest cartUpdateRequest = CartUpdateRequest.builder()
                .quantity(56)
                .build();

        when(cartRepository.save(Mockito.any(Cart.class))).thenReturn(cart);
        cartService.addCart(cartRequest);

        when(cartRepository.findCartById(cart.getId())).thenReturn(Optional.of(cart));
        when(cartRepository.save(Mockito.any(Cart.class))).thenReturn(cart2);

        cartService.updateCart(cart.getId(), cartUpdateRequest);
        Assertions.assertThat(cartService.findById(cart.getId())).isNotNull();
        Assertions.assertThat(cartService.findById(cart.getId()).getUserUuid()).isEqualTo(userUuid);
        Assertions.assertThat(cartService.findById(cart.getId()).getProductSkuId()).isEqualTo(productSkuId);
        Assertions.assertThat(cartService.findById(cart.getId()).getProductPrice()).isEqualTo(productPrice);
        Assertions.assertThat(cartService.findById(cart.getId()).getQuantity()).isEqualTo(56);

    }

    @Test
    public void updateCartFailTest() {

        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);

        Cart cart = new Cart(
                userUuid,
                productSkuId,
                productPrice,
                "Stratocaster Player MX Modern C",
                56
        );

        CartUpdateRequest cartUpdateRequest = CartUpdateRequest.builder()
                .quantity(56)
                .build();

        Long id = 45L;

        when(cartRepository.findCartById(id)).thenThrow(NotFoundException.class);

        Assertions.assertThatExceptionOfType(NotFoundException.class).isThrownBy(() -> cartService.findById(id));
        Assertions.assertThatExceptionOfType(NotFoundException.class).isThrownBy(() -> cartService.updateCart(id, cartUpdateRequest));

    }

    @Test
    public void deleteCartByUserUuidAndProductSkuIdTest() {

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

        CartRequest cartRequest = CartRequest.builder()
                .userUuid(userUuid)
                .productSkuId(productSkuId)
                .productPrice(productPrice)
                .productName("Stratocaster Player MX Modern C")
                .quantity(2)
                .build();



        when(cartRepository.save(Mockito.any(Cart.class))).thenReturn(cart);
        cartService.addCart(cartRequest);

        when(cartRepository.findCartByUserUuidAndProductSkuId(userUuid, productSkuId)).thenReturn(Optional.of(cart));

        String successMsg = cartService.deleteCartByUserUuidAndProductUuid(userUuid, productSkuId);
        Assertions.assertThat(successMsg).isNotNull();
        Assertions.assertThat(successMsg).isEqualTo("Cart item deleted successfully");

    }

    @Test
    public void deleteCartByUserUuidAndProductSkuIdNotFoundTest() {

        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        when(cartRepository.findCartByUserUuidAndProductSkuId(userUuid, productSkuId)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> cartService.deleteCartByUserUuidAndProductUuid(userUuid, productSkuId));


    }

    @Test
    public void cleanCartForUserTest() {

        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();
        UUID productSkuId2 = UUID.randomUUID();
        BigDecimal productPrice = BigDecimal.valueOf(269.99);
        BigDecimal productPrice2 = BigDecimal.valueOf(579.99);


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
                "Stratocaster Player MX Modern C",
                56
        );

        CartRequest cartRequest = CartRequest.builder()
                .userUuid(userUuid)
                .productSkuId(productSkuId)
                .productPrice(productPrice)
                .productName("Stratocaster Player MX Modern C")
                .quantity(2)
                .build();

        CartRequest cartRequest2 = CartRequest.builder()
                .userUuid(userUuid)
                .productSkuId(productSkuId2)
                .productPrice(productPrice2)
                .productName("Stratocaster Player MX Modern C")
                .quantity(56)
                .build();

        when(cartRepository.save(Mockito.any(Cart.class))).thenReturn(cart);
        cartService.addCart(cartRequest);
        when(cartRepository.save(Mockito.any(Cart.class))).thenReturn(cart2);
        cartService.addCart(cartRequest2);

        List<Cart> cartList = new ArrayList<>();

        cartService.cleanCartForUser(userUuid);

        when(cartRepository.findAllByUserUuid(userUuid)).thenReturn(cartList);
        ResponseEntity<List<Cart>> resultList = cartService.findAllCartsByUserUuid(userUuid);
        Assertions.assertThat(resultList).isNotNull();
        Assertions.assertThat(resultList.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(resultList.getBody()).isEmpty();

    }

}
