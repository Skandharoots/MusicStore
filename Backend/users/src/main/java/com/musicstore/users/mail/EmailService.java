package com.musicstore.users.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
@AllArgsConstructor
public class EmailService implements EmailSender {

    private final static Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private final JavaMailSender mailSender;

    @Override
    public void send(String to, String email) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setText(email, true);
            helper.setSubject("Email confirmation");
            helper.setFrom("mardok1825@gmail.com");
            mailSender.send(message);
        } catch (MessagingException e) {
            logger.error("Sending email failed", e);
            throw new IllegalStateException("Failed to send email");
        }
    }
}
