package com.musicstore.products.dto;

import jakarta.validation.constraints.Max;
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
public class ProductBoughtCountDto {

    @NotNull(message = "Product bought count cannot be null")
    @Min(value = 1, message = "Product bought count must be greater than 0")
    @Max(value = 10, message = "Product bought count must be less than 10")
    private Long boughtCount;

}
