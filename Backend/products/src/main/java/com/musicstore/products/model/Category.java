package com.musicstore.products.model;

import jakarta.persistence.*;
import lombok.*;

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
