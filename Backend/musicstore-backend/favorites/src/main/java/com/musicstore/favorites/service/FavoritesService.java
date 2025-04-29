package com.musicstore.favorites.service;

import com.musicstore.favorites.dto.FavoriteDto;
import com.musicstore.favorites.dto.FavoriteUpdateDto;
import com.musicstore.favorites.model.Favorite;
import com.musicstore.favorites.repository.FavoritesRepository;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class FavoritesService {

    private final FavoritesRepository favoritesRepository;

    public String addFavorite(FavoriteDto favoriteDto) {

        Optional<Favorite> existentFav = favoritesRepository.findByUserUuidAndProductUuidAndProductNameAndPrice(
          favoriteDto.getUserUuid(),
          favoriteDto.getProductUuid(),
          favoriteDto.getProductName(),
          favoriteDto.getProductPrice()
        );

        if (existentFav.isPresent()) {
            existentFav.get().setQuantity(existentFav.get().getQuantity() + favoriteDto.getQuantity());
            favoritesRepository.save(existentFav.get());
            log.info("Favorite with id " + existentFav.get().getId() + " successfully updated");
            return "Favorite with id " + existentFav.get().getId() + " successfully updated";
        }

        Favorite favorite = new Favorite(
                favoriteDto.getProductUuid(),
                favoriteDto.getUserUuid(),
                favoriteDto.getProductName(),
                favoriteDto.getProductPrice(),
                favoriteDto.getQuantity()
        );

        favoritesRepository.save(favorite);

        log.info("Favorite added successfully for user id {} and product name {}", favoriteDto.getUserUuid(), favoriteDto.getProductName());

        return "Favorite added successfully for user id " + favoriteDto.getUserUuid() + "and product id " + favoriteDto.getProductName();

    }

    public Page<Favorite> getFavoritesForUserUuid(UUID userUuid, Integer page, Integer pageSize) {

        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("dateAdded").descending());

        return favoritesRepository.findAllByUserUuid(userUuid, pageable);

    }

    public String updateFavorite(FavoriteUpdateDto favoriteUpdateDto) {

        Favorite favorite = favoritesRepository.findById(favoriteUpdateDto.getId())
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorite not found with id " + favoriteUpdateDto.getId())
                );

        favorite.setQuantity(favoriteUpdateDto.getQuantity());

        favoritesRepository.save(favorite);

        log.info("Favorite with id " + favoriteUpdateDto.getId() + " updated successfully");

        return "Favorite with id " + favoriteUpdateDto.getId() + " updated successfully";

    }

    public String deleteFavorite(Long id) {
        Favorite favorite = favoritesRepository.findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorite not found with id " + id)
                );

        favoritesRepository.delete(favorite);
        log.info("Favorite with id " + id + " deleted successfully");
        return "Favorite with id " + id + " deleted successfully";
    }
}
