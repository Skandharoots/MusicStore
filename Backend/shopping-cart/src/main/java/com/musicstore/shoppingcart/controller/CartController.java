package com.musicstore.shoppingcart.controller;

import com.musicstore.shoppingcart.dto.CartRequest;
import com.musicstore.shoppingcart.dto.CartUpdateRequest;
import com.musicstore.shoppingcart.model.Cart;
import com.musicstore.shoppingcart.service.CartService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public String createCart(@RequestBody CartRequest cartRequest) {

        return cartService.addCart(cartRequest);
    }

    @GetMapping("/get/{userUuid}")
    public ResponseEntity<List<Cart>> getAllCartsByUserUuid(
            @PathVariable(value = "userUuid") UUID userUuid
    ) {
        return cartService.findAllCartsByUserUuid(userUuid);
    }

    @PutMapping("/update/{id}")
    public String updateCart(
            @PathVariable(value = "id") Long id,
            @RequestBody CartUpdateRequest cartRequest
    ) {
        return cartService.updateCart(id, cartRequest);
    }

    @DeleteMapping("/delete/{userUuid}/{productSkuId}")
    public String deleteCartByUserUuidAndProductSgId(
            @PathVariable(value = "userUuid") UUID userUuid,
            @PathVariable(value = "productSkuId") UUID productSkuId
    ) {
        return cartService.deleteCartByUserUuidAndProductUuid(userUuid, productSkuId);
    }

    @DeleteMapping("/clear/{userUuid}")
    public String clearCartByUserUuid(
            @PathVariable(value = "userUuid") UUID userUuid
    ) {
        return cartService.cleanCartForUser(userUuid);
    }
}
