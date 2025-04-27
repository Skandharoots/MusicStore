package com.musicstore.opinions.controller;

import java.util.UUID;

import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.opinions.dto.OpinionRequestDto;
import com.musicstore.opinions.model.Opinion;
import com.musicstore.opinions.model.Rating;
import com.musicstore.opinions.service.OpinionService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = OpinionController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@RunWith(SpringRunner.class)
public class OpinionControllerTests {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private OpinionService opinionService;

        @Test
        public void addOpinionTest() throws Exception {
                OpinionRequestDto opinionRequestDto = OpinionRequestDto
                                .builder()
                                .productUuid(UUID.randomUUID())
                                .productName("Strat")
                                .userId(UUID.randomUUID())
                                .username("John Doe")
                                .rating(Rating.FIVE)
                                .comment("This is a test comment")
                                .build();

                mockMvc.perform(post("/api/opinions/create")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(opinionRequestDto)))
                                .andExpect(MockMvcResultMatchers.status().isCreated());
        }

        @Test
        public void addOpinionBadRequestTest() throws Exception {
                OpinionRequestDto opinionRequestDto = OpinionRequestDto
                                .builder()
                                .build();

                mockMvc.perform(post("/api/opinions/create")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(opinionRequestDto)))
                                .andExpect(MockMvcResultMatchers.status().isBadRequest());
        }

        @Test
        public void getOpinionsByProductIdTest() throws Exception {
                UUID productId = UUID.randomUUID();
                Opinion opinion = new Opinion(
                                productId,
                                "Strat",
                                UUID.randomUUID(),
                                "John Doe",
                                Rating.FIVE,
                                "This is a test comment");

                Pageable pageable = PageRequest.of(0, 10, Sort.by("dateAdded").descending());
                List<Opinion> opinions = new ArrayList<>();
                opinions.add(opinion);
                Page<Opinion> opinionsPage = new PageImpl<>(opinions, pageable, opinions.size());

                when(opinionService.getOpinionsByProductId(productId, 0, 10)).thenReturn(opinionsPage);
                mockMvc.perform(get("/api/opinions/get/{productId}", productId)
                .param("page", "0")
                .param("pageSize", "10"))
                                .andExpect(MockMvcResultMatchers.status().isOk());
        }

        @Test
        public void getOpinionByProductIdAndUserIdTest() throws Exception {
                UUID productId = UUID.randomUUID();
                UUID userId = UUID.randomUUID();
                Opinion opinion = new Opinion(
                                productId,
                                "Strat",
                                UUID.randomUUID(),
                                "John Doe",
                                Rating.FIVE,
                                "This is a test comment");


                when(opinionService.getOpinionByProductIdAndUserId(productId, userId)).thenReturn(Optional.of(opinion));
                mockMvc.perform(get("/api/opinions/get/user/{productId}/{userId}", productId, userId))
                                .andExpect(MockMvcResultMatchers.status().isOk());
        }

        @Test
        public void getOpinionByIdTest() throws Exception {
                Long opinionId = 1L;
                UUID productId = UUID.randomUUID();
                UUID userId = UUID.randomUUID();
                Opinion opinion = new Opinion(
                                productId,
                                "Strat",
                                UUID.randomUUID(),
                                "John Doe",
                                Rating.FIVE,
                                "This is a test comment");
                when(opinionService.getOpinionById(opinionId)).thenReturn(Optional.of(opinion));
                mockMvc.perform(get("/api/opinions/get/opinion/{opinionId}", opinionId))
                                .andExpect(MockMvcResultMatchers.status().isOk())
                                .andExpect(MockMvcResultMatchers.content()
                                                .json(objectMapper.writeValueAsString(Optional.of(opinion))));

        }

        @Test
        public void getOpinionsByUserIdTest() throws Exception {
        
                UUID productId = UUID.randomUUID();
                UUID userId = UUID.randomUUID();
                Opinion opinion = new Opinion(
                                productId,
                                "Strat",
                                userId,
                                "John Doe",
                                Rating.FIVE,
                                "This is a test comment");
                Pageable pageable = PageRequest.of(0, 10, Sort.by("dateAdded").descending());
                List<Opinion> opinions = new ArrayList<>();
                opinions.add(opinion);
                Page<Opinion> opinionsPage = new PageImpl<>(opinions, pageable, opinions.size());
                when(opinionService.getOpinionsByUsername(userId, 0, 10)).thenReturn(opinionsPage);
                mockMvc.perform(get("/api/opinions/get/users/{userId}", userId)
                .param("page", "0")
                .param("pageSize", "10"))
                                .andExpect(MockMvcResultMatchers.status().isOk());
                
        }

        @Test
        public void updateOpinionTest() throws Exception {
                Long opinionId = 1L;
                OpinionRequestDto opinionRequestDto = OpinionRequestDto
                                .builder()
                                .productUuid(UUID.randomUUID())
                                .productName("Strat")
                                .userId(UUID.randomUUID())
                                .username("John Doe")
                                .rating(Rating.FIVE)
                                .comment("This is a test comment")
                                .build();
                when(opinionService.updateOpinion(opinionId, opinionRequestDto))
                                .thenReturn("Opinion updated successfully");
                mockMvc.perform(put("/api/opinions/update/{opinionId}", opinionId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(opinionRequestDto)))
                                .andExpect(MockMvcResultMatchers.status().isOk());
        }

        @Test
        public void updateOpinionBadRequestTest() throws Exception {
                Long opinionId = 1L;
                OpinionRequestDto opinionRequestDto = OpinionRequestDto
                                .builder()
                                .build();

                mockMvc.perform(put("/api/opinions/update/{opinionId}", opinionId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(opinionRequestDto)))
                                .andExpect(MockMvcResultMatchers.status().isBadRequest());
        }

        @Test
        public void deleteOpinionTest() throws Exception {
                Long opinionId = 1L;
                mockMvc.perform(delete("/api/opinions/delete/{opinionId}", opinionId))
                                .andExpect(MockMvcResultMatchers.status().isOk());
        }

}