package com.musicstore.order.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

    @NotNull(message = "User uuid cannot be empty")
    private UUID userIdentifier;

    @NotBlank(message = "Name is mandatory.")
    @NotNull(message = "Name is mandatory.")
    @Pattern(regexp = "^(?=.{1,50}$)[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+"
            + "(?:[-'_./ \\s][A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$",
            message = "Name can contain capital and lowercase letters, "
                    + "numbers, spaces and special characters  -'_./")
    @Size(min = 1, max = 50, message = "Name must be 1 to 50 characters long.")
    private String name;

    @NotBlank(message = "Surname is mandatory.")
    @NotNull(message = "Surname is mandatory.")
    @Pattern(regexp = "^(?=.{1,50}$)[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+"
            + "(?:[-'_./ \\s][A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$",
            message = "Surname can contain capital and lowercase letters, "
                    + "numbers, spaces and special characters  -'_./")
    @Size(min = 1, max = 50, message = "Surname must be 1 to 50 characters long.")
    private String surname;

    @NotBlank(message = "Email is mandatory.")
    @NotNull(message = "Email is mandatory.")
    @Pattern(regexp = "^(?![^\"]+.*[^\"]+\\.\\.)[a-zA-Z0-9 !#\"$%&'*+-/=?^_`{|}~]*[a-zA-Z0-9\"]+@[a-zA-Z0-9.-]+$",
            message = "Email must be in a correct format. Email can contain capital and lowercase letters, "
                    + "numbers, spaces and special characters  -'_./")
    @Size(min = 1, max = 255, message = "Email must be 1 to 255 characters long.")
    private String email;

    @NotBlank(message = "Phone number is mandatory.")
    @NotNull(message = "Phone number is mandatory.")
    @Pattern(regexp = "^[+]?[ (]?[0-9]{1,3}[) ]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9 -]{1,7}$",
            message = "Phone number must be in a format +(432) 456 545 222, where () are optional. "
                    + "It can also be only numbers like 5555555 or 003823984523. "
                    + "It can contain spaces and dashes -")
    @Size(min = 5, max = 255, message = "Phone number must be at least 5 characters long.")
    private String phone;

    @NotBlank(message = "Country is mandatory.")
    @NotNull(message = "Country is mandatory.")
    @Pattern(regexp = "^(?=.{1,50}$)[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+"
            + "(?:[-'_./ \\s][A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$",
            message = "Country can contain capital and lowercase letters, "
                    + "numbers, spaces and special characters  -'_./")
    @Size(min = 1, max = 50, message = "Country must be 1 to 50 characters long.")
    private String country;

    @NotBlank(message = "Street address is mandatory.")
    @NotNull(message = "Street address is mandatory.")
    @Pattern(regexp = "^(?=.{1,50}$)[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+"
            + "(?:[-'_./ \\s][A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$",
            message = "Street address can contain capital and lowercase letters, "
                    + "numbers, spaces and special characters  -'_./")
    @Size(min = 1, max = 50, message = "Street address must be 1 to 50 characters long.")
    private String streetAddress;

    @NotBlank(message = "City is mandatory.")
    @NotNull(message = "City is mandatory.")
    @Pattern(regexp = "^(?=.{1,50}$)[A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+"
            + "(?:[-'_./ \\s][A-Za-z0-9żźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$",
            message = "City can contain capital and lowercase letters, "
                    + "numbers, spaces and special characters  -'_./")
    @Size(min = 1, max = 50, message = "City must be 1 to 50 characters long.")
    private String city;

    @NotBlank(message = "Zip code is mandatory.")
    @NotNull(message = "Zip code is mandatory.")
    @Pattern(regexp = "(?i)^[a-z0-9][a-z0-9\\- ]{0,10}[a-z0-9]$",
            message = "Zip code must follow the european standards")
    @Size(min = 1, max = 11, message = "Zip code must be 1 to 11 characters long.")
    private String zipCode;

    @NotNull(message = "Order total price cannot be empty.")
    @Min(value = 1, message = "Order total price cannot be less than 1.")
    private BigDecimal orderTotalPrice;

    @NotNull(message = "Order products cannot be empty")
    private List<OrderLineItemsDto> items;
}
