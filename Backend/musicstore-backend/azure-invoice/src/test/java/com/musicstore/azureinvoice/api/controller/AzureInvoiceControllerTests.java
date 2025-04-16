package com.musicstore.azureinvoice.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.azureinvoice.controller.AzureInvoiceController;
import com.musicstore.azureinvoice.service.AzureBlobStorageService;

import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = AzureInvoiceController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@RunWith(SpringRunner.class)
public class AzureInvoiceControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AzureBlobStorageService azureBlobStorageService;

    private String path = "/tests";

    private String filename = "test.txt";

    private String fullFilePath = path + "/" + filename;

    private MultipartFile multipartFile = new MockMultipartFile("file", "test.txt", "text/plain", "Hello World".getBytes());

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    @Test
    public void createFileTest() throws Exception {

        when(azureBlobStorageService.write(token, path, filename, multipartFile)).thenReturn(fullFilePath);

        ResultActions resultActions = mockMvc.perform(
                MockMvcRequestBuilders.multipart("/api/invoice/upload")
                        .file("path", path.getBytes())
                        .file("fileName", filename.getBytes())
                        .file((MockMultipartFile) multipartFile)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .header("Authorization", token)
                );

        resultActions.andExpect(MockMvcResultMatchers.status().isCreated());
        resultActions.andExpect(MockMvcResultMatchers.content().string(fullFilePath));

    }

    @Test
    public void readFileTest() throws Exception {

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        outputStream.write(multipartFile.getBytes());
        byte[] bytes = outputStream.toByteArray();

        when(azureBlobStorageService.read(fullFilePath)).thenReturn(bytes);

        ResultActions resultActions = mockMvc.perform(get("/api/invoice/read?path=" + fullFilePath));

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().bytes(bytes));

    }

    @Test
    public void listFilesTest() throws Exception {

        List<String> fileList = new ArrayList<>();
        fileList.add(fullFilePath);

        when(azureBlobStorageService.listFiles(path)).thenReturn(fileList);
        ResultActions resultActions = mockMvc.perform(get("/api/invoice/list?path=" + path));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(fileList)));

    }

    @Test
    public void updateFileTest() throws Exception {

        when(azureBlobStorageService.update(token, path, filename, multipartFile)).thenReturn(fullFilePath);


        MockMultipartHttpServletRequestBuilder builder =
                MockMvcRequestBuilders.multipart("/api/invoice/update");
        builder.with(new RequestPostProcessor() {
            @Override
            public MockHttpServletRequest postProcessRequest(MockHttpServletRequest request) {
                request.setMethod("PUT");
                return request;
            }
        });

        ResultActions resultActions = mockMvc.perform(
                builder
                        .file("path", path.getBytes())
                        .file("fileName", filename.getBytes())
                        .file((MockMultipartFile) multipartFile)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .header("Authorization", token)
        );
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(fullFilePath));

    }

    @Test
    public void deleteFileTest() throws Exception {

        when(azureBlobStorageService.delete(token, fullFilePath)).thenReturn("File deleted");

        ResultActions resultActions = mockMvc.perform(delete("/api/invoice/delete?path=" + fullFilePath)
                .header("Authorization", token)
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string("File deleted"));

    }


}
