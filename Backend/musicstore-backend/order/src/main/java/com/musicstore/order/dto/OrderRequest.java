package com.musicstore.order.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {

    private UUID userIdentifier;

    private String name;

    private String surname;

    private String email;

    private String phone;

    private String country;

    private String streetAddress;

    private String city;

    private String zipCode;

    private BigDecimal orderTotalPrice;

    private List<OrderLineItemsDto> items;
}
