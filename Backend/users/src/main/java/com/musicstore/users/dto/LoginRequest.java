package com.musicstore.users.dto;

import lombok.*;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class LoginRequest {

    private final String email;
    private final String password;

}
