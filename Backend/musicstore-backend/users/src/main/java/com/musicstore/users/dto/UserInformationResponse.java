package com.musicstore.users.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
@AllArgsConstructor
public class UserInformationResponse {
    private String firstName;
    private String lastName;
    private String email;
}
