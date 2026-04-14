package com.freshmart.mapper;

import com.freshmart.dto.CreateProductRequest;
import com.freshmart.dto.ProductRequest;
import com.freshmart.dto.ProductResponse;
import com.freshmart.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapperImpl implements ProductMapper {

    @Override
    public ProductRequest toProductRequest(CreateProductRequest request) {
        if (request == null) {
            return null;
        }
        return new ProductRequest(
            request.productName(),
            request.category(),
            request.upc(),
            request.supplierId(),
            request.unitCost(),
            request.retailPrice(),
            request.isFood(),
            request.reorderThreshold(),
            request.reorderQuantity(),
            request.expirationDate()
        );
    }

    @Override
    public Product toEntity(ProductRequest request) {
        if (request == null) {
            return null;
        }

        Product product = new Product();
        product.setProductName(request.productName());
        product.setCategory(request.category());
        product.setUpc(request.upc());
        product.setUnitCost(request.unitCost());
        product.setRetailPrice(request.retailPrice());
        product.setExpirationDate(request.expirationDate());
        product.setReorderThreshold(request.reorderThreshold());
        product.setReorderQuantity(request.reorderQuantity());
        product.setIsFood(request.isFood());
        product.setIsActive(true);
        product.setIsOnSale(false);
        product.setSalePrice(null);
        product.setSupplier(null);
        return product;
    }

    @Override
    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }

        String supplierName = product.getSupplier() != null
            ? product.getSupplier().getSupplierName()
            : null;

        return new ProductResponse(
            product.getProductId(),
            product.getProductName(),
            product.getCategory(),
            product.getUpc(),
            supplierName,
            product.getUnitCost(),
            product.getRetailPrice(),
            product.getIsOnSale(),
            product.getSalePrice(),
            product.getIsFood(),
            product.getReorderThreshold(),
            product.getReorderQuantity(),
            product.getExpirationDate(),
            product.getIsActive()
        );
    }

    @Override
    public void updateEntity(ProductRequest request, Product product) {
        if (request == null || product == null) {
            return;
        }

        if (request.productName() != null) {
            product.setProductName(request.productName());
        }
        if (request.category() != null) {
            product.setCategory(request.category());
        }
        if (request.upc() != null) {
            product.setUpc(request.upc());
        }
        if (request.unitCost() != null) {
            product.setUnitCost(request.unitCost());
        }
        if (request.retailPrice() != null) {
            product.setRetailPrice(request.retailPrice());
        }
        if (request.expirationDate() != null) {
            product.setExpirationDate(request.expirationDate());
        }
        if (request.reorderThreshold() != null) {
            product.setReorderThreshold(request.reorderThreshold());
        }
        if (request.reorderQuantity() != null) {
            product.setReorderQuantity(request.reorderQuantity());
        }
        if (request.isFood() != null) {
            product.setIsFood(request.isFood());
        }
    }
}
