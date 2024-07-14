package com.musicstore.shoppingcart.dto;

import com.musicstore.shoppingcart.model.Cart;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartListResponse {

    private List<Cart> carts;

}
