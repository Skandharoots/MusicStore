package com.musicstore.users.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.users.controller.RegisterController;
import com.musicstore.users.dto.LoginRequest;
import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.service.*;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;


@WebMvcTest(controllers = RegisterController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@RunWith(SpringRunner.class)
public class RegistryControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private RegisterService registerService;

    @MockBean
    private LoginService loginService;

    @MockBean
    private UserService userService;

    @MockBean
    private JWTService jwtService;

    @MockBean
    private ConfirmationTokenService confirmationTokenService;

    @Test
    public void getCsrfToken() throws Exception {
        mockMvc.perform(get("/api/v1/users/csrf/token"))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    public void registerTest() throws Exception {

        RegisterRequest registerRequest = RegisterRequest.builder()
                .firstName("Marek")
                .lastName("Kopania")
                .email("test@test.com")
                .password("testpass")
                .build();

        ResultActions resultActions = mockMvc.perform(post("/api/v1/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest))
        );
        System.out.println(objectMapper.writeValueAsString(registerRequest));
        resultActions
                .andExpect(MockMvcResultMatchers.status().isCreated());
    }

    @Test
    public void loginTest() throws Exception {

        LoginRequest loginRequest = LoginRequest.builder()
                .email("test@test.com")
                .password("testpass")
                .build();

        LoginResponse loginResponse = LoginResponse.builder()
                .firstName("Marek")
                .lastName("Kopania")
                .uuid(UUID.randomUUID())
                .role(UserRole.USER)
                .token("test")
                .build();

        when(loginService.loginUser(loginRequest)).thenReturn(loginResponse);

        ResultActions resultActions = mockMvc.perform(post("/api/v1/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest))
        );

        resultActions
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("Marek"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value("Kopania"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.uuid").value(loginResponse.getUuid().toString()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.role").value(UserRole.USER.toString()));

    }
}
