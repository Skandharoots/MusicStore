package com.musicstore.products.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class ManufacturerRequestBody {

	private List<ManufacturerRequest> manufacturers;

	public List<ManufacturerRequest> getManufacturers() {
		return manufacturers;
	}
}
