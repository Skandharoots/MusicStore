package com.musicstore.order.dto;

import com.musicstore.order.model.OrderStatus;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderUpdateRequest {

    @NotNull(message = "Order updated status cannot be empty.")
    private OrderStatus status;

    @NotNull(message = "Order update products cannot be empty.")
    private List<OrderLineItemsDto> itemsToCancel;

}
