package com.musicstore.favorites.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.favorites.dto.FavoriteDto;
import com.musicstore.favorites.dto.FavoriteUpdateDto;
import com.musicstore.favorites.model.Favorite;
import com.musicstore.favorites.service.FavoritesService;
import jakarta.ws.rs.core.MediaType;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = FavoriteController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
public class FavoriteControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
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

    @Test
    public void addFavoriteTest() throws Exception {

        mockMvc.perform(post("/api/favorites/create")
        .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(favoriteDto)))
                .andExpect(MockMvcResultMatchers.status().isCreated());
    }

    @Test
    public void addFavoriteBadRequestTest() throws Exception {

        FavoriteDto favoriteDtoBad = new FavoriteDto();

        mockMvc.perform(post("/api/favorites/create")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(favoriteDtoBad)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void getFavoritesByUserUuidTest() throws Exception {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("dateAdded").descending());
        List<Favorite> favorites = new ArrayList<>();
        favorites.add(favorite);
        Page<Favorite> page = new PageImpl<>(favorites, pageable, 1);
        when(favoritesService.getFavoritesForUserUuid(userId, 0, 10)).thenReturn(page);

        mockMvc.perform(get("/api/favorites/get/{uuid}", userId)
                        .param("page", "0")
                        .param("pageSize", "10"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    public void updateFavoriteTest() throws Exception {
        FavoriteUpdateDto favoriteUpdateDto = new FavoriteUpdateDto(
                1L,
                newQuantity
        );

        mockMvc.perform(put("/api/favorites/update")
        .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(favoriteUpdateDto)))
                .andExpect(MockMvcResultMatchers.status().isOk());


    }

    @Test
    public void updateFavoriteBadRequestTest() throws Exception {
        FavoriteUpdateDto favoriteUpdateDtoBad = new FavoriteUpdateDto();
        favoriteUpdateDtoBad.setId(1L);

        mockMvc.perform(put("/api/favorites/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(favoriteUpdateDtoBad)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void deleteFavoriteTest() throws Exception {

        mockMvc.perform(delete("/api/favorites/delete/{id}", 1L))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

}
