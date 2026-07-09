-- ============================================================
-- QuickReserve Seed Data
-- Run AFTER schema.sql
-- ============================================================

-- ============================================================
-- ADMIN USER
-- Email: admin@quickreserve.com
-- Password: Admin123  (bcrypt hash below)
-- ============================================================
INSERT INTO users (full_name, email, password_hash, role)
VALUES (
    'QuickReserve Admin',
    'admin@quickreserve.com',
    '$2a$12$wwjvTzCypM4MpYUwykBiAuzx91Fl2Zn/hmnqDw9LX3gusa4nYfLXe',
    'admin'
) ON CONFLICT (email) DO NOTHING;

-- Sample customers
INSERT INTO users (full_name, email, password_hash, role)
VALUES
    ('Abel Tesfaye',  'abel@example.com',  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgUCWlOaRrZ6GAmqc8KRdG', 'customer'),
    ('Yosef Bekele',  'yosef@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgUCWlOaRrZ6GAmqc8KRdG', 'customer'),
    ('Nati Alemu',    'nati@example.com',  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgUCWlOaRrZ6GAmqc8KRdG', 'customer')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (name)
VALUES
    ('Economy'),
    ('Compact'),
    ('SUV'),
    ('Luxury'),
    ('Sports'),
    ('Van')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- CARS
-- ============================================================
INSERT INTO cars (brand, model, year, category_id, daily_price, availability_status, image_url, description)
VALUES
    ('Toyota', 'Corolla', 2022,
     (SELECT id FROM categories WHERE name = 'Economy'),
     45.00, TRUE,
     'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600',
     'Reliable and fuel-efficient compact sedan. Perfect for city driving and daily commutes. Features air conditioning, Bluetooth connectivity, and backup camera.'),

    ('Honda', 'Civic', 2023,
     (SELECT id FROM categories WHERE name = 'Compact'),
     55.00, TRUE,
     'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600',
     'Modern and stylish compact car with excellent fuel economy. Equipped with Honda Sensing safety suite, touchscreen infotainment, and Apple CarPlay.'),

    ('Ford', 'Explorer', 2023,
     (SELECT id FROM categories WHERE name = 'SUV'),
     95.00, TRUE,
     'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600',
     'Spacious 7-passenger SUV ideal for family trips and adventures. Features 4WD capability, panoramic sunroof, and advanced navigation system.'),

    ('BMW', '5 Series', 2024,
     (SELECT id FROM categories WHERE name = 'Luxury'),
     180.00, TRUE,
     'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600',
     'Premium executive sedan offering unparalleled comfort and performance. Leather interior, adaptive cruise control, and iDrive infotainment system.'),

    ('Chevrolet', 'Camaro', 2023,
     (SELECT id FROM categories WHERE name = 'Sports'),
     140.00, TRUE,
     'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600',
     'Iconic American muscle car with thrilling V8 performance. Features sport-tuned suspension, Brembo brakes, and Recaro seats for an exhilarating drive.'),

    ('Mercedes-Benz', 'Sprinter', 2022,
     (SELECT id FROM categories WHERE name = 'Van'),
     120.00, TRUE,
     'https://images.unsplash.com/photo-1566043423584-5e5e0b7f7a7b?w=600',
     'Versatile cargo and passenger van suitable for group travel or business use. High roof configuration, rear AC, and generous cargo space.'),

    ('Hyundai', 'Tucson', 2023,
     (SELECT id FROM categories WHERE name = 'SUV'),
     75.00, TRUE,
     'https://images.unsplash.com/photo-1619976215249-a6b8e94e9ccf?w=600',
     'Stylish and feature-packed compact SUV. All-wheel drive, heated seats, wireless charging, and a comprehensive suite of driver assistance features.'),

    ('Audi', 'A4', 2024,
     (SELECT id FROM categories WHERE name = 'Luxury'),
     155.00, TRUE,
     'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600',
     'Refined German engineering in a sleek sedan package. Quattro AWD, Virtual Cockpit digital instrument cluster, and Bang & Olufsen sound system.'),

    ('Toyota', 'Yaris', 2022,
     (SELECT id FROM categories WHERE name = 'Economy'),
     38.00, TRUE,
     'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600',
     'Compact and economical city car. Easy to park, excellent fuel economy, and perfect for solo or duo travel on a budget.'),

    ('Porsche', '911', 2024,
     (SELECT id FROM categories WHERE name = 'Sports'),
     250.00, FALSE,
     'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600',
     'The legendary sports car that defines driving excellence. Twin-turbo flat-six engine, PDK transmission, and Sport Chrono package for track-ready performance.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SAMPLE BOOKINGS
-- ============================================================
INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price, booking_status)
VALUES
    (
        (SELECT id FROM users WHERE email = 'abel@example.com'),
        (SELECT id FROM cars WHERE brand = 'Toyota' AND model = 'Corolla'),
        CURRENT_DATE + 5,
        CURRENT_DATE + 8,
        135.00,
        'approved'
    ),
    (
        (SELECT id FROM users WHERE email = 'yosef@example.com'),
        (SELECT id FROM cars WHERE brand = 'BMW' AND model = '5 Series'),
        CURRENT_DATE + 2,
        CURRENT_DATE + 5,
        540.00,
        'pending'
    ),
    (
        (SELECT id FROM users WHERE email = 'abel@example.com'),
        (SELECT id FROM cars WHERE brand = 'Honda' AND model = 'Civic'),
        CURRENT_DATE - 10,
        CURRENT_DATE - 7,
        165.00,
        'approved'
    )
ON CONFLICT DO NOTHING;
