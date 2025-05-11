package com.musicstore.products.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.products.controller.SubcategoryController;
import com.musicstore.products.controller.SubcategoryTierTwoController;
import com.musicstore.products.dto.SubcategoryTierTwoRequest;
import com.musicstore.products.dto.SubcategoryTierTwoUpdateRequest;
import com.musicstore.products.model.Category;
import com.musicstore.products.model.Subcategory;
import com.musicstore.products.model.SubcategoryTierTwo;
import com.musicstore.products.service.SubcategoryTierTwoService;
import jakarta.ws.rs.core.MediaType;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;


@WebMvcTest(controllers = SubcategoryTierTwoController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@RunWith(SpringRunner.class)
public class SubcategoryTierTwoControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SubcategoryTierTwoService subcategoryTierTwoService;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    @Test
    public void createSubcategoryTierTwoTest() throws Exception {
        SubcategoryTierTwoRequest request = new SubcategoryTierTwoRequest();
        request.setName("Test");
        request.setSubcategoryId(1L);

        when(subcategoryTierTwoService.createSubcategoryTierTwo(token, request)).thenReturn("Created");

        mockMvc.perform(post("/api/products/subcategory_tier_two/create")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        ).andExpect(MockMvcResultMatchers.status().isCreated());

    }

    @Test
    public void createSubcategoryTierTwoBadRequestTest() throws Exception {
        SubcategoryTierTwoRequest request = new SubcategoryTierTwoRequest();
        request.setSubcategoryId(1L);

        when(subcategoryTierTwoService.createSubcategoryTierTwo(token, request)).thenReturn("Created");

        mockMvc.perform(post("/api/products/subcategory_tier_two/create")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        ).andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void getSubcategoriesTierTwoTest() throws Exception {
        SubcategoryTierTwoRequest request = new SubcategoryTierTwoRequest();
        request.setName("Test");
        request.setSubcategoryId(1L);

        Category category = new Category();
        category.setId(1L);
        category.setName("Test");

        Subcategory subcategory = new Subcategory();
        subcategory.setId(1L);
        subcategory.setName("Test");
        subcategory.setCategory(category);

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setName("Test");
        subcategoryTierTwo.setId(1L);
        subcategoryTierTwo.setSubcategory(subcategory);

        List<SubcategoryTierTwo> subcategories = List.of(subcategoryTierTwo);

        when(subcategoryTierTwoService.getAll()).thenReturn(subcategories);

        mockMvc.perform(get("/api/products/subcategory_tier_two/get"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(subcategories)));


    }

    @Test
    public void getAlSubcategoriesTierTwoBySubcategoryIdTest() throws Exception {

        Category category = new Category();
        category.setId(1L);
        category.setName("Test");

        Subcategory subcategory = new Subcategory();
        subcategory.setId(1L);
        subcategory.setName("Test");
        subcategory.setCategory(category);

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setName("Test");
        subcategoryTierTwo.setId(1L);
        subcategoryTierTwo.setSubcategory(subcategory);

        List<SubcategoryTierTwo> subcategories = List.of(subcategoryTierTwo);

        when(subcategoryTierTwoService.getAllSubcategoriesTierTwo(1L)).thenReturn(subcategories);

        mockMvc.perform(get("/api/products/subcategory_tier_two/get/subcategory?subcategory=1"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(subcategories)));

    }

    @Test
    public void getSubcategoryByIdTest() throws Exception {
        Category category = new Category();
        category.setId(1L);
        category.setName("Test");

        Subcategory subcategory = new Subcategory();
        subcategory.setId(1L);
        subcategory.setName("Test");
        subcategory.setCategory(category);

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setName("Test");
        subcategoryTierTwo.setId(1L);
        subcategoryTierTwo.setSubcategory(subcategory);

        when(subcategoryTierTwoService.getSubcategoryTierTwoById(1L)).thenReturn(subcategoryTierTwo);

        mockMvc.perform(get("/api/products/subcategory_tier_two/get/{id}", 1L))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(subcategoryTierTwo)));

    }

    @Test
    public void getAllBySearchParametersTest() throws Exception {
        Category category = new Category();
        category.setId(1L);
        category.setName("Test");

        Subcategory subcategory = new Subcategory();
        subcategory.setId(1L);
        subcategory.setName("Test");
        subcategory.setCategory(category);

        SubcategoryTierTwo subcategoryTierTwo = new SubcategoryTierTwo();
        subcategoryTierTwo.setName("Test");
        subcategoryTierTwo.setId(1L);
        subcategoryTierTwo.setSubcategory(subcategory);

        List<SubcategoryTierTwo> subcategories = List.of(subcategoryTierTwo);

        when(subcategoryTierTwoService
                .findAllBySearchParameters(1L,
                        "USA",
                        "Fender",
                        "Acoustic"))
                .thenReturn(subcategories);

        mockMvc.perform(get("/api/products/subcategory_tier_two/get/search/{category}?country=USA&manufacturer=Fender&subcategory=Acoustic", 1L))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(subcategories)));

    }

    @Test
    public void updateSubcategoryTierTwoTest() throws Exception {

        SubcategoryTierTwoUpdateRequest request = new SubcategoryTierTwoUpdateRequest();
        request.setName("Test");

        when(subcategoryTierTwoService.updateSubcategoryTierTwo(token, 1L, request)).thenReturn(ResponseEntity.ok("Updated"));

        mockMvc.perform(put("/api/products/subcategory_tier_two/update/{subcategoryId}", 1L)
        .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("Updated"));
    }

    @Test
    public void updateSubcategoryTierTwoBadRequestTest() throws Exception {

        SubcategoryTierTwoUpdateRequest request = new SubcategoryTierTwoUpdateRequest();

        mockMvc.perform(put("/api/products/subcategory_tier_two/update/{subcategoryId}", 1L)
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void deleteSubcategoryTierTwoTest() throws Exception {

        when(subcategoryTierTwoService.deleteSubcategoryTierTwo(token, 1L))
                .thenReturn(ResponseEntity.ok("Deleted"));

        mockMvc.perform(delete("/api/products/subcategory_tier_two/delete/{id}", 1L)
                .header("Authorization", token)
        ).andExpect(MockMvcResultMatchers.status().isOk());
    }

}
