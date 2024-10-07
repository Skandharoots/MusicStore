package com.musicstore.azureservice.api.service;

import com.musicstore.azureservice.service.AzureBlobStorageService;
import org.assertj.core.api.Assertions;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.multipart.MultipartFile;

import static com.github.tomakehurst.wiremock.client.WireMock.*;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWireMock(port = 0)
public class AzureBlobStorageServiceBlobExceptionTests {

    @Autowired
    private AzureBlobStorageService azureBlobStorageService;

    private String path = "/tests";

    private String filename = "test.txt";

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    @Test
    public void writeBlobExceptionTest() throws Exception {

        MultipartFile multipartFile = new MockMultipartFile("file", "test.txt", "text/plain", "Hello World".getBytes());

        stubFor(any(anyUrl())
                .withQueryParam("token", equalTo(token.substring(7))
                ).willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("true")
                )
        );

        Assertions.assertThatThrownBy(() -> azureBlobStorageService.write(token, path, filename, multipartFile));
    }

    @Test
    public void readBlobExceptionTest() throws Exception {
        Assertions.assertThatThrownBy(() -> azureBlobStorageService.read(path));
    }

    @Test
    public void listFilesBlobExceptionTest() throws Exception {
        Assertions.assertThatThrownBy(() -> azureBlobStorageService.listFiles(path));
    }

    @Test
    public void updateFileBlobExceptionTest() throws Exception {
        MultipartFile multipartFile = new MockMultipartFile("file", "test.txt", "text/plain", "Hello World".getBytes());

        stubFor(any(anyUrl())
                .withQueryParam("token", equalTo(token.substring(7))
                ).willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("true")
                )
        );

        Assertions.assertThatThrownBy(() -> azureBlobStorageService.update(token, path, filename, multipartFile));
    }

    @Test
    public void deleteFileBlobExceptionTest() throws Exception {

        stubFor(any(anyUrl())
                .withQueryParam("token", equalTo(token.substring(7))
                ).willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("true")
                )
        );

        Assertions.assertThatThrownBy(() -> azureBlobStorageService.delete(token, path));
    }
}
