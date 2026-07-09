# QuickReserve – Car Rental & Reservation Management System

## Project Description

QuickReserve is a web-based car rental and reservation management system developed as a final project for Web Programming II. The system allows customers to browse available vehicles, search and filter cars, create reservations, and manage their bookings. Administrators can manage cars, categories, users, and booking requests through a dedicated admin panel.

The project was built using Node.js, Express.js, PostgreSQL, and React. It follows the MVC (Model-View-Controller) architecture and implements authentication, authorization, password hashing, logging, and RESTful API design.

---

## Technology Stack

### Backend

* Node.js
* Express.js
* PostgreSQL
* pg (node-postgres)
* JSON Web Token (JWT)
* bcryptjs
* express-validator
* dotenv
* cors

### Frontend

* React
* Vite
* React Router
* Axios
* React Hot Toast
* CSS

---

## Project Structure

```text
quickreserve/
├── backend/
│   ├── config/
│   │   ├── config.js
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── carController.js
│   │   ├── bookingController.js
│   │   ├── categoryController.js
│   │   ├── userController.js
│   │   └── dashboardController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Car.js
│   │   ├── Booking.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── carRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── userRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── loggerMiddleware.js
│   │   └── errorMiddleware.js
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── utils/
│   │   ├── jwt.js
│   │   └── helpers.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── context/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    └── package.json
```

### Folder Description

* **config/** – Application and database configuration files.
* **controllers/** – Contains business logic for handling requests.
* **models/** – Handles database operations and queries.
* **routes/** – Defines API endpoints.
* **middleware/** – Authentication, authorization, logging, and error handling.
* **database/** – Database schema and seed files.
* **utils/** – Helper functions and JWT utilities.
* **components/** – Reusable frontend components.
* **pages/** – Application pages.
* **services/** – API communication logic.
* **context/** – Authentication and state management.

---

## Main Features

### Customer Features

* User registration and login
* Browse available cars
* Search and filter vehicles
* View car details
* Create bookings
* View booking history
* Update profile information

### Admin Features

* Manage cars
* Manage categories
* Manage users
* Manage bookings
* View dashboard statistics

---

## Security Features

* JWT-based authentication
* Password hashing using bcrypt
* Role-based authorization
* Protected routes
* Input validation
* Error handling middleware
* Request logging middleware

---

## MVC Architecture

The project follows the MVC pattern:

* **Models** handle database operations.
* **Controllers** contain business logic.
* **Routes** define API endpoints.
* **Views/Client** are implemented using React.

This separation helps keep the application organized and maintainable.

---

## Database Design

The application uses PostgreSQL as its relational database.

### Main Tables

#### Users

* id
* full_name
* email
* password_hash
* role
* created_at

#### Categories

* id
* name

#### Cars

* id
* brand
* model
* year
* category_id
* daily_price
* availability_status
* image_url
* description
* created_at

#### Bookings

* id
* user_id
* car_id
* start_date
* end_date
* total_price
* booking_status
* created_at

### Relationships

* One user can have many bookings.
* One car can have many bookings.
* One category can have many cars.

The database schema and DDL scripts are included in the repository.

---

## Installation and Setup

### Prerequisites

* Node.js v18 or later
* PostgreSQL
* npm

### 1. Database Setup

Create the database:

```sql
CREATE DATABASE quickreserve_db;
```

Run the schema and seed files:

```bash
psql -U postgres -d quickreserve_db -f backend/database/schema.sql
psql -U postgres -d quickreserve_db -f backend/database/seed.sql
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (.env)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quickreserve_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## API Overview

The application provides RESTful API endpoints for:

* Authentication
* Cars
* Categories
* Bookings
* Users
* Dashboard

These endpoints are consumed by the React frontend through Axios.

---

## Authentication Flow

1. User registers or logs in.
2. Password is hashed using bcrypt.
3. JWT token is generated.
4. Token is stored on the client side.
5. Protected routes verify the token.
6. Authorization middleware checks user roles.

---

## Logging

A custom logging middleware records incoming HTTP requests, response status codes, and response times to help monitor application activity and simplify debugging.

---

## Challenges Faced

During development, some challenges included:

* Implementing JWT authentication
* Managing user roles and permissions
* Designing the database relationships
* Connecting the React frontend with the Express backend
* Handling booking validation and availability checks

---

## Additional Features

In addition to the concepts covered in class, the project includes:

* Role-Based Access Control (RBAC)
* Input validation
* Search and filtering functionality
* Dashboard statistics
* Custom logging middleware
* Responsive user interface

---
## Links
The Main Website (Frontend): http://localhost:5173 
The Backend API: http://localhost:5000

## Future Improvements

Possible future enhancements include:

* Online payment integration
* Email notifications
* Vehicle image uploads
* Booking reminders
* Report generation

---

## Conclusion

QuickReserve demonstrates the concepts covered in Web Programming II, including backend development with Node.js and Express.js, RESTful API design, JWT authentication, authorization, password hashing, PostgreSQL database integration, MVC architecture, and frontend-backend communication using React.
