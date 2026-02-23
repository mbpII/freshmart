

---

## 1. Project Overview

The client wants a inventory management system for there grocery store. The system is to handle/track inventory and discounts of both food and non-food products, the will also need to be alerts handling states of low stock, tracking on current inventory sales rates relative to previous sales, suggest discounts on products approaching end of shelf life. Along with exetensibility for reportin reporting. 

## Note:
This document is a checkpoint for alignment, not a final deliverable. Feedback is welcome before I iterate further. Markdown is used for easy conversion to other formats.
---

## 2. Assumptions & Open Questions

### Assumptions
- Starting from scratch
- Assuming there will be one user (this is unlikely but can be extensible)
- This is just one store/location 

### Open Questions
1. **What system does the client currently have?** — Based on what they are currently using this could what needs to be built, if they have a current digital system I need only to integrate with it, then add the features they are missing, I could also have a better frame of reference of what the system should work like by having a demonstration.
2. **Who will be the main user of this system?** (stockers, managers, cashiers, associates, or some other role/position) — By knowing this it can help me better scope the user stories.

---

## 3. Epics

| Epic ID | Name | Description | Business Value |
|---------|------|-------------|----------------|
| EPIC-01 | Inventory Management | Add/remove and mark product as discounted | Allows accurate inventory tracking so the business always knows current stock levels and can make informed purchasing decisions |
| EPIC-02 | Inventory Monitoring and Alerting | Will alert the user based on the current stock of the product being low | This can allow the buisness to know when products are restock, meaning higher conversion of customers. |
| EPIC-03 | Analytics | Track the velocity of sale | Allows the business to know how to handle and order future stock based on current trends, better serving customer needs |
| EPIC-04 | Liquidation/Expiration Handling | Suggest recommendations to put items on sale based on proximity to their expiration date | Prevents the grocer from selling items that have gone bad and other similar disastrous outcomes |
| EPIC-05 | Reporting | Handling of the reporting infrastructure | Provides extensible foundation for future reporting capabilities |
---

## 4. User Stories by Epic

### Epic: EPIC-01 Inventory Management

| ID | Role | Story | So That | Acceptance Criteria | Priority |
|----|------|-------|---------|-------------------|----------|
| EPIC-01-01 | As a user | I want to add new products to the inventory | So that we can keep track of store inventory | - Can add food items with name, category, quantity, price, and expiration date<br>- Can add non-food items with name, category, quantity, and price (no expiration date required)<br>- System distinguishes between food and non-food product types | Must Have |
| EPIC-01-02 | As a user | I want to remove products from the inventory | So that discontinued or depleted items aren't in active inventory| - Product is archived rather than permanently deleted<br>-Removing a product with quantity > 0 triggers a confirmation prompt | Must Have |
| EPIC-01-03 | As a user | I want to update the quantity of an existing product | So that inventory counts stay accurate as stock is received or sold | - Quantity can be increased (stocked) or decreased (sold, damage, etc.)<br>- Quantity cannot go below zero| Must Have |
| EPIC-01-04 | As a user | I want to mark a product as on sale with a discount amount | So that reductions in price are applied and tracked without losing the original price | - Original price is preserved alongside the sale price<br>- Item can be a percentage or flat amount<br>- Item can be restored to the original price | Must Have |

### Epic: EPIC-02 Inventory Monitoring and Alerting

| ID | Role | Story | So That | Acceptance Criteria | Priority |
|----|------|-------|---------|-------------------|----------|
| EPIC-02-01 | As a user | I want to set a low-stock threshold when creating an item | So that I can define when I should be alerted before it runs out | - I can set a low-stock threshold during item creation<br>- The threshold must be a valid non-negative number<br>- The threshold is saved with the product | Should Have |
| EPIC-02-02 | As a user | I want to be alerted when stock falls below the threshold | So that I can restock before running out | - Alert is generated when quantity falls below threshold<br>- Alert includes product name, current quantity, and threshold value<br>- Alerts can be acknowledged once acted on | Must Have |

### Epic: EPIC-03 Analytics

