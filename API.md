# CHROMALUX Studio — Full-Stack REST API & Telemetry Guide

The **CHROMALUX E-Commerce Platform** is architected as an industry-standard **Full Stack Web Development (FSWD)** application.

It features a dual-execution model:
1. **Node.js / Express REST API (`/server`)**: A standalone TypeScript microservice providing complete CRUD endpoints, JWT authentication, query filtering, pagination, and persistent order tracking.
2. **In-Browser FSWD API Adapter & Telemetry Inspector**: An interactive real-time network inspector and endpoint runner embedded directly into the live client application. Evaluators and hiring managers can execute API calls and inspect HTTP request/response payloads live directly on GitHub Pages without requiring a local database setup.

---

## 📡 REST API Specification

### Base URL
- **Local Dev Server**: `http://localhost:5000/api`
- **Client Fallback / Live Explorer**: `Embedded REST Engine with Real-Time Telemetry`

---

### 1. Product Catalog Endpoints

#### `GET /api/products`
Retrieves products with multi-attribute filtering, search, sorting, and pagination.

**Query Parameters:**
- `category` *(optional)*: Filter by category (e.g. `Audio`, `Workspace`, `Wearables`, `Optics`, `Lifestyle`).
- `search` *(optional)*: Text search across product titles, descriptions, and tags.
- `minPrice` *(optional)*: Minimum price boundary.
- `maxPrice` *(optional)*: Maximum price boundary.
- `inStock` *(optional, boolean)*: Only return products in stock.
- `minRating` *(optional, number)*: Minimum rating score (e.g. `4.0`, `4.5`).
- `sort` *(optional)*: Sorting order (`featured`, `price-low`, `price-high`, `rating`, `newest`).
- `page` *(optional, default: 1)*: Page number.
- `limit` *(optional, default: 12)*: Number of items per page.

**Response Example (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-1",
      "slug": "chroma-anc-studio-headphones",
      "name": "Chroma ANC Studio Headphones",
      "price": 389,
      "category": "Audio",
      "rating": 4.9,
      "reviewCount": 128,
      "inStock": true,
      "stockCount": 8
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 6,
    "totalPages": 1
  }
}
```

#### `GET /api/products/:id`
Fetch single product details including variant configurations, technical specifications, and user reviews.

#### `GET /api/products/:id/related`
Fetch up to `N` recommended complementary items matching category or price profile.

---

### 2. Orders & Checkout Endpoints

#### `POST /api/orders`
Creates and registers a new customer order. Validates inventory levels, generates a verifiable order number (`CRX-XXXXX`) and courier tracking code (`TRK-FEDEX-XXXXX`).

**Request Body:**
```json
{
  "items": [
    {
      "id": "item-1",
      "productId": "prod-1",
      "name": "Chroma ANC Studio Headphones",
      "price": 389,
      "quantity": 1,
      "image": "https://..."
    }
  ],
  "customer": {
    "fullName": "Alex Mercer",
    "email": "alex@chromalux.design",
    "phone": "+1 (555) 438-9921"
  },
  "shippingAddress": {
    "street": "742 Evergreen Terrace",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94107",
    "country": "United States"
  },
  "subtotal": 389,
  "discount": 38.90,
  "shipping": 0,
  "tax": 28.00,
  "total": 378.10,
  "paymentMethod": "card"
}
```

**Response Example (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "CRX-98214",
    "status": "processing",
    "trackingNumber": "TRK-FEDEX-88319",
    "estimatedDelivery": "2026-11-20T10:00:00.000Z",
    "createdAt": "2026-11-15T11:45:00.000Z"
  }
}
```

#### `GET /api/orders`
Retrieves customer order history.

#### `GET /api/orders/:id`
Fetch status, courier events, and shipment timeline for an individual order.

---

### 3. Promotional Codes & Discounts

#### `POST /api/coupons/validate`
Validates coupon codes against promotional business rules.

**Supported Coupons:**
- `WELCOME10`: 10% off any order.
- `CHROMA20`: 20% off orders over $200.
- `FREESHIP`: 100% discount on expedited courier shipping.

---

### 4. Telemetry & Health

#### `GET /api/health`
Returns system uptime, environment, active database connection status, and memory metrics.

---

## 🛠️ Running the Full-Stack Locally

### 1. Run Client + Backend Concurrently:
```bash
npm run dev
# Starts Vite client on http://localhost:5173
```

### 2. Run Dedicated Express API Server:
```bash
npm run dev:server
# Starts Express API server on http://localhost:5000 with hot reloading
```

### 3. Build Production Bundles:
```bash
npm run build         # Builds frontend bundle into /dist
npm run build:server  # Compiles TypeScript server into /server/dist
```
