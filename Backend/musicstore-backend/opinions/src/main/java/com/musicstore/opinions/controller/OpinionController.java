package com.musicstore.opinions.controller;

import com.musicstore.opinions.dto.OpinionRequestDto;
import com.musicstore.opinions.model.Opinion;
import com.musicstore.opinions.service.OpinionService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
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
@RequestMapping("/api/opinions")
public class OpinionController {

    private final OpinionService opinionService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public String addOpinion(@Valid @RequestBody OpinionRequestDto opinionRequestDto) {
        return opinionService.addOpinion(opinionRequestDto);
    }

    @GetMapping("/get/{productId}")
    public Page<Opinion> getOpinionsByProductId(
            @PathVariable UUID productId,
            @RequestParam Integer page,
            @RequestParam Integer pageSize) {
        return opinionService.getOpinionsByProductId(productId, page, pageSize);
    }

    @GetMapping("/get/user/{productId}/{userId}")
    public Optional<Opinion> getOpinionByProductIdAndUserId(@PathVariable UUID productId, @PathVariable UUID userId) {
        return opinionService.getOpinionByProductIdAndUserId(productId, userId);
    }

    @GetMapping("/get/users/{userId}")
    public Page<Opinion> getOpinionsByUserId(
            @PathVariable UUID userId,
            @RequestParam Integer page,
            @RequestParam Integer pageSize) {
        return opinionService.getOpinionsByUsername(userId, page, pageSize);
    }

    @GetMapping("/get/opinion/{opinionId}")
    public Optional<Opinion> getOpinionById(@PathVariable Long opinionId) {
        return opinionService.getOpinionById(opinionId);
    }

    @PutMapping("/update/{opinionId}")
    public String updateOpinion(@PathVariable Long opinionId,
            @Valid @RequestBody OpinionRequestDto opinionRequestDto) {
        return opinionService.updateOpinion(opinionId, opinionRequestDto);
    }

    @DeleteMapping("/delete/{opinionId}")
    public String deleteOpinion(@PathVariable Long opinionId) {
        return opinionService.deleteOpinion(opinionId);
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