| ID | Role | Story | So That | Acceptance Criteria | Priority |
|----|------|-------|---------|-------------------|----------|
| EPIC-03-01 | As a user | I want to see a product's sales velocity over the last 4 weeks | So that I can tell if it is selling faster or slower than before | - A chart displays weekly sales velocity for the past 4 weeks<br>- Velocity is shown as units sold per week<br>- Trend direction is visually clear (e.g., upward/downward slope) | Must Have |
| EPIC-03-02 | As a user | I want to see the delta between the most recent week and the previous week | So that I can quickly quantify whether sales are accelerating or declining | - Delta (percentage change) is displayed<br>- Change is visually indicated (up/down) | Should Have |
| EPIC-03-03 | As a user | I want to adjust the time period used to calculate sales velocity | So that I can analyze longer or shorter trends | - Time period is selectable (7, 30, 90 days)<br>- Chart updates when time period changes | Should Have |

### Epic: EPIC-04 Liquidation/Expiration Handling

| ID | Role | Story | So That | Acceptance Criteria | Priority |
|----|------|-------|---------|-------------------|----------|
| EPIC-04-01 | As a user | I want the system to handle food products approaching their expiration date | So that I can take action before products expire and become unsellable | - Products are flagged at a configurable number of days before expiration (default: 7 days)<br>- Flagged products appear to the user<br>- Already expired products are distinct from approaching expiration | Must Have |
| EPIC-04-02 | As a user | I want the system to suggest a discount for products nearing expiration | So that I can reduce waste and increase the chance of selling them before they expire | - Suggested discount is based on remaining shelf life<br>- Products closer to expiration receive a steeper suggested discount<br>- Suggested discount percentage is displayed to the user | Should Have |
---

## 5. Roadmap

### Increment 1 — Core Inventory Foundation

**What it delivers:**
A functional inventory management system with the ability to add, remove, and update products. This increment establishes the core data model and basic CRUD operations through a REST API, accessible via a simple HTML/JavaScript frontend. Products can be created as either food items (with expiration dates) or non-food items, and inventory quantities can be tracked and modified.

**Stories covered:**
- EPIC-01-01: Add new products to inventory
- EPIC-01-02: Remove/archive products from inventory  
- EPIC-01-03: Update product quantities

**Dependencies:**
- Java 17+ and Maven/Gradle build system
- Spring Boot 3.x with Spring Data JPA
- PostgreSQL database (or H2 for local development)
- Flyway for database schema versioning and migrations
- Basic HTML/CSS/JavaScript frontend

**Why it's first:**
This increment delivers the foundational capabilities that all other features depend on. Without the ability to create and manage products, we cannot track inventory levels, monitor stock, analyze sales velocity, or handle expiration dates. It provides immediate value by replacing any manual inventory tracking with a digital system and establishes the core data structures needed for subsequent increments.

**Technical Notes:**
- Database schema managed via Flyway migrations (V1, V2, etc.)
- REST API endpoints for full CRUD operations
- Simple table-based UI with vanilla JavaScript calling the API
- Product model supports both food and non-food types via inheritance/polymorphism

---

### Increment 2 — Operations & Alerts

**What it delivers:**
Enhanced inventory operations including discount management, low stock alerting, and expiration date tracking. Users can mark products on sale with configurable discounts, receive alerts when stock falls below defined thresholds, and view warnings for products approaching expiration.

**Stories covered:**
- EPIC-01-04: Mark products as on sale with discount amount
- EPIC-02-01: Set low-stock thresholds during item creation
- EPIC-02-02: Alert when stock falls below threshold
- EPIC-04-01: Handle products approaching expiration date

**Dependencies:**
- Increment 1 completed and deployed
- Flyway migration for alert system schema additions
- Frontend alert display components

**Why it's second:**
Building on the core inventory foundation, this increment adds operational intelligence that prevents stockouts and waste. Low stock alerts ensure the store never runs out of popular items, while expiration handling prevents selling expired goods. The discount functionality enables promotional pricing strategies. These features directly address the client's stated concerns about knowing when items are running low and handling products near expiration.

**Technical Notes:**
- Flyway migration V3 adds low_stock_threshold column
- Flyway migration V4 adds alert/notification tables
- Alert system queries database periodically or on quantity updates
- Expiration warnings calculated based on configurable days-before-expiration threshold
- Discount UI shows both original and sale prices

---

