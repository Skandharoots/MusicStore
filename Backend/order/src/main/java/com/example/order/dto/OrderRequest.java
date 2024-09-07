package com.example.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

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

    private List<OrderLineItemsDTO> items;
}
