package com.musicstore.users.mail;

public interface EmailSender {

    void send(String to, String email);

    void sendPasswordReset(String to, String email);
}
