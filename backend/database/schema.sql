-- ============================================================
-- QuickReserve Database Schema
-- PostgreSQL DDL Script
-- ============================================================

-- Drop tables if they exist (for clean re-run)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    full_name   VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role        VARCHAR(20) NOT NULL DEFAULT 'customer'
                    CHECK (role IN ('customer', 'admin')),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
CREATE TABLE categories (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================================
-- CARS TABLE
-- ============================================================
CREATE TABLE cars (
    id                  SERIAL PRIMARY KEY,
    brand               VARCHAR(100) NOT NULL,
    model               VARCHAR(100) NOT NULL,
    year                INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
    category_id         INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    daily_price         NUMERIC(10, 2) NOT NULL CHECK (daily_price > 0),
    availability_status BOOLEAN NOT NULL DEFAULT TRUE,
    image_url           TEXT,
    description         TEXT,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
CREATE TABLE bookings (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    car_id         INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    start_date     DATE NOT NULL,
    end_date       DATE NOT NULL,
    total_price    NUMERIC(10, 2) NOT NULL CHECK (total_price > 0),
    booking_status VARCHAR(20) NOT NULL DEFAULT 'pending'
                       CHECK (booking_status IN ('pending', 'approved', 'rejected', 'cancelled')),
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_bookings_user_id   ON bookings(user_id);
CREATE INDEX idx_bookings_car_id    ON bookings(car_id);
CREATE INDEX idx_bookings_status    ON bookings(booking_status);
CREATE INDEX idx_cars_category_id   ON cars(category_id);
CREATE INDEX idx_cars_availability  ON cars(availability_status);
CREATE INDEX idx_users_email        ON users(email);

-- ============================================================
-- ER DIAGRAM DESCRIPTION
-- 
-- users (1) ──< bookings (many)   [user_id FK]
-- cars  (1) ──< bookings (many)   [car_id FK]
-- categories (1) ──< cars (many)  [category_id FK]
--
-- users:      id(PK), full_name, email(UNIQUE), password_hash, role, created_at
-- categories: id(PK), name(UNIQUE)
-- cars:       id(PK), brand, model, year, category_id(FK), daily_price,
--             availability_status, image_url, description, created_at
-- bookings:   id(PK), user_id(FK), car_id(FK), start_date, end_date,
--             total_price, booking_status, created_at
-- ============================================================
