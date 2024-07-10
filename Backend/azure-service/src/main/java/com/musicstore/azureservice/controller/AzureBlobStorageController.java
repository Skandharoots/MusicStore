package com.musicstore.azureservice.controller;

import com.musicstore.azureservice.exceptions.AzureBlobStorageException;
import com.musicstore.azureservice.service.AzureBlobStorageService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/azure")
@AllArgsConstructor
public class AzureBlobStorageController {

	private final AzureBlobStorageService azureBlobStorageService;

	@PostMapping("/upload")
	public String uploadFile(@RequestPart(name = "path") String path,
							 @RequestPart(name = "fileName") String fileName,
							 @RequestPart(name = "file") MultipartFile file) throws AzureBlobStorageException {
		return azureBlobStorageService.write(path, fileName, file);
	}

	@GetMapping("/read")
	public byte[] readFile(@RequestParam(name = "path") String path) throws AzureBlobStorageException {
		return azureBlobStorageService.read(path);
	}

	@GetMapping("/list")
	public List<String> readAllFiles(@RequestParam(name = "path") String path) throws AzureBlobStorageException {
		return azureBlobStorageService.listFiles(path);
	}

	@PutMapping("/update")
	public String updateFile(@RequestPart(name = "path") String path,
							 @RequestPart(name = "fileName") String name,
							 @RequestPart(name = "file") MultipartFile file) throws AzureBlobStorageException {
		return azureBlobStorageService.update(path, name, file);
	}

	@DeleteMapping("/delete")
	public void deleteFile(@RequestParam(name = "path") String path) throws AzureBlobStorageException {
		azureBlobStorageService.delete(path);
	}
}
