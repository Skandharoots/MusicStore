package com.musicstore.azureinvoice;


import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import com.musicstore.azureinvoice.service.AzureBlobStorageService;
import com.musicstore.azureinvoice.controller.AzureInvoiceController;

import static org.junit.Assert.assertNotNull;

@SpringBootTest
@RunWith(SpringRunner.class)
class AzureInvoiceApplicationTests {

	@Mock
	private AzureBlobStorageService azureBlobStorageService;

	@InjectMocks
	private AzureInvoiceController azureBlobStorageController;

	@Test
	void contextLoads() {
		assertNotNull("foo");
	}

	@Test
	public void testApp() {
		AzureInvoiceApplication.main(new String[] {});
	}

}
