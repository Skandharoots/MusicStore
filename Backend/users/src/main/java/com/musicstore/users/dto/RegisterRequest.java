package com.musicstore.users.dto;

import lombok.*;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Builder
public class RegisterRequest {

    private final String firstName;
    private final String lastName;
    private final String email;
    private final String password;

}
