package com.musicstore.order.api.service;

import com.musicstore.order.dto.*;
import com.musicstore.order.model.Order;
import com.musicstore.order.model.OrderLineItems;
import com.musicstore.order.model.OrderStatus;
import com.musicstore.order.repository.OrderRepository;
import com.musicstore.order.security.config.VariablesConfiguration;
import com.musicstore.order.service.OrderService;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.DefaultCsrfToken;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTests {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private VariablesConfiguration variablesConfiguration;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestBodyUriSpec requestBodyUriSpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.RequestBodySpec requestBodySpec;

    @Mock
    private WebClient.RequestHeadersUriSpec requestHeadersUriSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @InjectMocks
    private OrderService orderService;

    private String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX" +
            "VCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI" +
            "6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.S" +
            "flKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    private CsrfToken csrfToken;

    private Order order;

    private OrderLineItems orderLineItems;

    private OrderRequest orderRequest;

    private OrderLineItemsDTO orderLineItemsDTO;

    private OrderAvailabilityListItem orderListItemAvailable;

    private OrderAvailabilityListItem orderListItemUnavailable;

    private OrderAvailabilityResponse orderAvailabilityResponseGood;

    private OrderAvailabilityResponse orderAvailabilityResponseBad;

    private UUID productSkuId;

    private UUID userId;

    private LocalDateTime orderDate;

    @BeforeEach
    public void setup() {
        productSkuId = UUID.randomUUID();
        String csrf = UUID.randomUUID().toString();
        userId = UUID.randomUUID();
        orderDate = LocalDateTime.now();

        csrfToken = new DefaultCsrfToken("X-XSRF-TOKEN", "_csrf", csrf);

        orderLineItems = new OrderLineItems();
        orderLineItems.setQuantity(10);
        orderLineItems.setUnitPrice(BigDecimal.valueOf(3672.00));
        orderLineItems.setProductSkuId(productSkuId);

        List<OrderLineItems> orderLineItemsList = new ArrayList<>();
        orderLineItemsList.add(orderLineItems);

        orderLineItemsDTO = new OrderLineItemsDTO();
        orderLineItemsDTO.setQuantity(10);
        orderLineItemsDTO.setProductSkuId(productSkuId);
        orderLineItemsDTO.setUnitPrice(BigDecimal.valueOf(3672.00));
        List<OrderLineItemsDTO> itemsDto = new ArrayList<>();
        itemsDto.add(orderLineItemsDTO);

        order = new Order();
        order.setStatus(OrderStatus.IN_PROGRESS);
        order.setName("Test");
        order.setCity("Test");
        order.setCountry("Test");
        order.setDateCreated(orderDate);
        order.setCountry("Test");
        order.setEmail("test@test.com");
        order.setPhone("+48 739 847 394");
        order.setStreetAddress("Test");
        order.setSurname("Test");
        order.setUserIdentifier(userId);
        order.setZipCode("83-234");
        order.setTotalPrice(BigDecimal.valueOf(3672.00));
        order.setOrderItems(orderLineItemsList);

        orderRequest = new OrderRequest();
        orderRequest.setName("Test");
        orderRequest.setCity("Test");
        orderRequest.setCountry("Test");
        orderRequest.setCountry("Test");
        orderRequest.setEmail("test@test.com");
        orderRequest.setPhone("+48 739 847 394");
        orderRequest.setStreetAddress("Test");
        orderRequest.setSurname("Test");
        orderRequest.setUserIdentifier(userId);
        orderRequest.setZipCode("83-234");
        orderRequest.setOrderTotalPrice(BigDecimal.valueOf(3672.00));
        orderRequest.setItems(itemsDto);

        orderListItemAvailable = new OrderAvailabilityListItem();
        orderListItemAvailable.setProductSkuId(productSkuId);
        orderListItemAvailable.setIsAvailable(true);
        List<OrderAvailabilityListItem> availableItems = new ArrayList<>();
        availableItems.add(orderListItemAvailable);

        orderAvailabilityResponseGood = new OrderAvailabilityResponse();
        orderAvailabilityResponseGood.setAvailableItems(availableItems);

        orderListItemUnavailable = new OrderAvailabilityListItem();
        orderListItemUnavailable.setProductSkuId(productSkuId);
        orderListItemUnavailable.setIsAvailable(false);
        List<OrderAvailabilityListItem> unavailableItems = new ArrayList<>();
        unavailableItems.add(orderListItemUnavailable);

        orderAvailabilityResponseBad = new OrderAvailabilityResponse();
        orderAvailabilityResponseBad.setAvailableItems(unavailableItems);

    }

    @Test
    public void createOrderSuccessTest() {

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(variablesConfiguration.getOrderCheckUrl())).thenReturn(requestBodySpec);
        when(requestBodySpec.header(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.cookie(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(orderRequest)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(OrderAvailabilityResponse.class))
                .thenReturn(Mono.just(orderAvailabilityResponseGood));

        when(orderRepository.save(any())).thenReturn(order);

        String response = orderService.createOrder(orderRequest, csrfToken.getToken(), token);

        Assertions.assertThat(response).isNotNull();
        Assertions.assertThat(response).isEqualTo("Order placed successfully");

    }

    @Test
    public void createOrderFailureBadRequestTest() {

        OrderRequest badOrderRequest = new OrderRequest();

        Assertions.assertThatThrownBy(() -> orderService.createOrder(badOrderRequest, csrfToken.getToken(), token));
    }

    @Test
    public void createOrderFailureBadJwtTokenTest() {

        Assertions.assertThatThrownBy(() -> orderService.createOrder(orderRequest, csrfToken.getToken(), token.substring(7)));

    }

    @Test
    public void createOrderFailureProductNotFoundInWebClientRequestTest() {

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(variablesConfiguration.getOrderCheckUrl())).thenReturn(requestBodySpec);
        when(requestBodySpec.header("X-XSRF-TOKEN", csrfToken.getToken())).thenReturn(requestBodySpec);
        when(requestBodySpec.cookie(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(orderRequest)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(OrderAvailabilityResponse.class))
                .thenReturn(null);

        Assertions.assertThatThrownBy(() -> orderService.createOrder(orderRequest, csrfToken.getToken(), token));

    }

    @Test
    public void createOrderFailureNotAllProductsAvailableTest() {

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(variablesConfiguration.getOrderCheckUrl())).thenReturn(requestBodySpec);
        when(requestBodySpec.header(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.cookie(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(orderRequest)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(OrderAvailabilityResponse.class))
                .thenReturn(Mono.just(orderAvailabilityResponseBad));

        Assertions.assertThatThrownBy(() -> orderService.createOrder(orderRequest, csrfToken.getToken(), token));

    }

    @Test
    public void getAllOrdersByUserIdTest() {

        List<Order> ordersList = new ArrayList<>();
        ordersList.add(order);

        Pageable pageable = PageRequest.of(0, 10, Sort.by("dateCreated").descending());


        Page<Order> orders = new PageImpl<>(ordersList, pageable, ordersList.size());
        when(orderRepository.findAllByUserIdentifier(order.getUserIdentifier(), pageable)).thenReturn(orders);

        ResponseEntity<Page<Order>> ordersFound = orderService.getAllOrdersByUserId(order.getUserIdentifier(), 0, 10);
        Assertions.assertThat(ordersFound.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(ordersFound.getBody()).isNotNull();
        Assertions.assertThat(ordersFound.getBody().getContent()).isNotNull();
        Assertions.assertThat(ordersFound.getBody().getTotalElements()).isEqualTo(ordersList.size());
        Assertions.assertThat(ordersFound.getBody().getTotalPages()).isEqualTo(1);
        Assertions.assertThat(ordersFound.getBody().getNumber()).isEqualTo(0);
        Assertions.assertThat(ordersFound.getBody().getSize()).isEqualTo(10);
        Assertions.assertThat(ordersFound.getBody().getContent()).isNotNull();

    }

    @Test
    public void getOrderByIdTest() {

        when(orderRepository.findByOrderIdentifier(order.getOrderIdentifier())).thenReturn(Optional.of(order));

        ResponseEntity<Order> foundOrder = orderService.getOrderDetails(order.getOrderIdentifier());
        Assertions.assertThat(foundOrder.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(foundOrder.getBody()).isNotNull();
        Assertions.assertThat(foundOrder.getBody().getId()).isEqualTo(order.getId());

    }

    @Test
    public void getOrderByIdNotFoundTest() {

        when(orderRepository.findByOrderIdentifier(order.getOrderIdentifier())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> orderService.getOrderDetails(order.getOrderIdentifier()));

    }

    @Test
    public void updateOrderStatusTest() {

        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();
        orderUpdateRequest.setStatus(OrderStatus.CANCELED);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminVerificationUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(orderRepository.findByOrderIdentifier(order.getOrderIdentifier())).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenReturn(order);

        ResponseEntity<String> response = orderService.updateOrderStatus(order.getOrderIdentifier(), token, orderUpdateRequest);
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isNotNull();
        Assertions.assertThat(response.getBody()).isEqualTo("Order status updated successfully");

    }

    @Test
    public void updateOrderStatusFailureBadJwtTokenTest() {

        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();
        orderUpdateRequest.setStatus(OrderStatus.CANCELED);

        Assertions.assertThatThrownBy(() -> orderService.updateOrderStatus(order.getOrderIdentifier(), token.substring(7), orderUpdateRequest));

    }

    @Test
    public void updateOrderStatusFailureProductNotFoundInWebClientRequestTest() {

        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();
        orderUpdateRequest.setStatus(OrderStatus.CANCELED);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminVerificationUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(orderRepository.findByOrderIdentifier(order.getOrderIdentifier())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> orderService.updateOrderStatus(order.getOrderIdentifier(), token, orderUpdateRequest));

    }

    @Test
    public void updateOrderStatusFailureJwtTokenWithoutAdminPermissionsTest() {

        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();
        orderUpdateRequest.setStatus(OrderStatus.CANCELED);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminVerificationUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> orderService.updateOrderStatus(order.getUserIdentifier(), token, orderUpdateRequest));

    }

    @Test
    public void updateOrderStatusInvalidRequestTest() {

        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminVerificationUrl() + token.substring(7))).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        Assertions.assertThatThrownBy(() -> orderService.updateOrderStatus(order.getUserIdentifier(), token, orderUpdateRequest));

    }




}
