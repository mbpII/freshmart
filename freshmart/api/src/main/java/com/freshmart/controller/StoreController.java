package com.freshmart.controller;

import com.freshmart.model.Store;
import com.freshmart.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@Tag(name = "Stores", description = "Store management")
@Validated
public class StoreController {

    private final StoreService storeService;

    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }
    
    @GetMapping
    @Operation(summary = "Get all active stores")
    public ResponseEntity<List<Store>> getAllStores() {
        return ResponseEntity.ok(storeService.getActiveStores());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get store by ID")
    public ResponseEntity<Store> getStore(@PathVariable @Positive Long id) {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }
}
