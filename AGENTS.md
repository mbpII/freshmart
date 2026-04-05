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
./mvnw spring-boot:run        # run dev server on :8080
./mvnw clean package          # build jar (skips tests)
./mvnw test                   # run tests
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

## Conventions
- API: Spring profiles `dev`, `docker`, `prod`. Default profile connects to `localhost:5432`
- Web: No test framework configured — do not assume Jest/Vitest exists
