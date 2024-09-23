package com.musicstore.apigateway;

import com.musicstore.apigateway.filter.JwtAuthFilter;
import com.musicstore.apigateway.filter.RouteValidator;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import java.util.function.Predicate;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JwtAuthFilterTests {

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @Mock
    private RouteValidator routeValidator;

    @InjectMocks
    private JwtAuthFilter jwtAuthFilter;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    @Test
    public void applyTest() throws Exception {

        var filterFactory = new JwtAuthFilter(new RouteValidator(), webClientBuilder);

        MockServerHttpRequest request = MockServerHttpRequest.get("http://localhost:8222/api/users/register")
                .header("Authorization", token)
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        var gatewayFilter = filterFactory.apply(new JwtAuthFilter.Config());

        GatewayFilterChain filter = mock(GatewayFilterChain.class);
        ArgumentCaptor<ServerWebExchange> captor = ArgumentCaptor.forClass(ServerWebExchange.class);
        when(filter.filter(captor.capture())).thenReturn(Mono.empty());

        StepVerifier.create(gatewayFilter.filter(exchange, filter)).verifyComplete();
        var result = captor.getValue();

        Assertions.assertThat(result).isNotNull();
    }

    @Test
    public void applyExceptionTokenTest() throws Exception {

        var filterFactory = new JwtAuthFilter(new RouteValidator(), webClientBuilder);

        MockServerHttpRequest request = MockServerHttpRequest.get("http://localhost:8222/api/users/register")
                .header("Authorization", token.substring(7))
                .build();
        MockServerWebExchange exchange = MockServerWebExchange.from(request);

        var gatewayFilter = filterFactory.apply(new JwtAuthFilter.Config());

        GatewayFilterChain filter = mock(GatewayFilterChain.class);
        ArgumentCaptor<ServerWebExchange> captor = ArgumentCaptor.forClass(ServerWebExchange.class);
        when(filter.filter(captor.capture())).thenReturn(Mono.empty());

        StepVerifier.create(gatewayFilter.filter(exchange, filter)).verifyComplete();
        var result = captor.getValue();

        Assertions.assertThat(result).isNotNull();
    }


}
