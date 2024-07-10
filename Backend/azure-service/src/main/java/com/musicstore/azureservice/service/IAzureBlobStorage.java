package com.musicstore.azureservice.service;

import com.musicstore.azureservice.exceptions.AzureBlobStorageException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IAzureBlobStorage {

	String write(String path, String fileName, MultipartFile file) throws AzureBlobStorageException;

	String update(String path, String fileName, MultipartFile file) throws AzureBlobStorageException;

	byte[] read(String path) throws AzureBlobStorageException;

	List<String> listFiles(String path) throws AzureBlobStorageException;

	void delete(String path) throws AzureBlobStorageException;

	void createContainer() throws AzureBlobStorageException;

	void deleteContainer() throws AzureBlobStorageException;
}
