package com.musicstore.users.service;

import com.musicstore.users.dto.LoginResponse;
import com.musicstore.users.dto.RegisterRequest;
import com.musicstore.users.dto.UserInformationResponse;
import com.musicstore.users.mail.EmailService;
import com.musicstore.users.model.ConfirmationToken;
import com.musicstore.users.model.Users;
import com.musicstore.users.repository.UserRepository;
import com.musicstore.users.security.config.VariablesConfiguration;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bcryptPasswordEncoder;
    private static final String USER_NOT_FOUND_MESSAGE = "User with email %s not found";
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final VariablesConfiguration variablesConfiguration;


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
                Optional<ConfirmationToken> token = confirmationTokenService
                        .getConfirmationTokenByUserUuid(existingUser.getUuid());
                if (token.isPresent()) {
                    ConfirmationToken confirmationToken = token.get();

                    String link = variablesConfiguration.getAccountConfirmUrl()
                            + confirmationToken.getToken();

                    emailService.send(existingUser.getEmail(),
                            buildEmail(existingUser.getFirstName(), link));

                    return confirmationToken.getToken();
                } else {
                    log.error(
                            "Confirmation token not found for user \""
                                    + users.getEmail() + "\".");
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Confirmation token not found");
                }
            } else {
                log.error("User with email \""
                        + users.getEmail()
                        + "\" already exists.");
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Email already taken");
            }
        } else {
            String encodedPassword = bcryptPasswordEncoder
                    .encode(users.getPassword());

            users.setPassword(encodedPassword);

            userRepository.save(users);

            log.info("User with email \""
                    + users.getEmail()
                    + "\" has been registered successfully.");

            String tokenUuid = UUID.randomUUID().toString();

            ConfirmationToken token = new ConfirmationToken(
                    tokenUuid,
                    LocalDateTime.now(),
                    LocalDateTime.now().plusMinutes(20),
                    users
            );

            confirmationTokenService.saveConfirmationToken(token);

            String link = variablesConfiguration.getAccountConfirmUrl() + token.getToken();

            emailService.send(
                    users.getEmail(),
                    buildEmail(users.getFirstName(),
                            link));

            return tokenUuid;
        }
    }

    public UserInformationResponse getUserInfo(UUID uuid) {

        Users user = userRepository.findByUuid(uuid).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
        );

        return UserInformationResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getUsername())
                .build();
    }

    public void enableUser(String email) {
        userRepository.enableUser(email);
    }

    @Transactional
    public LoginResponse updateUser(UUID uuid, RegisterRequest request) {

        boolean userExists = userRepository.findByUuid(uuid).isPresent();

        if (!userExists) {
            log.error("User with id \"" + uuid + "\" not found.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot update user, user not found");
        }

        userRepository.updateUser(uuid, request.getFirstName(),
                request.getLastName(), request.getEmail(),
                bcryptPasswordEncoder.encode(request.getPassword()));

        var updatedUser = userRepository.findByUuid(uuid);
        var userDetails = loadUserByUsername(request.getEmail());

        log.info("User with username \""
                + updatedUser.get().getUsername()
                + "\" has been updated.");

        return LoginResponse.builder()
                .firstName(updatedUser.get().getFirstName())
                .lastName(updatedUser.get().getLastName())
                .uuid(uuid)
                .token(jwtService.generateToken(userDetails))
                .role(updatedUser.get().getUserRole())
                .build();
    }

    @Transactional
    public String deleteUser(UUID uuid) {
        Optional<Users> user = userRepository.findByUuid(uuid);
        if (user.isEmpty()) {
            log.error("User with id \"" + uuid
                    + "\" not found. Deletion failed.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot delete user, user not found");
        } else {
            Users userToDelete = user.get();
            confirmationTokenService.deleteConfirmationToken(userToDelete.getId());
            userRepository.deleteByUuid(uuid);
            log.info("User with id \"" + uuid
                    + "\" has been deleted.");

            return "User successfully deleted";
        }
    }

    private String buildEmail(String name, String link) {
        return "<!DOCTYPE html>\n"
                + "<html xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" lang=\"en\">\n"
                + "\n"
                + "<head>\n"
                + "    <title></title>\n"
                + "    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n"
                + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><!--[if mso]><xml><o:OfficeDocumentSettings>"
                + "<o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!--><!--<![endif]-->\n"
                + "    <style>\n"
                + "        * {\n"
                + "            box-sizing: border-box;\n"
                + "        }\n"
                + "\n"
                + "        body {\n"
                + "            margin: 0;\n"
                + "            padding: 0;\n"
                + "        }\n"
                + "\n"
                + "        a[x-apple-data-detectors] {\n"
                + "            color: inherit !important;\n"
                + "            text-decoration: inherit !important;\n"
                + "        }\n"
                + "\n"
                + "        #MessageViewBody a {\n"
                + "            color: inherit;\n"
                + "            text-decoration: none;\n"
                + "        }\n"
                + "\n"
                + "        p {\n"
                + "            line-height: inherit\n"
                + "        }\n"
                + "\n"
                + "        .desktop_hide,\n"
                + "        .desktop_hide table {\n"
                + "            mso-hide: all;\n"
                + "            display: none;\n"
                + "            max-height: 0px;\n"
                + "            overflow: hidden;\n"
                + "        }\n"
                + "\n"
                + "        .image_block img+div {\n"
                + "            display: none;\n"
                + "        }\n"
                + "\n"
                + "        sup,\n"
                + "        sub {\n"
                + "            font-size: 75%;\n"
                + "            line-height: 0;\n"
                + "        }\n"
                + "\n"
                + "        @media (max-width:520px) {\n"
                + "            .desktop_hide table.icons-inner {\n"
                + "                display: inline-block !important;\n"
                + "            }\n"
                + "\n"
                + "            .icons-inner {\n"
                + "                text-align: center;\n"
                + "            }\n"
                + "\n"
                + "            .icons-inner td {\n"
                + "                margin: 0 auto;\n"
                + "            }\n"
                + "\n"
                + "            .mobile_hide {\n"
                + "                display: none;\n"
                + "            }\n"
                + "\n"
                + "            .row-content {\n"
                + "                width: 100% !important;\n"
                + "            }\n"
                + "\n"
                + "            .stack .column {\n"
                + "                width: 100%;\n"
                + "                display: block;\n"
                + "            }\n"
                + "\n"
                + "            .mobile_hide {\n"
                + "                min-height: 0;\n"
                + "                max-height: 0;\n"
                + "                max-width: 0;\n"
                + "                overflow: hidden;\n"
                + "                font-size: 0px;\n"
                + "            }\n"
                + "\n"
                + "            .desktop_hide,\n"
                + "            .desktop_hide table {\n"
                + "                display: table !important;\n"
                + "                max-height: none !important;\n"
                + "            }\n"
                + "        }\n"
                + "    </style><!--[if mso ]><style>sup, sub { font-size: 100% !important; } sup { mso-text-raise:10% } sub "
                + "{ mso-text-raise:-10% }</style> <![endif]-->\n"
                + "</head>\n"
                + "\n"
                + "<body class=\"body\" style=\"background-color: #FFFFFF; margin: 0; padding: 0; -webkit-text-size-adjust: none; "
                + "text-size-adjust: none;\">\n"
                + "<table class=\"nl-container\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\""
                + " style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF;\">\n"
                + "    <tbody>\n"
                + "    <tr>\n"
                + "        <td>\n"
                + "            <table class=\"row row-1\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" "
                + "cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">\n"
                + "                <tbody>\n"
                + "                <tr>\n"
                + "                    <td>\n"
                + "                        <table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" "
                + "cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; "
                + "width: 500px; margin: 0 auto;\" width=\"500\">\n"
                + "                            <tbody>\n"
                + "                            <tr>\n"
                + "                                <td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; "
                + "mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; "
                + "border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">\n"
                + "                                    <table class=\"image_block block-1\" width=\"100%\" border=\"0\" cellpadding=\"0\" "
                + "cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">\n"
                + "                                        <tr>\n"
                + "                                            <td class=\"pad\" style=\"width:100%;\">\n"
                + "                                                <div class=\"alignment\" align=\"center\" style=\"line-height:10px\">\n"
                + "                                                    <div style=\"max-width: 500px;\"><img "
                + "src=\"https://78e5c3ac46.imgdist.com/pub/bfra/42gk87sq/109/wqo/qg0/logo.svg\" style=\"display: block; height: auto; border: 0; "
                + "width: 100%;\" width=\"500\" alt title height=\"auto\"></div>\n"
                + "                                                </div>\n"
                + "                                            </td>\n"
                + "                                        </tr>\n"
                + "                                    </table>\n"
                + "                                    <table class=\"heading_block block-2\" width=\"100%\" border=\"0\" cellpadding=\"10\" "
                + "cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">\n"
                + "                                        <tr>\n"
                + "                                            <td class=\"pad\">\n"
                + "                                                <h1 style=\"margin: 0; color: #1e0e4b; direction: ltr; font-family: Arial, "
                + "'Helvetica Neue', Helvetica, sans-serif; font-size: 38px; font-weight: 400; letter-spacing: normal; line-height: 120%; "
                + "text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;\"><em>Welcome, " + name + "!</em></h1>\n"
                + "                                            </td>\n"
                + "                                        </tr>\n"
                + "                                    </table>\n"
                + "                                </td>\n"
                + "                            </tr>\n"
                + "                            </tbody>\n"
                + "                        </table>\n"
                + "                    </td>\n"
                + "                </tr>\n"
                + "                </tbody>\n"
                + "            </table>\n"
                + "            <table class=\"row row-2\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" "
                + "cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">\n"
                + "                <tbody>\n"
                + "                <tr>\n"
                + "                    <td>\n"
                + "                        <table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" "
                + "cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; "
                + "color: #000000; width: 500px; margin: 0 auto;\" width=\"500\">\n"
                + "                            <tbody>\n"
                + "                            <tr>\n"
                + "                                <td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; "
                + "mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; "
                + "border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">\n"
                + "                                    <table class=\"paragraph_block block-1\" width=\"100%\" border=\"0\" cellpadding=\"10\" "
                + "cellspacing=\"0\" role=\"presentation\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;\">\n"
                + "                                        <tr>\n"
                + "                                            <td class=\"pad\">\n"
                + "                                                <div style=\"color:#444a5b;direction:ltr;font-family:Arial, 'Helvetica Neue', "
                + "Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;\">\n"
                + "                                                    <p style=\"margin: 0; margin-bottom: 16px;\">Fancy Strings team are glad You're with us! "
                + "<br>Let's get Your gear nice and ready!<br><br>Before You begin exploring, we need to ask You to to tell us, that You are really You...</p>\n"
                + "                                                    <p style=\"margin: 0;\">Please click on the link below, to verify Your brand new account.</p>\n"
                + "                                                </div>\n"
                + "                                            </td>\n"
                + "                                        </tr>\n"
                + "                                    </table>\n"
                + "                                </td>\n"
                + "                            </tr>\n"
                + "                            </tbody>\n"
                + "                        </table>\n"
                + "                    </td>\n"
                + "                </tr>\n"
                + "                </tbody>\n"
                + "            </table>\n"
                + "            <table class=\"row row-3\" align=\"center\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" "
                + "style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">\n"
                + "                <tbody>\n"
                + "                <tr>\n"
                + "                    <td>\n"
                + "                        <table class=\"row-content stack\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\" "
                + "style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 500px; margin: 0 auto;\" width=\"500\">\n"
                + "                            <tbody>\n"
                + "                            <tr>\n"
                + "                                <td class=\"column column-1\" width=\"100%\" style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; "
                + "text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;\">\n"
                + "                                    <table class=\"button_block block-1\" width=\"100%\" border=\"0\" cellpadding=\"10\" cellspacing=\"0\" role=\"presentation\" "
                + "style=\"mso-table-lspace: 0pt; mso-table-rspace: 0pt;\">\n"
                + "                                        <tr>\n"
                + "                                            <td class=\"pad\">\n"
                + "                                                <div class=\"alignment\" align=\"center\"><!--[if mso]>\n"
                + "                                                    <v:roundrect xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" "
                + "href=\"" + link + "\" style=\"height:56px;width:480px;v-text-anchor:middle;\" arcsize=\"8%\" stroke=\"false\" fillcolor=\"#276318\">\n"
                + "                                                        <w:anchorlock/>\n"
                + "                                                        <v:textbox inset=\"0px,0px,0px,0px\">\n"
                + "                                                            <center dir=\"false\" style=\"color:#ffffff;font-family:Arial, sans-serif;font-size:23px\">\n"
                + "                                                    <![endif]--><a href=\"" + link + "\" target=\"_blank\" style=\"background-color:#276318;border-bottom:0px solid transparent;"
                + "border-left:0px solid transparent;border-radius:4px;border-right:0px solid transparent;border-top:0px solid transparent;color:#ffffff;display:block;font-family:Arial, "
                + "'Helvetica Neue', Helvetica, sans-serif;font-size:23px;font-weight:400;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:100%;"
                + "word-break:keep-all;\"><span style=\"word-break: break-word; padding-left: 20px; padding-right: 20px; font-size: 23px; display: inline-block; letter-spacing: normal;\">"
                + "<span style=\"word-break: break-word; line-height: 46px;\">Activate</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>\n"
                + "                                            </td>\n"
                + "                                        </tr>\n"
                + "                                    </table>\n"
                + "                                </td>\n"
                + "                            </tr>\n"
                + "                            </tbody>\n"
                + "                        </table>\n"
                + "                    </td>\n"
                + "                </tr>\n"
                + "                </tbody>\n"
                + "            </table>\n"
                + "        </td>\n"
                + "    </tr>\n"
                + "    </tbody>\n"
                + "</table><!-- End -->\n"
                + "</body>\n"
                + "\n"
                + "</html>";
    }
}
