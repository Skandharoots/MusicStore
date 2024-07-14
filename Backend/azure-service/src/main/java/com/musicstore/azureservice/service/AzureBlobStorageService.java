package com.musicstore.azureservice.service;

import com.azure.core.http.rest.PagedIterable;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobItem;
import com.azure.storage.blob.models.BlobStorageException;
import com.musicstore.azureservice.exceptions.AzureBlobStorageException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class AzureBlobStorageService implements IAzureBlobStorage {


	private final BlobServiceClient blobServiceClient;

	private final BlobContainerClient blobContainerClient;

	private final WebClient.Builder webClient;

	@Value("${spring.cloud.azure.storage.blob.container-name}")
	private String containerName;

	@Override
	public String write(String token, String path, String fileName, MultipartFile file) throws AzureBlobStorageException {

		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}
		try {
			BlobClient blobClient = blobContainerClient.getBlobClient(path + "/" + fileName);
			blobClient.upload(file.getInputStream(), false);
			return path;
		} catch (BlobStorageException e) {
			throw new AzureBlobStorageException(e.getServiceMessage());
		} catch (Exception e) {
			throw new AzureBlobStorageException(e.getMessage());
		}
	}

	@Override
	public byte[] read(String path) throws AzureBlobStorageException {
		try {
			BlobClient client = blobContainerClient.getBlobClient(path);
			ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
			client.download(outputStream);
			final byte[] bytes = outputStream.toByteArray();
			return bytes;
		} catch(BlobStorageException e){
			throw new AzureBlobStorageException(e.getServiceMessage());
		} catch (Exception e){
			throw new AzureBlobStorageException(e.getMessage());
		}
	}

	@Override
	public List<String> listFiles(String path) throws AzureBlobStorageException {
		try {
			PagedIterable<BlobItem> blobList = blobContainerClient.listBlobsByHierarchy(path + "/");
			List<String> blobNamesList = new ArrayList<>();
			for (BlobItem blob : blobList) {
				blobNamesList.add(blob.getName());
			}
			return blobNamesList;
		} catch(BlobStorageException e){
			throw new AzureBlobStorageException(e.getServiceMessage());
		} catch (Exception e){
			throw new AzureBlobStorageException(e.getMessage());
		}
	}

	@Override
	public String update(String token, String path, String name, MultipartFile file) throws AzureBlobStorageException {

		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

		try {
			BlobClient client = blobContainerClient.getBlobClient(path);
			client.delete();
			int index = path.lastIndexOf("/");
			client = blobContainerClient.getBlobClient(path.substring(0, index) + "/" + name);
			client.upload(file.getInputStream(), true);
			return path;
		} catch(BlobStorageException e){
			throw new AzureBlobStorageException(e.getServiceMessage());
		} catch (Exception e){
			throw new AzureBlobStorageException(e.getMessage());
		}
	}

	@Override
	public void delete(String token, String path) throws AzureBlobStorageException {

		//TODO: Uncomment this for prod
//		if (Boolean.FALSE.equals(doesUserHaveAdminAuthorities(token))) {
//			throw new RuntimeException("No admin authority");
//		}

		try {
			BlobClient client = blobContainerClient.getBlobClient(path);
			client.delete();
		} catch(BlobStorageException e){
			throw new AzureBlobStorageException(e.getServiceMessage());
		} catch (Exception e){
			throw new AzureBlobStorageException(e.getMessage());
		}
	}

	@Override
	public void createContainer() throws AzureBlobStorageException {
		try {
			blobServiceClient.createBlobContainer(containerName);
		} catch(BlobStorageException e){
			throw new AzureBlobStorageException(e.getServiceMessage());
		} catch(RuntimeException e){
			throw new AzureBlobStorageException(e.getMessage());
		} catch (Exception e){
			throw new AzureBlobStorageException(e.getMessage());
		}
	}

	@Override
	public void deleteContainer() throws AzureBlobStorageException {
		try {
			blobServiceClient.deleteBlobContainer(containerName);
		} catch(BlobStorageException e){
			throw new AzureBlobStorageException(e.getServiceMessage());
		} catch (Exception e){
			throw new AzureBlobStorageException(e.getMessage());
		}
	}

	private Boolean doesUserHaveAdminAuthorities(String token) {

		if (token.isEmpty() || !token.startsWith("Bearer ")) {
			throw new RuntimeException("Invalid token");
		}

		String jwtToken = token.substring("Bearer ".length());

		return webClient
				.build()
				.get()
				.uri("http://USERS/api/v1/users/adminauthorize?token=" + jwtToken)
				.retrieve()
				.bodyToMono(Boolean.class)
				.block();

	}
}
