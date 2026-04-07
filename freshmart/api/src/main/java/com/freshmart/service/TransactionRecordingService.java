package com.freshmart.service;

import com.freshmart.event.InventoryAdjustedEvent;
import com.freshmart.model.Product;
import com.freshmart.model.Store;
import com.freshmart.model.Transaction;
import com.freshmart.model.User;
import com.freshmart.repository.ProductRepository;
import com.freshmart.repository.StoreRepository;
import com.freshmart.repository.TransactionRepository;
import com.freshmart.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Service
public class TransactionRecordingService {
    
    private static final Logger log = LoggerFactory.getLogger(TransactionRecordingService.class);
    
    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    
    public TransactionRecordingService(TransactionRepository transactionRepository,
                                       ProductRepository productRepository,
                                       StoreRepository storeRepository,
                                       UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
    }
    
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void handleInventoryAdjustedEvent(InventoryAdjustedEvent event) {
        log.info("Recording transaction for product {} in store {}: {} ({})",
            event.productId(), event.storeId(), event.transactionType(), event.quantityChange());
        
        Product product = productRepository.findById(event.productId())
            .orElseThrow(() -> new IllegalStateException("Product not found: " + event.productId()));
        
        Store store = storeRepository.findById(event.storeId())
            .orElseThrow(() -> new IllegalStateException("Store not found: " + event.storeId()));
        
        User user = userRepository.findById(event.userId())
            .orElseThrow(() -> new IllegalStateException("User not found: " + event.userId()));
        
        Transaction transaction = new Transaction();
        transaction.setProduct(product);
        transaction.setStore(store);
        transaction.setUser(user);
        transaction.setTransactionType(event.transactionType());
        transaction.setQuantityChange(event.quantityChange());
        transaction.setNotes(event.notes());
        transaction.setTransactionDate(java.time.LocalDateTime.now());
        
        transactionRepository.save(transaction);
        
        log.info("Transaction recorded: {} - Product {} in Store {} by User {}",
            event.transactionType(), event.productId(), event.storeId(), event.userId());
    }
}