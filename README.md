# Invoicely — Professional Invoice Generator

A full-stack invoice management platform built for speed, accuracy, and professional presentation. Create, customize, preview, and send invoices with a real-time editor — backed by a secure Java microservices API.

---

## Table of Contents

1. [About the App](#about-the-app)
2. [Architecture Overview](#architecture-overview)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Getting Started](#getting-started)
   - [Docker (Recommended)](#docker-recommended)
   - [Without Docker — Linux](#without-docker--linux)
   - [Without Docker — Windows](#without-docker--windows)
6. [Environment Variables](#environment-variables)
7. [Available Scripts](#available-scripts)
8. [Project Structure](#project-structure)
9. [Contributing](#contributing)

---

## About the App

Invoicely is a SaaS-style invoice generator with the following capabilities:

- **Invoice Editor** — real-time side-by-side editor and PDF-preview with template selection, line items, tax/discount, signatures, and paper-size controls.
- **Draft Management** — save and resume incomplete invoices at any time.
- **Send Invoice** — share invoices directly from the app via configurable delivery options.
- **Dashboard** — overview of all issued invoices with status tracking.
- **Settings** — manage profile, password, invoice number prefixes, and default invoice preferences.
- **Authentication** — JWT-based login/register with email verification, forgot-password, and token-refresh handled transparently by the Next.js middleware proxy.

---

## Architecture Overview

```
Browser
  └── Next.js 16 (app router, standalone build)
        ├── Middleware proxy — JWT refresh / route protection
        ├── Server Actions — calls Java APIs over the internal Docker network
        │     ├── auth-service   :8081  (Spring Boot 3, JWT, email verification)
        │     └── invoice-service :8080  (Spring Boot 3, Hexagonal DDD)
        └── Postgres
              ├── invoicely      :5432  (invoice data)
              └── invoicely_auth :5433  (user/auth data)
```

Services communicate only over an internal Docker bridge network. Only the Next.js frontend is exposed to the host.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 |
| Auth service | Java 21, Spring Boot 3.4, Spring Security, JWT, Flyway |
| Invoice service | Java 21, Spring Boot 3.4, JPA/Hibernate, Flyway |
| Database | PostgreSQL 16 |
| Email (dev) | Mailhog |
| Containerisation | Docker, Docker Compose v2 |
| Build tools | npm, Maven 3.9 |

---

## Prerequisites

### Docker (all platforms)

| Tool | Minimum version |
|------|----------------|
| Docker Engine / Docker Desktop | 24+ |
| Docker Compose | v2 (bundled with Docker Desktop) |

### Without Docker

| Tool | Minimum version | Notes |
|------|----------------|-------|
| Node.js | 22 | LTS recommended |
| npm | 10 | Bundled with Node.js 22 |
| Java | 21 | Eclipse Temurin or OpenJDK |
| Maven | 3.9 | |
| PostgreSQL | 16 | Two databases required |
| MailHog (optional) | latest | For local email testing |

---

## Getting Started

### Docker (Recommended)

This is the fastest path and mirrors the production topology exactly.

**1. Clone the repository**

```bash
git clone <repo-url> invoicely
cd invoicely
```

**2. Create Docker secrets**

```bash
mkdir -p secrets
echo "invoicely"  > secrets/db_user.txt
echo "changeme"   > secrets/db_password.txt
```

> Change `changeme` to a strong password for any environment beyond local development.

**3. Start the full stack (development mode)**

```bash
docker compose up --build
```

The `docker-compose.override.yml` is loaded automatically and enables:
- Hot-reload for the Next.js frontend
- Debug ports for both Java services (5005, 5006)
- MailHog UI on `http://localhost:8025`

**4. Open the app**

| Service | URL |
|---------|-----|
| App (Next.js) | http://localhost:3000 |
| Invoice service API | http://localhost:8080 |
| Auth service API | http://localhost:8081 |
| MailHog (email) | http://localhost:8025 |
| PostgreSQL (invoice) | localhost:5432 |
| PostgreSQL (auth) | localhost:5433 |

**5. Stop the stack**

```bash
docker compose down
```

To remove volumes (wipes all database data):

```bash
docker compose down -v
```

---

### Without Docker — Linux

**1. Install system dependencies**

Install Node.js 22 via [nvm](https://github.com/nvm-sh/nvm):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
```

Install Java 21 (Eclipse Temurin):

```bash
sudo apt-get install -y wget apt-transport-https gpg
wget -qO - https://packages.adoptium.net/artifactory/api/gpg/key/public | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/adoptium.gpg > /dev/null
echo "deb https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | sudo tee /etc/apt/sources.list.d/adoptium.list
sudo apt-get update && sudo apt-get install -y temurin-21-jdk
```

Install Maven 3.9:

```bash
sudo apt-get install -y maven
```

Install PostgreSQL 16:

```bash
sudo apt-get install -y postgresql-16
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Install MailHog (optional — for email testing):

```bash
wget https://github.com/mailhog/MailHog/releases/download/v1.0.1/MailHog_linux_amd64 -O /usr/local/bin/mailhog
chmod +x /usr/local/bin/mailhog
mailhog &
```

**2. Create databases**

```bash
sudo -u postgres psql -c "CREATE USER invoicely WITH PASSWORD 'changeme';"
sudo -u postgres psql -c "CREATE DATABASE invoicely        OWNER invoicely;"
sudo -u postgres psql -c "CREATE DATABASE invoicely_auth   OWNER invoicely;"
```

**3. Set environment variables**

Create `.env.local` in the project root for Next.js:

```bash
INVOICE_API_URL=http://localhost:8080
AUTH_API_URL=http://localhost:8081
```

**4. Install and run Next.js**

```bash
npm ci
npm run dev
```

**5. Run the auth service**

```bash
cd auth-service
SPRING_PROFILES_ACTIVE=dev \
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/invoicely_auth \
SPRING_DATASOURCE_USERNAME=invoicely \
SPRING_DATASOURCE_PASSWORD=changeme \
MAIL_HOST=localhost \
MAIL_PORT=1025 \
APP_FRONTEND_URL=http://localhost:3000 \
mvn spring-boot:run
```

**6. Run the invoice service**

```bash
cd invoice-service
SPRING_PROFILES_ACTIVE=dev \
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/invoicely \
SPRING_DATASOURCE_USERNAME=invoicely \
SPRING_DATASOURCE_PASSWORD=changeme \
mvn spring-boot:run
```

---

### Without Docker — Windows

**1. Install system dependencies**

- **Node.js 22** — download from [nodejs.org](https://nodejs.org) or via [nvm-windows](https://github.com/coreybutler/nvm-windows)
- **Java 21** — download Eclipse Temurin 21 from [adoptium.net](https://adoptium.net) and run the installer; ensure `JAVA_HOME` is set in System Environment Variables
- **Maven 3.9** — download from [maven.apache.org](https://maven.apache.org/download.cgi), extract, and add `bin/` to `PATH`
- **PostgreSQL 16** — download the installer from [postgresql.org](https://www.postgresql.org/download/windows/) and follow the setup wizard

**2. Create databases**

Open pgAdmin or `psql` (installed with PostgreSQL):

```sql
CREATE USER invoicely WITH PASSWORD 'changeme';
CREATE DATABASE invoicely       OWNER invoicely;
CREATE DATABASE invoicely_auth  OWNER invoicely;
```

**3. Set environment variables**

Create `.env.local` in the project root:

```
INVOICE_API_URL=http://localhost:8080
AUTH_API_URL=http://localhost:8081
```

**4. Install and run Next.js**

Open a terminal (PowerShell or Git Bash):

```powershell
npm ci
npm run dev
```

**5. Run the auth service**

Open a new terminal in `auth-service/`:

```powershell
$env:SPRING_PROFILES_ACTIVE    = "dev"
$env:SPRING_DATASOURCE_URL     = "jdbc:postgresql://localhost:5432/invoicely_auth"
$env:SPRING_DATASOURCE_USERNAME = "invoicely"
$env:SPRING_DATASOURCE_PASSWORD = "changeme"
$env:MAIL_HOST                 = "localhost"
$env:MAIL_PORT                 = "1025"
$env:APP_FRONTEND_URL          = "http://localhost:3000"
mvn spring-boot:run
```

**6. Run the invoice service**

Open a new terminal in `invoice-service/`:

```powershell
$env:SPRING_PROFILES_ACTIVE    = "dev"
$env:SPRING_DATASOURCE_URL     = "jdbc:postgresql://localhost:5432/invoicely"
$env:SPRING_DATASOURCE_USERNAME = "invoicely"
$env:SPRING_DATASOURCE_PASSWORD = "changeme"
mvn spring-boot:run
```

---

## Environment Variables

### Next.js (`/.env.local`)

| Variable | Default (Docker) | Description |
|----------|-----------------|-------------|
| `INVOICE_API_URL` | `http://invoice-service:8080` | Internal URL of the invoice service |
| `AUTH_API_URL` | `http://auth-service:8081` | Internal URL of the auth service |

### Auth service

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod` | Set to `dev` to enable debug logging and MailHog |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/invoicely_auth` | JDBC connection string |
| `SPRING_DATASOURCE_USERNAME` | `invoicely` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | `changeme` | Database password |
| `JWT_SECRET` | *(base64 dev key)* | HS256 signing secret — **must be changed in production** |
| `JWT_ACCESS_TOKEN_EXPIRY_SECONDS` | `900` | Access token lifetime (15 min) |
| `MAIL_HOST` | `localhost` | SMTP host |
| `MAIL_PORT` | `1025` | SMTP port |
| `MAIL_USERNAME` | *(empty)* | SMTP username (production only) |
| `MAIL_PASSWORD` | *(empty)* | SMTP password (production only) |
| `MAIL_SMTP_AUTH` | `false` | Enable SMTP authentication |
| `MAIL_SMTP_STARTTLS` | `false` | Enable STARTTLS |
| `APP_MAIL_FROM` | `noreply@invoicely.com` | From address on outbound emails |
| `APP_FRONTEND_URL` | `http://localhost:3000` | Used in email verification links |

### Invoice service

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | `prod` | Set to `dev` to enable debug logging |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/invoicely` | JDBC connection string |
| `SPRING_DATASOURCE_USERNAME` | `invoicely` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | `changeme` | Database password |

> **Production note:** Database credentials are injected via Docker Secrets (files under `secrets/`) in the Compose setup. Never commit secrets to version control.

---

## Available Scripts

### Next.js (project root)

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Starts Next.js with Turbopack on port 3000 |
| Production build | `npm run build` | Creates an optimised standalone build |
| Production server | `npm run start` | Serves the production build |
| Lint | `npm run lint` | Runs ESLint across the codebase |

### Java services (`auth-service/` or `invoice-service/`)

| Script | Command | Description |
|--------|---------|-------------|
| Run in dev mode | `mvn spring-boot:run` | Starts the service with Spring DevTools |
| Run tests | `mvn test` | Runs all unit and integration tests |
| Package (skip tests) | `mvn package -DskipTests` | Produces the runnable JAR |

---

## Project Structure

```
.
├── app/                        # Next.js App Router pages and server actions
│   ├── (auth)/                 # Auth group: login, register, reset, verify
│   ├── dashboard/              # Dashboard page
│   ├── invoice/                # Invoice creation and draft editing
│   ├── invoices/               # Invoice list and draft list
│   └── settings/               # User profile and invoice preferences
├── components/
│   ├── auth/                   # Auth form components
│   ├── invoice/                # Invoice editor, preview, and send sheet
│   ├── invoices/               # Invoice and draft list components
│   ├── landing/                # Marketing landing page sections
│   ├── layout/                 # Top nav, footer, navigation
│   ├── settings/               # Settings section components
│   └── ui/                     # Design-system primitives (Button, Input, Card…)
├── lib/
│   ├── auth/                   # Auth server actions, API client, session utils
│   └── design-system/          # Design tokens and DesignSystem utility class
├── auth-service/               # Spring Boot JWT auth microservice (port 8081)
├── invoice-service/            # Spring Boot invoice microservice (port 8080)
├── secrets/                    # Docker secrets (git-ignored — create manually)
├── docker-compose.yml          # Production Compose topology
├── docker-compose.override.yml # Dev overrides (hot-reload, debug ports, MailHog)
├── Dockerfile                  # Multi-stage Next.js image
└── proxy.ts                    # Next.js middleware — JWT refresh + route protection
```

Both Java services follow **Hexagonal Architecture** with DDD tactical patterns. The domain layer is pure Java 21 with no framework annotations.

---

## Contributing

**Branch conventions**

| Prefix | Use |
|--------|-----|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `chore/` | Tooling, dependency updates, config |
| `refactor/` | Code restructuring with no behaviour change |

**Before opening a PR**

1. Run `npm run lint` — zero ESLint errors required.
2. Run `mvn test` in both `auth-service/` and `invoice-service/` — all tests must pass.
3. Keep files under 350 lines (TypeScript) / 200 lines (Java). Split proactively.
4. No `any`, `unknown` (except at API boundaries), magic numbers, or hardcoded hex/px values.
5. All form fields must use `<Input />` or `<Textarea />` from `@/components/ui`. Raw `<input>` elements in feature components are violations.
6. Do not commit `console.log`, `TODO`, or `FIXME` comments.

Pull requests that do not satisfy the above will be closed without merge.
