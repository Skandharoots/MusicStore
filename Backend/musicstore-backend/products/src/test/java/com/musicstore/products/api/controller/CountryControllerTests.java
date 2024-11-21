package com.musicstore.products.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.products.controller.CountryController;
import com.musicstore.products.dto.CountryRequest;
import com.musicstore.products.model.Country;
import com.musicstore.products.service.CountryService;
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

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;


@WebMvcTest(controllers = CountryController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@RunWith(SpringRunner.class)
public class CountryControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CountryService countryService;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    @Test
    public void createCountryTest() throws Exception {

        CountryRequest countryRequest = new CountryRequest();
        countryRequest.setName("Test");

        when(countryService.createCountry(token, countryRequest)).thenReturn("Country created");

        ResultActions resultActions = mockMvc.perform(post("/api/products/countries/create")
                .header("authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(countryRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isCreated());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Country created"));

    }

    @Test
    public void createCountryBadRequestTest() throws Exception {

        CountryRequest countryRequest = new CountryRequest();
        countryRequest.setName("");

        ResultActions resultActions = mockMvc.perform(post("/api/products/countries/create")
                .header("authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(countryRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void getAllCountriesTest() throws Exception {

        Country country = new Country("ASDsda");
        country.setId(1L);

        List<Country> countries = new ArrayList<>();
        countries.add(country);

        when(countryService.getAllCountries()).thenReturn(countries);

        ResultActions resultActions = mockMvc.perform(get("/api/products/countries/get"));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(countries)));

    }

    @Test
    public void getCountryByIdTest() throws Exception {
        Country country = new Country("ASDsda");
        country.setId(1L);

        when(countryService.getCountryById(1L)).thenReturn(country);

        ResultActions resultActions = mockMvc.perform(get("/api/products/countries/get/{id}", 1L));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(country)));

    }

    @Test
    public void getCountryBySearchParameterTest() throws Exception {

        Country country = new Country("ASDsda");
        country.setId(1L);

        List<Country> countries = new ArrayList<>();
        countries.add(country);

        when(countryService.findAllBySearchParameters(1L, "Fender", "Electric")).thenReturn(countries);

        ResultActions resultActions = mockMvc.perform(get("/api/products/countries/get/search/{category}?manufacturer=Fender&subcategory=Electric",1L));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(countries)));

    }

    @Test
    public void updateCountryTest() throws Exception {

        CountryRequest countryRequest = new CountryRequest();
        countryRequest.setName("Test");

        when(countryService.updateCountry(token, 1L, countryRequest)).thenReturn(ResponseEntity.ok("Country updated"));

        ResultActions resultActions = mockMvc.perform(put("/api/products/countries/update/{countryId}", 1L, 1L)
                .header("authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(countryRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Country updated"));

    }

    @Test
    public void updateCountryBadRequestTest() throws Exception {

        CountryRequest countryRequest = new CountryRequest();
        countryRequest.setName("");

        ResultActions resultActions = mockMvc.perform(put("/api/products/countries/update/{countryId}", 1L, 1L)
                .header("authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(countryRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isBadRequest());


    }

    @Test
    public void deleteCountryTest() throws Exception {

        when(countryService.deleteCountry(token, 1L)).thenReturn(ResponseEntity.ok("Country deleted"));

        ResultActions resultActions = mockMvc.perform(delete("/api/products/countries/delete/{id}", 1L)
        .header("authorization", token));

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Country deleted"));
    }
}