### Increment 3 — Analytics

**What it delivers:**
Sales velocity tracking and analytics capabilities that show how fast products are selling compared to previous periods. Includes visual charts displaying weekly sales velocity over time, week-over-week delta calculations, and configurable time period analysis. Smart discount recommendations are provided for products nearing expiration based on remaining shelf life.

**Stories covered:**
- EPIC-03-01: Display product sales velocity over last 4 weeks
- EPIC-03-02: Show delta between recent and previous week
- EPIC-03-03: Adjustable time period for velocity calculation
- EPIC-04-02: Suggest discounts for products nearing expiration

**Dependencies:**
- Increment 2 completed and deployed
- Historical sales data accumulated from quantity decrements
- Flyway migration for sales velocity tracking schema
- Charting library for frontend (Chart.js or vanilla canvas)

**Why it's third:**
Analytics requires historical sales data that only becomes meaningful after Increment 2 is operational for some time. This increment transforms raw inventory data into actionable business intelligence—showing which products are trending up or down, enabling data-driven purchasing decisions, and providing automated discount suggestions to minimize waste. It completes the client's requirements for understanding sales velocity and making smart liquidation decisions.

**Technical Notes:**
- Flyway migration V5 adds sales_transaction_history table
- REST endpoints for velocity calculations and chart data
- Frontend charts rendered with Chart.js or custom canvas implementation
- Discount suggestion algorithm based on days until expiration
- Time period selector (7, 30, 90 days) for trend analysis

---

## 6. Future Considerations

### Reporting Infrastructure

**Status:** Out of Scope for Current Roadmap

**Rationale:** While the system architecture will support future reporting enhancements (as noted in requirements), full reporting capabilities are not included in the initial deliverables. The current epics focus on operational inventory management. However, the database schema and API design should accommodate future reporting features without requiring significant refactoring.

**Future Value:** Once basic inventory operations are stable, reporting will enable the business to analyze long-term trends, identify seasonal patterns, and optimize overall store performance.

---

## 7. Wireframes

### Wireframe: Inventory Dashboard (Main List View)

**Description:**
The primary entry point for the inventory system. Displays a searchable, filterable table of all products with quick-glance information including current stock, sale status, and expiration warnings. McMaster-Carr inspired: dense data table with minimal chrome, clear headers, functional search/filter bar at top.

**Layout Structure:**
```
+--------------------------------------------------+
|  INVENTORY MANAGEMENT                    [+ Add] |
+--------------------------------------------------+
|  Search: [________________]  Filter: [All ▼]     |
+--------------------------------------------------+
|  Name          | Category | Qty | Price | Alert |
|----------------|----------|-----|-------|-------|
|  Milk 2%       | Dairy    |  45 | $3.99 |       |
|  Milk 2% [S]   | Dairy    |  12 | $2.99 |  LOW  |
|  Bread White   | Bakery   |   3 | $2.49 |  LOW  |
|  Eggs Dozen    | Dairy    |  28 | $4.99 |  EXP  |
|  Paper Towels  | Household| 67 | $5.99 |       |
|  ...           | ...      | ... | ...   | ...   |
+--------------------------------------------------+
|  Showing 5 of 47 products    [< Prev] [Next >] |
+--------------------------------------------------+
```

**Supports Stories:**
- EPIC-01-01: View all products in inventory
- EPIC-01-03: Quick access to update quantities
- EPIC-01-04: Visual indicator of sale items [S] badge
- EPIC-02-02: Alert column shows LOW/EXP warnings
- EPIC-04-01: Expiration warnings in Alert column

**Key Elements:**
- **Search bar**: Real-time filtering by product name
- **Category filter**: Dropdown to filter by product category
- **Data table**: Columns for Name, Category, Quantity, Price, Alert status
- **Alert indicators**: Visual badges (LOW, EXP) for items needing attention
- **Sale badge**: [S] indicator next to product name when on sale
- **Pagination**: Navigate through large product lists
- **Add button**: Primary action to create new product
- **Row click**: Opens Product Detail page

---

### Wireframe: Add/Edit Product Form

**Description:**
Modal or dedicated page for creating new products or editing existing ones. Clean form layout with conditional fields based on product type (food vs non-food). McMaster-Carr style: form fields aligned in a grid, clear labels, functional layout without decorative elements.

