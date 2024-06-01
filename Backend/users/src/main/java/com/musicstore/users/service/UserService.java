package com.musicstore.users.service;


import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.UserRepository;
import com.musicstore.users.model.ConfirmationToken;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final static String USER_NOT_FOUND_MESSAGE = "User with email %s not found";
    private final static String USER_UUID_NOT_FOUND_MESSAGE = "User with uuid %s not found";
    private final ConfirmationTokenService confirmationTokenService;


    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                String.format(USER_NOT_FOUND_MESSAGE, email)));
    }

    public String signUpUser(Users users) {
        boolean userExists = userRepository
                .findByEmail(users.getEmail())
                .isPresent();

        if (userExists) {
            throw new IllegalStateException("email already taken");
        }

        String encodedPassword = bCryptPasswordEncoder
                .encode(users.getPassword());

        users.setPassword(encodedPassword);

        userRepository.save(users);

        String tokenUUID = UUID.randomUUID().toString();

        ConfirmationToken token = new ConfirmationToken(
                tokenUUID,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                users
        );

        confirmationTokenService.saveConfirmationToken(token);

        return tokenUUID;
    }

    public void enableUser(String email) {
        userRepository.enableUser(email);
    }

    @Transactional
    public String updateUser(UUID uuid, RegisterRequest request) {

        boolean userExists = userRepository.findByUuid(uuid).isPresent();

        if (!userExists) {
            throw new IllegalStateException("Cannot update user, user not found");
        }

        userRepository.updateUser(uuid, request.getFirstName(),
                request.getLastName(), request.getEmail(),
                bCryptPasswordEncoder.encode(request.getPassword()));

        return "User successfully updated";
    }

    @Transactional
    public String deleteUser(UUID uuid) {
        boolean userExists = userRepository.findByUuid(uuid).isPresent();

        if (!userExists) {
            throw new IllegalStateException("Cannot delete user, user not found");
        }

        confirmationTokenService.deleteConfirmationToken(uuid);
        userRepository.deleteUser(uuid);

        return "User successfully deleted";
    }

}
