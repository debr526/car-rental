# 🚗 QuickReserve – Car Rental & Reservation Management System

> A full-stack, production-quality web application demonstrating all **Web Programming II** concepts including Node.js, Express.js, PostgreSQL, RESTful APIs, MVC Architecture, JWT Authentication, bcrypt password hashing, Role-Based Authorization, Logging Middleware, and complete CRUD operations.

---

## 📸 Features at a Glance

| Feature | Description |
|---------|-------------|
| 🔐 JWT Auth | Secure login/register with JSON Web Tokens |
| 🔒 bcrypt | Passwords stored as salted bcrypt hashes |
| 👥 RBAC | Role-Based Access Control (admin / customer) |
| 📋 Bookings | Full booking lifecycle with price calculation |
| 🚗 Fleet Management | Admin CRUD for cars, categories |
| 📊 Dashboard | Live stats for admin overview |
| 🔍 Search & Filter | Real-time car search by brand, category, price |
| 📝 Logger | Custom HTTP logger middleware |
| 🌐 REST API | 20+ RESTful endpoints |

---

## 🏗️ Technology Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Server-side JavaScript runtime |
| Express.js | Web framework + routing |
| PostgreSQL | Relational database |
| pg (node-postgres) | PostgreSQL driver |
| jsonwebtoken | JWT generation/verification |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| cors | Cross-Origin Resource Sharing |
| dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | Component-based UI |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client with JWT interceptor |
| React Hot Toast | Toast notifications |
| Vanilla CSS | Custom design system (dark theme) |

---

## 📁 Project Structure

```
quickreserve/
├── backend/
│   ├── config/
│   │   ├── config.js           # Central configuration
│   │   └── database.js         # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, GetMe
│   │   ├── carController.js    # Car CRUD + filtering
│   │   ├── bookingController.js# Booking lifecycle
│   │   ├── categoryController.js
│   │   ├── userController.js
│   │   └── dashboardController.js
│   ├── models/
│   │   ├── User.js             # User DB operations
│   │   ├── Car.js              # Car DB operations
│   │   ├── Booking.js          # Booking DB operations
│   │   └── Category.js         # Category DB operations
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── carRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── userRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   ├── roleMiddleware.js   # Role-based authorization
│   │   ├── loggerMiddleware.js # HTTP request logger
│   │   └── errorMiddleware.js  # 404 + global error handler
│   ├── database/
│   │   ├── schema.sql          # DDL script (tables, constraints)
│   │   └── seed.sql            # Seed data + admin account
│   ├── utils/
│   │   ├── jwt.js              # Token generation/verification
│   │   └── helpers.js          # Price calculator, utilities
│   ├── app.js                  # Express app configuration
│   ├── server.js               # HTTP server entry point
│   ├── .env                    # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx # Auth state management
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx     # Admin sidebar
    │   │   ├── CarCard.jsx
    │   │   ├── BookingForm.jsx # Price calculator + booking
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── SearchBar.jsx
    │   │   └── FilterPanel.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Cars.jsx
    │   │   ├── CarDetails.jsx
    │   │   ├── CustomerDashboard.jsx
    │   │   ├── MyBookings.jsx
    │   │   ├── Profile.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── ManageCars.jsx
    │   │       ├── ManageBookings.jsx
    │   │       ├── ManageUsers.jsx
    │   │       └── ManageCategories.jsx
    │   ├── services/
    │   │   ├── api.js          # Axios instance + JWT interceptor
    │   │   └── authService.js  # Auth operations + localStorage
    │   ├── App.jsx             # Router + layout
    │   ├── main.jsx
    │   └── index.css           # Complete design system
    ├── .env
    └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18 or higher
- **PostgreSQL** 14 or higher
- **npm** v8 or higher

---

### 1. Database Setup

1. Open **pgAdmin** or **psql** and create the database:
   ```sql
   CREATE DATABASE quickreserve_db;
   ```

2. Run the schema script:
   ```bash
   psql -U postgres -d quickreserve_db -f backend/database/schema.sql
   ```

3. Run the seed script (creates admin account + sample data):
   ```bash
   psql -U postgres -d quickreserve_db -f backend/database/seed.sql
   ```

---

### 2. Backend Setup

```bash
cd backend
```

Copy and configure environment variables:
```bash
copy .env.example .env
```

Edit `.env` with your PostgreSQL credentials:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=quickreserve_db
DB_USER=postgres
DB_PASSWORD=your_password_here

JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173
```

Install dependencies and start:
```bash
npm install
npm run dev
```

The API will be available at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `quickreserve_db` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | *(required)* |
| `JWT_SECRET` | Secret for JWT signing | *(required)* |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `FRONTEND_URL` | CORS allowed origin | `http://localhost:5173` |

### Frontend `.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 👤 Default Admin Credentials

```
Email:    admin@quickreserve.com
Password: Admin123
Role:     admin
```

> ⚠️ The password is stored as a **bcrypt hash** in the database via the seed script.

---

## 📡 REST API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register new customer |
| `POST` | `/api/auth/login` | Public | Login + receive JWT |
| `GET` | `/api/auth/me` | 🔐 Auth | Get current user info |

