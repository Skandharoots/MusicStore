package com.musicstore.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PasswordResetRequestSettings {

    @NotNull(message = "Current password cannot be empty")
    @NotBlank(message = "Current password cannot be empty")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–[{}]:;',?/*~$^+=<>]).{6,50}$", message = "Current password must contain lower and upper case letters, "
            + "at least one number, as well as one special character. "
            + "Password must be at least 6 characters long.")
    @Size(min = 6, max = 50, message = "Password must be from 6 to 50 characters long.")
    private String current;

    @NotNull(message = "Password cannot be empty")
    @NotBlank(message = "Password cannot be empty")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–[{}]:;',?/*~$^+=<>]).{6,50}$", message = "Password must contain lower and upper case letters, "
            + "at least one number, as well as one special character. "
            + "Password must be at least 6 characters long.")
    @Size(min = 6, max = 50, message = "Password must be from 6 to 50 characters long.")
    private String password;

    @NotNull(message = "Password confirmation cannot be empty")
    @NotBlank(message = "Password confirmation cannot be empty")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–[{}]:;',?/*~$^+=<>]).{6,50}$", message = "Password confirmation must contain lower and upper case letters, "
            + "at least one number, as well as one special character. "
            + "Password must be at least 6 characters long.")
    @Size(min = 6, max = 50, message = "Password confirmation must be from 6 to 50 characters long.")
    private String passwordConfirmation;

}
