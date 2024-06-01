package com.musicstore.users.service;

import com.musicstore.users.dto.LoginRequest;
import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@AllArgsConstructor
public class LoginService {

    private final UserService userService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;


    public LoginResponse loginUser(LoginRequest request) {

        Users user = (Users) userService.loadUserByUsername(request.getEmail());

        if (user != null) {
            String password = request.getPassword();
            String passwordHash = user.getPassword();

            boolean doPasswordsMatch = bCryptPasswordEncoder.matches(password, passwordHash);
            if (doPasswordsMatch) {
                Optional<Users> loggedInUser = userRepository.findByEmailAndPassword(request.getEmail(), passwordHash);
                if (loggedInUser.isPresent()) {
                    return userRepository.findAllByEmail(request.getEmail());
                } else {
                    throw new IllegalStateException("User not found");
                }
            } else {
                throw new IllegalStateException("Invalid password");
            }
        } else {
            throw new IllegalStateException("User not found");
        }
    }

}
