package com.musicstore.products;

import com.musicstore.products.controller.*;
import com.musicstore.products.service.*;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertNotNull;

@SpringBootTest
@RunWith(SpringRunner.class)
class ProductsApplicationTests {

	@Mock
	private CategoryService categoryService;

	@InjectMocks
	private CategoryController categoryController;

	@Mock
	private ManufacturerService manufacturerService;

	@InjectMocks
	private ManufacturerController manufacturerController;

	@Mock
	private CountryService countryService;

	@InjectMocks
	private CountryController countryController;

	@Mock
	private ProductService productService;

	@InjectMocks
	private ProductsController productsController;

	@Mock
	private SubcategoryService subcategoryService;

	@InjectMocks
	private SubcategoryController subcategoryController;

	@Test
	void contextLoads() {
		assertNotNull("foo");
	}

	@Test
	public void testApp() {
		ProductsApplication.main(new String[] {});
	}

}
