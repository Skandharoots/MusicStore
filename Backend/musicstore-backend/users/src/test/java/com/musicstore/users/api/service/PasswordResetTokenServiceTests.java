package com.musicstore.users.api.service;

import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import com.musicstore.users.model.PasswordResetToken;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.PasswordResetTokenRepository;
import com.musicstore.users.service.PasswordResetTokenService;

@ExtendWith(MockitoExtension.class)
public class PasswordResetTokenServiceTests {

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @InjectMocks
    private PasswordResetTokenService passwordResetTokenService;

    private Users user;

    private PasswordResetToken passwordResetToken;

    private String tokenUUID;

    @BeforeEach
    public void setUp() {
        user = new Users(
                "Marek",
                "Kopania",
                "test@test.com",
                "testpasswd",
                UserRole.USER
        );

        tokenUUID = UUID.randomUUID().toString();

        passwordResetToken = new PasswordResetToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
    }

    @Test
    public void createpasswordResetToken() {
        when(passwordResetTokenRepository.save(Mockito.any(PasswordResetToken.class))).thenReturn(passwordResetToken);
        passwordResetTokenService.savePasswordResetToken(passwordResetToken);
        Mockito.verify(passwordResetTokenRepository, Mockito.times(1)).save(Mockito.any(PasswordResetToken.class));
    }

    @Test
    public void getpasswordResetTokenTestReturnsOptionalOfpasswordResetToken() {
        Optional<PasswordResetToken> passwordResetTokenOptional = Optional.of(passwordResetToken);
        when(passwordResetTokenRepository.findByToken(tokenUUID)).thenReturn(passwordResetTokenOptional);
        Optional<PasswordResetToken> passwordResetToken = passwordResetTokenService.getPasswordResetToken(tokenUUID);
        Assertions.assertThat(passwordResetToken).isPresent();
        Assertions.assertThat(passwordResetToken).isEqualTo(passwordResetTokenOptional);
    }

    @Test
    public void setConfirmationDateTest() {
        Optional<PasswordResetToken> passwordResetTokenOptional = Optional.of(passwordResetToken);
        when(passwordResetTokenRepository.findByToken(tokenUUID)).thenReturn(passwordResetTokenOptional);
        passwordResetTokenService.setConfirmationDate(tokenUUID);
        Mockito.verify(
                passwordResetTokenRepository,
                Mockito.times(1)
                )
                .updatePasswordResetToken(
                        Mockito.any(String.class),
                        Mockito.any(LocalDateTime.class)
                );
    }

    @Test
    public void setConfirmationDateFailTest() {
        Optional<PasswordResetToken> passwordResetTokenOptional = Optional.of(passwordResetToken);
        when(passwordResetTokenRepository.findByToken(tokenUUID)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> passwordResetTokenService.setConfirmationDate(tokenUUID)).isNotNull();

    }

    @Test
    public void getpasswordResetTokenByUserUuidTestReturnsOptionalOfpasswordResetToken() {
        Optional<PasswordResetToken> passwordResetTokenOptional = Optional.of(passwordResetToken);
        when(passwordResetTokenRepository.findByUser_Uuid(user.getUuid())).thenReturn(passwordResetTokenOptional);
        Optional<PasswordResetToken> passwordResetToken = passwordResetTokenService.getPasswordResetTokenByUserUuid(user.getUuid());
        Assertions.assertThat(passwordResetToken).isNotNull();
    }

    @Test
    public void deletepasswordResetTokenByUserIdTest() {
        Optional<PasswordResetToken> passwordResetTokenOptional = Optional.of(passwordResetToken);
        when(passwordResetTokenRepository.findByUser_Id(user.getId())).thenReturn(passwordResetTokenOptional);
        String successMsg = passwordResetTokenService.deletePasswordResetToken(user.getId());
        Assertions.assertThat(successMsg).isNotNull();
    }

    @Test
    public void deletepasswordResetTokenByTokenFailTest() {
        Optional<PasswordResetToken> passwordResetTokenOptional = Optional.of(passwordResetToken);
        when(passwordResetTokenRepository.findByUser_Id(user.getId())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> passwordResetTokenService.deletePasswordResetToken(user.getId())).isNotNull();
    }

}
