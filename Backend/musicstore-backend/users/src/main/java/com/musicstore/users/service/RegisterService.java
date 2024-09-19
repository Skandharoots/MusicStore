package com.musicstore.users.service;

import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.model.ConfirmationToken;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class RegisterService {

    private final UserService userService;
    private final ConfirmationTokenService confirmationTokenService;

    public String register(RegisterRequest request) {

        Pattern pattern = Pattern.compile("^(?![^\"]+.*[^\"]+\\.\\.)"
                        + "[a-zA-Z0-9 !#\"$%&'*+-/=?^_`{|}~]*"
                        + "[a-zA-Z0-9\"]+@[a-zA-Z0-9.-]+$",
                Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(request.getEmail());

        boolean isValidEmail = matcher.matches();

        if (!isValidEmail) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,  "Email not valid");
        }

        return userService.signUpUser(
                new Users(
                        request.getFirstName(),
                        request.getLastName(),
                        request.getEmail(),
                        request.getPassword(),
                        UserRole.USER
                )
        );
    }

    @Transactional
    public String confirmToken(String token) {
        ConfirmationToken confirmationToken = confirmationTokenService
                .getConfirmationToken(token)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.BAD_REQUEST, "Invalid token")
                );

        if (confirmationToken.getConfirmedAt() != null) {
            log.error("Email already confirmed");
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Email already confirmed");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            log.error("Confirmation token already expired");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expired token");
        }

        confirmationTokenService.setConfirmationDate(token);
        userService.enableUser(confirmationToken.getUser().getEmail());
        log.info("User \"" + confirmationToken.getUser().getEmail() + "\" has been confirmed");
        return "Confirmed";
    }


}
