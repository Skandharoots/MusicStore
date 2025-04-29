package com.musicstore.favorites.repository;

import com.musicstore.favorites.model.Favorite;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
public class FavoriteRepositoryTests {

    @Autowired
    private FavoritesRepository favoritesRepository;

    @Autowired
    private TestEntityManager entityManager;

    private UUID productUuid = UUID.randomUUID();
    private UUID userId = UUID.randomUUID();
    private UUID newProductUuid = UUID.randomUUID();
    private UUID newUserUuid = UUID.randomUUID();
    private String productName = "Strat";
    private String newProductName = "New Strat";
    private BigDecimal price = BigDecimal.valueOf(50L);
    private BigDecimal newPrice = BigDecimal.valueOf(80L);
    private Integer quantity = 2;
    private Integer newQuantity = 7;

    @Test
    public void createFavoriteTest() {
        Favorite favorite = new Favorite(
                productUuid,
                userId,
                productName,
                price,
                quantity
        );

        entityManager.persist(favorite);
        entityManager.flush();

        Optional<Favorite> savedFavorite = favoritesRepository.findById(favorite.getId());

        Assertions.assertThat(savedFavorite.isPresent()).isTrue();
        Assertions.assertThat(savedFavorite.get().getProductUuid()).isEqualTo(productUuid);
        Assertions.assertThat(savedFavorite.get().getUserUuid()).isEqualTo(userId);
        Assertions.assertThat(savedFavorite.get().getProductName()).isEqualTo(productName);
        Assertions.assertThat(savedFavorite.get().getPrice()).isEqualTo(price);
        Assertions.assertThat(savedFavorite.get().getQuantity()).isEqualTo(quantity);

    }

    @Test
    public void findAllByUserIdTest() {

        Favorite favorite = new Favorite(
                productUuid,
                userId,
                productName,
                price,
                quantity
        );

        entityManager.persist(favorite);
        entityManager.flush();

        Pageable pageable = PageRequest.of(0, quantity, Sort.by("dateAdded").descending());

        Page<Favorite> favorites = favoritesRepository.findAllByUserUuid(userId, pageable);
        Assertions.assertThat(favorites.getTotalElements()).isEqualTo(1);
        Assertions.assertThat(favorites.getContent().get(0).getProductUuid()).isEqualTo(productUuid);
        Assertions.assertThat(favorites.getContent().get(0).getUserUuid()).isEqualTo(userId);
        Assertions.assertThat(favorites.getContent().get(0).getProductName()).isEqualTo(productName);
        Assertions.assertThat(favorites.getContent().get(0).getPrice()).isEqualTo(price);
        Assertions.assertThat(favorites.getContent().get(0).getQuantity()).isEqualTo(quantity);

    }

    @Test
    public void updateFavoriteTest() {

        Favorite favorite = new Favorite(
                productUuid,
                userId,
                productName,
                price,
                quantity
        );

        entityManager.persist(favorite);
        entityManager.flush();

        Optional<Favorite> savedFavorite = favoritesRepository.findById(favorite.getId());

        Assertions.assertThat(savedFavorite.isPresent()).isTrue();
        savedFavorite.get().setProductUuid(newProductUuid);
        savedFavorite.get().setUserUuid(newUserUuid);
        savedFavorite.get().setProductName(newProductName);
        savedFavorite.get().setPrice(newPrice);
        savedFavorite.get().setQuantity(newQuantity);
        entityManager.persist(savedFavorite.get());
        entityManager.flush();
        Optional<Favorite> updatedFavorite = favoritesRepository.findById(favorite.getId());
        Assertions.assertThat(updatedFavorite.isPresent()).isTrue();
        Assertions.assertThat(updatedFavorite.get().getProductUuid()).isEqualTo(newProductUuid);
        Assertions.assertThat(updatedFavorite.get().getUserUuid()).isEqualTo(newUserUuid);
        Assertions.assertThat(updatedFavorite.get().getProductName()).isEqualTo(newProductName);
        Assertions.assertThat(updatedFavorite.get().getPrice()).isEqualTo(newPrice);
        Assertions.assertThat(updatedFavorite.get().getQuantity()).isEqualTo(newQuantity);


    }

    @Test
    public void deleteFavoriteTest() {

        Favorite favorite = new Favorite(
                productUuid,
                userId,
                productName,
                price,
                quantity
        );

        entityManager.persist(favorite);
        entityManager.flush();

        Optional<Favorite> savedFavorite = favoritesRepository.findById(favorite.getId());
        Assertions.assertThat(savedFavorite.isPresent()).isTrue();
        favoritesRepository.delete(savedFavorite.get());
        entityManager.flush();
        Optional<Favorite> deletedFavorite = favoritesRepository.findById(favorite.getId());
        Assertions.assertThat(deletedFavorite.isPresent()).isFalse();

    }
}
