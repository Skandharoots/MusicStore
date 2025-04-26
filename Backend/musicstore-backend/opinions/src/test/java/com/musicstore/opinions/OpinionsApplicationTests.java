package com.musicstore.opinions;

import static org.junit.Assert.assertNotNull;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import com.musicstore.opinions.controller.OpinionController;
import com.musicstore.opinions.service.OpinionService;

@SpringBootTest
@RunWith(SpringRunner.class)
class OpinionsApplicationTests {

	@Mock
	private OpinionService opinionsService;

	@InjectMocks
	private OpinionController opinionsController;

	@Test
	void contextLoads() {
		assertNotNull("foo");
	}

	@Test
	public void main() {
		OpinionsApplication.main(new String[] {});
	}

}
