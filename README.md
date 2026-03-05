# Job Tracker — Full Stack Application

A full-stack application for managing and tracking job applications through every stage of the hiring process.

> **Live App:** [https://job-tracker-api-lemon.vercel.app/]
> **API Docs:** [https://job-tracker-api-ouah.onrender.com/swagger-ui/index.html](https://job-tracker-api-ouah.onrender.com/swagger-ui/index.html)

> Disclaimer: the API is hosted on Render's free tier — the first request after a period of inactivity may take 30 seconds to wake up.

---

## Overview

Job Tracker helps you manage the full cycle of a job search — from the first application to the final offer. Track statuses, add notes, attach job URLs, and monitor your pipeline at a glance through a real-time stats dashboard.

---

## Project Structure

This is a monorepo containing both the backend API and the frontend client:

```
job-tracker/
├── backend/                      → Spring Boot REST API
└── job-tracker-frontend/         → React frontend
```

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | Spring Boot 4 |
| Language | Java 21 |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Validation | Jakarta Bean Validation |
| Documentation | SpringDoc OpenAPI / Swagger UI |
| Testing | JUnit 5 / Mockito |
| Build Tool | Maven |
| Deployment | Render |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build Tool | Vite |
| HTTP Client | Fetch API |
| Styling | CSS Variables / Custom Design System |
| Deployment | Vercel |

---

## Architecture

```
┌─────────────────────────────────────┐
│           React Frontend            │
│         (Vercel — Global CDN)       │
└────────────────┬────────────────────┘
                 │ HTTP / REST
┌────────────────▼────────────────────┐
│         Spring Boot API             │
│  ┌──────────┐  ┌──────────────────┐ │
│  │Controller│→ │    Service       │ │
│  └──────────┘  └────────┬─────────┘ │
│                         │           │
│               ┌─────────▼─────────┐ │
│               │    Repository     │ │
│               │  (Spring Data JPA)│ │
│               └─────────┬─────────┘ │
│           (Render — US West)        │
└─────────────────┬───────────────────┘
                  │ JDBC
┌─────────────────▼───────────────────┐
│         PostgreSQL Database         │
│         (Render — US West)          │
└─────────────────────────────────────┘
```

The backend follows a clean **layered architecture** (Controller → Service → Repository) with a DTO pattern to decouple the API contract from the database schema.

### Backend Package Structure
```
src/main/java/com/rafael/ribeiro/job/tracker/
│
├── controller/        → HTTP layer — handles requests and responses
├── service/           → Business logic
├── repository/        → Data access layer (Spring Data JPA)
├── model/             → JPA entities
├── dto/               → Request and Response objects
├── exception/         → Custom exceptions and global error handler
└── config/            → OpenAPI / Swagger / CORS configuration
```

---

## Features

- Full CRUD for job applications
- Status tracking: `APPLIED → INTERVIEW → OFFER → REJECTED → WITHDRAWN`
- Real-time stats dashboard (counts per status)
- Search by company name or job title
- Filter by application status
- Input validation with meaningful error messages
- Global exception handling with clean JSON error responses
- Interactive API documentation via Swagger UI
- 11 unit tests with JUnit 5 and Mockito

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/applications` | Create a new job application |
| `GET` | `/api/applications` | Get all applications |
| `GET` | `/api/applications/{id}` | Get application by ID |
| `PUT` | `/api/applications/{id}` | Update an application |
| `DELETE` | `/api/applications/{id}` | Delete an application |
| `GET` | `/api/applications/stats` | Get counts grouped by status |

Full interactive documentation available at the [Swagger UI](https://job-tracker-api-ouah.onrender.com/swagger-ui/index.html).



## Running Locally

### Prerequisites
- Java 21
- PostgreSQL
- Node.js 18+
- Maven

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/ravalenr/job-tracker-api.git
cd job-tracker-api/backend
```

2. Create the database:
```bash
psql -U postgres -c "CREATE DATABASE jobtracker;"
```

3. Create `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/jobtracker
spring.datasource.username=postgres
spring.datasource.password=your_very_secret_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

4. Run the backend:
```bash
./mvnw spring-boot:run
```

5. Open Swagger UI at `http://localhost:8080/swagger-ui/index.html`

### Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Open the app at `http://localhost:5173`

---

## Tests

11 unit tests covering the full service layer — create, read, update, delete, and stats:

```bash
cd backend
./mvnw test
```

```
[INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## Application Status Flow

```
APPLIED → INTERVIEW → OFFER
                    ↘ REJECTED
        ↘ WITHDRAWN
```

---

## Roadmap

Planned features for future development:

- **Authentication & Data Isolation** — JWT-based login and registration 
  with Spring Security. Each user will only see their own applications — 
  currently all data is shared across sessions with no user context.
- **Social Login** — OAuth2 integration (Google, GitHub, LinkedIn)
- **Email Notifications** — Automated reminders for follow-ups and 
  interview prep using Spring Mail
- **AI Application Tracking** — Intelligent insights powered by an LLM 
  API: auto-suggest status updates, flag stale applications, and generate 
  personalised follow-up emails based on application history
---

## Security Notes

- Database credentials are never hardcoded — all configuration 
  is handled through environment variables (`DATABASE_URL`, 
  `DATABASE_USERNAME`, `DATABASE_PASSWORD`) injected at runtime by the 
  deployment platform
- `application.properties` uses `${VARIABLE_NAME}` syntax so the app 
  works in any environment (local, staging, production) without code changes
- CORS is configured to only allow requests from the deployed frontend

---

## Author

**Rafael Ribeiro**
- GitHub: [@ravalenr](https://github.com/ravalenr)
- LinkedIn: [raphahribs](https://linkedin.com/in/raphahribs)
