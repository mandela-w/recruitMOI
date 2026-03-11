# Recruitment Application System - Backend

A production-ready Spring Boot REST API for the Recruitment Application System.

## Tech Stack

- **Java 21** with Spring Boot 3.2
- **PostgreSQL** — primary database
- **Spring Security** — authentication & authorization
- **JWT** — stateless auth (access token: 15min, refresh token: 7 days)
- **BCrypt** — password hashing
- **OpenAPI/Swagger** — auto-generated API docs

---

## Architecture

```
src/main/java/com/recruitment/
├── config/               # Spring configs (Security, JPA, OpenAPI, DataInitializer)
├── controller/           # REST controllers (Auth, Applicant, HR, Admin, Dashboard, Simulation)
├── dto/
│   ├── request/          # Incoming request DTOs with validation
│   └── response/         # Outgoing response DTOs
├── entity/               # JPA entities (User, Application, RefreshToken)
├── enums/                # Shared enums (Role, ApplicationStatus, Gender)
├── exception/            # Custom exceptions + GlobalExceptionHandler
├── repository/           # Spring Data JPA repositories
├── security/             # JWT service, UserDetailsService, JwtAuthFilter
├── service/              # Service interfaces
│   └── impl/             # Service implementations
├── simulation/           # NID & NESA API simulators
└── util/                 # FileStorageService, SecurityUtils
```

---

## Roles & Access

| Role         | Access                                                    |
|--------------|-----------------------------------------------------------|
| `APPLICANT`  | Register, Login, Submit application, View own status      |
| `HR`         | View top-10 applicants, View details, Review/Approve/Reject|
| `SUPER_ADMIN`| Everything HR does + full user management + dashboard     |

---

## API Endpoints

### Authentication — `/api/v1/auth`
| Method | Path              | Description                   |
|--------|-------------------|-------------------------------|
| POST   | `/register`       | Register applicant account    |
| POST   | `/login`          | Login (returns JWT tokens)    |
| POST   | `/refresh-token`  | Refresh access token          |
| POST   | `/logout`         | Revoke refresh token          |

### Applicant — `/api/v1/applicant` *(APPLICANT role)*
| Method | Path           | Description                        |
|--------|----------------|------------------------------------|
| POST   | `/application` | Submit application + CV file upload |
| GET    | `/application` | View my application + status       |

### HR — `/api/v1/hr` *(HR + SUPER_ADMIN roles)*
| Method | Path                              | Description                     |
|--------|-----------------------------------|---------------------------------|
| GET    | `/applications`                   | Latest 10 apps, alphabetically  |
| GET    | `/applications/all`               | All applications                |
| GET    | `/applications/{id}`              | Full applicant details          |
| PATCH  | `/applications/{id}/review`       | Review / Approve / Reject       |

### Admin — `/api/v1/admin` *(SUPER_ADMIN only)*
| Method | Path           | Description              |
|--------|----------------|--------------------------|
| POST   | `/users`       | Create HR/Admin user     |
| GET    | `/users`       | List all users           |
| GET    | `/users/{id}`  | Get user by ID           |
| PATCH  | `/users/{id}`  | Update user / toggle active |
| DELETE | `/users/{id}`  | Delete user              |

### Dashboard — `/api/v1/dashboard` *(HR + SUPER_ADMIN)*
| Method | Path     | Description              |
|--------|----------|--------------------------|
| GET    | `/stats` | Full statistical overview |

### Simulation — `/api/v1/simulation` *(public)*
| Method | Path            | Description                      |
|--------|-----------------|----------------------------------|
| GET    | `/nid/{id}`     | Lookup NID (personal info)       |
| GET    | `/nesa/{id}`    | Lookup NESA (academic records)   |

---

## Quick Start

### Local (with Docker)
```bash
docker-compose up -d
```
App runs at: http://localhost:8080
Swagger UI: http://localhost:8080/swagger-ui.html

### Default Super Admin Credentials
```
Email:    admin@recruitment.rw
Password: Admin@12345
```
⚠️ Change this immediately after first login via the admin panel.

### Test NID Numbers (for simulation)
```
1199880012345678  — Jean Claude Uwimana
1200190098765432  — Marie Mukamana
1199750056781234  — Patrick Habimana
1200290034561890  — Amina Ingabire
1199960078903456  — Eric Niyonzima
```

---

## JWT Token Details

| Token         | Duration   | Notes                          |
|---------------|------------|--------------------------------|
| Access Token  | 15 minutes | Sent in Authorization header   |
| Refresh Token | 7 days     | UUID stored in DB, single-use  |

---

## Environment Variables

| Variable         | Default                  | Description          |
|------------------|--------------------------|----------------------|
| `DB_USERNAME`    | `postgres`               | DB username          |
| `DB_PASSWORD`    | `postgres`               | DB password          |
| `JWT_SECRET`     | (dev default)            | Base64 secret key    |
| `FILE_UPLOAD_DIR`| `uploads/cvs`            | CV storage path      |

