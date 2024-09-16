package com.musicstore.azureservice.api.service;

import com.musicstore.azureservice.service.AzureBlobStorageService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@SpringBootTest
public class AzureBlobStorageServiceTests {

//    @Autowired
//    private AzureBlobStorageService azureBlobStorageService;
//
//    private String path = "/tests";
//
//    private String filename = "test.txt";
//
//
//    @Test
//    public void writeFileGetFileAndDeleteFile() throws ResponseStatusException {
//
//        MultipartFile multipartFile = new MockMultipartFile("file", "test.txt", "text/plain", "Hello World".getBytes());
//
//        String pathReturned = azureBlobStorageService.write(path, filename, multipartFile);
//        Assertions.assertThat(pathReturned).isEqualTo(path + "/" + filename);
//
//        List<String> filesList = azureBlobStorageService.listFiles(path);
//        Assertions.assertThat(filesList).hasSize(1);
//        Assertions.assertThat(filesList.get(0)).isEqualTo(path + "/" + filename);
//
//        azureBlobStorageService.delete(filesList.get(0));
//        List<String> filesList2 = azureBlobStorageService.listFiles(path);
//        Assertions.assertThat(filesList2).hasSize(0);
//
//    }
//
//    @Test
//    public void writeFileGetPathAndDownloadFile() throws ResponseStatusException {
//        MultipartFile multipartFile = new MockMultipartFile("file", "test.txt", "text/plain", "Hello World".getBytes());
//
//        String pathReturned = azureBlobStorageService.write(path, filename, multipartFile);
//        Assertions.assertThat(pathReturned).isEqualTo(path + "/" + filename);
//
//        byte[] bytes = azureBlobStorageService.read(pathReturned);
//
//        Assertions.assertThat(bytes).isNotNull();
//        Assertions.assertThat(bytes.length).isGreaterThan(0);
//        azureBlobStorageService.delete(pathReturned);
//
//    }
//
//    @Test
//    public void writeFileAndThenUpdateTheFile() throws ResponseStatusException {
//
//        MultipartFile multipartFile = new MockMultipartFile("file", "test.txt", "text/plain", "Hello World".getBytes());
//        MultipartFile multipartFile2 = new MockMultipartFile("file2", "test.txt", "text/plain", "Hello World".getBytes());
//
//        String pathReturned = azureBlobStorageService.write(path, filename, multipartFile);
//        Assertions.assertThat(pathReturned).isEqualTo(path + "/" + filename);
//
//        String updatedPath = azureBlobStorageService.update(pathReturned, multipartFile2.getName() , multipartFile2);
//        Assertions.assertThat(updatedPath).isEqualTo(path + "/" + multipartFile2.getName());
//
//        azureBlobStorageService.delete(updatedPath);
//    }



}
