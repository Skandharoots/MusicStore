package com.musicstore.opinions.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.musicstore.opinions.model.Opinion;
import com.musicstore.opinions.model.Rating;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class OpinionRepositoryTest {

    @Autowired
    private OpinionRepository opinionRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    public void createOpinionTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);

        entityManager.persist(opinion);
        entityManager.flush();

        Opinion savedOpinion = opinionRepository.findById(opinion.getId()).orElseThrow();

        Assertions.assertThat(savedOpinion).isNotNull();
        Assertions.assertThat(savedOpinion.getProductUuid()).isEqualTo(productUuid);
        Assertions.assertThat(savedOpinion.getUserId()).isEqualTo(userId);
        Assertions.assertThat(savedOpinion.getUsername()).isEqualTo(username);
        Assertions.assertThat(savedOpinion.getRating()).isEqualTo(rating);
        Assertions.assertThat(savedOpinion.getComment()).isEqualTo(comment);

    }

    @Test
    public void findOpinionByProductUuidAndUserIdTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);

        entityManager.persist(opinion);
        entityManager.flush();

        Optional<Opinion> foundOpinion = opinionRepository.findByProductUuidAndUserId(productUuid, userId);

        Assertions.assertThat(foundOpinion).isNotNull();
        Assertions.assertThat(foundOpinion.isPresent()).isTrue();
        Assertions.assertThat(foundOpinion.get().getProductUuid()).isEqualTo(productUuid);
        Assertions.assertThat(foundOpinion.get().getUserId()).isEqualTo(userId);
        Assertions.assertThat(foundOpinion.get().getUsername()).isEqualTo(username);
        Assertions.assertThat(foundOpinion.get().getRating()).isEqualTo(rating);
        Assertions.assertThat(foundOpinion.get().getComment()).isEqualTo(comment);

    }

    @Test
    public void findOpinionByIdTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);

        entityManager.persist(opinion);
        entityManager.flush();

        Optional<Opinion> foundOpinion = opinionRepository.findById(opinion.getId());

        Assertions.assertThat(foundOpinion).isNotNull();
        Assertions.assertThat(foundOpinion.isPresent()).isTrue();
        Assertions.assertThat(foundOpinion.get().getProductUuid()).isEqualTo(productUuid);
        Assertions.assertThat(foundOpinion.get().getUserId()).isEqualTo(userId);
        Assertions.assertThat(foundOpinion.get().getUsername()).isEqualTo(username);
        Assertions.assertThat(foundOpinion.get().getRating()).isEqualTo(rating);
        Assertions.assertThat(foundOpinion.get().getComment()).isEqualTo(comment);

    }

    @Test
    public void findAllByProductUuidTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);

        entityManager.persist(opinion);
        entityManager.flush();

        Page<Opinion> opinions = opinionRepository.findAllByProductUuid(productUuid, Pageable.unpaged());

        Assertions.assertThat(opinions).isNotNull();
        Assertions.assertThat(opinions.getTotalElements()).isEqualTo(1);
        Assertions.assertThat(opinions.getContent().get(0).getProductUuid()).isEqualTo(productUuid);
        Assertions.assertThat(opinions.getContent().get(0).getUserId()).isEqualTo(userId);
        Assertions.assertThat(opinions.getContent().get(0).getUsername()).isEqualTo(username);
        Assertions.assertThat(opinions.getContent().get(0).getRating()).isEqualTo(rating);
        Assertions.assertThat(opinions.getContent().get(0).getComment()).isEqualTo(comment);

    }

    @Test
    public void updateOpinionTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);

        entityManager.persist(opinion);
        entityManager.flush();  

        opinion.setComment("This is a test comment 2");
        opinion.setRating(Rating.FOUR);

        opinionRepository.save(opinion);
        entityManager.flush();

        Opinion updatedOpinion = opinionRepository.findById(opinion.getId()).orElseThrow();

        Assertions.assertThat(updatedOpinion).isNotNull();
        Assertions.assertThat(updatedOpinion.getComment()).isEqualTo("This is a test comment 2");
        Assertions.assertThat(updatedOpinion.getRating()).isEqualTo(Rating.FOUR);

    }

    @Test
    public void deleteOpinionTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);

        entityManager.persist(opinion);
        entityManager.flush();

        Optional<Opinion> foundOpinion = opinionRepository.findById(opinion.getId());

        Assertions.assertThat(foundOpinion).isNotNull();
        Assertions.assertThat(foundOpinion.isPresent()).isTrue();

        opinionRepository.delete(opinion);
        entityManager.flush();
        Optional<Opinion> foundOpinion2 = opinionRepository.findById(opinion.getId());

        Assertions.assertThat(foundOpinion2).isEmpty();
        Assertions.assertThat(foundOpinion2.isPresent()).isFalse();
        
    }

}
