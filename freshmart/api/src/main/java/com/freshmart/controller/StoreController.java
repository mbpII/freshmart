package com.freshmart.controller;

import com.freshmart.model.Store;
import com.freshmart.repository.StoreRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@Tag(name = "Stores", description = "Store management")
public class StoreController {
    
    private final StoreRepository storeRepository;
    
    public StoreController(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }
    
    @GetMapping
    @Operation(summary = "Get all active stores")
    public ResponseEntity<List<Store>> getAllStores() {
        List<Store> stores = storeRepository.findByIsActiveTrue();
        return ResponseEntity.ok(stores);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get store by ID")
    public ResponseEntity<Store> getStore(@PathVariable Long id) {
        Store store = storeRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Store not found with id: " + id));
        return ResponseEntity.ok(store);
    }
}