package com.musicstore.opinions.dto;

import com.musicstore.opinions.model.Rating;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OpinionRequestDto {

    @NotNull(message = "Product UUID is required")
    private UUID productUuid;

    @NotNull(message = "User UUID is required")
    private UUID userId;

    @NotNull(message = "Username is required")
    @NotBlank(message = "Username is required")
    @Pattern(regexp = "^(?=.{1,50}$)[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_.\\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$", 
    message = "First name can contain lower and upper case letters, including polish, spaces and special"
            + " characters: -'_.")
    @Size(min = 2, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @NotNull(message = "Rating is required")
    private Rating rating;

    @NotNull(message = "Comment is required")
    @NotBlank(message = "Comment is required")
    @Pattern(regexp = "^[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ][A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ\"'_.() -]{9,500}$",
    message = "Comment can contain lower and upper case letters, including polish, numbers, spaces and special"
            + " characters: -'_.()")
    @Size(min = 10, max = 500, message = "Comment must be between 10 and 500 characters")
    private String comment;
}
