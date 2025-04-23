package com.musicstore.users.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.users.controller.RegisterController;
import com.musicstore.users.dto.AuthenticationResponse;
import com.musicstore.users.dto.LoginRequest;
import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.dto.PasswordResetRequest;
import com.musicstore.users.dto.PasswordResetRequestSettings;
import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.dto.UserInformationResponse;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.service.*;
import jakarta.servlet.http.Cookie;

import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.DefaultCsrfToken;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import java.util.UUID;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

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
        private JwtService jwtService;

        @MockBean
        private ConfirmationTokenService confirmationTokenService;

        private CsrfToken csrfToken;

        @Test
        public void getCsrfToken() throws Exception {
                mockMvc.perform(get("/api/users/csrf/token"))
                                .andExpect(MockMvcResultMatchers.status().isOk());
        }

        @Test
        public void registerTest() throws Exception {

                RegisterRequest registerRequest = RegisterRequest.builder()
                                .firstName("Marek")
                                .lastName("Kopania")
                                .email("test@test.com")
                                .password("4kdj@#slKsds")
                                .build();

                ResultActions resultActions = mockMvc.perform(post("/api/users/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)));
                resultActions
                                .andExpect(MockMvcResultMatchers.status().isCreated());
        }

        @Test
        public void registerBadRequestTest() throws Exception {

                RegisterRequest registerRequest = RegisterRequest.builder()
                                .firstName("Mare$%&^%^&*@#$!$:][k")
                                .lastName("Kopania")
                                .email("tes..t@test.com")
                                .password("pass")
                                .build();

                ResultActions resultActions = mockMvc.perform(post("/api/users/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)));
                resultActions
                                .andExpect(MockMvcResultMatchers.status().isBadRequest());
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

                ResultActions resultActions = mockMvc.perform(post("/api/users/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest)));

                resultActions
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("Marek"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value("Kopania"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.uuid")
                                                .value(loginResponse.getUuid().toString()))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.role").value(UserRole.USER.toString()));

        }

        @Test
        public void registerConfirmationTokenTest() throws Exception {

                String token = UUID.randomUUID().toString();

                when(registerService.confirmToken(token)).thenReturn(token);

                ResultActions resultActions = mockMvc.perform(get("/api/users/register/confirm")
                                .param("token", token));

                resultActions
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.content().string(token));
        }

        @Test
        public void getUserInformationTest() throws Exception {
                UUID uuid = UUID.randomUUID();
                UserInformationResponse info = UserInformationResponse
                                .builder()
                                .firstName("Marek")
                                .lastName("Kopania")
                                .email("test@test.com")
                                .build();

                when(userService.getUserInfo(uuid)).thenReturn(info);

                ResultActions resultActions = mockMvc.perform(post("/api/users/get/{uuid}", uuid)
                                .contentType(MediaType.APPLICATION_JSON));

                resultActions.andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("Marek"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value("Kopania"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("test@test.com"));
        }

        @Test
        public void validateTokenTest() throws Exception {
                String token = UUID.randomUUID().toString();
                when(loginService.validateLoginRequest(token)).thenReturn(true);

                ResultActions resultActions = mockMvc.perform(get("/api/users/validate")
                                .param("token", token));

                resultActions
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(MockMvcResultMatchers.content().string("true"));
        }

        @Test
        public void refreshTokenTest() throws Exception {

                String token = UUID.randomUUID().toString();
                String csrf = UUID.randomUUID().toString();
                csrfToken = new DefaultCsrfToken("X-XSRF-TOKEN", "_csrf", csrf);

                AuthenticationResponse authResp = AuthenticationResponse
                                .builder()
                                .token(token)
                                .refreshToken(token)
                                .build();

                ResultActions resultActions = mockMvc.perform(post("/api/users/refresh-token")
                                .header(HttpHeaders.AUTHORIZATION, token)
                                .cookie(new Cookie("XSRF-TOKEN", csrfToken.getToken()))
                                .contentType(MediaType.APPLICATION_JSON));

                resultActions.andExpect(MockMvcResultMatchers.status().isOk());

        }

        @Test
        public void adminAuthorizationTest() throws Exception {
                String token = UUID.randomUUID().toString();
                when(loginService.adminAuthorize(token)).thenReturn(true);

                ResultActions resultActions = mockMvc.perform(get("/api/users/adminauthorize")
                                .param("token", token));

                resultActions
                                .andExpect(MockMvcResultMatchers.status().isAccepted())
                                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(MockMvcResultMatchers.content().string("true"));
        }

        @Test
        public void userInformationUpdateTest() throws Exception {
                UUID uuid = UUID.randomUUID();

                RegisterRequest registerRequest = RegisterRequest.builder()
                                .firstName("Marek")
                                .lastName("Kopania")
                                .email("test@test.com")
                                .password("7@#asdlKj23")
                                .build();

                LoginResponse loginResponse = LoginResponse.builder()
                                .firstName("Marek")
                                .lastName("Kopania")
                                .uuid(uuid)
                                .role(UserRole.USER)
                                .token("test")
                                .build();

                when(userService.updateUser(uuid, registerRequest)).thenReturn(loginResponse);

                ResultActions resultActions = mockMvc.perform(put("/api/users/update/{uuid}", uuid)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)));

                resultActions
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value("Marek"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value("Kopania"))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.uuid").value(uuid.toString()))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.role").value(UserRole.USER.toString()))
                                .andExpect(MockMvcResultMatchers.jsonPath("$.token").value("test"));
        }

        @Test
        public void userInformationUpdateBadRequestTest() throws Exception {
                UUID uuid = UUID.randomUUID();

                RegisterRequest registerRequest = RegisterRequest.builder()
                                .firstName("Mare$%&^%^&*@#$!$:][k")
                                .lastName("Kopania")
                                .email("tes..t@test.com")
                                .password("pass")
                                .build();

                ResultActions resultActions = mockMvc.perform(put("/api/users/update/{uuid}", uuid)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)));

                resultActions
                                .andExpect(MockMvcResultMatchers.status().isBadRequest());
        }

        @Test
        public void deleteUserTest() throws Exception {
                UUID uuid = UUID.randomUUID();

                when(userService.deleteUser(uuid)).thenReturn(String.valueOf(String.class));

                ResultActions resultActions = mockMvc.perform(delete("/api/users/delete/{uuid}", uuid));
                resultActions
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=UTF-8"));
        }

        @Test
        public void getPasswordResetEmailTest() throws Exception {

                String email = "test@test.com";
                String token = UUID.randomUUID().toString();
                when(userService.generatePasswordResetToken(email)).thenReturn(token);
                
                ResultActions resultActions = mockMvc.perform(get("/api/users/password/email/{email}", email));
                resultActions.andExpect(MockMvcResultMatchers.status().isOk());
                resultActions.andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=UTF-8"));

        }

        @Test
        public void resetPasswordEmailTest() throws JsonProcessingException, Exception {

                String token = UUID.randomUUID().toString();

                PasswordResetRequest request = PasswordResetRequest.builder()
                        .token(token)
                        .password("V$rh273Sd23%$")
                        .passwordConfirmation("V$rh273Sd23%$")
                        .build();

                when(userService.resetPasswordEmail(request)).thenReturn("Password reset successfully.");

                ResultActions resultActions = mockMvc.perform(put("/api/users/password/email/reset")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        );

                resultActions.andExpect(MockMvcResultMatchers.status().isOk());
                resultActions.andExpect(MockMvcResultMatchers.content().contentType("text/plain;charset=UTF-8"));

        }

        @Test
        public void resetPasswordEmailInvalidTest() throws JsonProcessingException, Exception {

                String token = UUID.randomUUID().toString();

                PasswordResetRequest request = PasswordResetRequest.builder()
                        .token(token)
                        .password("V$r")
                        .passwordConfirmation("V$r")
                        .build();

                ResultActions resultActions = mockMvc.perform(put("/api/users/password/email/reset")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        );

                resultActions.andExpect(MockMvcResultMatchers.status().isBadRequest());

        }

        @Test
        public void resetPasswordSettingsTest() throws JsonProcessingException, Exception {

                String token = UUID.randomUUID().toString();
                PasswordResetRequestSettings request = new PasswordResetRequestSettings(
                        "Wh#re4R3", "C0mm)nThing", "C0mm)nThing");
                
                when(userService.resetPasswordSettings(request, token)).thenReturn("Password successfully changed.");

                ResultActions resultActions = mockMvc.perform(put("/api/users/password/settings/reset")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .header("Authorization", "Bearer " + token)
                );

                resultActions.andExpect(MockMvcResultMatchers.status().isOk());

        }

        @Test
        public void resetPasswordSettingsInvalidTest() throws JsonProcessingException, Exception {

                String token = UUID.randomUUID().toString();
                PasswordResetRequestSettings request = new PasswordResetRequestSettings(
                        "Wh#re4R3", "C0mm)", "C0mm)");
                
                ResultActions resultActions = mockMvc.perform(put("/api/users/password/settings/reset")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
                        .header("Authorization", "Bearer " + token)
                );

                resultActions.andExpect(MockMvcResultMatchers.status().isBadRequest());

        }
}
