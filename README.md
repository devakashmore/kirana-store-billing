# KiranaFlow 🚀
### Smart Billing. Simple Business.

KiranaFlow is a modern, scalable billing and store management system designed for small retail businesses, especially Kirana stores.

It aims to simplify daily store operations through digital billing, inventory tracking, customer management, sales reports, and secure role-based access.

The project is being developed with a modular backend architecture using Node.js, Express.js, PostgreSQL, and Prisma ORM.

---

## 📌 Project Status

**Currently under development.**

The initial backend infrastructure, PostgreSQL connection, Prisma setup, database migrations, and health-check endpoint have been completed.

Authentication, billing, inventory, and other business modules are planned for upcoming development.

## ✨ Planned Features

- **Authentication & Authorization**
  - Secure owner and cashier login
  - JWT access and refresh tokens
  - Password hashing with bcrypt
  - Role-based access control

- **Billing & Invoicing**
  - Fast billing workflow
  - Multiple products in a single bill
  - Automatic subtotal, discount, tax, and total calculation
  - Bill history and receipt generation
  - Historical product and price snapshots on bill items

- **Product Management**
  - Add, update, and manage products
  - Product categories
  - SKU and barcode support
  - Purchase price and selling price management

- **Inventory Management**
  - Stock tracking
  - Stock adjustments
  - Low-stock alerts
  - Inventory movement history

- **Customer Management**
  - Customer mobile number
  - Purchase history
  - Digital receipt delivery

- **Reports & Analytics**
  - Daily and monthly sales reports
  - Revenue summaries
  - Best-selling products
  - Inventory reports

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js 5 | REST API framework |
| PostgreSQL 16 | Relational database |
| Prisma ORM 6 | Database access and migrations |
| JavaScript (ES Modules) | Backend development |
| bcrypt | Password hashing |
| JSON Web Token | Authentication |
| Zod | Request validation |
| Helmet | Security headers |
| express-rate-limit | API rate limiting |
| Pino | Application logging |
| Docker | Database containerization |
| Vitest | Testing |
| Supertest | API testing |

## 🏗️ Project Architecture

```text
kiranaflow/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── env.js
│   │   │   └── logger.js
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── inventory/
│   │   │   ├── billing/
│   │   │   ├── customers/
│   │   │   ├── reports/
│   │   │   └── health/
│   │   │
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   ├── docker-compose.yml
│   ├── prisma.config.ts
│   ├── package.json
│   └── .env.example
│
└── README.md
```

*Modules will be added as development progresses.*

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Node.js 22+
- npm
- Docker Desktop
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/kiranaflow.git

cd kiranaflow/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory.

```env
NODE_ENV=development
PORT=8000

DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5433/kirana_billing?schema=public"

JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

COOKIE_SECURE=false
SESSION_IDLE_TIMEOUT_MINUTES=30

FRONTEND_URL=http://localhost:5173
```

Generate separate secure JWT secrets. Never commit your `.env` file to GitHub.

### 4. Start PostgreSQL using Docker

```bash
docker compose up -d
```

Check the database container:

```bash
docker compose ps
```

### 5. Generate Prisma Client

```bash
npm run db:generate
```

### 6. Run database migrations

For an existing database with migrations:

```bash
npm run db:migrate:deploy
```

For local development when creating a new migration:

```bash
npm run db:migrate
```

### 7. Start the development server

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:8000
```

## 🔌 API Endpoints

Base URL:

```text
http://localhost:8000/api/v1
```

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | API and database health check |
| POST | `/auth/register` | Owner registration (planned) |
| POST | `/auth/login` | User login (planned) |
| POST | `/auth/refresh` | Refresh access token (planned) |
| POST | `/auth/logout` | Logout (planned) |

Only the health endpoint is currently implemented. Authentication endpoints are planned.

## 🔐 Security Considerations

KiranaFlow is being designed with security as a priority.

- Password hashing using bcrypt.
- Short-lived JWT access tokens.
- Database-backed refresh sessions and token rotation.
- Role-based authorization.
- Request validation using Zod.
- HTTP security headers using Helmet.
- API rate limiting.
- Environment-based configuration.
- Centralized error handling.
- Secure cookie configuration for production.

## 🗄️ Database Design

The initial database schema includes:

- `Store`
- `User`
- `RefreshSession`
- `OtpChallenge`

Additional models will be introduced for:

- Products
- Categories
- Inventory
- Customers
- Bills
- Bill Items
- Payments
- Stock Movements
- Audit Logs

The architecture includes `storeId` relationships to support future multi-store functionality.

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run coverage:

```bash
npm run test:coverage
```

## 🎯 Project Goals

KiranaFlow is being developed to demonstrate practical backend engineering skills, including:

- RESTful API development
- Relational database design
- Database transactions
- Authentication and authorization
- Secure session management
- Modular backend architecture
- Inventory and billing workflows
- API testing and error handling
- Docker-based development environments

## 🚀 Future Improvements

- React-based admin dashboard
- Barcode scanner integration
- PDF invoice generation
- Thermal printer support
- WhatsApp receipt integration
- Advanced sales analytics
- Multi-store management
- Cloud deployment

## 👨‍💻 Author

**Akash More**

- GitHub: [@devakashmore](https://github.com/devakashmore)

---

⭐ If you find this project interesting, consider giving it a star!

**KiranaFlow — Making everyday retail operations smarter.**
