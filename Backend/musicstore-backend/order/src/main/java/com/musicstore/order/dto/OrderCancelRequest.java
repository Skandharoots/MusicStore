package com.musicstore.order.dto;

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
public class OrderCancelRequest {

    @NotNull(message = "Order cancellation items cannot be empty")
    private List<OrderLineItemsDto> items;
}
