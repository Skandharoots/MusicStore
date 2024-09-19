package com.musicstore.shoppingcart.dto;

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

    private UUID userUuid;
    private UUID productSkuId;
    private BigDecimal productPrice;
    private String productName;
    private Integer quantity;

}
