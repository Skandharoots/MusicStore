package com.musicstore.favorites.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteUpdateDto {

    @NotNull(message = "Favorite id cannot be empty.")
    private Long id;

    @NotNull(message = "Favorite quantity cannot be empty.")
    @Min(value = 1)
    private Integer quantity;

}
