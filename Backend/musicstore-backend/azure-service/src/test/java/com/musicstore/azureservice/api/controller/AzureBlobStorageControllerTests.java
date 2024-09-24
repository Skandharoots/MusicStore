package com.musicstore.azureservice.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.azureservice.controller.AzureBlobStorageController;
import com.musicstore.azureservice.service.AzureBlobStorageService;
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

@WebMvcTest(controllers = AzureBlobStorageController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@RunWith(SpringRunner.class)
public class AzureBlobStorageControllerTests {

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

    @Test
    public void createFileTest() throws Exception {

        when(azureBlobStorageService.write(path, filename, multipartFile)).thenReturn(fullFilePath);

        ResultActions resultActions = mockMvc.perform(
                MockMvcRequestBuilders.multipart("/api/azure/upload")
                        .file("path", path.getBytes())
                        .file("fileName", filename.getBytes())
                        .file((MockMultipartFile) multipartFile)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
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

        ResultActions resultActions = mockMvc.perform(get("/api/azure/read?path=" + fullFilePath));

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().bytes(bytes));

    }

    @Test
    public void listFilesTest() throws Exception {

        List<String> fileList = new ArrayList<>();
        fileList.add(fullFilePath);

        when(azureBlobStorageService.listFiles(path)).thenReturn(fileList);
        ResultActions resultActions = mockMvc.perform(get("/api/azure/list?path=" + path));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(fileList)));

    }

    @Test
    public void updateFileTest() throws Exception {

        when(azureBlobStorageService.update(path, filename, multipartFile)).thenReturn(fullFilePath);


        MockMultipartHttpServletRequestBuilder builder =
                MockMvcRequestBuilders.multipart("/api/azure/update");
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
        );
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(fullFilePath));

    }

    @Test
    public void deleteFileTest() throws Exception {

        when(azureBlobStorageService.delete(fullFilePath)).thenReturn("File deleted");

        ResultActions resultActions = mockMvc.perform(delete("/api/azure/delete?path=" + fullFilePath)
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string("File deleted"));

    }
}
