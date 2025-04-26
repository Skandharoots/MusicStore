package com.musicstore.opinions.service;

import com.musicstore.opinions.dto.OpinionRequestDto;
import com.musicstore.opinions.model.Opinion;
import com.musicstore.opinions.repository.OpinionRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class OpinionService {

    private final OpinionRepository opinionRepository;

    public String addOpinion(OpinionRequestDto opinionRequestDto) {

        Opinion opinion = Opinion.builder()
                .productUuid(opinionRequestDto.getProductUuid())
                .userId(opinionRequestDto.getUserId())
                .username(opinionRequestDto.getUsername())
                .rating(opinionRequestDto.getRating())
                .comment(opinionRequestDto.getComment())
                .build();

        opinionRepository.save(opinion);

        log.info("Opinion for product {} added successfully", opinionRequestDto.getProductUuid());

        return "Opinion added successfully";
    }

    public List<Opinion> getOpinionsByUsername(UUID userId) {

        List<Opinion> opinions = opinionRepository.findAllByUserId(userId);

        return opinions;

    }

    public Optional<Opinion> getOpinionByProductIdAndUserId(UUID productId, UUID userId) {

        Optional<Opinion> opinion = Optional.ofNullable(opinionRepository.findByProductUuidAndUserId(productId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opinion not found")));

        return opinion;

    }

    public List<Opinion> getOpinionsByProductId(UUID productId) {

        List<Opinion> opinions = opinionRepository.findAllByProductUuid(productId);

        return opinions;

    }

    public Optional<Opinion> getOpinionById(Long opinionId) {

        Optional<Opinion> opinion = Optional.ofNullable(opinionRepository.findById(opinionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Opinion not found")));
        return opinion;

    }

    public String updateOpinion(Long opinionId, OpinionRequestDto opinionRequestDto) {

        Optional<Opinion> opinion = opinionRepository.findById(opinionId);

        if (!opinion.isPresent()) {
            log.error("Opinion with id {} not found", opinionId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Opinion with id " + opinionId + " not found");
        }

        opinion.get().setComment(opinionRequestDto.getComment());
        opinion.get().setRating(opinionRequestDto.getRating());

        opinionRepository.save(opinion.get());

        log.info("Opinion with id {} updated successfully", opinionId);

        return "Opinion updated successfully";

    }

    public String deleteOpinion(Long opinionId) {

        Optional<Opinion> opinion = opinionRepository.findById(opinionId);

        if (!opinion.isPresent()) {
            log.error("Opinion with id {} not found", opinionId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Opinion not found");
        }

        opinionRepository.delete(opinion.get());

        log.info("Opinion with id {} deleted successfully", opinionId);

        return "Opinion deleted successfully";
    }

}
