package com.musicstore.azureservice;

import com.musicstore.azureservice.controller.AzureBlobStorageController;
import com.musicstore.azureservice.service.AzureBlobStorageService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertNotNull;

@SpringBootTest
@RunWith(SpringRunner.class)
class AzureServiceApplicationTests {

	@Mock
	private AzureBlobStorageService azureBlobStorageService;

	@InjectMocks
	private AzureBlobStorageController azureBlobStorageController;

	@Test
	void contextLoads() {
		assertNotNull("foo");
	}

	@Test
	public void testApp() {
		AzureServiceApplication.main(new String[] {});
	}

}
