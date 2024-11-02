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

        Pattern emailPattern = Pattern.compile("^(?![^\"]+.*[^\"]+\\.\\.)"
                        + "[a-zA-Z0-9 !#\"$%&'*+-/=?^_`{|}~]*"
                        + "[a-zA-Z0-9\"]+@[a-zA-Z0-9.-]+$",
                Pattern.CASE_INSENSITIVE);
        Matcher matcher = emailPattern.matcher(request.getEmail());

        if (!matcher.matches()) {
            log.error("Invalid email address provided - " + request.getEmail());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Email not valid");
        }

        Pattern passPattern = Pattern
                .compile("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])"
                        + "(?=.*[!@#&()–[{}]:;',?/*~$^+=<>]).{6,20}$");
        Matcher passMatcher = passPattern.matcher(request.getPassword());

        if (!passMatcher.matches()) {
            log.error("Invalid password provided - " + request.getPassword());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Password must contain lower and upper case letters, "
                    + "at least one number, as well as one special character. "
                    + "Password must be at least 6 characters long.");
        }

        if (request.getFirstName().isEmpty() || request.getLastName().isEmpty()
        || request.getEmail().isEmpty() || request.getPassword().isEmpty()) {
            log.error("Empty registration request fields.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "First and Last name, as well as email or password fields cannot be empty");
        }

        Pattern firstAndLastNamePattern =
                Pattern.compile("^(?=.{1,50}$)[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+"
                        + "(?:[-'_.\\s][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+)*$");

        if (!firstAndLastNamePattern.matcher(request.getFirstName()).matches()
                || !firstAndLastNamePattern.matcher(request.getLastName()).matches()) {
            log.error("Invalid first or last name provided - " + request.getFirstName()
                    + ", " + request.getLastName());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid first or last name: for first name [" + request.getFirstName()
                            + "] and last name [" + request.getLastName() + "]");
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
