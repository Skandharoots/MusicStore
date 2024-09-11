package com.musicstore.users.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;


@Data
@Getter
@AllArgsConstructor
@Builder
public class RegisterRequest {

    private final String firstName;
    private final String lastName;
    private final String email;
    private final String password;

}
