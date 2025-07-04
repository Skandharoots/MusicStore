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

    private OrderLineItemsDto orderLineItemsDTO;

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
        orderLineItems.setProductName("Stratocaster");

        List<OrderLineItems> orderLineItemsList = new ArrayList<>();
        orderLineItemsList.add(orderLineItems);

        orderLineItemsDTO = new OrderLineItemsDto();
        orderLineItemsDTO.setQuantity(10);
        orderLineItemsDTO.setProductSkuId(productSkuId);
        orderLineItemsDTO.setUnitPrice(BigDecimal.valueOf(3672.00));
        orderLineItemsDTO.setProductName("Stratocaster");
        List<OrderLineItemsDto> itemsDto = new ArrayList<>();
        itemsDto.add(orderLineItemsDTO);

        List<OrderStatus> statuses = new ArrayList<>();
        statuses.add(OrderStatus.RECEIVED);

        order = new Order();
        order.setStatus(statuses);
        order.setName("Grzegoż");
        order.setCity("Łęgockiążćźqweśłó");
        order.setCountry("Chrząszczyrzewoszyce");
        order.setDateCreated(orderDate);
        order.setCountry("Łękołody");
        order.setEmail("test@test.com");
        order.setPhone("+48 739 847 394");
        order.setStreetAddress("Puławska 78/80");
        order.setSurname("Brzęczyszczykiewicz");
        order.setUserIdentifier(userId);
        order.setZipCode("83-234");
        order.setTotalPrice(BigDecimal.valueOf(3672.00));
        order.setOrderItems(orderLineItemsList);

        orderRequest = new OrderRequest();
        orderRequest.setName("Grzegoż");
        orderRequest.setCity("Łęgockiążćźqweśłó");
        orderRequest.setCountry("Chrząszczyrzewoszyce");
        orderRequest.setCountry("Łękołody");
        orderRequest.setEmail("test@test.com");
        orderRequest.setPhone("+(48)-739-847-394");
        orderRequest.setStreetAddress("Puławska 78/80");
        orderRequest.setSurname("Brzęczyszczykiewicz");
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
    public void createOrderFailureBadJwtTokenTest() {

        Assertions.assertThatThrownBy(
                () -> orderService.createOrder(orderRequest, csrfToken.getToken(), token.substring(7)));

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
    public void findAllOrdersTest() {

        List<Order> ordersList = new ArrayList<>();
        ordersList.add(order);

        Pageable pageable = PageRequest.of(0, 10, Sort.by("dateCreated").descending());

        Page<Order> orders = new PageImpl<>(ordersList, pageable, ordersList.size());
        when(orderRepository.findAll(pageable)).thenReturn(orders);

        ResponseEntity<Page<Order>> ordersFound = orderService.getAllOrders(0, 10);
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
    public void updateOrderStatusCancelledTest() {

        List<OrderLineItemsDto> itemsToCancel = new ArrayList<>();
        itemsToCancel.add(orderLineItemsDTO);

        OrderCancelRequest orderCancelRequest = new OrderCancelRequest();
        orderCancelRequest.setItems(itemsToCancel);

        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();
        orderUpdateRequest.setStatus(OrderStatus.CANCELED);
        orderUpdateRequest.setItemsToCancel(itemsToCancel);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminVerificationUrl() + token.substring(7)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(orderRepository.findByOrderIdentifier(order.getOrderIdentifier())).thenReturn(Optional.of(order));

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(variablesConfiguration.getOrderCancellationUrl())).thenReturn(requestBodySpec);
        when(requestBodySpec.header(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.cookie(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(orderCancelRequest)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class))
                .thenReturn(Mono.just(true));

        when(orderRepository.save(any())).thenReturn(order);

        ResponseEntity<String> response = orderService.updateOrderStatus(order.getOrderIdentifier(), token,
                csrfToken.getToken(), orderUpdateRequest);
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isNotNull();
        Assertions.assertThat(response.getBody()).isEqualTo("Order status updated successfully");

    }

    @Test
    public void updateOrderStatusFailedTest() {

        List<OrderLineItemsDto> itemsToCancel = new ArrayList<>();
        itemsToCancel.add(orderLineItemsDTO);

        OrderCancelRequest orderCancelRequest = new OrderCancelRequest();
        orderCancelRequest.setItems(itemsToCancel);

        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();
        orderUpdateRequest.setStatus(OrderStatus.CANCELED);
        orderUpdateRequest.setItemsToCancel(itemsToCancel);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminVerificationUrl() + token.substring(7)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(orderRepository.findByOrderIdentifier(order.getOrderIdentifier())).thenReturn(Optional.of(order));

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(variablesConfiguration.getOrderCancellationUrl())).thenReturn(requestBodySpec);
        when(requestBodySpec.header(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.cookie(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(orderCancelRequest)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class))
                .thenReturn(Mono.just(true));

        when(orderRepository.save(any())).thenReturn(order);

        ResponseEntity<String> response = orderService.updateOrderStatus(order.getOrderIdentifier(), token,
                csrfToken.getToken(), orderUpdateRequest);
        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isNotNull();
        Assertions.assertThat(response.getBody()).isEqualTo("Order status updated successfully");

    }

    @Test
    public void updateOrderStatusBadResponseTest() {
        List<OrderLineItemsDto> itemsToCancel = new ArrayList<>();
        itemsToCancel.add(orderLineItemsDTO);

        OrderCancelRequest orderCancelRequest = new OrderCancelRequest();
        orderCancelRequest.setItems(itemsToCancel);

        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();
        orderUpdateRequest.setStatus(OrderStatus.CANCELED);
        orderUpdateRequest.setItemsToCancel(itemsToCancel);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminVerificationUrl() + token.substring(7)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);

        when(orderRepository.findByOrderIdentifier(order.getOrderIdentifier())).thenReturn(Optional.of(order));

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(variablesConfiguration.getOrderCancellationUrl())).thenReturn(requestBodySpec);
        when(requestBodySpec.header(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.cookie(any(), any())).thenReturn(requestBodySpec);
        when(requestBodySpec.contentType(any())).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(orderCancelRequest)).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class))
                .thenReturn(Mono.just(true), Mono.just(false));

        Assertions.assertThatThrownBy(() -> orderService.updateOrderStatus(order.getOrderIdentifier(), token,
                csrfToken.getToken(), orderUpdateRequest));
    }

    @Test
    public void updateOrderStatusFailureBadJwtTokenTest() {

        List<OrderLineItemsDto> itemsToCancel = new ArrayList<>();
        itemsToCancel.add(orderLineItemsDTO);

        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();
        orderUpdateRequest.setStatus(OrderStatus.CANCELED);
        orderUpdateRequest.setItemsToCancel(itemsToCancel);

        Assertions.assertThatThrownBy(() -> orderService.updateOrderStatus(order.getOrderIdentifier(),
                token.substring(7), csrfToken.getToken(), orderUpdateRequest));

    }

    @Test
    public void updateOrderStatusFailureOrderNotFoundInWebClientRequestTest() {

        List<OrderLineItemsDto> itemsToCancel = new ArrayList<>();
        itemsToCancel.add(orderLineItemsDTO);

        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();
        orderUpdateRequest.setStatus(OrderStatus.CANCELED);
        orderUpdateRequest.setItemsToCancel(itemsToCancel);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminVerificationUrl() + token.substring(7)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        when(orderRepository.findByOrderIdentifier(order.getOrderIdentifier())).thenReturn(Optional.empty());
        Assertions.assertThatThrownBy(() -> orderService.updateOrderStatus(order.getOrderIdentifier(), token,
                csrfToken.getToken(), orderUpdateRequest));

    }

    @Test
    public void updateOrderStatusFailureJwtTokenWithoutAdminPermissionsTest() {

        List<OrderLineItemsDto> itemsToCancel = new ArrayList<>();
        itemsToCancel.add(orderLineItemsDTO);
        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();
        orderUpdateRequest.setStatus(OrderStatus.CANCELED);
        orderUpdateRequest.setItemsToCancel(itemsToCancel);

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminVerificationUrl() + token.substring(7)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(false));

        Assertions.assertThatThrownBy(() -> orderService.updateOrderStatus(order.getUserIdentifier(), token,
                csrfToken.getToken(), orderUpdateRequest));

    }

    @Test
    public void updateOrderStatusInvalidRequestTest() {

        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.get()).thenReturn(requestHeadersUriSpec);
        when(requestHeadersUriSpec.uri(variablesConfiguration.getAdminVerificationUrl() + token.substring(7)))
                .thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(Boolean.class)).thenReturn(Mono.just(true));

        Assertions.assertThatThrownBy(() -> orderService.updateOrderStatus(order.getUserIdentifier(), token,
                csrfToken.getToken(), orderUpdateRequest));

    }

}
