package com.musicstore.users.dto;

import com.musicstore.users.model.UserRole;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
@AllArgsConstructor
public class LoginResponse {

    private final UUID uuid;
    private final String firstName;
    private final String lastName;
    private final UserRole role;
    private final String token;
    private final String refreshToken;

}
