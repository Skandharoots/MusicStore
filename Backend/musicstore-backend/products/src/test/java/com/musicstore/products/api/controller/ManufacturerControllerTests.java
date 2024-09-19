package com.musicstore.products.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.products.controller.ManufacturerController;
import com.musicstore.products.dto.ManufacturerRequest;
import com.musicstore.products.model.Manufacturer;
import com.musicstore.products.service.ManufacturerService;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = ManufacturerController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@RunWith(SpringRunner.class)
public class ManufacturerControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ManufacturerService manufacturerService;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    @Test
    public void createManufacturerTest() throws Exception {

        ManufacturerRequest manufacturerRequest = new ManufacturerRequest();
        manufacturerRequest.setName("Test");

        when(manufacturerService.createManufacturers(token, manufacturerRequest)).thenReturn("Manufacturer created");

        ResultActions resultActions = mockMvc.perform(post("/api/products/manufacturers/create")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(manufacturerRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isCreated());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Manufacturer created"));
    }

    @Test
    public void getAllManufacturersTest() throws Exception {

        Manufacturer manufacturer = new Manufacturer();
        manufacturer.setName("Test");
        manufacturer.setId(1L);

        List<Manufacturer> manufacturers = new ArrayList<>();
        manufacturers.add(manufacturer);

        when(manufacturerService.getAllManufacturers()).thenReturn(manufacturers);

        ResultActions resultActions = mockMvc.perform(get("/api/products/manufacturers/get"));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(manufacturers)));

    }

    @Test
    public void getManufacturerByIdTest() throws Exception {

        Manufacturer manufacturer = new Manufacturer();
        manufacturer.setId(1L);
        manufacturer.setName("Test");

        when(manufacturerService.getManufacturerById(1L)).thenReturn(manufacturer);

        ResultActions resultActions = mockMvc.perform(get("/api/products/manufacturers/get/{id}", 1L));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(manufacturer)));

    }

    @Test
    public void getAllManufacturersBySearchParameterTest() throws Exception {

        Manufacturer manufacturer = new Manufacturer();
        manufacturer.setName("Test");
        manufacturer.setId(1L);

        List<Manufacturer> manufacturers = new ArrayList<>();
        manufacturers.add(manufacturer);

        when(manufacturerService.findAllBySearchParameters(1L, "USA", "Electric")).thenReturn(manufacturers);
        ResultActions resultActions = mockMvc.perform(get("/api/products/manufacturers/get/search/{category}?country=USA&subcategory=Electric", 1L));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(manufacturers)));

    }

    @Test
    public void updateManufacturerTest() throws Exception {

        ManufacturerRequest manufacturerRequest = new ManufacturerRequest();
        manufacturerRequest.setName("Test");

        when(manufacturerService.updateManufacturer(token, 1L, manufacturerRequest)).thenReturn(ResponseEntity.ok("Manufacturer updated"));

        ResultActions resultActions = mockMvc.perform(put("/api/products/manufacturers/update/{id}", 1L)
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(manufacturerRequest))
        );
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Manufacturer updated"));

    }

    @Test
    public void deleteManufacturerTest() throws Exception {

        when(manufacturerService.deleteManufacturer(token, 1L)).thenReturn(ResponseEntity.ok("Manufacturer deleted"));

        ResultActions resultActions = mockMvc.perform(delete("/api/products/manufacturers/delete/{id}", 1L)
                .header("Authorization", token));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Manufacturer deleted"));

    }
}
