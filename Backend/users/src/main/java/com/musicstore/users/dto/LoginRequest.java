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
@EqualsAndHashCode
@ToString
@Builder
public class LoginRequest {

    private final String email;
    private final String password;

}
