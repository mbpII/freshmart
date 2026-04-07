-- V3__fix_schema_to_epic01.sql
-- Align schema with EPIC-01 specification

-- Drop alerts table (not part of EPIC-01)
DROP TABLE IF EXISTS alerts;

-- Fix products table: remove created_at and updated_at (not in spec)
ALTER TABLE products DROP COLUMN IF EXISTS created_at;
ALTER TABLE products DROP COLUMN IF EXISTS updated_at;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Fix suppliers table: remove is_active and created_at (not in spec)
ALTER TABLE suppliers DROP COLUMN IF EXISTS is_active;
ALTER TABLE suppliers DROP COLUMN IF EXISTS created_at;

-- Create users table first (required for transactions foreign key)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('MANAGER', 'ASSOCIATE', 'CORPORATE')),
    assigned_store_id SMALLINT REFERENCES stores(store_id),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create index for user lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_store ON users(assigned_store_id);

-- Fix transactions table: remove created_at, add user_id
ALTER TABLE transactions DROP COLUMN IF EXISTS created_at;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id INTEGER;
ALTER TABLE transactions ADD CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE transactions ALTER COLUMN user_id SET NOT NULL;

-- Create index for transactions user foreign key
CREATE INDEX idx_transactions_user ON transactions(user_id);