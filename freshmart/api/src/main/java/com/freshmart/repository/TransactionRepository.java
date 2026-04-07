package com.freshmart.repository;

import com.freshmart.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByProductProductIdOrderByTransactionDateDesc(Long productId);
    
    List<Transaction> findByStoreStoreIdOrderByTransactionDateDesc(Long storeId);
    
    List<Transaction> findByProductProductIdAndStoreStoreIdOrderByTransactionDateDesc(Long productId, Long storeId);
    
    @Query("SELECT t FROM Transaction t WHERE t.product.productId = :productId AND t.store.storeId = :storeId AND t.transactionDate >= :since ORDER BY t.transactionDate DESC")
    List<Transaction> findRecentTransactions(@Param("productId") Long productId, @Param("storeId") Long storeId, @Param("since") LocalDateTime since);
}