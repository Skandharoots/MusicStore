package com.musicstore.products.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class ProductResponse {

    private Long id;
    private UUID productSgid;
    private String name;
    private String description;
    private BigDecimal price;
    private String manufacturer;
    private String country;
    private String category;

}
