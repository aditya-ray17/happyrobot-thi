# HappyRobot Inbound Carrier Sales Automation Case Study

Voice automation system for freight brokerages to handle inbound carrier calls, verify credentials, match loads, negotiate pricing, and generate real-time analytics.

**Live Demo:** [https://happyrobot-thi-production.up.railway.app/](https://happyrobot-thi-production.up.railway.app/)

## Architecture

```
┌──────────────────┐
│  Carrier Phone   │
│      Call        │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────┐
│  HappyRobot Voice Agent │
│  • MC Verification      │
│  • Load Search          │
│  • Price Negotiation    │
└────────┬────────────────┘
         │
         │ HTTPS POST
         ▼
┌─────────────────────────┐
│   Express API Server    │
│   • /api/loads/search   │
│   • /api/calls/record   │
│   • /api/metrics        │
└────────┬────────────────┘
         │
         │ Prisma ORM
         ▼
┌─────────────────────────┐
│  PostgreSQL Database    │
│   • loads               │
│   • call_records        │
└─────────────────────────┘
```

## Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.x
- **Framework:** Express.js 5.x
- **ORM:** Prisma 6.x
- **Database:** PostgreSQL 15

### Frontend
- **Dashboard:** Vanilla HTML/CSS/JavaScript
- **Charts:** Chart.js 4.x
- **Styling:** Custom CSS with responsive design

### DevOps
- **Containerization:** Docker + Docker Compose
- **Deployment:** Railway
- **CI/CD:** Automated deployment on push to main

### External APIs
- **FMCSA API:** Carrier verification via DOT database
- **HappyRobot Platform:** AI voice agent orchestration

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Docker & Docker Compose

### Local Development Setup through Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/aditya-ray17/happyrobot-thi.git
   cd happyrobot-thi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
  You should receive instructions to do this by email

4. **Start PostgreSQL** (using Docker)
   ```bash
   docker-compose up -d db
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

6. **Seed the database**
   ```bash
   npm run seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Access the application**
   - Dashboard: [http://localhost:8080](http://localhost:8080)
   - API Health Check: [http://localhost:8080/api/health](http://localhost:8080/api/health)

### Docker Setup

Run the entire stack with Docker Compose:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL database on port 5432
- API server on port 8080
- Automatic database migrations and seeding

## API Documentation

### Base URL
- **Local:** `http://localhost:8080/api`
- **Production:** `https://happyrobot-thi-production.up.railway.app/api`

### Authentication
All `/api/*` endpoints require an API key in the header. 
I will give this to you.

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-27T12:00:00.000Z",
  "service": "HappyRobot Carrier Sales API"
}
```

---

#### 2. Search Loads
```http
POST /api/loads/search
Content-Type: application/json
x-api-key: your_api_key

```

**Request Body:**
```json
{
  "origin": "Chicago",
  # Leave body blank for ALL loads
  # You can also search by just destination, equipment type, and so on.
}
```

**Response:**
```json
{
  "loads": [
    {
      "id": 1,
      "load_id": "LD-2025-001",
      "origin": "Chicago, IL",
      "destination": "Dallas, TX",
      "pickup_datetime": "2025-10-22T12:00:00.000Z",
      "delivery_datetime": "2025-10-23T21:00:00.000Z",
      "equipment_type": "Dry Van",
      "loadboard_rate": 2400,
      "weight": 42000,
      "commodity_type": "Electronics",
      "miles": 967,
      "notes": "Tail-gate delivery required",
      "num_of_pieces": 18,
      "dimensions": "48x40x72"
    }
  ],
  "total": 1
}
```

---

#### 3. Record Call
```http
POST /api/calls/record
Content-Type: application/json
x-api-key: your_api_key
```

**Request Body:**
```json
{
  "call_id": "c9b0345a-b11f-4929-b726-923e3387b3c9",
  "mc_number": "172379",
  "carrier_name": "ABC Trucking Inc",
  "transcript": "[Full conversation transcript]",
  "classification": "booked",
  "sentiment": "positive",
  "negotiated_price": 2600,
  "loadboard_rate": 2400,
  "load_id": "LD-2025-001",
  "duration": 207,
  "negotiation_rounds": 2
}
```

**Response:**
```json
{
  "success": true,
  "call_id": "c9b0345a-b11f-4929-b726-923e3387b3c9"
}
```

---

#### 4. Get Metrics
```http
GET /api/metrics
x-api-key: your_api_key
```

**Response:**
```json
{
  "total_calls": 5,
  "successful_bookings": 3,
  "conversion_rate": 60.0,
  "average_call_duration": 195,
  "sentiment_distribution": {
    "positive": 4,
    "neutral": 1,
    "negative": 0
  },
  "counter_offer_rate": 40.0,
  "average_negotiation_rounds": 1.5,
  "popular_routes": [
    { "route": "Chicago, IL → Dallas, TX", "count": 2 }
  ],
  "popular_equipment": [
    { "equipment_type": "Dry Van", "count": 3 }
  ],
  "recent_calls": [
    {
      "call_id": "uuid",
      "mc_number": "172379",
      "carrier_name": "ABC Trucking",
      "classification": "booked",
      "sentiment": "positive",
      "timestamp": "2025-10-27T10:00:00.000Z"
    }
  ]
}
```

## Database Schema

### Load Table
```prisma
model Load {
  id                Int      @id @default(autoincrement())
  load_id           String   @unique
  origin            String
  destination       String
  pickup_datetime   DateTime
  delivery_datetime DateTime
  equipment_type    String
  loadboard_rate    Float
  notes             String?
  weight            Float
  commodity_type    String
  num_of_pieces     Int
  miles             Float
  dimensions        String
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt
  
  call_records CallRecord[]
}
```

### CallRecord Table
```prisma
model CallRecord {
  id                 Int      @id @default(autoincrement())
  call_id            String   @unique
  mc_number          String
  carrier_name       String?
  transcript         String?  @db.Text
  classification     String?  // booked, rejected, pending, failed_verification
  sentiment          String?  // positive, neutral, negative
  negotiated_price   Float?
  loadboard_rate     Float?
  load_id            String?
  duration           Int?     // seconds
  negotiation_rounds Int?
  timestamp          DateTime @default(now())
  
  load Load? @relation(fields: [load_id], references: [load_id])
}
```

## Project Structure

```
happyrobot-thi/
├── prisma/
│   ├── migrations/          # Database migration files
│   ├── schema.prisma        # Prisma schema definition
│   └── seed.js              # Database seeding script
├── src/
│   ├── middleware/
│   │   └── auth.ts          # API key authentication
│   ├── routes/
│   │   ├── calls.ts         # Call recording endpoints
│   │   ├── dashboard.ts     # Dashboard HTML injection for sensitive data
│   │   ├── loads.ts         # Load search endpoints
│   │   └── metrics.ts       # Analytics endpoints
│   ├── services/
│   │   └── prisma.ts        # Prisma client instance
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   └── index.ts             # Express app entry point
├── index.html               # Dashboard frontend
├── Dockerfile               # Docker container definition
├── docker-compose.yml       # Docker Compose orchestration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Node.js dependencies
```

## Testing

### Manual Testing through curl

1. **Test Load Search**
   ```bash
   curl -X POST http://localhost:8080/api/loads/search \
     -H "Content-Type: application/json" \
     -H "x-api-key: your_api_key" \
     -d '{"origin": "Chicago", "equipment_type": "Dry Van"}'
   ```

2. **Test Call Recording**
   ```bash
   curl -X POST http://localhost:8080/api/calls/record \
     -H "Content-Type: application/json" \
     -H "x-api-key: your_api_key" \
     -d '{
       "call_id": "test-123",
       "mc_number": "172379",
       "classification": "booked",
       "sentiment": "positive"
     }'
   ```

3. **Test Metrics Dashboard**
   ```bash
   curl http://localhost:8080/api/metrics \
     -H "x-api-key: your_api_key"
   ```


Thank you to the HappyRobot team!