**Layout Structure:**
```
+--------------------------------------------------+
|  ADD NEW PRODUCT                         [X Close]|
+--------------------------------------------------+
|                                                  |
|  Product Type:  ( ) Food    ( ) Non-Food        |
|                                                  |
|  Product Name: [____________________________]   |
|                                                  |
|  Category:     [Dairy ▼______________________]   |
|                                                  |
|  SKU/Barcode:  [____________________________]    |
|                                                  |
|  Initial Qty:  [____________]  Unit: [each ▼]   |
|                                                  |
|  Regular Price: $[__________]                    |
|                                                  |
|  [Food items only]:                             |
|  Expiration Date: [____/____/________]         |
|                                                  |
|  Low Stock Threshold: [________]                 |
|  (Alert when quantity falls below this number)  |
|                                                  |
|  [ ] Mark as on sale now                        |
|  Sale Price: $[__________]   or  Discount: [__]%|
|                                                  |
|          [Cancel]           [Save Product]      |
|                                                  |
+--------------------------------------------------+
```

**Supports Stories:**
- EPIC-01-01: Add new products with type distinction
- EPIC-01-03: Edit product details and quantities
- EPIC-01-04: Configure sale pricing
- EPIC-02-01: Set low stock thresholds
- EPIC-04-01: Enter expiration dates for food items

**Key Elements:**
- **Product type toggle**: Radio buttons for Food/Non-Food selection
- **Conditional fields**: Expiration date only shows for Food type
- **SKU/Barcode field**: Optional unique identifier
- **Low stock threshold**: Number input with helpful text
- **Sale configuration**: Toggle to enable sale, with price or percentage options
- **Form validation**: Inline validation for required fields
- **Cancel/Save buttons**: Standard form actions

---

### Wireframe: Product Detail Page

**Description:**
Detailed view of a single product showing all information, current stock status, sales history graph, and active alerts. McMaster-Carr inspired: information-dense layout with data organized in clear sections, functional graphs without decorative elements.

**Layout Structure:**
```
+--------------------------------------------------+
|  < Back to Inventory                             |
+--------------------------------------------------+
|  Milk 2% - 1 Gallon                              |
|  SKU: DAIRY-001    Category: Dairy    Type: Food |
+--------------------------------------------------+
|                                                  |
|  CURRENT STOCK                                   |
|  +------------------------------------------+   |
|  |  In Stock: 45 units    Status: OK        |   |
|  |                                          |   |
|  |  [+ Stock In]  [- Stock Out]  [Update ▼] |   |
|  +------------------------------------------+   |
|                                                  |
|  PRICING                                         |
|  Regular: $3.99    Sale: $2.99 (25% off)       |
|  [Remove Sale]                                   |
|                                                  |
|  SHELF LIFE                                      |
|  Expires: 2026-03-15 (18 days remaining)         |
|  Status: OK                                      |
|                                                  |
|  ALERTS                                          |
|  [!] Stock is below threshold (45 < 50)          |
|  [Dismiss] [Update Threshold]                    |
|                                                  |
|  SALES VELOCITY (Last 4 Weeks)                  |
|  +------------------------------------------+   |
|  |         /\                               |   |
|  |        /  \      /\                     |   |
|  |       /    \    /  \   /\               |   |
|  |  ____/      \__/    \_/  \____          |   |
|  |  W1    W2    W3    W4                      |   |
|  |  12    18    15    22  units/week        |   |
|  |                                          |   |
|  |  Trend: +37%  [↑] vs previous week       |   |
|  +------------------------------------------+   |
|                                                  |
|  HISTORY                                         |
|  2026-02-20  Restocked +50 units                 |
|  2026-02-18  Price updated $3.49 → $3.99       |
|  2026-02-15  Sale activated (25% off)            |
|  ...                                             |
|                                                  |
+--------------------------------------------------+
|  [Archive Product]                    [Edit]    |
+--------------------------------------------------+
```

**Supports Stories:**
- EPIC-01-02: Archive product option
- EPIC-01-03: Quick stock in/out controls
- EPIC-01-04: View and manage sale status
- EPIC-02-02: Display and dismiss low stock alerts
- EPIC-03-01, 03-02: Sales velocity chart with trend indicator
- EPIC-04-01: Expiration status display

