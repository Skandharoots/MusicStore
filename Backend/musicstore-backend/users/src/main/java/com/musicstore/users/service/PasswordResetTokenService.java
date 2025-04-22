package com.musicstore.users.service;

import com.musicstore.users.model.PasswordResetToken;
import com.musicstore.users.repository.PasswordResetTokenRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public void savePasswordResetToken(PasswordResetToken resetToken) {
        passwordResetTokenRepository.save(resetToken);
    }

    public Optional<PasswordResetToken> getPasswordResetToken(String token) {
        return passwordResetTokenRepository.findByToken(token);
    }

    public void setConfirmationDate(String token) {

        boolean tokenExists = passwordResetTokenRepository.findByToken(token).isPresent();

        if (!tokenExists) {
            log.error("Token " + token + " does not exist");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token does not exist");
        }

        passwordResetTokenRepository.updatePasswordResetToken(token, LocalDateTime.now());
    }

    public Optional<PasswordResetToken> getPasswordResetTokenByUserUuid(UUID userUuid) {
        return passwordResetTokenRepository.findByUser_Uuid(userUuid);
    }

    public String deletePasswordResetToken(Long id) {
        boolean tokenExists = passwordResetTokenRepository.findByUser_Id(id).isPresent();

        if (!tokenExists) {
            log.error("Searched token does not exist");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token does not exist");
        }

        passwordResetTokenRepository.deleteByUser_Id(id);

        return "Token deleted";
    }

}
