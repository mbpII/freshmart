package com.freshmart.service;

import com.freshmart.dto.ProductRequest;
import com.freshmart.dto.ProductResponse;
import com.freshmart.exception.DuplicateUpcException;
import com.freshmart.exception.ProductNotFoundException;
import com.freshmart.exception.SupplierNotFoundException;
import com.freshmart.mapper.ProductMapper;
import com.freshmart.model.Product;
import com.freshmart.model.Supplier;
import com.freshmart.repository.ProductRepository;
import com.freshmart.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
    
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final ProductMapper productMapper;
    
    public ProductService(ProductRepository productRepository,
                          SupplierRepository supplierRepository,
                          ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
        this.productMapper = productMapper;
    }
    
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        ensureUpcIsUnique(request.upc());

        Product product = productMapper.toEntity(request);
        product.setSupplier(resolveSupplier(request.supplierId()));

        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = findProductByIdOrThrow(id);
        return productMapper.toResponse(product);
    }
    
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProductByIdOrThrow(id);

        if (!product.getUpc().equals(request.upc()) && productRepository.existsByUpc(request.upc())) {
            throw new DuplicateUpcException("Product with UPC " + request.upc() + " already exists");
        }

        productMapper.updateEntity(request, product);
        product.setSupplier(resolveSupplier(request.supplierId()));

        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    Product getProductEntity(Long id) {
        return findProductByIdOrThrow(id);
    }

    private void ensureUpcIsUnique(String upc) {
        if (productRepository.existsByUpc(upc)) {
            throw new DuplicateUpcException("Product with UPC " + upc + " already exists");
        }
    }

    private Product findProductByIdOrThrow(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
    }

    private Supplier resolveSupplier(Long supplierId) {
        if (supplierId == null) {
            return null;
        }
        return supplierRepository.findById(supplierId)
            .orElseThrow(() -> new SupplierNotFoundException("Supplier not found with id: " + supplierId));
    }
}
