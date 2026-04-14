# AGENTS.md — FreshMart Portfolio

## Repo shape
- Monorepo root is infra only; app code is under `freshmart/api` (Spring Boot 3.2, Java 17, Maven) and `freshmart/web` (React 19 + TS, Vite 6, Tailwind 4).
- Root `docker-compose.yml` runs only `postgres` (`5432`), `api` (`8080`), and `adminer` (`8081`) — not the web app.

## Commands that matter
- Infra (repo root): `docker compose up -d` / `docker compose down`.
- API (`freshmart/api`): `mvn spring-boot:run`, `mvn clean compile`, `mvn clean package -DskipTests`.
- Web (`freshmart/web`): `npm run dev`, `npm run lint`, `npm run build` (`build` runs `tsc -b` first).
- There is no Maven wrapper; use system `mvn` (not `./mvnw`).

## Fast verification
- Web has no test script; validate with `npm run lint` and `npm run build`.
- API includes test deps but no `src/test` suite currently; use `mvn clean compile` as the sanity check.

## Backend constraints
- `spring.jpa.hibernate.ddl-auto=validate`; DB shape changes must go through Flyway SQL migrations in `freshmart/api/src/main/resources/db/migration`.
- Profiles in `application.yml`: default uses local Postgres, `docker` switches DB host to `postgres`, `prod` reads `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`.
- Auth is stubbed: `CurrentUserService` resolves hardcoded user `manager_downtown`.
- `POST /api/products` already performs both product creation and initial inventory creation (optional `storeId` + `initialQuantity` in request).
- `DELETE /api/products/{id}` is store-level soft archive (`inventory.is_active = false`), not global product deletion.
- Sale state is store-scoped (`inventory.sales_price_modifier` / `inventory.is_on_sale`), not a product-global flag.

## Frontend wiring
- Keep frontend API calls relative (`/api/...`); Vite proxy forwards `/api` to `http://localhost:8080`.
- Path alias `@` points to `freshmart/web/src`.
- Routes are explicitly declared in `freshmart/web/src/App.tsx` (no file-based routing).
- Manager/employee UI is a dev toggle (`DevModeProvider` + `useDevMode`) persisted in `localStorage` key `freshmart.dev.isManager`.
- Store assumptions are hardcoded in `freshmart/web/src/lib/constants.ts` (`DEFAULT_STORE_ID = 101`, `INVENTORY_PAGE_SIZE = 5`).
