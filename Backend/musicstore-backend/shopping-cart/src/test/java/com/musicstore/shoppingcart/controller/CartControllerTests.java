package com.musicstore.shoppingcart.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.shoppingcart.dto.CartRequest;
import com.musicstore.shoppingcart.dto.CartUpdateRequest;
import com.musicstore.shoppingcart.model.Cart;
import com.musicstore.shoppingcart.service.CartService;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = CartController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@RunWith(SpringRunner.class)
public class CartControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CartService cartService;

    @Test
    public void createCartTest() throws Exception {

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

        ResultActions resultActions = mockMvc.perform(post("/api/cart/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cartRequest))
        );
        resultActions.andExpect(
                MockMvcResultMatchers.status().isCreated()
        );
    }

    @Test
    public void getAllCartsByUserUuidTest() throws Exception {

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

        List<Cart> carts = new ArrayList<>();
        carts.add(cart);
        carts.add(cart2);

        when(cartService.findAllCartsByUserUuid(userUuid)).thenReturn(ResponseEntity.ok(carts));

        ResultActions resultActions = mockMvc.perform(
                get("/api/cart/get/{uuid}", userUuid)
        );

        resultActions
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.content().json(objectMapper.writeValueAsString(carts)));
    }

    @Test
    public void updateCartTest() throws Exception {
        Long id = 1L;

        CartUpdateRequest cartUpdateRequest =
                CartUpdateRequest.builder()
                        .quantity(4)
                        .build();

        when(cartService.updateCart(id, cartUpdateRequest)).thenReturn("Cart item updated successfully");

        ResultActions resultActions = mockMvc.perform(put("/api/cart/update/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cartUpdateRequest)
                )
        );

        resultActions
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=UTF-8"));

    }

    @Test
    public void deleteCartByUserUuidAndProductSkuIdTest() throws Exception {
        UUID userUuid = UUID.randomUUID();
        UUID productSkuId = UUID.randomUUID();

        when(cartService.deleteCartByUserUuidAndProductUuid(userUuid, productSkuId)).thenReturn("Cart item deleted successfully");
        ResultActions resultActions = mockMvc.perform(delete("/api/cart/delete/{uuid}/{productSkuId}", userUuid, productSkuId));

        resultActions
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=UTF-8"));
    }

    @Test
    public void clearCartByUserUuid() throws Exception {
        UUID userUuid = UUID.randomUUID();

        when(cartService.cleanCartForUser(userUuid)).thenReturn("Cart item deleted successfully");
        ResultActions resultActions = mockMvc.perform(delete("/api/cart/clear/{userUuid}", userUuid));

        resultActions
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=UTF-8"));
    }
}
