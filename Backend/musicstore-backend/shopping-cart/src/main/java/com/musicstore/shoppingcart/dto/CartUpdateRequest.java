package com.musicstore.shoppingcart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartUpdateRequest {

    @NotNull(message = "Product quantity cannot be empty")
    @Min(value = 1, message = "Product quantity cannot be less than 1")
    private Integer quantity;

}
