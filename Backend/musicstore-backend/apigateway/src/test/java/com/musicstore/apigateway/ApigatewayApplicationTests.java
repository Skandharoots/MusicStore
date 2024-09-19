package com.musicstore.apigateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class ApigatewayApplicationTests {

	@Test
	void contextLoads() {
		assertNotNull("foo");
	}

	@Test
	void appTest() {
		ApigatewayApplication.main(new String[] {});
	}

}
