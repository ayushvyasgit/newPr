# Money Transfer API - Setup Guide

## Prerequisites
- Node.js v16+
- PostgreSQL v12+

## Setup Steps

1. **Install dependencies**
```bash
npm install
```

2. **Create `.env` file**
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=money_transfer_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

3. **Create database**
```bash
createdb money_transfer_db
```

4. **Run migrations**
```bash
psql -U postgres -d money_transfer_db -f database/schema.sql
```

5. **Start server**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## API Usage

### 1. Register User
```bash
POST /api/auth/register

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}
```

**Response:** Returns `user` object and `token`

### 2. Login
```bash
POST /api/auth/login

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Returns `token` (use this in Authorization header for all requests below)

---

**All endpoints below require:** `Authorization: Bearer YOUR_TOKEN`

---

### 3. Get Account Balance
```bash
GET /api/accounts/me
```

### 4. Deposit Money (Testing)
```bash
POST /api/accounts/deposit

{
  "amount": 1000
}
```

### 5. Transfer Money
```bash
POST /api/transfers

{
  "to_account_number": "ACC123456789",
  "amount": 100,
  "description": "Payment"
}
```

### 6. Get Transaction History
```bash
GET /api/transfers/history?page=1&limit=10
```

### 7. Create Scheduled Transfer
```bash
POST /api/scheduled-transfers

{
  "to_account_number": "ACC123456789",
  "amount": 50,
  "frequency": "monthly",
  "description": "Rent payment",
  "start_date": "2024-02-01",
  "end_date": "2024-12-01"
}
```

**Frequency:** `daily` | `weekly` | `monthly` | `once`

### 8. List Scheduled Transfers
```bash
GET /api/scheduled-transfers
```

### 9. Pause Scheduled Transfer
```bash
PATCH /api/scheduled-transfers/:id/pause
```

### 10. Resume Scheduled Transfer
```bash
PATCH /api/scheduled-transfers/:id/resume
```

### 11. Cancel Scheduled Transfer
```bash
DELETE /api/scheduled-transfers/:id
```

### 12. Get Execution History
```bash
GET /api/scheduled-transfers/:id/executions
```

---

## Quick Test Flow

```bash
# 1. Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass1234","full_name":"Test User"}'

# 2. Login (save the token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass1234"}'

# 3. Deposit money
curl -X POST http://localhost:3000/api/accounts/deposit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":5000}'

# 4. Check balance
curl -X GET http://localhost:3000/api/accounts/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Features
✅ User authentication with JWT  
✅ Account management with balance  
✅ Instant money transfers  
✅ Scheduled recurring transfers (daily/weekly/monthly)  
✅ Transaction history with pagination  
✅ Pause/resume/cancel scheduled transfers  
✅ Auto-execution of scheduled transfers (cron job runs every minute)  

## Tech Stack
Node.js • Express • PostgreSQL • JWT • Bcrypt • Node-cron

---

## Troubleshooting

**Database connection error:**
- Verify PostgreSQL is running
- Check credentials in `.env` file

**Port already in use:**
- Change `PORT` in `.env` file

**Token expired:**
- Login again to get new token
