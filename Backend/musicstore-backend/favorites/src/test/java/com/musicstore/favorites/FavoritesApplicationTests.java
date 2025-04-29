package com.musicstore.favorites;

import com.musicstore.favorites.controller.FavoriteController;
import com.musicstore.favorites.service.FavoritesService;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertNotNull;

@SpringBootTest
@RunWith(SpringRunner.class)
class FavoritesApplicationTests {

	@MockBean
	private FavoritesService favoritesService;

	@InjectMocks
	private FavoriteController favoriteController;

    @Test
    void contextLoads() {
        assertNotNull("foo");
    }

	@Test
	public void main() {
		FavoritesApplication.main(new String[]{});
	}

}
