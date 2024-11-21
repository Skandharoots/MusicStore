package com.musicstore.shoppingcart.controller;

import com.musicstore.shoppingcart.dto.CartRequest;
import com.musicstore.shoppingcart.dto.CartUpdateRequest;
import com.musicstore.shoppingcart.model.Cart;
import com.musicstore.shoppingcart.service.CartService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public String createCart(@Valid @RequestBody CartRequest cartRequest) {

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
            @Valid @RequestBody CartUpdateRequest cartRequest
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

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }

}
