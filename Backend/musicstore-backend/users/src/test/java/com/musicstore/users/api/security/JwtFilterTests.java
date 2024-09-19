package com.musicstore.users.api.security;

import com.musicstore.users.model.UserRole;
import com.musicstore.users.model.Users;
import com.musicstore.users.security.JwtFilter;
import com.musicstore.users.service.JwtService;
import com.musicstore.users.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.core.SecurityContext;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.support.SecurityWebApplicationContextUtils;

import java.io.IOException;
import java.util.Collections;

import static jakarta.ws.rs.core.HttpHeaders.AUTHORIZATION;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtFilterTests {


    @InjectMocks
    JwtFilter jwtFilter;

    @Mock
    UserService userService;

    @Mock
    JwtService jwtService;

    HttpServletRequest request;

    HttpServletResponse response;

    FilterChain chain;


    @Test
    public void doFilterInternalAuthenticationNotNull() throws ServletException, IOException {

        request = mock(HttpServletRequest.class);
        response = mock(HttpServletResponse.class);
        chain = mock(FilterChain.class);

        String token = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiJ9.GE2q1gX6T-mcjf0xmIlGru1gzu-PQF1leFK4U3Kphj8ZLpQG3Rn8qyLLO38ilyvP2u03Ft7bEBAJqRS-86WXCg";
        String jwtToken = token.substring(7);

        Users user = new Users(
                "Marek",
                "Kopania",
                "mardok1825@gmail.com",
                "test",
                UserRole.USER
        );

        when(request.getHeader(AUTHORIZATION)).thenReturn(token);
        when(jwtService.getUsername(jwtToken)).thenReturn(user.getUsername());
        when(userService.loadUserByUsername(anyString())).thenReturn((UserDetails) user);
        when(jwtService.validateToken(jwtToken, (UserDetails) user)).thenReturn(true);

        jwtFilter.doFilter(request, response, chain);
        verify(chain).doFilter(request, response);
    }
}
