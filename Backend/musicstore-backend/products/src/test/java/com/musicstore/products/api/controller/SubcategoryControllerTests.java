package com.musicstore.products.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.products.controller.SubcategoryController;
import com.musicstore.products.dto.SubcategoryRequest;
import com.musicstore.products.dto.SubcategoryUpdateRequest;
import com.musicstore.products.model.Subcategory;
import com.musicstore.products.service.SubcategoryService;
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

@WebMvcTest(controllers = SubcategoryController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@RunWith(SpringRunner.class)
public class SubcategoryControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SubcategoryService subcategoryService;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    @Test
    public void createSubcategoryTest() throws Exception {

        SubcategoryRequest subcategoryRequest = new SubcategoryRequest();
        subcategoryRequest.setCategoryId(1L);
        subcategoryRequest.setName("Test");

        when(subcategoryService.createSubcategories(token, subcategoryRequest)).thenReturn("Subcategory created");

        ResultActions resultActions = mockMvc.perform(post("/api/products/subcategories/create")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(subcategoryRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isCreated());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Subcategory created"));
    }

    @Test
    public void createSubcategoryBadRequestTest() throws Exception {

        SubcategoryRequest subcategoryRequest = new SubcategoryRequest();
        subcategoryRequest.setCategoryId(null);
        subcategoryRequest.setName("");

        ResultActions resultActions = mockMvc.perform(post("/api/products/subcategories/create")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(subcategoryRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void getAllSubcategoriesTest() throws Exception {
        Subcategory subcategory = new Subcategory();
        subcategory.setId(1L);
        subcategory.setName("test");

        List<Subcategory> subcategories = new ArrayList<>();
        subcategories.add(subcategory);

        when(subcategoryService.getAll()).thenReturn(subcategories);

        ResultActions resultActions = mockMvc.perform(get("/api/products/subcategories/get"));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(subcategories)));
    }

    @Test
    public void getAllSubcategoriesByCategoryTest() throws Exception {

        Subcategory subcategory = new Subcategory();
        subcategory.setId(1L);
        subcategory.setName("test");

        List<Subcategory> subcategories = new ArrayList<>();
        subcategories.add(subcategory);

        when(subcategoryService.getAllSubcategories(1L)).thenReturn(subcategories);

        ResultActions resultActions = mockMvc.perform(get("/api/products/subcategories/get/category?category=1"));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(subcategories)));

    }

    @Test
    public void getSubcategoryByIdTest() throws Exception {

        Subcategory subcategory = new Subcategory();
        subcategory.setId(1L);
        subcategory.setName("test");

        when(subcategoryService.getSubcategoryById(1L)).thenReturn(subcategory);

        ResultActions resultActions = mockMvc.perform(get("/api/products/subcategories/get/{id}", 1L));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(subcategory)));

    }

    @Test
    public void getAllBySearchParametersTest() throws Exception {

        Subcategory subcategory = new Subcategory();
        subcategory.setId(1L);
        subcategory.setName("test");

        List<Subcategory> subcategories = new ArrayList<>();
        subcategories.add(subcategory);

        when(subcategoryService.findAllBySearchParameters(1L, "USA", "Fender", "Electric")).thenReturn(subcategories);

        ResultActions resultActions = mockMvc.perform(get("/api/products/subcategories/get/search/{category}?country=USA&manufacturer=Fender&subcategoryTierTwo=Electric", 1L));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(subcategories)));

    }

    @Test
    public void updateSubcategoryTest() throws Exception {

        SubcategoryUpdateRequest subcategoryRequest = new SubcategoryUpdateRequest();
        subcategoryRequest.setName("Test");

        when(subcategoryService.updateSubcategory(token, 1L, subcategoryRequest)).thenReturn(ResponseEntity.ok("Subcategory updated"));

        ResultActions resultActions = mockMvc.perform(put("/api/products/subcategories/update/{subcategoryId}", 1L)
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(subcategoryRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Subcategory updated"));

    }

    @Test
    public void updateSubcategoryBadRequestTest() throws Exception {

        SubcategoryUpdateRequest subcategoryRequest = new SubcategoryUpdateRequest();
        subcategoryRequest.setName("");


        ResultActions resultActions = mockMvc.perform(put("/api/products/subcategories/update/{subcategoryId}", 1L)
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(subcategoryRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isBadRequest());

    }

    @Test
    public void deleteSubcategoryTest() throws Exception {

        when(subcategoryService.deleteSubcategory(token, 1L)).thenReturn(ResponseEntity.ok("Subcategory deleted successfully"));

        ResultActions resultActions = mockMvc.perform(delete("/api/products/subcategories/delete/{id}", 1L)
                .header("Authorization", token));

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Subcategory deleted successfully"));
    }
}
