package com.musicstore.products.api.controller;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.products.controller.CategoryController;
import com.musicstore.products.dto.CategoryRequest;
import com.musicstore.products.model.Category;
import com.musicstore.products.service.CategoryService;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = CategoryController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@RunWith(SpringRunner.class)
public class CategoryControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CategoryService categoryService;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    @Test
    public void addCategoryTest() throws Exception {

        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setCategoryName("Test");

        ResultActions resultActions = mockMvc.perform(post("/api/products/categories/create")
                .header("authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(categoryRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isCreated());
    }

    @Test
    public void addCategoryBadRequestTest() throws Exception {

        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setCategoryName("");

        ResultActions resultActions = mockMvc.perform(post("/api/products/categories/create")
                .header("authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(categoryRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void getAllCategoriesTest() throws Exception {

        ResultActions resultActions = mockMvc.perform(get("/api/products/categories/get"));

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());

    }

    @Test
    public void getCategoryByIdTest() throws Exception {
        Category category = new Category("Guitars");
        category.setId(1L);

        when(categoryService.getCategoryById(category.getId())).thenReturn(category);
        ResultActions resultActions = mockMvc.perform(get("/api/products/categories/get/" + category.getId()));

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(category)));
    }

    @Test
    public void updateCategoryTest() throws Exception {

        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setCategoryName("Test");

        ResultActions resultActions = mockMvc.perform(put("/api/products/categories/update/{categoryId}", 1)
                .header("authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(categoryRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());

    }

    @Test
    public void updateCategoryBadRequestTest() throws Exception {

        CategoryRequest categoryRequest = new CategoryRequest();
        categoryRequest.setCategoryName("");

        ResultActions resultActions = mockMvc.perform(put("/api/products/categories/update/{categoryId}", 1)
                .header("authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(categoryRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isBadRequest());

    }

    @Test
    public void deleteCategoryTest() throws Exception {

        ResultActions resultActions = mockMvc.perform(delete("/api/products/categories/delete/{id}", 1)
                .header("authorization", token)
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());

    }
}
