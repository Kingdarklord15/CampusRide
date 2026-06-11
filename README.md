# CampusRide - Real-time Campus Ride-Hailing Platform

CampusRide is a production-ready, full-stack real-time ride management application tailored for university campuses. It facilitates smooth, fast, and secure coordination between students/faculty (passengers) requesting rides, campus shuttle/e-rickshaw operators (drivers) fulfilling them, and campus security/dispatchers (admins) monitoring the system.

## 🚀 Key Features

- **Real-Time Dispatching**: Bi-directional real-time communication using Socket.IO for immediate ride requests, driver acceptances, and live status synchronization.
- **Interactive Routing**: Frontend Leaflet-based map integration featuring interactive hotspot selectors for pickup/dropoff, visual tracking, and route details.
- **Unified Auth**: Custom JWT-based cookie/bearer authentication for role-based dashboard authorization (Passenger, Driver, Admin) with automated silent token refreshes.
- **Payment Settlement**: Simulated payments (Cash, Mock UPI, Wallet) with automatic fee calculation based on distance and dynamic parameters.
- **System Monitoring**: Admin console featuring KPI analytics, driver registry approval mechanisms, and live system monitoring.
- **Robust Database**: Strong Prisma PostgreSQL models tracking active and historical rides, rating reviews, notification logs, and system audit trails.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router, Tailwind CSS, TypeScript)
- **State Management**: Zustand (Auth, Ride, UI store persistence)
- **Data Fetching**: React Query & Axios
- **Live Maps**: Leaflet & OpenStreetMap (dynamic imports)
- **Charts**: Recharts
- **Icons & Components**: Lucide Icons & Radix UI custom primitives

### Backend
- **Framework**: Node.js & Express.js (TypeScript)
- **Real-time Gateway**: Socket.IO
- **Database client**: Prisma ORM
- **Authentication**: JWT & Bcrypt
- **Validation**: Zod (Schema-level request validations)

### Database
- **Engine**: PostgreSQL 16
- **Schema**: 11 models indexing user profiles, vehicle telemetry, payment invoices, and notification alert states.

---

## 📂 Project Directory Structure

```text
campusride/
├── backend/
│   ├── prisma/             # Prisma schema & migrations
│   ├── src/
│   │   ├── config/         # App, env, and database settings
│   │   ├── middleware/     # Auth, role-gate, and error handling
│   │   ├── modules/        # Core business units (Auth, Rides, Payments...)
│   │   ├── sockets/        # Real-time WebSockets event listeners
│   │   └── utils/          # Logger and shared formatters
│   ├── Dockerfile
│   └── tsconfig.json
├── frontend/
│   ├── public/             # Static graphics and leaflets
│   ├── src/
│   │   ├── app/            # Next.js App Router (pages & layouts)
│   │   ├── components/     # UI elements (buttons, inputs, cards)
│   │   ├── constants/      # App routing configurations
│   │   ├── hooks/          # Custom hooks (Queries, socket wrappers)
│   │   ├── lib/            # Axios API wrappers and styling helpers
│   │   ├── store/          # Zustand state management
│   │   └── types/          # Shared type interfaces
│   ├── Dockerfile
│   └── tailwind.config.ts
├── docker-compose.yml       # Production orchestration setup
├── .env.example             # Global environment configurations
└── README.md                # Documentation manual
```

---

## 🔌 Socket.IO Event Map

All real-time communications flow through Socket.IO namespaces/rooms. Below is the primary event contract:

| Event Name | Direction | Payload / Description |
| :--- | :--- | :--- |
| `connection` | Server <- Client | Initial handshake (requires valid Auth Header/Token) |
| `driver:update-location` | Server <- Client | Emits latitude and longitude updates from active drivers |
| `ride:request` | Server <- Client | Passengers request a ride (pickup/dropoff coordinates) |
| `ride:request-created` | Server -> Client | Dispatches active request details to nearby online drivers |
| `ride:accept` | Server <- Client | Driver accepts a pending ride request |
| `ride:accepted` | Server -> Client | Notifies passenger that their ride has been accepted |
| `ride:status-update` | Server <- Client | Updates status (`DRIVER_ARRIVING`, `IN_PROGRESS`, `COMPLETED`) |
| `ride:status-changed` | Server -> Client | Propagates new status transitions to passengers and monitor logs |

---

## 🐳 Running with Docker Compose

Ensure Docker and Docker Compose are installed on your machine.

1. **Clone the Repository** and navigate to the project directory:
   ```bash
   cd campusride
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```

3. **Spin up the containers**:
   Run the following command to build and launch all services (Database, Backend API, and Next.js Frontend) concurrently:
   ```bash
   docker compose up --build
   ```

4. **Verify Deployment**:
   - Frontend is active at: [http://localhost:3000](http://localhost:3000)
   - Backend API endpoint: [http://localhost:4001/api/v1](http://localhost:4001/api/v1)
   - PostgreSQL Database is running on port `5432`

---

## 💻 Local Manual Execution

If you prefer to run services individually without Docker:

### 1. Database Setup
Ensure you have a local PostgreSQL server running, create a database (e.g., `campusride_db`), and set the corresponding `DATABASE_URL` in `backend/.env`.

### 2. Launch the Backend API
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### 3. Launch the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the client dashboard.
