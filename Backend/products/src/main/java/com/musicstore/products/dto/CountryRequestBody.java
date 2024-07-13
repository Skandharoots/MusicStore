package com.musicstore.products.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class CountryRequestBody {

	private List<CountryRequest> countries;

}
