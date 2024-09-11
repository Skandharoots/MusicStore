package com.musicstore.shoppingcart;

import com.musicstore.shoppingcart.controller.CartController;
import com.musicstore.shoppingcart.service.CartService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertNotNull;

@SpringBootTest
@RunWith(SpringRunner.class)
class ShoppingCartApplicationTests {

    @Mock
    private CartService cartService;

    @InjectMocks
    private CartController cartController;

    @Test
    void contextLoads() {
        assertNotNull("foo");
    }

}
