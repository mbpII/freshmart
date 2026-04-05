-- V4__seed_users.sql
-- Seed initial users for each store

-- Password for all seed users: 'password' (BCrypt hash)
-- In production, use proper password hashing and management

INSERT INTO users (username, password_hash, role, assigned_store_id, is_active) VALUES
    ('manager_downtown', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MrqJWJPqZJTrZqJqJqJqJqJqJqJqJq', 'MANAGER', 101, TRUE),
    ('manager_northside', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MrqJWJPqZJTrZqJqJqJqJqJqJqJqJq', 'MANAGER', 102, TRUE),
    ('manager_westside', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MrqJWJPqZJTrZqJqJqJqJqJqJqJqJq', 'MANAGER', 103, TRUE),
    ('manager_riverside', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MrqJWJPqZJTrZqJqJqJqJqJqJqJqJq', 'MANAGER', 104, TRUE),
    ('associate_downtown', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MrqJWJPqZJTrZqJqJqJqJqJqJqJqJq', 'ASSOCIATE', 101, TRUE),
    ('associate_northside', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MrqJWJPqZJTrZqJqJqJqJqJqJqJqJq', 'ASSOCIATE', 102, TRUE),
    ('associate_westside', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MrqJWJPqZJTrZqJqJqJqJqJqJqJqJq', 'ASSOCIATE', 103, TRUE),
    ('associate_riverside', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MrqJWJPqZJTrZqJqJqJqJqJqJqJqJq', 'ASSOCIATE', 104, TRUE),
    ('corporate_admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MrqJWJPqZJTrZqJqJqJqJqJqJqJqJq', 'CORPORATE', NULL, TRUE);