package com.musicstore.users.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class PasswordResetToken {

    @SequenceGenerator(
        name = "password_reset_sequence",
        sequenceName = "password_reset_sequence",
        allocationSize = 1
    )
    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "password_confirm_sequence"
    )
    private Long id;
    @Column(nullable = false)
    private String token;
    @Column(nullable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    private LocalDateTime confirmedAt;

    @ManyToOne
    @JoinColumn(
            nullable = false,
            name = "user_id")
    private Users user;

    public PasswordResetToken(String token,
                             LocalDateTime createdAt,
                             LocalDateTime expiresAt,
                             Users user) {
        this.token = token;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.user = user;
    }

}
