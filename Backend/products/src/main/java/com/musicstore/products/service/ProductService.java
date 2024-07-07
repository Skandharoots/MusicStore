package com.musicstore.products.service;

import com.musicstore.products.model.Product;
import com.musicstore.products.repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;


}
