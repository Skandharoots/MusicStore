package com.musicstore.opinions.model;

import io.micrometer.common.lang.NonNull;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Opinion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private UUID productUuid;

    @NonNull
    private UUID userId;

    @NonNull
    private String username;

    @NonNull
    private Rating rating;

    @NonNull
    private LocalDateTime createdAt = LocalDateTime.now();

    @NonNull
    @Column(columnDefinition = "TEXT")
    private String comment;

    public Opinion(UUID productUuid, UUID userId, String username, Rating rating, String comment) {
        this.productUuid = productUuid;
        this.userId = userId;
        this.username = username;
        this.rating = rating;
        this.comment = comment;
    }

}
