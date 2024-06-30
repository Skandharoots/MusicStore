package com.musicstore.users.service;


import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.mail.EmailService;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.ConfirmationTokenRepository;
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
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final static String USER_NOT_FOUND_MESSAGE = "User with email %s not found";
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailService emailService;
    private final JWTService jwtService;


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
            Users existingUser = userRepository.findByEmail(users.getEmail()).get();
            if (!existingUser.isEnabled()) {
                Optional<ConfirmationToken> token = confirmationTokenService.getConfirmationTokenByUserUuid(existingUser.getUuid());
                if (token.isPresent()) {
                    ConfirmationToken confirmationToken = token.get();

                    String link = "http://localhost:8222/api/v1/users/register/confirm?token=" + confirmationToken.getToken();
                    emailService.send(existingUser.getEmail(),
                            buildEmail(existingUser.getFirstName(), link));

                    return confirmationToken.getToken();
                } else {
                    throw new IllegalStateException("Confirmation token not found");
                }
            } else {
                throw new IllegalStateException("Email already taken");
            }
        } else {
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

            String link = "http://localhost:8222/api/v1/users/register/confirm?token=" + token.getToken();

            emailService.send(
                    users.getEmail(),
                    buildEmail(users.getFirstName(),
                            link));

            return tokenUUID;
        }
    }

    public void enableUser(String email) {
        userRepository.enableUser(email);
    }

    @Transactional
    public LoginResponse updateUser(UUID uuid, RegisterRequest request) {

        boolean userExists = userRepository.findByUuid(uuid).isPresent();

        if (!userExists) {
            throw new IllegalStateException("Cannot update user, user not found");
        }

        userRepository.updateUser(uuid, request.getFirstName(),
                request.getLastName(), request.getEmail(),
                bCryptPasswordEncoder.encode(request.getPassword()));

        var updatedUser = userRepository.findByUuid(uuid);
        var userDetails = loadUserByUsername(request.getEmail());

        return LoginResponse.builder()
                .firstName(updatedUser.get().getFirstName())
                .lastName(updatedUser.get().getLastName())
                .uuid(uuid)
                .token(jwtService.generateToken(userDetails))
                .build();
    }

    @Transactional
    public String deleteUser(UUID uuid) {
        Optional<Users> user = userRepository.findByUuid(uuid);
        if (user.isEmpty()) {
            throw new IllegalStateException("Cannot delete user, user not found");
        } else {
            Users userToDelete = user.get();
            confirmationTokenService.deleteConfirmationToken(userToDelete.getId());
            userRepository.deleteByUuid(uuid);
            return "User successfully deleted";
        }
    }

    private String buildEmail(String name, String link) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirm your email</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Thank you for registering. Please click on the below link to activate your account: </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">Activate Now</a> </p></blockquote>\n Link will expire in 20 minutes. <p>See you soon</p>" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }
}
