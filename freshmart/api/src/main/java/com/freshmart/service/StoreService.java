package com.freshmart.service;

import com.freshmart.exception.StoreNotFoundException;
import com.freshmart.model.Store;
import com.freshmart.repository.StoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StoreService {

    private final StoreRepository storeRepository;

    public StoreService(StoreRepository storeRepository) {
        this.storeRepository = storeRepository;
    }

    @Transactional(readOnly = true)
    public List<Store> getActiveStores() {
        return storeRepository.findByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public Store getStoreById(Long id) {
        return storeRepository.findById(id)
            .orElseThrow(() -> new StoreNotFoundException("Store not found with id: " + id));
    }
}
