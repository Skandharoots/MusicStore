package com.musicstore.users.token;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

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
        confirmationTokenRepository.updateConfirmationToken(token, LocalDateTime.now());
    }

    public String deleteConfirmationToken(UUID uuid) {
        boolean tokenExists = confirmationTokenRepository.findByUserUUID(uuid).isPresent();

        if (!tokenExists) {
            throw new IllegalStateException("Token does not exist");
        }

        confirmationTokenRepository.deleteConfirmationToken(uuid);

        return "Token deleted";
    }

}
