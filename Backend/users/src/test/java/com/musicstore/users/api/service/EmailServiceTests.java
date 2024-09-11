package com.musicstore.users.api.service;

import com.musicstore.users.mail.EmailService;
import com.musicstore.users.security.EmailValidator;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTests {

    @Mock
    private EmailService emailService;

    @Mock
    private EmailValidator emailValidator;

    @Test
    public void sendEmailTest() throws Exception {

        IllegalStateException exception = null;
        try {
            emailService.send("test@test.com", "test");
        } catch (IllegalStateException e) {
            exception = e;
        }

        Assertions.assertThat(exception).isNull();
    }

    @Test
    public void sendEmailTestNull() throws Exception {
        IllegalStateException exception = null;
        try {
            emailService.send(null, null);
        } catch (IllegalStateException e) {
            exception = e;
        }
        Assertions.assertThat(exception).isNull();
    }

    @Test
    public void testEmailValidator() {
        String emailFail = "te..st@test.com";
        Assertions.assertThat(emailValidator.test(emailFail)).isFalse();
    }
}
