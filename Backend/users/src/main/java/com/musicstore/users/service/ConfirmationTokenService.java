package com.musicstore.users.service;

import com.musicstore.users.model.ConfirmationToken;
import com.musicstore.users.repository.ConfirmationTokenRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
public class ConfirmationTokenService {

    private final ConfirmationTokenRepository confirmationTokenRepository;

    public void saveConfirmationToken(ConfirmationToken confirmationToken) {
        confirmationTokenRepository.save(confirmationToken);
    }

    public Optional<ConfirmationToken> getConfirmationToken(String token) {
        return confirmationTokenRepository.findByToken(token);
    }

    public void setConfirmationDate(String token) {

        boolean tokenExists = confirmationTokenRepository.findByToken(token).isPresent();

        if (!tokenExists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,  "Token does not exist");
        }

        confirmationTokenRepository.updateConfirmationToken(token, LocalDateTime.now());
    }

    public Optional<ConfirmationToken> getConfirmationTokenByUserUuid(UUID userUuid) {
        return confirmationTokenRepository.findByUser_Uuid(userUuid);
    }

    public String deleteConfirmationToken(Long id) {
        boolean tokenExists = confirmationTokenRepository.findByUser_Id(id).isPresent();

        if (!tokenExists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token does not exist");
        }

        confirmationTokenRepository.deleteByUser_Id(id);

        return "Token deleted";
    }

}
