package com.musicstore.order.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musicstore.order.controller.OrderController;
import com.musicstore.order.dto.*;
import com.musicstore.order.model.Order;
import com.musicstore.order.model.OrderLineItems;
import com.musicstore.order.model.OrderStatus;
import com.musicstore.order.service.OrderService;
import jakarta.servlet.http.Cookie;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.DefaultCsrfToken;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
@RunWith(SpringRunner.class)
public class OrderControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
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

    @Before
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

        orderLineItemsDTO = new OrderLineItemsDto();
        orderLineItemsDTO.setQuantity(10);
        orderLineItemsDTO.setProductSkuId(productSkuId);
        orderLineItemsDTO.setUnitPrice(BigDecimal.valueOf(3672.00));
        List<OrderLineItemsDto> itemsDto = new ArrayList<>();
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
    public void createOrderTest() throws Exception {

        when(orderService.createOrder(orderRequest, csrfToken.getToken(), token)).thenReturn("Order placed successfully");

        ResultActions resultActions = mockMvc.perform(post("/api/order/create")
                .header("Authorization", token)
                .cookie(new Cookie("XSRF-TOKEN", csrfToken.getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isCreated());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Order placed successfully"));

    }

    @Test
    public void getAllOrdersForUserTest() throws Exception {

        List<Order> ordersList = new ArrayList<>();
        ordersList.add(order);

        Pageable pageable = PageRequest.of(0, 10, Sort.by("dateCreated").descending());
        Page<Order> page = new PageImpl<>(ordersList, pageable, 1);

        when(orderService.getAllOrdersByUserId(order.getUserIdentifier(), 0, 10)).thenReturn(ResponseEntity.ok(page));

        ResultActions resultActions = mockMvc.perform(get("/api/order/get/all/{user-id}?page=0&pageSize=10", order.getUserIdentifier()));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(page)));

    }

    @Test
    public void getOrderDetailsTest() throws Exception {

        when(orderService.getOrderDetails(order.getOrderIdentifier())).thenReturn(ResponseEntity.ok(order));

        ResultActions resultActions = mockMvc.perform(get("/api/order/get/{order-id}", order.getOrderIdentifier()));
        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string(objectMapper.writeValueAsString(order)));

    }

    @Test
    public void updateOrderDetailsTest() throws Exception {

        List<OrderLineItemsDto> itemsToCancel = new ArrayList<>();
        itemsToCancel.add(orderLineItemsDTO);
        OrderUpdateRequest orderUpdateRequest = new OrderUpdateRequest();
        orderUpdateRequest.setStatus(OrderStatus.COMPLETED);
        orderUpdateRequest.setItemsToCancel(itemsToCancel);

        when(orderService.updateOrderStatus(order.getOrderIdentifier(), token, csrfToken.getToken(), orderUpdateRequest)).thenReturn(ResponseEntity.ok("Order status updated"));

        ResultActions resultActions  = mockMvc.perform(put("/api/order/update/{order-id}", order.getOrderIdentifier())
                .header("Authorization", token)
                .cookie(new Cookie("XSRF-TOKEN", csrfToken.getToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderUpdateRequest))
        );

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        resultActions.andExpect(MockMvcResultMatchers.content().string("Order status updated"));
    }
}
