package com.musicstore.opinions.service;

import static org.mockito.Mockito.when;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.*;

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
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);
        OpinionRequestDto opinionRequestDto = new OpinionRequestDto(productUuid, productName, userId, username, rating,
                comment);

        when(opinionRepository.save(Mockito.any(Opinion.class))).thenReturn(opinion);
        String response = opinionService.addOpinion(opinionRequestDto);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isEqualTo("Opinion added successfully");

    }

    @Test
    public void addOpinionAlreadyExistsTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        OpinionRequestDto opinionRequestDto = new OpinionRequestDto(productUuid, "Strat", userId, "John Doe",
                Rating.FIVE, "This is a test comment");
        when(opinionRepository.findByProductUuidAndUserId(productUuid, userId)).thenReturn(Optional.of(new Opinion()));
        Assertions.assertThatThrownBy(() -> opinionService.addOpinion(opinionRequestDto))
                .isInstanceOf(ResponseStatusException.class);

    }

    @Test
    public void getOpinionsByUsernameTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);
        Pageable pageable = PageRequest.of(0, 10, Sort.by("dateAdded").descending());
        List<Opinion> opinions = new ArrayList<>();
        opinions.add(opinion);
        Page<Opinion> opinionsPage = new PageImpl<>(opinions, pageable, opinions.size());

        when(opinionRepository.findAllByUserId(userId, pageable)).thenReturn(opinionsPage);
        Page<Opinion> opinions2 = opinionService.getOpinionsByUsername(userId, 0, 10);
        Assertions.assertThat(opinions2).isNotNull();
        Assertions.assertThat(opinions2).hasSize(1);
    }

    @Test
    public void getOpinionByProductIdAndUserIdTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);

        when(opinionRepository.findByProductUuidAndUserId(productUuid, userId)).thenReturn(Optional.of(opinion));
        Optional<Opinion> opinion2 = opinionService.getOpinionByProductIdAndUserId(productUuid, userId);
        Assertions.assertThat(opinion2).isNotNull();
        Assertions.assertThat(opinion2.get()).isEqualTo(opinion);
    }

    @Test
    public void getOpinionByProductIdAndUserIdNotFoundTest() {

        UUID uuid = UUID.randomUUID();
        when(opinionRepository.findByProductUuidAndUserId(uuid, uuid)).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> opinionService.getOpinionByProductIdAndUserId(uuid, uuid))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("Opinion not found");
    }

    @Test
    public void getOpinionsByProductIdTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);
        Pageable pageable = PageRequest.of(0, 10, Sort.by("dateAdded").descending());
        List<Opinion> opinions = new ArrayList<>();
        opinions.add(opinion);
        Page<Opinion> opinionsPage = new PageImpl<>(opinions, pageable, opinions.size());

        when(opinionRepository.findAllByProductUuid(productUuid, pageable)).thenReturn(opinionsPage);
        Page<Opinion> opinions2 = opinionService.getOpinionsByProductId(productUuid, 0, 10);
        Assertions.assertThat(opinions2).isNotNull();
        Assertions.assertThat(opinions2).hasSize(1);
        Assertions.assertThat(opinions2.getContent().get(0)).isEqualTo(opinion);
    }

    @Test
    public void getAllOpinionsByProductUuidTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);
        List<Opinion> opinions = new ArrayList<>();
        opinions.add(opinion);

        when(opinionRepository.findAllByProductUuid(productUuid)).thenReturn(opinions);
        List<Opinion> result = opinionService.getAllOpinionsByProductId(productUuid);
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result).hasSize(1);

    }

    @Test
    public void getOpinionByIdTest() {

        UUID productUuid = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String username = "John Doe";
        Rating rating = Rating.FIVE;
        String comment = "This is a test comment";
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);

        when(opinionRepository.findById(opinion.getId())).thenReturn(Optional.of(opinion));
        Optional<Opinion> opinion2 = opinionService.getOpinionById(opinion.getId());
        Assertions.assertThat(opinion2).isNotNull();
        Assertions.assertThat(opinion2.get()).isEqualTo(opinion);
    }

    @Test
    public void getOpinionByIdNotFoundTest() {

        when(opinionRepository.findById(Mockito.anyLong())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> opinionService.getOpinionById(1L))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("Opinion not found");
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
        String productName = "Strat";
        Opinion opinion = new Opinion(productUuid, productName, userId, username, rating, comment);
        OpinionRequestDto opinionRequestDto = new OpinionRequestDto(productUuid, productName, userId, username, rating2,
                comment2);

        when(opinionRepository.findById(opinion.getId())).thenReturn(Optional.of(opinion));
        String response = opinionService.updateOpinion(opinion.getId(), opinionRequestDto);
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isEqualTo("Opinion updated successfully");

    }

    @Test
    public void updateOpinionNotFoundTest() {

        when(opinionRepository.findById(Mockito.anyLong())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> opinionService.updateOpinion(1L, new OpinionRequestDto()))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("Opinion with id 1 not found");

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

        when(opinionRepository.findById(opinion.getId())).thenReturn(Optional.of(opinion));
        String response = opinionService.deleteOpinion(opinion.getId());
        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isEqualTo("Opinion deleted successfully");
    }

    @Test
    public void deleteOpinionNotFoundTest() {

        when(opinionRepository.findById(Mockito.anyLong())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> opinionService.deleteOpinion(1L))
                .isInstanceOf(ResponseStatusException.class).hasMessageContaining("Opinion not found");
    }

}
