package com.musicstore.shoppingcart.service;

import com.musicstore.shoppingcart.dto.CartRequest;
import com.musicstore.shoppingcart.dto.CartUpdateRequest;
import com.musicstore.shoppingcart.model.Cart;
import com.musicstore.shoppingcart.repository.CartRepository;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;

    public Cart findById(Long id) throws NotFoundException {

        return cartRepository.findCartById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found")
        );

    }

    public ResponseEntity<List<Cart>> findAllCartsByUserUuid(UUID userUuid) {
        List<Cart> carts = cartRepository.findAllByUserUuid(userUuid);
        return ResponseEntity.ok(carts);
    }

    public String addCart(CartRequest cartRequest) {

        if (
                cartRequest.getUserUuid() == null
                || cartRequest.getUserUuid().toString().isEmpty()
                || cartRequest.getQuantity() == null
                        || cartRequest.getQuantity() <= 0
                || cartRequest.getProductSkuId() == null
                        || cartRequest.getProductSkuId().toString().isEmpty()
                || cartRequest.getProductName() == null
                        || cartRequest.getProductName().isEmpty()
                || cartRequest.getProductPrice() == null
                        || cartRequest.getProductPrice().toString().isEmpty()) {
            log.error("Cart creation bad request.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cart request cannot have empty data");
        }

        Optional<Cart> foundCart = cartRepository
                .findCartByUserUuidAndProductSkuId(
                        cartRequest.getUserUuid(),
                        cartRequest.getProductSkuId()
                );

        if (foundCart.isPresent()) {
            Cart cart = foundCart.get();
            Integer oldQuantity = cart.getQuantity();
            cart.setQuantity(oldQuantity + 1);
            cartRepository.save(cart);
        } else {
            Cart newCart = new Cart(
                    cartRequest.getUserUuid(),
                    cartRequest.getProductSkuId(),
                    cartRequest.getProductPrice(),
                    cartRequest.getProductName(),
                    cartRequest.getQuantity()
            );
            cartRepository.save(newCart);

        }
        log.info("New cart created.");
        return "Cart item added successfully";
    }

    public String updateCart(Long id, CartUpdateRequest cartUpdateRequest) {

        Cart cart = findById(id);

        cart.setQuantity(cartUpdateRequest.getQuantity());
        cartRepository.save(cart);
        log.info("Cart updated.");
        return "Cart item updated successfully";
    }

    public String deleteCartByUserUuidAndProductUuid(UUID userUuid, UUID productSkuId) {

        Cart cart = cartRepository.findCartByUserUuidAndProductSkuId(
                userUuid, productSkuId)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Cart not found")
                );

        cartRepository.delete(cart);
        log.info("Cart for user id \"" + userUuid + "\" and product id \""
                + productSkuId + "\" deleted.");
        return "Cart item deleted successfully";
    }

    public String cleanCartForUser(UUID userUuid) {

        cartRepository.deleteAllByUserUuid(userUuid);
        log.info("All carts for user id \"" + userUuid
                + "\" deleted.");
        return "Cart cleaned successfully";
    }





}
