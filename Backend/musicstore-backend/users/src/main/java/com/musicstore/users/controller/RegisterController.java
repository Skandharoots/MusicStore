package com.musicstore.users.controller;

import com.fasterxml.jackson.core.exc.StreamWriteException;
import com.fasterxml.jackson.databind.DatabindException;
import com.musicstore.users.dto.LoginRequest;
import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.dto.PasswordResetRequest;
import com.musicstore.users.dto.PasswordResetRequestSettings;
import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.dto.UserInformationResponse;
import com.musicstore.users.service.LoginService;
import com.musicstore.users.service.RegisterService;
import com.musicstore.users.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class RegisterController {

    private final RegisterService registerService;
    private final LoginService loginService;
    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public String register(@Valid @RequestBody RegisterRequest request) {
        return registerService.register(request);
    }

    @GetMapping("/register/confirm")
    @ResponseStatus(HttpStatus.OK)
    public String confirm(@RequestParam("token") String token) {
        return registerService.confirmToken(token);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(loginService.loginUser(request));
    }

    @PostMapping("/get/{uuid}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<UserInformationResponse> getUserInformation(
            @PathVariable(name = "uuid") UUID uuid) {
        return ResponseEntity.ok(userService.getUserInfo(uuid));
    }

    @GetMapping("/validate")
    @ResponseStatus(HttpStatus.OK)
    public Boolean validateToken(@RequestParam("token") String token) {
        return loginService.validateLoginRequest(token);
    }

    @GetMapping("/adminauthorize")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public Boolean adminAuthorize(@RequestParam("token") String token) {

        return loginService.adminAuthorize(token);
    }

    @PutMapping("/update/{uuid}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<LoginResponse> updateUser(
            @PathVariable("uuid") UUID uuid,
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.updateUser(uuid, request));
    }

    @DeleteMapping("/delete/{uuid}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public String deleteUser(@PathVariable("uuid") UUID uuid) {

        return userService.deleteUser(uuid);
    }

    @GetMapping("/csrf/token")
    public CsrfToken getCsrfToken(CsrfToken token) {

        return token;
    }

    @PostMapping("/refresh-token")
    public void generateRefreshToken(
            HttpServletRequest request,
            HttpServletResponse response) throws StreamWriteException, DatabindException, IOException {
        userService.refresh(request, response);
    }

    @GetMapping("/password/email/{email}")
    public String getPasswordResetEmail(
            @PathVariable(name = "email") String email) {
        return userService.generatePasswordResetToken(email);
    }

    @PutMapping("/password/email/reset")
    public String resetPasswordEmail(@Valid @RequestBody PasswordResetRequest request) {
        return userService.resetPasswordEmail(request);
    }

    @PutMapping("/password/settings/reset")
    public String resetPasswordSettings(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @Valid @RequestBody PasswordResetRequestSettings request) {
        return userService.resetPasswordSettings(request, token);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}
