package com.musicstore.order.dto;

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
public class OrderLineItemsDto {

    @NotNull(message = "Order item sku id cannot be empty")
    private UUID productSkuId;

    @NotNull(message = "Order product name cannot be empty")
    @NotBlank(message = "Order product name cannot be empty")
    private String productName;

    @NotNull(message = "Order product quantity cannot be empty")
    private Integer quantity;

    @NotNull(message = "Order product price cannot be empty")
    private BigDecimal unitPrice;
}
