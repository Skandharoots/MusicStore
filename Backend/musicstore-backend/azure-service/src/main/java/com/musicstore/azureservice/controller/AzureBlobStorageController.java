package com.musicstore.azureservice.controller;

import com.musicstore.azureservice.service.AzureBlobStorageService;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("api/azure")
@AllArgsConstructor
public class AzureBlobStorageController {

    private final AzureBlobStorageService azureBlobStorageService;

    @PostMapping("/upload")
    @ResponseStatus(HttpStatus.CREATED)
    public String uploadFile(
            @RequestPart(name = "path") String path,
            @RequestPart(name = "fileName") String fileName,
            @RequestPart(name = "file") MultipartFile file
    ) throws ResponseStatusException {
        return azureBlobStorageService.write(path, fileName, file);
    }

    @GetMapping("/read")
    public byte[] readFile(
            @RequestParam(name = "path") String path
    ) throws ResponseStatusException {
        return azureBlobStorageService.read(path);
    }

    @GetMapping("/list")
    public List<String> readAllFiles(
            @RequestParam(name = "path") String path
    ) throws ResponseStatusException {
        return azureBlobStorageService.listFiles(path);
    }

    @PutMapping("/update")
    public String updateFile(
            @RequestPart(name = "path") String path,
            @RequestPart(name = "fileName") String fileName,
            @RequestPart(name = "file") MultipartFile file
    ) throws ResponseStatusException {
        return azureBlobStorageService.update(path, fileName, file);
    }

    @DeleteMapping("/delete")
    public String deleteFile(
            @RequestParam(name = "path") String path
    ) throws ResponseStatusException {
        return azureBlobStorageService.delete(path);
    }
}
