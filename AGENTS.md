# AGENTS.md — FreshMart Portfolio

## Project Overview
Inventory management system for a grocery chain. Two services under `freshmart/`:
- **api/** — Spring Boot 3.2 (Java 17, Maven)
- **web/** — React 19 + TypeScript + Vite + Tailwind 4

PostgreSQL 16 runs via `docker-compose.yml` (also orchestrates api + adminer).

## Developer Commands

### Infrastructure
```bash
docker compose up -d          # starts postgres (port 5432), api (8080), adminer (8081)
docker compose down           # stop all
```

### API (`freshmart/api/`)
```bash
mvn spring-boot:run           # run dev server on :8080 (use mvn, not ./mvnw)
mvn clean compile             # build (MapStruct requires Maven)
mvn clean package             # build jar (skips tests)
mvn test                      # run tests
```
- Swagger UI at `http://localhost:8080/swagger-ui.html`
- Uses Flyway migrations in `src/main/resources/db/migration/`
- `hibernate.ddl-auto: validate` — schema must match migrations; do not rely on auto-DDL
- MapStruct annotation processor required — always build with Maven, not IDE-only compile

### Web (`freshmart/web/`)
```bash
npm run dev                   # Vite dev server
npm run build                 # tsc -b && vite build
npm run lint                  # eslint
npm run preview               # preview production build
```
- Routes: `/` (product list), `/products/:id` (detail), `/products/new` (create), `/products/:id/edit` (TODO stub)
- State: React Query (staleTime 30s, no refetch on focus)
- Forms: React Hook Form + Zod validation
- Tailwind 4 — no `tailwind.config.js`; config via CSS

## Architecture Notes
- API entrypoint: `com.freshmart` package under `src/main/java/com/`
- Web entrypoint: `src/main.tsx` → `src/App.tsx`
- No `test/` directory exists in the API — tests have not been written yet
- No CI/CD pipeline configured
- `knowledge-repo/` contains exercise docs and wireframes (reference only, not code)

### Backend Structure (EPIC-01)
```
com.freshmart/
├── controller/    # REST endpoints
├── service/       # Business logic (CurrentUserService stub for auth)
├── repository/    # JPA repositories
├── dto/           # Request/response records
├── mapper/        # MapStruct converters
├── event/         # Domain events (InventoryAdjustedEvent)
├── exception/     # Global exception handler
├── config/        # OpenAPI, CORS, Web config
└── model/         # JPA entities
```

### Key Design Decisions
- **Product Creation**: Two separate endpoints — `POST /api/products` (catalog) + `POST /api/stores/{storeId}/inventory` (store linkage)
- **Soft Delete**: `inventory.is_active=false` (per-store only, no global side effects)
- **Transaction Recording**: Automatic via `InventoryAdjustedEvent` + `@TransactionalEventListener`
- **Response Format**: Standard REST (HTTP status codes, direct resource bodies)
- **Store ID**: Derived from authenticated user (stub: `manager_downtown` with store 101)
- **DTO Structure**: Flat `ProductInventoryResponse` (serves frontend needs)

## Conventions
- API: Spring profiles `dev`, `docker`, `prod`. Default profile connects to `localhost:5432`
- Web: No test framework configured — do not assume Jest/Vitest exists

## Current Task Plan

### EPIC-01: Backend Implementation ✅ COMPLETE
- [x] **Start database** — `docker compose up -d` to spin up PostgreSQL
- [x] **Create Repositories** — JPA repositories for all entities
- [x] **Create Domain Events** — `InventoryAdjustedEvent` for transaction audit
- [x] **Create DTOs** — Request/response records for all endpoints
- [x] **Create Mappers** — MapStruct for entity/DTO conversion
- [x] **Create Services** — Product, Inventory, TransactionRecording, CurrentUser (stub)
- [x] **Create Controllers** — REST endpoints for products, inventory, stores
- [x] **Create Exception Handler** — Global @RestControllerAdvice
- [x] **Verify build** — `mvn clean compile -DskipTests` succeeds

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products` | Create product in catalog |
| GET | `/api/products` | List products for store (combined with inventory) |
| GET | `/api/products/{id}` | Get product details |
| PUT | `/api/products/{id}` | Update product |
| POST | `/api/products/{id}/sale` | Mark product on sale |
| DELETE | `/api/products/{id}/sale` | Remove sale |
| POST | `/api/stores/{storeId}/inventory` | Link product to store |
| GET | `/api/stores/{storeId}/inventory` | Get store inventory |
| DELETE | `/api/stores/{storeId}/inventory/{productId}` | Archive from store |
| POST | `/api/inventory/products` | Create product + inventory in one call |

### Next Steps
- [ ] Wire frontend to real API endpoints (replace mock data)
- [ ] Implement authentication (replace CurrentUserService stub)
- [ ] Add frontend routing for edit product page
- [ ] Write integration tests for API endpoints
