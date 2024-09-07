package com.musicstore.shoppingcart.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartRequest {

    private UUID userUuid;
    private UUID productSgid;
    private BigDecimal productPrice;
    private String productName;
    private Integer quantity;

}
