package com.musicstore.favorites.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class FavoriteDto {

    @NotNull(message = "Product id cannot be empty.")
    private UUID productUuid;

    @NotNull(message = "Product name cannot be empty.")
    @NotBlank(message = "Product name cannot be empty.")
    @Pattern(regexp = "^[A-Za-z0-9][A-Za-z0-9&' .,:+=#?()%/\"-]{1,99}$",
            message = "Product name can contain capital and lowercase letters, "
                    + "numbers, spaces and special characters  &'.,:+=#?()%/\"-")
    @Size(min = 2, max = 100, message = "Product name must be 2 to 100 characters long.")
    private String productName;

    @NotNull(message = "User id cannot be empty.")
    private UUID userUuid;

    @NotNull(message = "Product price cannot be empty")
    @Min(value = 1)
    private BigDecimal productPrice;

    @NotNull(message = "Product quantity cannot be empty.")
    @Min(value = 1)
    @Max(value = 10)
    private Integer quantity;

}
