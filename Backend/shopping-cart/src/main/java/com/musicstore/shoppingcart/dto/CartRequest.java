package com.musicstore.shoppingcart.dto;

import lombok.*;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartRequest {

    private UUID userUuid;
    private UUID productSgid;
    private String productName;
    private Integer quantity;

}
