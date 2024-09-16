package com.musicstore.azureservice.controller;

import com.musicstore.azureservice.service.AzureBlobStorageService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("api/azure")
@AllArgsConstructor
public class AzureBlobStorageController {

	private final AzureBlobStorageService azureBlobStorageService;

	@PostMapping("/upload")
	@ResponseStatus(HttpStatus.CREATED)
	public String uploadFile(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@RequestPart(name = "path") String path,
			@RequestPart(name = "fileName") String fileName,
			@RequestPart(name = "file") MultipartFile file
	) throws ResponseStatusException {
		return azureBlobStorageService.write(token, path, fileName, file);
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
			@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@RequestPart(name = "path") String path,
			@RequestPart(name = "fileName") String fileName,
			@RequestPart(name = "file") MultipartFile file
	) throws ResponseStatusException {
		return azureBlobStorageService.update(token, path, fileName, file);
	}

	@DeleteMapping("/delete")
	public String deleteFile(
			@RequestHeader(HttpHeaders.AUTHORIZATION) String token,
			@RequestParam(name = "path") String path
	) throws ResponseStatusException {
		return azureBlobStorageService.delete(token, path);
	}
}
