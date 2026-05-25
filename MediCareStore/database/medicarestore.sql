-- MediCare Store Database Schema
-- Production ready schema with all tables

SET FOREIGN_KEY_CHECKS = 0;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(15) DEFAULT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `avatar` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `is_verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Addresses
CREATE TABLE IF NOT EXISTS `user_addresses` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `address_line1` VARCHAR(200) NOT NULL,
  `address_line2` VARCHAR(200) DEFAULT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(10) NOT NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `parent_id` INT UNSIGNED DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `description` TEXT,
  `short_description` VARCHAR(500) DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `compare_price` DECIMAL(10,2) DEFAULT NULL,
  `cost_price` DECIMAL(10,2) DEFAULT NULL,
  `stock` INT UNSIGNED DEFAULT 0,
  `sku` VARCHAR(100) DEFAULT NULL UNIQUE,
  `brand` VARCHAR(100) DEFAULT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `is_prescription_required` TINYINT(1) DEFAULT 0,
  `dosage_form` VARCHAR(50) DEFAULT NULL,
  `strength` VARCHAR(100) DEFAULT NULL,
  `manufacturer` VARCHAR(150) DEFAULT NULL,
  `expiry_date` DATE DEFAULT NULL,
  `storage_instructions` VARCHAR(300) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
  INDEX `idx_category` (`category_id`),
  INDEX `idx_featured` (`is_featured`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_slug` (`slug`),
  FULLTEXT INDEX `ft_search` (`name`, `description`, `brand`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Images Table
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT UNSIGNED NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `public_id` VARCHAR(300) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  INDEX `idx_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- OTP Table
CREATE TABLE IF NOT EXISTS `otps` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL,
  `otp` VARCHAR(10) NOT NULL,
  `purpose` ENUM('verification', 'password_reset', 'login') DEFAULT 'verification',
  `expires_at` TIMESTAMP NOT NULL,
  `is_used` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email_purpose` (`email`, `purpose`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coupons Table
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `discount_type` ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
  `discount_value` DECIMAL(10,2) NOT NULL,
  `min_order_amount` DECIMAL(10,2) DEFAULT NULL,
  `max_discount_amount` DECIMAL(10,2) DEFAULT NULL,
  `max_uses` INT UNSIGNED DEFAULT NULL,
  `max_uses_per_user` INT UNSIGNED DEFAULT NULL,
  `used_count` INT UNSIGNED DEFAULT 0,
  `expires_at` TIMESTAMP NULL DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT UNSIGNED NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `discount_amount` DECIMAL(10,2) DEFAULT 0,
  `tax_amount` DECIMAL(10,2) DEFAULT 0,
  `shipping_amount` DECIMAL(10,2) DEFAULT 0,
  `final_amount` DECIMAL(10,2) NOT NULL,
  `payment_method` ENUM('razorpay','cod','bank_transfer') NOT NULL DEFAULT 'cod',
  `payment_status` ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  `razorpay_order_id` VARCHAR(100) DEFAULT NULL,
  `razorpay_payment_id` VARCHAR(100) DEFAULT NULL,
  `razorpay_signature` VARCHAR(300) DEFAULT NULL,
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  `shipping_address` JSON NOT NULL,
  `billing_address` JSON DEFAULT NULL,
  `coupon_code` VARCHAR(50) DEFAULT NULL,
  `coupon_discount` DECIMAL(10,2) DEFAULT 0,
  `store_id` INT UNSIGNED DEFAULT NULL COMMENT 'ID of the fulfilling store',
  `store_name` VARCHAR(255) DEFAULT NULL COMMENT 'Name of the fulfilling store',
  `status` ENUM('pending','confirmed','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  `status_note` TEXT DEFAULT NULL,
  `delivered_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  INDEX `idx_user` (`user_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_order_id` (`order_id`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items Table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `price` DECIMAL(10,2) NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT,
  INDEX `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Status History
CREATE TABLE IF NOT EXISTS `order_status_history` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT UNSIGNED NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `note` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  INDEX `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart Items Table
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_cart_item` (`user_id`, `product_id`),
  INDEX `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews Table
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL,
  `title` VARCHAR(200) DEFAULT NULL,
  `comment` TEXT DEFAULT NULL,
  `is_approved` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_review` (`product_id`, `user_id`),
  INDEX `idx_product` (`product_id`),
  INDEX `idx_approved` (`is_approved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Wishlists Table
CREATE TABLE IF NOT EXISTS `wishlists` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `unique_wishlist` (`user_id`, `product_id`),
  INDEX `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Banners Table
CREATE TABLE IF NOT EXISTS `banners` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `subtitle` VARCHAR(300) DEFAULT NULL,
  `image` VARCHAR(500) NOT NULL,
  `link` VARCHAR(500) DEFAULT NULL,
  `position` ENUM('hero','offer','sidebar') DEFAULT 'hero',
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- SEED DATA
-- =============================================

-- Default Admin User (Password: Admin@123)
INSERT IGNORE INTO `users` (`name`, `email`, `password`, `role`, `is_active`, `is_verified`) VALUES
('Admin User', 'admin@medicarestore.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.AgNf5bP8i', 'admin', 1, 1);

-- Categories
INSERT IGNORE INTO `categories` (`name`, `slug`, `description`, `sort_order`, `is_active`) VALUES
('Medicines', 'medicines', 'All types of prescription and OTC medicines', 1, 1),
('Vitamins & Supplements', 'vitamins-supplements', 'Health vitamins, minerals and dietary supplements', 2, 1),
('Personal Care', 'personal-care', 'Skincare, haircare and personal hygiene products', 3, 1),
('Baby Care', 'baby-care', 'Safe products for babies and toddlers', 4, 1),
('Ayurveda', 'ayurveda', 'Natural ayurvedic medicines and products', 5, 1),
('Medical Devices', 'medical-devices', 'Health monitoring devices and medical equipment', 6, 1),
('Fitness', 'fitness', 'Protein powders, sports nutrition and fitness products', 7, 1),
('COVID Care', 'covid-care', 'COVID prevention, testing and treatment products', 8, 1);

-- Sample Products
INSERT IGNORE INTO `products` (`name`, `slug`, `description`, `short_description`, `price`, `compare_price`, `stock`, `sku`, `brand`, `category_id`, `is_featured`, `dosage_form`, `strength`, `manufacturer`) VALUES
('Paracetamol 500mg Tablets', 'paracetamol-500mg-tablets', 'Paracetamol 500mg is used to relieve mild to moderate pain and fever.', 'Effective pain and fever relief', 25.00, 35.00, 500, 'MED-001', 'Cipla', 1, 1, 'Tablet', '500mg', 'Cipla Ltd'),
('Vitamin C 1000mg Effervescent', 'vitamin-c-1000mg-effervescent', 'Vitamin C 1000mg with zinc to boost immunity. Effervescent formula for faster absorption.', 'Boost immunity with Vitamin C and Zinc', 299.00, 399.00, 200, 'VIT-001', 'HealthKart', 2, 1, 'Effervescent Tablet', '1000mg', 'HealthKart Nutrition'),
('Himalaya Ashwagandha Capsules', 'himalaya-ashwagandha-60-caps', 'Powerful adaptogen that helps manage stress, improve energy levels and enhance vitality.', 'Natural stress relief and vitality booster', 349.00, 450.00, 150, 'AYU-001', 'Himalaya', 5, 1, 'Capsule', '300mg Extract', 'Himalaya Drug Company'),
('Cetaphil Moisturizing Cream 250g', 'cetaphil-moisturizing-cream-250g', 'Cetaphil Moisturizing Cream provides 24-hour hydration for dry to very dry sensitive skin.', '24hr intense moisturization for sensitive skin', 499.00, 650.00, 120, 'SPC-001', 'Cetaphil', 3, 1, 'Cream', 'Topical', 'Galderma India'),
('Omron BP Monitor HEM-7120', 'omron-bp-monitor-hem-7120', 'Automatic upper arm blood pressure monitor with IntelliSense technology for accurate readings.', 'Clinically validated home BP monitor', 2499.00, 3200.00, 50, 'DEV-001', 'Omron', 6, 1, 'Device', 'N/A', 'Omron Healthcare'),
('Multivitamin Women 60 Tablets', 'multivitamin-women-60-tablets', 'Complete multivitamin for women with 25+ essential vitamins and minerals.', 'Complete daily nutrition for women', 549.00, 699.00, 180, 'VIT-002', 'GNC', 2, 1, 'Tablet', 'As Directed', 'GNC Holdings'),
('Dettol Antiseptic Liquid 500ml', 'dettol-antiseptic-liquid-500ml', 'Dettol Antiseptic kills 99.9% of germs. Use for wound care and hand hygiene.', 'Kills 99.9% germs trusted antiseptic', 145.00, 180.00, 300, 'PC-001', 'Dettol', 3, 0, 'Liquid', 'Topical Use', 'Reckitt India'),
('Protein Whey Chocolate 1kg', 'protein-whey-chocolate-1kg', 'Premium whey protein with 24g protein per serving. Helps in muscle building and recovery.', 'Build muscle with premium whey protein', 1299.00, 1799.00, 75, 'FIT-001', 'MuscleBlaze', 7, 1, 'Powder', '24g Protein/Serving', 'HYF Wellness');

-- Sample Coupons
INSERT IGNORE INTO `coupons` (`code`, `discount_type`, `discount_value`, `min_order_amount`, `max_discount_amount`, `max_uses`, `is_active`) VALUES
('FIRST10', 'percentage', 10.00, 200.00, 100.00, 1000, 1),
('SAVE50', 'fixed', 50.00, 500.00, NULL, 500, 1),
('HEALTH20', 'percentage', 20.00, 999.00, 200.00, 200, 1);

SELECT 'MediCare Store database setup complete!' AS Message;
