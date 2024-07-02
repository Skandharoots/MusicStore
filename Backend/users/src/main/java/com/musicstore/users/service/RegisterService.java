package com.musicstore.users.service;

import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.mail.EmailSender;
import com.musicstore.users.model.ConfirmationToken;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.security.EmailValidator;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RegisterService {

    private final UserService userService;
    private final EmailValidator emailValidator;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailSender emailSender;

    public String register(RegisterRequest request) {
        boolean isValidEmail = emailValidator
                .test(request.getEmail());

        if (!isValidEmail) {
            throw new IllegalStateException("Email not valid");
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
                .orElseThrow(() -> new IllegalStateException("Invalid token"));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new IllegalStateException("Email already confirmed");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Expired token");
        }

        confirmationTokenService.setConfirmationDate(token);
        userService.enableUser(confirmationToken.getUser().getEmail());
        return "Confirmed";
    }

}
