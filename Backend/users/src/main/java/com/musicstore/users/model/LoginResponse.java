package com.musicstore.users.model;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class LoginResponse {

    private final UUID uuid;
    private final String firstName;
    private final String lastName;

}
