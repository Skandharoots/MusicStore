package com.musicstore.shoppingcart.service;

import com.musicstore.shoppingcart.dto.CartRequest;
import com.musicstore.shoppingcart.dto.CartUpdateRequest;
import com.musicstore.shoppingcart.model.Cart;
import com.musicstore.shoppingcart.repository.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    private final WebClient.Builder webClient;

    private Optional<Cart> findById(Long id) {

        Optional<Cart> cart = cartRepository.findCartById(id);
        if (!cart.isPresent()) {
            throw new RuntimeException("Cart not found");
        }
        return cart;
    }

    public ResponseEntity<List<Cart>> findAllCartsByUserUuid(UUID userUuid) {
        List<Cart> carts = cartRepository.findAllByUserUuid(userUuid);
        return ResponseEntity.ok(carts);
    }

    public String addCart(CartRequest cartRequest) {

        Optional<Cart> foundCart = cartRepository
                .findCartByUserUuidAndProductSgid(
                        cartRequest.getUserUuid(),
                        cartRequest.getProductSgid()
                );

        if (foundCart.isPresent()) {
            Cart cart = foundCart.get();
            Integer oldQuantity = cart.getQuantity();
            cart.setQuantity(oldQuantity + 1);
            cartRepository.save(cart);
        } else {
            Cart newCart = new Cart(
                    cartRequest.getUserUuid(),
                    cartRequest.getProductSgid(),
                    cartRequest.getProductName(),
                    cartRequest.getQuantity()
            );
            cartRepository.save(newCart);

        }

        return "Cart item added successfully";
    }

    public String updateCart(Long id, CartUpdateRequest cartUpdateRequest) {

        Optional<Cart> cart = findById(id);

        cart.get().setQuantity(cartUpdateRequest.getQuantity());
        cartRepository.save(cart.get());

        return "Cart item updated successfully";
    }

    public String deleteCartByUserUuidAndProductUuid(UUID userUuid, UUID productSgid) {

        cartRepository.deleteCartByUserUuidAndProductSgid(userUuid, productSgid);

        return "Cart item deleted successfully";
    }

    public String cleanCartForUser(UUID userUuid) {

        cartRepository.deleteAllByUserUuid(userUuid);
        return "Cart cleaned successfully";
    }





}