### Cars
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/cars` | Public | List cars (with filters) |
| `GET` | `/api/cars/:id` | Public | Get car details |
| `POST` | `/api/cars` | 👑 Admin | Add new car |
| `PUT` | `/api/cars/:id` | 👑 Admin | Update car |
| `DELETE` | `/api/cars/:id` | 👑 Admin | Delete car |
| `PATCH` | `/api/cars/:id/availability` | 👑 Admin | Toggle availability |

#### Car Filter Query Params
```
GET /api/cars?search=toyota&category_id=1&min_price=30&max_price=100&available=true
```

### Categories
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/categories` | Public | List all categories |
| `POST` | `/api/categories` | 👑 Admin | Create category |
| `PUT` | `/api/categories/:id` | 👑 Admin | Update category |
| `DELETE` | `/api/categories/:id` | 👑 Admin | Delete category |

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/bookings` | 🔐 Customer | Create booking |
| `GET` | `/api/bookings/my-bookings` | 🔐 Customer | Own bookings |
| `GET` | `/api/bookings` | 👑 Admin | All bookings |
| `PUT` | `/api/bookings/:id/status` | 👑 Admin | Approve/Reject/Cancel |
| `DELETE` | `/api/bookings/:id` | 🔐 Auth | Cancel (customer) / Delete (admin) |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/users` | 👑 Admin | List all users |
| `PUT` | `/api/users/:id` | 🔐 Auth | Update profile/role |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/dashboard/summary` | 👑 Admin | Aggregated statistics |

---

## 🗄️ Database Schema

### ER Diagram Description

```
users (1) ──────< bookings (many)   [bookings.user_id → users.id]
cars  (1) ──────< bookings (many)   [bookings.car_id  → cars.id]
categories (1) ─< cars (many)       [cars.category_id → categories.id]
```

### Tables

#### `users`
| Column | Type | Constraint |
|--------|------|-----------|
| id | SERIAL | PRIMARY KEY |
| full_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | NOT NULL UNIQUE |
| password_hash | TEXT | NOT NULL |
| role | VARCHAR(20) | CHECK (customer\|admin) DEFAULT 'customer' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### `categories`
| Column | Type | Constraint |
|--------|------|-----------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL UNIQUE |

#### `cars`
| Column | Type | Constraint |
|--------|------|-----------|
| id | SERIAL | PRIMARY KEY |
| brand | VARCHAR(100) | NOT NULL |
| model | VARCHAR(100) | NOT NULL |
| year | INTEGER | CHECK (1900–2100) |
| category_id | INTEGER | FK → categories.id ON DELETE SET NULL |
| daily_price | NUMERIC(10,2) | CHECK (> 0) |
| availability_status | BOOLEAN | DEFAULT TRUE |
| image_url | TEXT | |
| description | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### `bookings`
| Column | Type | Constraint |
|--------|------|-----------|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | FK → users.id ON DELETE CASCADE |
| car_id | INTEGER | FK → cars.id ON DELETE CASCADE |
| start_date | DATE | NOT NULL |
| end_date | DATE | NOT NULL |
| total_price | NUMERIC(10,2) | CHECK (> 0) |
| booking_status | VARCHAR(20) | CHECK (pending\|approved\|rejected\|cancelled) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

---

## 🔐 Authentication Flow

```
1. Customer registers  →  POST /api/auth/register
2. Server hashes password with bcrypt (12 salt rounds)
3. Server inserts user record with role='customer'
4. Server generates JWT: { id, role } signed with JWT_SECRET
5. Client stores JWT in localStorage
6. Client sends JWT in every request: Authorization: Bearer <token>
7. authMiddleware.js verifies token on every protected route
8. roleMiddleware.js checks user.role against allowed roles
```

---

## 📋 Booking Price Calculation

```
Total Price = Daily Price × Number of Days
Number of Days = ceil((end_date - start_date) / 86400000)

Example:
  Daily Price = $95.00
  Start = 2025-08-10, End = 2025-08-13 (3 days)
  Total = $95.00 × 3 = $285.00
```

---

## 🪵 Logger Middleware

Every HTTP request is logged to the console:
```
[2025-08-10T14:23:01.123Z] GET /api/cars 200 45ms
[2025-08-10T14:23:05.456Z] POST /api/auth/login 200 120ms
[2025-08-10T14:23:10.789Z] POST /api/bookings 201 89ms
[2025-08-10T14:23:15.000Z] PUT /api/bookings/5/status 200 56ms
```

---

## 🎯 Key Implementation Concepts Demonstrated

| Concept | Implementation |
|---------|---------------|
| MVC Architecture | `models/`, `controllers/`, `routes/` separation |
| REST API | Express.js with proper HTTP methods and status codes |
| JWT | `jsonwebtoken` in `utils/jwt.js` + Bearer token flow |
| bcrypt | `bcryptjs` with 12 salt rounds in `User.js` |
| Authorization | `authMiddleware.js` + `roleMiddleware.js` |
| Input Validation | `express-validator` in all write routes |
| Logging | Custom `loggerMiddleware.js` |
| Error Handling | `errorMiddleware.js` with 404 + global handler |
| CORS | Configured in `app.js` |
| PostgreSQL | Connection pooling with `pg` |
| Environment Config | `dotenv` + `config.js` |
| Frontend-Backend | React SPA consuming REST API via Axios |

---

## 📄 License

MIT License – Free to use for educational purposes.

---

*Built for Web Programming II Final Project Capstone – QuickReserve Car Rental Management System*
