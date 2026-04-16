-- Enforce UPC-A format: exactly 12 numeric digits.
-- Backfill existing non-conforming values to a deterministic 12-digit UPC.

UPDATE products
SET upc = LPAD(product_id::text, 12, '0')
WHERE upc IS NULL OR upc !~ '^[0-9]{12}$';

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM products
        GROUP BY upc
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'Cannot enforce UPC-A: generated UPC values are not unique';
    END IF;
END $$;

ALTER TABLE products
    ALTER COLUMN upc TYPE VARCHAR(12);

ALTER TABLE products
    ADD CONSTRAINT chk_products_upc_upca
    CHECK (upc ~ '^[0-9]{12}$');
