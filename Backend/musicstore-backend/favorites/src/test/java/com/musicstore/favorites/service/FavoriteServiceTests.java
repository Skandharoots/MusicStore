package com.musicstore.favorites.service;

import com.musicstore.favorites.dto.FavoriteDto;
import com.musicstore.favorites.dto.FavoriteUpdateDto;
import com.musicstore.favorites.model.Favorite;
import com.musicstore.favorites.repository.FavoritesRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FavoriteServiceTests {

    @Mock
    private FavoritesRepository favoritesRepository;

    @InjectMocks
    private FavoritesService favoritesService;

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
    public void addFavorite() {

        Favorite favorite = new Favorite(
                productUuid,
                userId,
                productName,
                price,
                quantity
        );

        FavoriteDto favoriteDto = new FavoriteDto(
                productUuid,
                productName,
                userId,
                price,
                quantity
        );

        String response = favoritesService.addFavorite(favoriteDto);
        Assertions.assertNotNull(response);
        Assertions.assertEquals(response, "Favorite added successfully for user id " + favoriteDto.getUserUuid() + "and product id " + favoriteDto.getProductName());
    }

    @Test
    public void addFavoriteExistentInstanceTest() {

        Favorite favorite = new Favorite(
                productUuid,
                userId,
                productName,
                price,
                quantity
        );

        favorite.setId(1L);

        FavoriteDto favoriteDto = new FavoriteDto(
                productUuid,
                productName,
                userId,
                price,
                quantity
        );

        when(favoritesRepository.findByUserUuidAndProductUuidAndProductNameAndPrice(userId, productUuid, productName, price)).thenReturn(Optional.of(favorite));
        String response = favoritesService.addFavorite(favoriteDto);
        Assertions.assertNotNull(response);
        Assertions.assertEquals(response, "Favorite with id " + favorite.getId() + " successfully updated");
    }

    @Test
    public void findAllByUserUuid() {
        Favorite favorite = new Favorite(
                productUuid,
                userId,
                productName,
                price,
                quantity
        );

        Pageable pageable = PageRequest.of(0, 10, Sort.by("dateAdded").descending());
        List<Favorite> pages = new ArrayList<>();
        pages.add(favorite);
        Page<Favorite> page = new PageImpl<Favorite>(pages, pageable, 1);
        when(favoritesRepository.findAllByUserUuid(userId, pageable)).thenReturn(page);
        Page<Favorite> pageResult = favoritesService.getFavoritesForUserUuid(userId, 0, 10);
        Assertions.assertNotNull(pageResult);
        Assertions.assertNotNull(pageResult.getContent());
        Assertions.assertEquals(1, pageResult.getTotalElements());

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

        FavoriteUpdateDto favoriteUpdateDto = new FavoriteUpdateDto(
                1L,
                quantity
        );

        when(favoritesRepository.findById(favoriteUpdateDto.getId())).thenReturn(Optional.of(favorite));
        String result = favoritesService.updateFavorite(favoriteUpdateDto);
        Assertions.assertNotNull(result);
        Assertions.assertEquals(result, "Favorite with id " + favoriteUpdateDto.getId() + " updated successfully");

    }

    @Test
    public void updateFavoriteNotFoundTest() {
        FavoriteUpdateDto favoriteUpdateDto = new FavoriteUpdateDto(
                1L,
                quantity
        );
        when(favoritesRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThrows(ResponseStatusException.class, () -> favoritesService.updateFavorite(favoriteUpdateDto));
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
        favorite.setId(1L);

        when(favoritesRepository.findById(1L)).thenReturn(Optional.of(favorite));
        String result = favoritesService.deleteFavorite(1L);
        Assertions.assertNotNull(result);
        Assertions.assertEquals(result, "Favorite with id " + favorite.getId() + " deleted successfully");

    }

    @Test
    public void deleteFavoriteNotFoundTest() {
        when(favoritesRepository.findById(1L)).thenReturn(Optional.empty());
        Assertions.assertThrows(ResponseStatusException.class, () -> favoritesService.deleteFavorite(1L));
    }
}
