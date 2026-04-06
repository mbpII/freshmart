package com.freshmart.mapper;

import com.freshmart.dto.ProductRequest;
import com.freshmart.dto.ProductResponse;
import com.freshmart.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ProductMapper {
    
    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "onSale", constant = "false")
    @Mapping(target = "salePrice", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    @Mapping(target = "food", constant = "false")
    Product toEntity(ProductRequest request);
    
    @Mapping(source = "supplier.supplierName", target = "supplierName")
    @Mapping(source = "onSale", target = "isOnSale")
    @Mapping(source = "salePrice", target = "salePrice")
    @Mapping(source = "food", target = "isFood")
    @Mapping(source = "active", target = "isActive")
    ProductResponse toResponse(Product product);
    
    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "onSale", ignore = true)
    @Mapping(target = "salePrice", ignore = true)
    @Mapping(target = "food", ignore = true)
    void updateEntity(ProductRequest request, @MappingTarget Product product);
    
    default Product copy(Product product) {
        Product copy = new Product();
        copy.setProductId(product.getProductId());
        copy.setProductName(product.getProductName());
        copy.setCategory(product.getCategory());
        copy.setUpc(product.getUpc());
        copy.setSupplier(product.getSupplier());
        copy.setUnitCost(product.getUnitCost());
        copy.setRetailPrice(product.getRetailPrice());
        copy.setOnSale(product.isOnSale());
        copy.setSalePrice(product.getSalePrice());
        copy.setExpirationDate(product.getExpirationDate());
        copy.setReorderThreshold(product.getReorderThreshold());
        copy.setReorderQuantity(product.getReorderQuantity());
        copy.setFood(product.isFood());
        copy.setActive(product.isActive());
        return copy;
    }
}