**Key Elements:**
- **Breadcrumb**: Navigation back to main list
- **Quick actions**: Stock in/out buttons with quantity inputs
- **Pricing section**: Shows current sale status with remove option
- **Shelf life indicator**: Days until expiration with visual status
- **Alert panel**: Active alerts with dismiss actions
- **Sales velocity chart**: Simple line/bar chart (vanilla JS or Chart.js)
- **Trend indicator**: Percentage change with up/down arrow
- **Activity history**: Chronological log of changes
- **Archive button**: Soft-delete functionality

---

### Wireframe: Alerts Panel

**Description:**
Centralized view of all system alerts requiring user attention. Organized by severity/urgency with clear action items. McMaster-Carr style: tabular data presentation with action buttons, minimal visual noise.

**Layout Structure:**
```
+--------------------------------------------------+
|  ALERTS & NOTIFICATIONS              [Dashboard] |
+--------------------------------------------------+
|                                                  |
|  ACTIVE ALERTS (4)                               |
|  [All] [Low Stock] [Expiring] [Dismissed]       |
|                                                  |
|  Priority | Product       | Type    | Action    |
|  ---------|---------------|---------|-----------|
|  HIGH     | Bread White   | LOW     | [Restock] |
|  HIGH     | Milk 2%       | LOW     | [Restock] |
|  MEDIUM   | Eggs Dozen    | EXP 3d  | [Discount]|
|  MEDIUM   | Yogurt Plain  | EXP 5d  | [Discount]|
|  ...      | ...           | ...     | ...       |
|                                                  |
+--------------------------------------------------+
|                                                  |
|  RECOMMENDED ACTIONS                             |
|  +------------------------------------------+   |
|  |  Eggs Dozen - Expires in 3 days           |   |
|  |  Suggested: 40% discount ($4.99 → $2.99)   |   |
|  |  [Apply Discount] [Dismiss] [View Product] |   |
|  +------------------------------------------+   |
|                                                  |
|  +------------------------------------------+   |
|  |  Yogurt Plain - Expires in 5 days         |   |
|  |  Suggested: 25% discount ($3.49 → $2.62) |   |
|  |  [Apply Discount] [Dismiss] [View Product] |   |
|  +------------------------------------------+   |
|                                                  |
+--------------------------------------------------+
```

**Supports Stories:**
- EPIC-02-02: View and acknowledge low stock alerts
- EPIC-04-01: View expiration warnings
- EPIC-04-02: Smart discount recommendations

**Key Elements:**
- **Tab filters**: Filter alerts by type (All/Low Stock/Expiring/Dismissed)
- **Priority column**: Visual indication of urgency (HIGH/MEDIUM/LOW)
- **Quick actions**: Context-aware buttons per alert type
  - Low Stock: [Restock] opens product edit with focus on quantity
  - Expiring: [Discount] suggests and applies recommended discount
- **Recommended actions section**: Expanded view of expiring items with suggested discount percentages
- **Dismiss functionality**: Mark alerts as handled/acknowledged
- **Product links**: Navigate to product detail from any alert

---

## Appendix

### MoSCoW Priority Definitions

- **Must Have** — Critical for launch; system cannot function without this
- **Should Have** — Important but not critical; can work around if missing
- **Nice to Have** — Desirable but not necessary; can be added later

### Glossary

| Term | Definition |
|------|------------|
| **Inventory** | The complete list of products currently in stock at the store |
| **Food Item** | A product that has an expiration date and requires shelf life tracking |
| **Non-Food Item** | A product without an expiration date (e.g., cleaning supplies, paper goods) |
| **Low Stock** | When a product's quantity falls below the minimum threshold set for reordering |
| **Sale Price** | A temporary reduced price applied to move inventory faster |
| **Archived Product** | A product removed from active inventory tracking but retained in historical records |
| **Velocity** | The rate at which a product sells over a specific time period |
| **Expiration Date** | The date by which a food product should be sold or removed from shelves |
| **Restock** | The process of adding inventory to an existing product's quantity |
| **SKU** | Stock Keeping Unit - a unique identifier for each product type |

---
