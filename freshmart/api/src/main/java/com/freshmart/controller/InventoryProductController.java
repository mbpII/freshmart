package com.freshmart.controller;

import com.freshmart.dto.ProductInventoryResponse;
import com.freshmart.dto.CreateProductWithInventoryRequest;
import com.freshmart.dto.ProductRequest;
import com.freshmart.dto.InventoryRequest;
import com.freshmart.service.InventoryService;
import com.freshmart.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Combined Operations", description = "Combined product and inventory operations")
public class InventoryProductController {
    
    private final ProductService productService;
    private final InventoryService inventoryService;
    
    public InventoryProductController(ProductService productService, InventoryService inventoryService) {
        this.productService = productService;
        this.inventoryService = inventoryService;
    }
    
    @PostMapping("/products")
    @Operation(summary = "Create product and add to store inventory in one call")
    public ResponseEntity<ProductInventoryResponse> createProductWithInventory(
            @Valid @RequestBody CreateProductWithInventoryRequest request) {
        ProductRequest productRequest = new ProductRequest(
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
        
        var productResponse = productService.createProduct(productRequest);
        
        InventoryRequest inventoryRequest = new InventoryRequest(
            productResponse.productId(),
            request.initialQuantity()
        );
        
        inventoryService.createInventory(request.storeId(), inventoryRequest);
        
        ProductInventoryResponse response = inventoryService.getProductInventory(
            productResponse.productId(), request.storeId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}