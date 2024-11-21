package com.musicstore.products.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ManufacturerRequest {

    @NotBlank(message = "Manufacturer name is mandatory.")
    @NotNull(message = "Manufacturer name is mandatory.")
    @Pattern(regexp = "^[A-Z][A-Za-z ']{1,49}$",
            message = "Manufacturer name must start with a capital"
                    + "letter and can contain spaces and and apostrophe.")
    @Size(min = 2, max = 50, message = "Manufacturer name must be 1 to 50 characters long.")
    private String name;
}
