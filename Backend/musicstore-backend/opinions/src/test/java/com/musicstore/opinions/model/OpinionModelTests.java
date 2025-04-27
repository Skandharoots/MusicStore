package com.musicstore.opinions.model;

import java.util.UUID;

import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class OpinionModelTests {

    @Test
    public void cartConstructorTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String productName = "Strat";
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";

        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);

        Assertions.assertThat(opinion.getProductUuid()).isEqualTo(productUuid);
        Assertions.assertThat(opinion.getUserId()).isEqualTo(userId);
        Assertions.assertThat(opinion.getUsername()).isEqualTo(username);
        Assertions.assertThat(opinion.getRating()).isEqualTo(rating);
        Assertions.assertThat(opinion.getComment()).isEqualTo(comment);

    }

    @Test
    public void cartConstructorTest2() {
        UUID productUuid = UUID.randomUUID();
        UUID productUuid2 = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        UUID userId2 = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);

        Assertions.assertThat(opinion.getProductUuid()).isEqualTo(productUuid);
        Assertions.assertThat(opinion.getUserId()).isEqualTo(userId);
        Assertions.assertThat(opinion.getUsername()).isEqualTo(username);
        Assertions.assertThat(opinion.getRating()).isEqualTo(rating);
        Assertions.assertThat(opinion.getComment()).isEqualTo(comment);

        opinion.setId(2L);
        opinion.setProductUuid(productUuid2);
        opinion.setUserId(userId2);
        opinion.setUsername("Marek");
        opinion.setRating(Rating.FOUR);
        opinion.setComment("This is a test comment 2");

        Assertions.assertThat(opinion.getId()).isEqualTo(2L);
        Assertions.assertThat(opinion.getProductUuid()).isEqualTo(productUuid2);
        Assertions.assertThat(opinion.getUserId()).isEqualTo(userId2);
        Assertions.assertThat(opinion.getUsername()).isEqualTo("Marek");
        Assertions.assertThat(opinion.getRating()).isEqualTo(Rating.FOUR);
        Assertions.assertThat(opinion.getComment()).isEqualTo("This is a test comment 2");
        
    }

}
