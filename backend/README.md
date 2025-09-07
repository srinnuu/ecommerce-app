# E-commerce Backend (Node.js + Express + PostgreSQL)

## Setup
1. Create PostgreSQL DB: `createdb ecommerce_db`
2. Copy `.env.example` to `.env` and update `DATABASE_URL` & `JWT_SECRET`.
3. Install & run:
```
cd backend
npm install
npm run init:db
npm start
```
API endpoints:
- POST /api/auth/signup { email, password }
- POST /api/auth/login { email, password } -> returns { token }
- GET /api/items
- POST /api/items (protected)
- GET /api/cart (protected)
- POST /api/cart/add (protected) { itemId, quantity }
