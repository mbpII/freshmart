package com.freshmart.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Objects;

@Entity
@Table(name = "stores")
public class Store {
    
    @Id
    @Column(name = "store_id")
    private Long storeId;
    
    @NotBlank(message = "Store name is required")
    @Size(max = 100, message = "Store name must not exceed 100 characters")
    @Column(name = "store_name", nullable = false, length = 100)
    private String storeName;
    
    @Size(max = 200, message = "Street must not exceed 200 characters")
    @Column(name = "street", length = 200)
    private String street;
    
    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    @Column(name = "city", nullable = false, length = 100)
    private String city;
    
    @NotBlank(message = "State is required")
    @Size(min = 2, max = 2, message = "State must be 2 characters")
    @Column(name = "state", nullable = false, length = 2)
    private String state;
    
    @Size(max = 10, message = "ZIP code must not exceed 10 characters")
    @Column(name = "zip_code", length = 10)
    private String zipCode;
    
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Column(name = "is_active")
    private Boolean isActive = true;

    public Long getStoreId() { return storeId; }
    public void setStoreId(Long storeId) { this.storeId = storeId; }
    
    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }
    
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public boolean isActive() { return isActive != null && isActive; }
    public void setActive(boolean isActive) { this.isActive = isActive; }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Store store)) return false;
        return storeId != null && Objects.equals(storeId, store.storeId);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    
    @Override
    public String toString() {
        return "Store{" +
                "storeId=" + storeId +
                ", storeName='" + storeName + '\'' +
                ", city='" + city + '\'' +
                ", state='" + state + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}