package com.freshmart.service;

import com.freshmart.model.Store;
import com.freshmart.model.User;
import com.freshmart.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {
    
    private static final String DEFAULT_USERNAME = "manager_downtown";
    
    private final UserRepository userRepository;
    
    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User getCurrentUser() {
        return userRepository.findByUsernameAndIsActiveTrue(DEFAULT_USERNAME)
            .orElseThrow(() -> new IllegalStateException("Default user not found. Please run database migrations."));
    }
    
    public Long getCurrentUserId() {
        return getCurrentUser().getUserId();
    }
    
    public Store getCurrentStore() {
        User user = getCurrentUser();
        if (user.getAssignedStore() == null) {
            throw new IllegalStateException("Current user has no assigned store");
        }
        return user.getAssignedStore();
    }
    
    public Long getCurrentStoreId() {
        return getCurrentStore().getStoreId();
    }
}