package com.musicstore.products.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Product name is mandatory.")
    @NotNull(message = "Product name is mandatory.")
    @Pattern(regexp = "^[A-Za-z0-9][A-Za-z0-9&' .,:+=#?()%/\"-]{1,99}$",
            message = "Product name can contain capital and lowercase letters, "
                    + "numbers, spaces and special characters  &'.,:+=#?()%/\"-")
    @Size(min = 2, max = 100, message = "Product name must be 2 to 100 characters long.")
    private String productName;

    @NotBlank(message = "Product description is mandatory.")
    @NotNull(message = "Product description is mandatory.")
    @Pattern(regexp = "^[ -~\\r\\n]*$",
            message = "Product description can contain all characters except special ASCII characters.")
    private String description;

    @NotNull(message = "Product price is mandatory.")
    @Min(value = 1, message = "Product price must be greater or equal to one.")
    private BigDecimal price;

    @NotNull(message = "Product quantity is mandatory.")
    @Min(value = 0, message = "Product quantity must be greater or equal to zero.")
    private Integer quantity;

    @NotNull(message = "Product manufacturer is mandatory.")
    private Long manufacturerId;

    @NotNull(message = "Product country is mandatory.")
    private Long countryId;

    @NotNull(message = "Product category is mandatory.")
    private Long categoryId;

    @NotNull(message = "Product subcategory is mandatory.")
    private Long subcategoryId;

    private Long subcategoryTierTwoId;


}
