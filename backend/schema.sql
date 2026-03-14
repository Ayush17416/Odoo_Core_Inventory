-- MySQL schema for Count-Cat

CREATE DATABASE IF NOT EXISTS countcat;
USE countcat;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  default_warehouse CHAR(36),
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) UNIQUE NOT NULL,
  role ENUM('inventory_manager', 'warehouse_staff') NOT NULL,
  FOREIGN KEY (user_id) REFERENCES profiles(user_id)
);

-- Index for performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- Test user
INSERT IGNORE INTO profiles (id, user_id, full_name, password_hash) VALUES ('test-id', 'test@test.com', 'Test User', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: 'password'
INSERT IGNORE INTO user_roles (id, user_id, role) VALUES ('test-role', 'test@test.com', 'inventory_manager');
