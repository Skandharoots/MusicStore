package com.musicstore.azureservice.config;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AzureBlobStorageConfiguration {

    @Value("${spring.cloud.azure.storage.blob.container-name}")
    private String containerName;

    @Value("${spring.cloud.azure.storage.connection.string}")
    private String connectionString;

    @Value("${my.admin_authorize_url}")
    private String adminUrl;

    @Bean
    public BlobServiceClient getBlobServiceClient() {
        return new BlobServiceClientBuilder()
                .connectionString(connectionString).buildClient();

    }

    @Bean
    public BlobContainerClient getBlobContainerClient() {
        return getBlobServiceClient()
                .getBlobContainerClient(containerName);
    }

    @Bean
    public String getContainerName() {
        return containerName;
    }

    @Bean
    public String getConnectionString() {
        return connectionString;
    }

    @Bean
    public String getAdminUrl() {
        return adminUrl;
    }
}
