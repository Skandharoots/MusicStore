package com.musicstore.products.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
@Entity
public class Category {

	@Id
	@GeneratedValue(
			strategy = GenerationType.IDENTITY
	)
	private Long id;

	@NonNull
	private String name;

	public Category(String categoryName) {
		this.name = categoryName;
	}
}
