package com.freshmart.mapper;

import com.freshmart.dto.CreateProductRequest;
import com.freshmart.dto.ProductRequest;
import com.freshmart.dto.ProductResponse;
import com.freshmart.model.Product;

public interface ProductMapper {

    ProductRequest toProductRequest(CreateProductRequest request);

    Product toEntity(ProductRequest request);

    ProductResponse toResponse(Product product);

    void updateEntity(ProductRequest request, Product product);
}
