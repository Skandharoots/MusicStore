package com.musicstore.users.dto;

import com.musicstore.users.model.UserRole;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class LoginResponse {

    private final UUID uuid;
    private final String firstName;
    private final String lastName;
    private final UserRole role;
    private final String token;

}
