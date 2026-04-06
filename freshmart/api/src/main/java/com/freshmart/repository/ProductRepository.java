package com.freshmart.repository;

import com.freshmart.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findByUpc(String upc);
    
    boolean existsByUpc(String upc);
    
    List<Product> findByIsActiveTrue();
    
    List<Product> findByCategoryAndIsActiveTrue(String category);
    
    List<Product> findByIsActiveTrueOrderByProductNameAsc();
}