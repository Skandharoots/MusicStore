package com.musicstore.azureservice.service;

import com.azure.core.http.rest.PagedIterable;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobItem;
import com.azure.storage.blob.models.BlobStorageException;
import com.musicstore.azureservice.config.AzureBlobStorageConfiguration;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class AzureBlobStorageService implements IAzureBlobStorage {

    private final BlobContainerClient blobContainerClient;

    private final BlobServiceClient blobServiceClient;

    private final AzureBlobStorageConfiguration azureBlobStorageConfiguration;

    private final WebClient.Builder webClient;

    @Override
    public String write(String token, String path, String fileName, MultipartFile file)
            throws ResponseStatusException {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        try {
            BlobClient blobClient = blobContainerClient.getBlobClient(path + "/" + fileName);
            blobClient.upload(file.getInputStream(), false);
            log.info("File uploaded successfully - " + fileName);
            return path + "/" + fileName;
        } catch (BlobStorageException e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getServiceMessage());
        } catch (Exception e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @Override
    public byte[] read(String path) throws ResponseStatusException {
        try {
            BlobClient client = blobContainerClient.getBlobClient(path);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            client.download(outputStream);
            final byte[] bytes = outputStream.toByteArray();
            return bytes;
        } catch (BlobStorageException e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getServiceMessage());
        } catch (Exception e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @Override
    public List<String> listFiles(String path) throws ResponseStatusException {
        try {
            PagedIterable<BlobItem> blobList = blobContainerClient.listBlobsByHierarchy(path + "/");
            List<String> blobNamesList = new ArrayList<>();
            for (BlobItem blob : blobList) {
                blobNamesList.add(blob.getName());
            }
            return blobNamesList;
        } catch (BlobStorageException e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getServiceMessage());
        } catch (Exception e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @Override
    public String update(String token, String path, String fileName, MultipartFile file)
            throws ResponseStatusException {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        try {
            BlobClient client = blobContainerClient.getBlobClient(path);
            client.delete();
            int index = path.lastIndexOf("/");
            client = blobContainerClient.getBlobClient(path.substring(0, index) + "/" + fileName);
            client.upload(file.getInputStream(), true);
            log.info("File updated successfully - " + fileName);
            return path.substring(0, index) + "/" + fileName;

        } catch (BlobStorageException e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getServiceMessage());
        } catch (Exception e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @Override
    public String delete(String token, String path) throws ResponseStatusException {

        if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
            log.error("No admin authority for token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No admin authority");
        }

        try {
            BlobClient client = blobContainerClient.getBlobClient(path);
            client.delete();
            log.info("File deleted successfully - " + path);
            return "File deleted";

        } catch (BlobStorageException e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getServiceMessage());
        } catch (Exception e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    @Override
    public void createContainer(String name) throws Exception {
        try {
            blobServiceClient.createBlobContainer(name);
            log.info("Container Created");
        } catch (BlobStorageException e) {
            throw new Exception(e.getServiceMessage());
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public void deleteContainer(String name) throws Exception {
        try {
            blobServiceClient.deleteBlobContainer(name);
            log.info("Container Deleted");
        } catch (BlobStorageException e) {
            throw new Exception(e.getServiceMessage());
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    private Boolean doesUserHaveAdminAuthorities(String token) {

        if (!token.startsWith("Bearer ")) {
            log.error("No admin privileges, invalid token - " + token);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid token");
        }

        String jwtToken = token.substring("Bearer ".length());

        return webClient
                .build()
                .get()
                .uri(azureBlobStorageConfiguration.getAdminUrl() + jwtToken)
                .retrieve()
                .bodyToMono(Boolean.class)
                .block();

    }

}
