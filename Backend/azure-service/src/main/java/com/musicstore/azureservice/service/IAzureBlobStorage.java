package com.musicstore.azureservice.service;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

public interface IAzureBlobStorage {

	String write(String path, String fileName, MultipartFile file) throws ResponseStatusException;

	String update(String path, String fileName,  MultipartFile file) throws ResponseStatusException;

	byte[] read(String path) throws ResponseStatusException;

	List<String> listFiles(String path) throws ResponseStatusException;

	String delete(String path) throws ResponseStatusException;

}
