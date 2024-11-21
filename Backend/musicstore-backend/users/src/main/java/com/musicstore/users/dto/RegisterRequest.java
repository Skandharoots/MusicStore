package com.musicstore.users.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequest {

    @NotNull(message = "First name cannot be empty")
    @NotBlank(message = "First name cannot be empty")
    @Pattern(regexp = "^(?=.{1,50}$)[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_.\\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$",
        message = "First name can contain lower and upper case letters, including polish, spaces and special"
                + " characters: -'_.")
    private String firstName;

    @NotNull(message = "Last name cannot be empty")
    @NotBlank(message = "Last name cannot be empty")
    @Pattern(regexp = "^(?=.{1,50}$)[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+(?:[-'_.\\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$",
            message = "Last name can contain lower and upper case letters, including polish, spaces and special"
                    + " characters: -'_.")
    private String lastName;

    @NotNull(message = "Email cannot be empty")
    @NotBlank(message = "Email cannot be empty")
    @Pattern(regexp = "^(?![^\"]+.*[^\"]+\\.\\.)[a-zA-Z0-9 !#\"$%&'*+-/=?^_`{|}~]*[a-zA-Z0-9\"]+@[a-zA-Z0-9.-]+$",
            message = "Email is invalid.")
    private String email;

    @NotNull(message = "Password cannot be empty")
    @NotBlank(message = "Password cannot be empty")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()–[{}]:;',?/*~$^+=<>]).{6,50}$",
        message = "Password must contain lower and upper case letters, "
                + "at least one number, as well as one special character. "
                + "Password must be at least 6 characters long.")
    private String password;

}
