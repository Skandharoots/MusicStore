package com.musicstore.favorites.controller;

import com.musicstore.favorites.dto.FavoriteDto;
import com.musicstore.favorites.dto.FavoriteUpdateDto;
import com.musicstore.favorites.model.Favorite;
import com.musicstore.favorites.service.FavoritesService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController
@AllArgsConstructor
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoritesService favoritesService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public String createFavorite(@Valid @RequestBody FavoriteDto favoriteDto) {
        return favoritesService.addFavorite(favoriteDto);
    }

    @GetMapping("/get/{uuid}")
    public Page<Favorite> getFavorite(
            @PathVariable UUID uuid,
            @RequestParam(name = "page") Integer page,
            @RequestParam(name = "pageSize") Integer pageSize
    ) {
        return favoritesService.getFavoritesForUserUuid(uuid, page, pageSize);
    }

    @PutMapping("/update")
    public String updateFavorite(
            @Valid @RequestBody FavoriteUpdateDto favoriteDto
    ) {
        return favoritesService.updateFavorite(favoriteDto);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteFavorite(@PathVariable Long id) {
        return favoritesService.deleteFavorite(id);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }

}
