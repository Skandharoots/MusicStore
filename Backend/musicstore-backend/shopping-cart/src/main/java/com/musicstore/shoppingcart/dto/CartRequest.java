package com.musicstore.shoppingcart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartRequest {

    @NotNull(message = "User uuid cannot be null")
    private UUID userUuid;

    @NotNull(message = "Product sku id cannot be null")
    private UUID productSkuId;

    @NotNull(message = "Product price cannot be null")
    @Min(value = 1, message = "Product price cannot be less than 1.00")
    private BigDecimal productPrice;

    @NotNull(message = "Product name cannot be empty")
    @NotBlank(message = "Product name cannot be empty")
    private String productName;

    @NotNull(message = "Product quantity cannot be empty")
    @Min(value = 1, message = "Product quantity cannot be less than 1")
    private Integer quantity;

}
