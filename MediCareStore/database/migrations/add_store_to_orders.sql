-- Migration: Add store columns to orders table
-- Run this SQL in your MySQL database (medicarestore)
-- Date: 2026-05-25

ALTER TABLE `orders`
  ADD COLUMN IF NOT EXISTS `store_id` INT UNSIGNED DEFAULT NULL COMMENT 'ID of the fulfilling store' AFTER `coupon_discount`,
  ADD COLUMN IF NOT EXISTS `store_name` VARCHAR(255) DEFAULT NULL COMMENT 'Name of the fulfilling store' AFTER `store_id`;

-- Add index on store_id for admin filtering by store
ALTER TABLE `orders`
  ADD INDEX IF NOT EXISTS `idx_store_id` (`store_id`);

-- Verify the columns were added
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'medicarestore'
  AND TABLE_NAME = 'orders'
  AND COLUMN_NAME IN ('store_id', 'store_name');
