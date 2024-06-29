package com.musicstore.users.api.service;

import com.musicstore.users.model.ConfirmationToken;
import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.ConfirmationTokenRepository;
import com.musicstore.users.service.ConfirmationTokenService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class ConfirmationTokenServiceTests {

    @Mock
    private ConfirmationTokenRepository confirmationTokenRepository;

    @InjectMocks
    private ConfirmationTokenService confirmationTokenService;

    private Users user;

    private ConfirmationToken confirmationToken;

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

        confirmationToken = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user
        );
    }

    @Test
    public void createConfirmationToken() {
        when(confirmationTokenRepository.save(Mockito.any(ConfirmationToken.class))).thenReturn(confirmationToken);
        confirmationTokenService.saveConfirmationToken(confirmationToken);
        Mockito.verify(confirmationTokenRepository, Mockito.times(1)).save(Mockito.any(ConfirmationToken.class));
    }

    @Test
    public void getConfirmationTokenTestReturnsOptionalOfConfirmationToken() {
        Optional<ConfirmationToken> confirmationTokenOptional = Optional.of(confirmationToken);
        when(confirmationTokenRepository.findByToken(tokenUUID)).thenReturn(confirmationTokenOptional);
        Optional<ConfirmationToken> confirmationToken = confirmationTokenService.getConfirmationToken(tokenUUID);
        Assertions.assertThat(confirmationToken).isPresent();
        Assertions.assertThat(confirmationToken).isEqualTo(confirmationTokenOptional);
    }

    @Test
    public void setConfirmationDateTest() {
        Optional<ConfirmationToken> confirmationTokenOptional = Optional.of(confirmationToken);
        when(confirmationTokenRepository.findByToken(tokenUUID)).thenReturn(confirmationTokenOptional);
        confirmationTokenService.setConfirmationDate(tokenUUID);
        Mockito.verify(
                confirmationTokenRepository,
                Mockito.times(1)
                )
                .updateConfirmationToken(
                        Mockito.any(String.class),
                        Mockito.any(LocalDateTime.class)
                );
    }

    @Test
    public void getConfirmationTokenByUserUuidTestReturnsOptionalOfConfirmationToken() {
        Optional<ConfirmationToken> confirmationTokenOptional = Optional.of(confirmationToken);
        when(confirmationTokenRepository.findByUser_Uuid(user.getUuid())).thenReturn(confirmationTokenOptional);
        Optional<ConfirmationToken> confirmationToken = confirmationTokenService.getConfirmationTokenByUserUuid(user.getUuid());
        Assertions.assertThat(confirmationToken).isNotNull();
    }

    @Test
    public void deleteConfirmationTokenByUserIdTest() {
        Optional<ConfirmationToken> confirmationTokenOptional = Optional.of(confirmationToken);
        when(confirmationTokenRepository.findByUser_Id(user.getId())).thenReturn(confirmationTokenOptional);
        String successMsg = confirmationTokenService.deleteConfirmationToken(user.getId());
        Assertions.assertThat(successMsg).isNotNull();
    }
}
