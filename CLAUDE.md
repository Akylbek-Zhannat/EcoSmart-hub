# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EcoSmart Hub is a smart home energy monitoring platform (diploma MVP). It consists of two independent sub-projects:

- `ecosmart-frontend/` — React 19 + Vite SPA
- `ecosmart-backend/` — Spring Boot 3.2.5 REST API (Java 17)

## Commands

### Frontend (`ecosmart-frontend/`)

```bash
npm install          # install dependencies
npm run dev          # start Vite dev server at http://localhost:5173
npm run build        # production build
npm run lint         # ESLint
npm run preview      # preview production build
```

### Backend (`ecosmart-backend/`)

```bash
./mvnw spring-boot:run          # start on http://localhost:8080
./mvnw test                     # run tests
./mvnw package -DskipTests      # build JAR
```

The H2 web console is available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:ecosmartdb`).

## Architecture

### Frontend

`AuthContext.jsx` holds login state in `localStorage` under `ecosmart_user`. Authentication is entirely client-side for the MVP — `login()` accepts any credentials without calling the backend and generates a mock token locally. All protected routes use `<PrivateRoute>` which checks `user` from `useAuth()`.

`Layout.jsx` is the shared shell (sidebar + topbar) that every authenticated page renders inside. Pages pass a `title` prop to it.

Pages call the backend API directly with `fetch('/api/...')` — there is no shared API client or base-URL config, so the Vite dev server must proxy or the backend must be reachable at `http://localhost:8080`.

### Backend

Controllers talk directly to JPA repositories — there is no service layer. Most data (analytics, recommendations, reports, profile) is **hardcoded** in `OtherControllers.java`. Only `Device` records are persisted to the H2 in-memory database (schema is `create-drop`, so data resets on restart). `DashboardController` counts live active devices from the DB but all other dashboard numbers are hardcoded.

**No real security**: passwords are stored in plain text, tokens are `"mock-jwt-" + userId + "-" + timestamp`, and there is no Spring Security or JWT validation. The `Authorization` header from the frontend is not verified.

CORS is configured via `CorsConfig.java`, reading `ecosmart.cors.allowed-origins` from `application.properties`. Allowed origins: `http://localhost:5173` and `http://localhost:3000`.

### Switching to PostgreSQL

Comment out the H2 block in `application.properties` and uncomment the PostgreSQL block (connection details already present as comments). Change `spring.jpa.hibernate.ddl-auto` to `update` or use migrations.

## Key Data Notes

- Currency is Kazakhstani Tenge (`₸`); default tariff is `22.5 ₸/kWh`; default budget is `25 000 ₸/month`
- All energy figures in `OtherControllers.java` and `DashboardController.java` are static sample data
- The `Device` → `User` `@ManyToOne` relationship exists in the model but `DeviceController` returns all devices regardless of user (`findAll()`)
