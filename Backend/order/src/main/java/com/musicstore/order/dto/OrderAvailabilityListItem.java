package com.musicstore.order.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderAvailabilityListItem {

    private UUID productSkuId;
    private Boolean isAvailable;

}
