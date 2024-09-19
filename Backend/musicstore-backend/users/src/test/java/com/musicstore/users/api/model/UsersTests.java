package com.musicstore.users.api.model;

import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import org.junit.Test;
import org.junit.jupiter.api.Assertions;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

@SpringBootTest
public class UsersTests {

    @Test
    public void usersConstructorTest() {

        Users user = new Users();

        Long id = 1L;
        UUID uuid = UUID.randomUUID();
        user.setId(id);
        user.setUuid(uuid);
        user.setEmail("test@test.com");
        user.setFirstName("Test");
        user.setLastName("Test");
        user.setPassword("Test");
        user.setUserRole(UserRole.USER);
        user.setEnabled(true);
        user.setLocked(false);

        Assertions.assertEquals(id, user.getId());
        Assertions.assertEquals(uuid, user.getUuid());
        Assertions.assertEquals("Test", user.getFirstName());
        Assertions.assertEquals("Test", user.getLastName());
        Assertions.assertEquals("Test", user.getPassword());
        Assertions.assertEquals(UserRole.USER, user.getUserRole());
        Assertions.assertEquals(true, user.isEnabled());
        Assertions.assertEquals(false, user.getLocked());
        Assertions.assertEquals("test@test.com", user.getEmail());
        Assertions.assertEquals(user.isAccountNonExpired(), true);
        Assertions.assertEquals(user.isCredentialsNonExpired(), true);
        Assertions.assertEquals(user.isAccountNonLocked(), true);

        user.setLocked(true);
        Assertions.assertEquals(user.isAccountNonLocked(), false);
        Assertions.assertEquals(user.getEnabled(), true);
    }
}
