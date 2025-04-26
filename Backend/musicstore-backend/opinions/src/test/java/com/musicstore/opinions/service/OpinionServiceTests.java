package com.musicstore.opinions.service;

import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import jakarta.ws.rs.NotFoundException;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import com.musicstore.opinions.dto.OpinionRequestDto;
import com.musicstore.opinions.model.Opinion;
import com.musicstore.opinions.model.Rating;
import com.musicstore.opinions.repository.OpinionRepository;

@ExtendWith(MockitoExtension.class)
public class OpinionServiceTests {

    @Mock
    private OpinionRepository opinionRepository;

    @InjectMocks
    private OpinionService opinionService;

    @Test
    public void addOpinionTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";

        Opinion opinion = new Opinion(productUuid, userId, username, rating, comment);
        OpinionRequestDto opinionRequestDto = new OpinionRequestDto(productUuid, userId, username, rating, comment);

        when(opinionRepository.save(Mockito.any(Opinion.class))).thenReturn(opinion);
        String response = opinionService.addOpinion(opinionRequestDto);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isEqualTo("Opinion added successfully");

    }

    @Test
    public void getOpinionsByUsernameTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";

        Opinion opinion = new Opinion(productUuid, userId, username, rating, comment);

        when(opinionRepository.findAllByUserId(userId)).thenReturn(List.of(opinion));
        List<Opinion> opinions = opinionService.getOpinionsByUsername(userId);
        Assertions.assertThat(opinions).isNotNull();
        Assertions.assertThat(opinions).hasSize(1);
        Assertions.assertThat(opinions.get(0)).isEqualTo(opinion);
    }

    @Test
    public void getOpinionByProductIdAndUserIdTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";

        Opinion opinion = new Opinion(productUuid, userId, username, rating, comment);

        when(opinionRepository.findByProductUuidAndUserId(productUuid, userId)).thenReturn(Optional.of(opinion));
        Optional<Opinion> opinion2 = opinionService.getOpinionByProductIdAndUserId(productUuid, userId);
        Assertions.assertThat(opinion2).isNotNull();
        Assertions.assertThat(opinion2.get()).isEqualTo(opinion);
    }

    @Test
    public void getOpinionByProductIdAndUserIdNotFoundTest() {

        UUID uuid = UUID.randomUUID();
        when(opinionRepository.findByProductUuidAndUserId(uuid, uuid)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> opinionService.getOpinionByProductIdAndUserId(uuid, uuid)).isInstanceOf(ResponseStatusException.class).hasMessageContaining("Opinion not found");
    }

    @Test
    public void getOpinionsByProductIdTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";

        Opinion opinion = new Opinion(productUuid, userId, username, rating, comment);

        when(opinionRepository.findAllByProductUuid(productUuid)).thenReturn(List.of(opinion));
        List<Opinion> opinions = opinionService.getOpinionsByProductId(productUuid);
        Assertions.assertThat(opinions).isNotNull();
        Assertions.assertThat(opinions).hasSize(1);
        Assertions.assertThat(opinions.get(0)).isEqualTo(opinion);
    }

    @Test
    public void getOpinionByIdTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";

        Opinion opinion = new Opinion(productUuid, userId, username, rating, comment);

        when(opinionRepository.findById(opinion.getId())).thenReturn(Optional.of(opinion));
        Optional<Opinion> opinion2 = opinionService.getOpinionById(opinion.getId());
        Assertions.assertThat(opinion2).isNotNull();
        Assertions.assertThat(opinion2.get()).isEqualTo(opinion);
    }

    @Test
    public void getOpinionByIdNotFoundTest() {

        when(opinionRepository.findById(Mockito.anyLong())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> opinionService.getOpinionById(1L)).isInstanceOf(ResponseStatusException.class).hasMessageContaining("Opinion not found");
    }

    @Test
    public void updateOpinionTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        Rating rating2 = Rating.FOUR;
        String comment2 = "This is a test comment 2";

        Opinion opinion = new Opinion(productUuid, userId, username, rating, comment);
        OpinionRequestDto opinionRequestDto = new OpinionRequestDto(productUuid, userId, username, rating2, comment2);

        when(opinionRepository.findById(opinion.getId())).thenReturn(Optional.of(opinion));
        String response = opinionService.updateOpinion(opinion.getId(), opinionRequestDto);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isEqualTo("Opinion updated successfully");
        
    }

    @Test
    public void updateOpinionNotFoundTest() {

        when(opinionRepository.findById(Mockito.anyLong())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> opinionService.updateOpinion(1L, new OpinionRequestDto())).isInstanceOf(ResponseStatusException.class).hasMessageContaining("Opinion with id 1 not found");

    }

    @Test
    public void deleteOpinionTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";

        Opinion opinion = new Opinion(productUuid, userId, username, rating, comment);

        when(opinionRepository.findById(opinion.getId())).thenReturn(Optional.of(opinion));
        String response = opinionService.deleteOpinion(opinion.getId());
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isEqualTo("Opinion deleted successfully");
    }

    @Test
    public void deleteOpinionNotFoundTest() {

        when(opinionRepository.findById(Mockito.anyLong())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> opinionService.deleteOpinion(1L)).isInstanceOf(ResponseStatusException.class).hasMessageContaining("Opinion not found");
    }

}
