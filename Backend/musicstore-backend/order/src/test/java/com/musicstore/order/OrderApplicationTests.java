package com.musicstore.order;

import com.musicstore.order.controller.OrderController;
import com.musicstore.order.service.OrderService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertNotNull;

@SpringBootTest
@RunWith(SpringRunner.class)
class OrderApplicationTests {

	@Mock
	private OrderService orderService;

	@InjectMocks
	private OrderController orderController;

	@Test
	void contextLoads() {
		assertNotNull("foo");
	}

	@Test
	public void testApp() {
		OrderApplication.main(new String[] {});
	}

}
