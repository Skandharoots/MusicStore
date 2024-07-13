package com.musicstore.products.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Setter
@Getter
public class ProductResponseBody {

    private List<ProductResponse> products;

}
