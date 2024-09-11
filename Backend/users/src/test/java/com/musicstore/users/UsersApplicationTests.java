package com.musicstore.users;

import com.musicstore.users.controller.RegisterController;
import com.musicstore.users.mail.EmailService;
import com.musicstore.users.service.*;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@RunWith(SpringRunner.class)
class UsersApplicationTests {

	@Mock
	private EmailService emailService;

	@Mock
	private ConfirmationTokenService confirmationTokenService;

	@Mock
	private JwtService jwtService;

	@Mock
	private LoginService loginService;

	@Mock
	private RegisterService registerService;

	@Mock
	private UserService userService;

	@InjectMocks
	private RegisterController registerController;

	@Test
	void contextLoads() {
		assertNotNull("foo");
	}

	@Test
	public void main() {
		UsersApplication.main(new String[] {});
	}

}
