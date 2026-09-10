# AURA Studio — Responsive E-Commerce Platform

> An intentional, design-forward shopping experience for acoustic hardware, minimalist desk objects, and tactile lifestyle artifacts.

![AURA Studio Preview](https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80)

---

## 🌟 Overview

**AURA Studio** was built from the ground up as a complete, production-grade e-commerce application. It transcends static landing pages to deliver an immersive end-to-end shopping journey: from multi-factor live catalog exploration and detailed variant configuration to interactive cart management, validated multi-step checkout, real-time simulated payment processing, and comprehensive order tracking.

---

## ✨ Key Features

### 1. Catalog & Discovery (`/shop`)
- **Real-Time Live Search**: Instant debounced search with global keyboard shortcut (`/`) and query highlighting.
- **Multi-Factor Filtering**:
  - Filter by category (*Audio, Workspace, Wearables, Lifestyle, Optics*).
  - Dynamic dual price slider with live currency formatting.
  - In-stock only filter toggle.
  - Customer review threshold filter (4★+ & 4.5★+).
  - One-click **Reset Filters** button.
- **Sorting Modes**: Featured Picks, Price (Low to High), Price (High to Low), Highest Rated, and Newest Releases.
- **View Modes**: Responsive toggle between visual **Grid View** and detailed **List View**.
- **Dual Navigation**: Switch effortlessly between **Numbered Pagination** and **Infinite / Load More** scroll.
- **Quick View Modal**: Inspect finishes, sizes, specs, and add items directly to your bag without navigating away from the catalog.

### 2. Product Details (`/product/:id`)
- **Interactive Gallery**: Main image with cursor-following hover zoom magnifier, thumbnail rail, and fullscreen lightbox with keyboard and arrow navigation.
- **Finishes & Variant Selector**: Visual color swatches with active ring feedback, configuration/size pills, and dynamic price adjustments.
- **Inventory Feedback**: Dynamic live stock status indicator (e.g., *"Only 5 left in stock!"*).
- **Quantity Selector**: Increment/decrement controls with stock ceiling validation.
- **Dual Purchase Actions**: Standard *"Add to Bag"* with animated confirmation or 1-click *"Instant Buy"* express checkout.
- **Customer Ratings & Reviews**:
  - Comprehensive star distribution percentage bars (5★ to 1★).
  - Filter reviews by star rating.
  - Interactive **Write a Review** modal with star picker and instant optimistic submission.
  - "Helpful" thumbs-up toggle with optimistic count increments.
- **Related Recommendations & Recently Viewed Rail**: Context-aware product carousels based on category and browsing history.

### 3. Shopping Cart & Drawer
- **Persistent Slide-Over Mini-Cart**: Accessible globally from the navbar across every page.
- **Dedicated Cart Page (`/cart`)**: Detailed tabular item review, quantity adjustments, and remove actions.
- **Free Shipping Milestone Bar**: Dynamic progress calculation encouraging higher basket values (unlocked at \$150+).
- **Promo Code Engine**:
  - `WELCOME10` — 10% off for new creators
  - `AURA20` — 20% off summer studio refresh
  - `FREESHIP` — Waives express freight shipping
  - Invalid code feedback and instant deduction breakdown.
- **State Persistence**: Backed by `localStorage` via Zustand middleware, ensuring carts survive page reloads and browser restarts.

### 4. Streamlined 3-Step Checkout (`/checkout`)
- **Step 1: Recipient & Shipping Address**: Form with real-time validation and clear inline error feedback.
- **Step 2: Delivery Speed Selection**: Choose between Standard Freight (Free on \$150+) and Priority Air Express.
- **Step 3: Payment Methods**:
  - **Credit / Debit Card**: Includes an interactive virtual card preview that renders cardholder name, masked card number, and expiry date live as you type.
  - **UPI / Instant QR**: Simulated scan-to-pay interface.
  - **Cash on Delivery**: Option for doorstep collection.
- **Simulated Clearinghouse Flow**: Multi-stage authorization spinner (*TLS handshake → Account verification → Fulfillment allocation → Waybill generation*).

### 5. Order Confirmation & Tracking (`/order-confirmation/:orderId`)
- Celebratory confetti feedback upon successful checkout.
- Auto-generated unique order reference number (e.g. `AUR-98214`) and carrier tracking code.
- Interactive **Live Order Status Timeline** (*Order Placed → Studio Fulfillment → Dispatched in Transit → Delivered*) with status simulation switcher.
- Printable / downloadable invoice receipt.

### 6. Order History (`/orders`)
- Browse all past studio orders with date, amount, and recipient tags.
- Search orders by order ID or product title.
- One-click **Reorder All** action that loads past items directly back into the cart.

### 7. Wishlist & Comparison
- **Wishlist (`/wishlist`)**: Save items for future review, with a 1-click *"Move All to Bag"* action.
- **Side-by-Side Product Comparison**: Compare up to 4 products in a floating matrix comparing specs, availability, ratings, and pricing.

### 8. Theming & Accessibility
- **Dark & Light Mode**: Smooth transition with persistent theme preference.
- **Fully Responsive**: Bespoke ergonomics tailored for mobile (375px), tablet (768px), and ultra-wide desktop monitors (1440px+).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **State Management**: Zustand with persistent storage
- **Animations**: Framer Motion, Canvas Confetti
- **Routing**: React Router DOM v6
- **Architecture**: Modular component architecture, Separation of Concerns (Stores, Services, Components, Pages)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/guhan-art/E-Commerce.git
   cd E-Commerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 👤 Author

**Guhan Raj**  
- Portfolio: [GitHub](https://github.com/guhan-art)
