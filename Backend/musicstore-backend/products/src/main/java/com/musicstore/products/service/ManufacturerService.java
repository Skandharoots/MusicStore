package com.musicstore.products.service;

import com.musicstore.products.dto.ManufacturerRequest;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.repository.ManufacturerRepository;
import com.musicstore.products.security.config.VariablesConfiguration;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class ManufacturerService {

    private final ManufacturerRepository manufacturerRepository;

    private final WebClient.Builder webClient;

    private final VariablesConfiguration variablesConfiguration;

    public String createManufacturers(String token, ManufacturerRequest manufacturer) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        Manufacturer newManufacturer = new Manufacturer(manufacturer.getName());


        manufacturerRepository.save(newManufacturer);
        log.info("Manufacturer created: " + newManufacturer.getName());

        return "Manufacturers created";
    }

    public List<Manufacturer> getAllManufacturers() {
        return manufacturerRepository.findAll();
    }

    public Manufacturer getManufacturerById(Long id) {
        return manufacturerRepository
                .findById(id)
                .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Manufacturer not found")
                );
    }

    public List<Manufacturer> findAllBySearchParameters(Long categoryId, String country, String subcategory, String subcategoryTierTwo) {
        return manufacturerRepository.findAllBySearchParameters(categoryId, country, subcategory, subcategoryTierTwo);
    }

    @Transactional
    public ResponseEntity<String> updateManufacturer(String token, Long id, ManufacturerRequest manufacturer) {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        Manufacturer manufacurerToUpdate = manufacturerRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Manufacturer not found")
                );

        manufacurerToUpdate.setName(manufacturer.getName());

        manufacturerRepository.save(manufacurerToUpdate);
        log.info("Manufacturer updated: " + manufacurerToUpdate.getName());

        return ResponseEntity.ok("Manufacturer updated");

    }

    @Transactional
    public ResponseEntity<String> deleteManufacturer(String token, Long id) {
        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        Manufacturer manufacurerToDelete = manufacturerRepository
                .findById(id)
                .orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Manufacturer not found")
                );

        manufacturerRepository.delete(manufacurerToDelete);
        log.info("Manufacturer deleted: " + manufacurerToDelete.getName());

        return ResponseEntity.ok("Manufacturer deleted");
    }

    private Boolean doesUserHaveAdminAuthorities(String token) {

        if (!token.startsWith("Bearer ")) {
            log.error("Invalid token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid token");
        }

        String jwtToken = token.substring("Bearer ".length());

        return webClient
                .build()
                .get()
                .uri(variablesConfiguration.getAdminUrl() + jwtToken)
                .retrieve()
                .bodyToMono(Boolean.class)
                .block();

    }
}
