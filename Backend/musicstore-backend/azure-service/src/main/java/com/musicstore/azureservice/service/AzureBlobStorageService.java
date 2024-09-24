package com.musicstore.azureservice.service;

import com.azure.core.http.rest.PagedIterable;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
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

    @Override
    public String write(String path, String fileName, MultipartFile file)
            throws ResponseStatusException {

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
    public String update(String path, String fileName, MultipartFile file)
            throws ResponseStatusException {

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
    public String delete(String path) throws ResponseStatusException {

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

}
