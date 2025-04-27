package com.musicstore.opinions.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class Opinion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID productUuid;

    private String productName;

    private UUID userId;

    private String username;

    private Rating rating;

    private LocalDateTime dateAdded = LocalDateTime.now();

    @Column(columnDefinition = "TEXT")
    private String comment;

    public Opinion(UUID productUuid, String productName, UUID userId, String username, Rating rating, String comment) {
        this.productUuid = productUuid;
        this.productName = productName;
        this.userId = userId;
        this.username = username;
        this.rating = rating;
        this.comment = comment;
    }

}
