package com.musicstore.users.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class EmailService implements EmailSender {


    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void send(String to, String email) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setText(email, true);
            helper.setSubject("Email confirmation");
            helper.setFrom("Fancy Strings <fancy.strings.org@gmail.com>");
            mailSender.send(message);
            log.info("Email sent to: " + to);
        } catch (MessagingException e) {
            log.error("Sending email failed", e);
            throw new IllegalStateException("Failed to send email");
        }
    }
}
