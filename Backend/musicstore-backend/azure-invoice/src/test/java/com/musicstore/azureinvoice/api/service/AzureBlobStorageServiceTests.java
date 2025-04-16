package com.musicstore.azureinvoice.api.service;

import org.assertj.core.api.Assertions;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static com.github.tomakehurst.wiremock.client.WireMock.*;

import com.musicstore.azureinvoice.service.AzureBlobStorageService;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureWireMock(port = 0)
public class AzureBlobStorageServiceTests {

    @Autowired
    private AzureBlobStorageService azureBlobStorageService;

    private String path = "/tests";

    private String filename = "test.txt";

    private String fullFilePath = path + "/" + filename;

    private MultipartFile multipartFile = new MockMultipartFile("file", "test.txt", "text/plain", "Hello World".getBytes());

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    @Before
    public void setUp() throws Exception {
        azureBlobStorageService.createContainer("test");
    }

    @After
    public void tearDown() throws Exception {
        azureBlobStorageService.deleteContainer("test");
    }

    @Test
    public void writeFileGetFileAndDeleteFile() throws ResponseStatusException {

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

        String pathReturned = azureBlobStorageService.write(token, path, filename, multipartFile);
        Assertions.assertThat(pathReturned).isEqualTo(path + "/" + filename);

        List<String> filesList = azureBlobStorageService.listFiles(path);
        Assertions.assertThat(filesList).hasSize(1);
        Assertions.assertThat(filesList.get(0)).isEqualTo(path + "/" + filename);

        azureBlobStorageService.delete(token, filesList.get(0));
        List<String> filesList2 = azureBlobStorageService.listFiles(path);
        Assertions.assertThat(filesList2).hasSize(0);

    }

    @Test
    public void addFileBadTokenExceptionTest() throws ResponseStatusException {

        MultipartFile multipartFile = new MockMultipartFile("file", "test.txt", "text/plain", "Hello World".getBytes());

        Assertions.assertThatThrownBy(() -> azureBlobStorageService.write(token.substring(7), path, filename, multipartFile));
    }

    @Test
    public void writeFileNoAdminAuthorityExceptionTest() throws ResponseStatusException {

        MultipartFile multipartFile = new MockMultipartFile("file", "test.txt", "text/plain", "Hello World".getBytes());

        stubFor(any(anyUrl())
                .withQueryParam("token", equalTo(token.substring(7))
                ).willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("false")
                )
        );

        Assertions.assertThatThrownBy(() -> azureBlobStorageService.write(token, path, filename, multipartFile));

    }

    @Test
    public void writeFileGetPathAndDownloadFile() throws ResponseStatusException {
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

        String pathReturned = azureBlobStorageService.write(token, path, filename, multipartFile);
        Assertions.assertThat(pathReturned).isEqualTo(path + "/" + filename);

        byte[] bytes = azureBlobStorageService.read(pathReturned);

        Assertions.assertThat(bytes).isNotNull();
        Assertions.assertThat(bytes.length).isGreaterThan(0);
        azureBlobStorageService.delete(token, pathReturned);

    }

    @Test
    public void writeFileAndThenUpdateTheFile() throws ResponseStatusException {

        MultipartFile multipartFile = new MockMultipartFile("file", "test.txt", "text/plain", "Hello World".getBytes());
        MultipartFile multipartFile2 = new MockMultipartFile("file2", "test.txt", "text/plain", "Hello World".getBytes());

        stubFor(any(anyUrl())
                .withQueryParam("token", equalTo(token.substring(7))
                ).willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("true")
                )
        );

        String pathReturned = azureBlobStorageService.write(token, path, filename, multipartFile);
        Assertions.assertThat(pathReturned).isEqualTo(path + "/" + filename);

        String updatedPath = azureBlobStorageService.update(token, pathReturned, multipartFile2.getName() , multipartFile2);
        Assertions.assertThat(updatedPath).isEqualTo(path + "/" + multipartFile2.getName());

        azureBlobStorageService.delete(token, updatedPath);
    }

    @Test
    public void updateFileNoAdminAuthorityExceptionTest() throws ResponseStatusException {

        MultipartFile multipartFile2 = new MockMultipartFile("file2", "test.txt", "text/plain", "Hello World".getBytes());

        stubFor(any(anyUrl())
                .withQueryParam("token", equalTo(token.substring(7))
                ).willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("false")
                )
        );

        Assertions.assertThatThrownBy(() -> azureBlobStorageService.update(token, path + "/" + filename, multipartFile2.getName() , multipartFile2));

    }

    @Test
    public void deleteFileNoAdminAuthorityExceptionTest() throws ResponseStatusException {

        stubFor(any(anyUrl())
                .withQueryParam("token", equalTo(token.substring(7))
                ).willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader("Content-Type", "application/json")
                                .withBody("false")
                )
        );

        Assertions.assertThatThrownBy(() -> azureBlobStorageService.delete(token, path + "/" + filename));

    }

}
