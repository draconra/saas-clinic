# ClinicSaaS - Health Clinic Management System

> A modern, comprehensive SaaS platform for small health clinics built with Next.js 15, TypeScript, and Prisma.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Product Vision](#-product-vision)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## Overview

ClinicSaaS is a cloud-based practice management system designed specifically for small to medium-sized healthcare clinics. It streamlines clinic operations by digitizing patient records, appointment scheduling, billing, and electronic health records (EHR) in a single, intuitive interface.

### 🎯 Key Benefits

- **⏱️ Save Time** - Reduce administrative tasks by 50%
- **💰 Increase Revenue** - Reduce no-shows, improve billing accuracy
- **🔒 Stay Secure** - HIPAA-compliant security standards
- **📱 Anywhere Access** - Works on any device, anywhere
- **🌍 Global Ready** - Multi-language support (English, Indonesian)

---

## 🏥 Features

### ✅ Core Features Implemented

#### 🔐 Authentication & Security
- NextAuth.js integration with credentials provider
- Secure password hashing (bcrypt, cost factor 12+)
- Role-based access control (Admin, Doctor, Nurse, Staff)
- Rate limiting on authentication endpoints (5 requests / 15 min)
- Structured logging with correlation IDs
- Input validation with Zod schemas
- Session management and protected routes

#### 📊 Dashboard & Analytics
- Real-time statistics with animated counters
- Today's appointments overview
- Patient demographics breakdown
- Revenue metrics and trends
- Quick action buttons
- Responsive design with sidebar navigation
- Performance monitoring

#### 👥 Patient Management
- Complete CRUD operations for patient records
- Comprehensive patient profiles (demographics, medical info)
- Advanced search and filtering
- Medical history tracking
- Insurance information management
- Allergies and medications documentation
- Repository pattern for testability
- Service layer with business logic

#### 📅 Appointment Scheduling
- Smart appointment booking system
- Calendar view (day/week/month)
- Conflict detection and prevention
- Different appointment types (Consultation, Emergency, Surgery)
- Status tracking (Scheduled, Completed, Cancelled, No-show)
- Doctor-patient assignment
- Time slot management

#### 💼 Billing & Invoicing
- Invoice generation and management
- Payment status tracking (Pending, Paid, Overdue)
- Revenue analytics
- Automatic invoice numbering
- Due date management
- Payment history

#### 📋 Electronic Health Records (EHR)
- Digital medical records management
- SOAP note format (Subjective, Objective, Assessment, Plan)
- Diagnosis and treatment tracking
- Prescription management
- Vital signs recording
- Body chart annotations (visual documentation)
- Follow-up appointment scheduling
- Comprehensive medical history

#### 🌍 Multi-language Support
- English (primary)
- Indonesian (Bahasa Indonesia)
- Easy language switching
- Localized date/time and number formats

#### 🎨 Landing Page & Marketing
- Modern, responsive design
- Hero section with clear value proposition
- Feature showcase
- Pricing plans table
- Customer testimonials
- FAQ section
- Mobile-optimized

---

## 🎯 Product Vision

### Vision
To become the leading practice management solution for small healthcare clinics globally by providing an intuitive, secure, and affordable platform that simplifies clinic operations and improves patient care.

### Mission
Empower healthcare providers with tools that reduce administrative burden, improve patient outcomes, and increase operational efficiency through technology.

### Target Audience

**Primary Users:**
- 🏥 **Clinic Owners** - Manage operations, track revenue
- 👨‍⚕️ **Doctors** - Access patient records, reduce paperwork
- 👩‍💼 **Front Desk Staff** - Schedule appointments, handle billing

**Key Metrics:**
- Serve clinics with 1-10 healthcare providers
- Support 100-2,000 patients per clinic
- Save 40% of time on administrative tasks
- Reduce no-shows by 50%

---

## 🛠 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.1+ | React framework with App Router |
| **React** | 19.0+ | UI library |
| **TypeScript** | 5.6+ | Type safety |
| **Tailwind CSS** | 3.4+ | Styling |
| **Radix UI** | Latest | Accessible component primitives |
| **Lucide React** | Latest | Icon library |
| **next-intl** | 4.8+ | Internationalization |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 15.1+ | Serverless API |
| **NextAuth.js** | 4.24+ | Authentication |
| **Prisma** | 5.22+ | Database ORM |
| **Zod** | 3.23+ | Input validation |
| **bcryptjs** | 2.4+ | Password hashing |

### Database
- **Development:** SQLite (file:./dev.db)
- **Production:** PostgreSQL (recommended)

### Architecture Patterns
- **Repository Pattern** - I/O abstraction for testability
- **Service Layer** - Business logic separation
- **Feature-Based Organization** - Domain-driven structure
- **Structured Logging** - JSON logs with correlation IDs
- **Error Handling** - Custom error classes with proper HTTP codes

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
│  Next.js App Router (React Components + Server Actions)     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                              │
│  Next.js API Routes (RESTful endpoints + validation)        │
│  ├─ Authentication (NextAuth.js)                           │
│  ├─ Rate Limiting (5 req / 15 min for auth)               │
│  ├─ Input Validation (Zod schemas)                        │
│  └─ Error Handling (Custom error classes)                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
│  Business Logic (Pure Functions + Domain Rules)            │
│  ├─ PatientService                                         │
│  ├─ AppointmentService                                     │
│  └─ BillingService                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  Repository Layer                           │
│  Data Access Abstraction (Interfaces + Implementations)    │
│  ├─ PatientRepository (Interface)                          │
│  │  ├─ PrismaPatientRepository (Production)                │
│  │  └─ MockPatientRepository (Testing)                    │
│  └─ AppointmentRepository                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Database Layer                           │
│  Prisma ORM → PostgreSQL (or SQLite for dev)               │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── [locale]/                  # Localized routes
│   ├── api/                       # API endpoints
│   │   ├── patients/              # Patient CRUD
│   │   ├── appointments/          # Appointment management
│   │   ├── medical-records/       # EHR
│   │   ├── invoices/              # Billing
│   │   └── auth/                  # Authentication
│   ├── auth/                      # Auth pages (signin, signup)
│   └── dashboard/                 # Main app pages
│
├── features/                      # Feature-based modules ✨ NEW
│   └── patient/
│       ├── types/                 # Domain types
│       ├── api/                   # Repository layer
│       │   ├── patient.repository.ts
│       │   ├── patient.repository.prisma.ts
│       │   └── patient.repository.mock.ts
│       └── services/              # Business logic
│           └── patient.service.ts
│
├── components/                    # React components
│   ├── ui/                        # Reusable UI primitives
│   ├── dashboard/                 # Dashboard-specific
│   └── providers/                 # Context providers
│
├── lib/                           # Utilities & core
│   ├── auth.ts                    # NextAuth config
│   ├── auth_helpers.ts            # Auth utilities
│   ├── prisma.ts                  # Database client
│   ├── logger.ts                  # Structured logging ✨ NEW
│   ├── errors.ts                  # Custom errors ✨ NEW
│   ├── validator.ts               # Zod schemas ✨ NEW
│   ├── rate-limit.ts              # Rate limiting ✨ NEW
│   └── utils.ts                   # Helper functions
│
├── middleware.ts                  # Next.js middleware
├── types/                         # TypeScript definitions
└── i18n/                          # Internationalization
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/draconra/saas-clinic.git
   cd clinic-saas
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Configure your environment variables:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-change-in-production"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   yarn db:seed
   ```

5. **Start the development server**
   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### 📱 Demo Credentials

The application comes pre-seeded with demo data:

- **Admin**: `admin@clinic.com` / `admin123`
- **Doctor**: `doctor@clinic.com` / `doctor123`

---

## 📚 Documentation

### Core Documents

| Document | Description | Link |
|----------|-------------|------|
| **PRD** | Product Requirements Document - Complete feature specifications, user personas, roadmap | [PRD.md](PRD.md) |
| **AGENT_RULES** | Development guidelines - SOLID principles, security best practices | [AGENT_RULES.md](AGENT_RULES.md) |
| **CODE_AUDIT** | Security audit findings and compliance score | [CODE_AUDIT.md](CODE_AUDIT.md) |
| **IMPLEMENTATION_GUIDE** | Code examples and patterns for the codebase | [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) |
| **REFACTORING_SUMMARY** | Summary of recent improvements and changes | [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md) |

### Key Features Explained

#### 🔒 Security (Score: 7/10)
- ✅ Input validation with Zod schemas
- ✅ Password hashing (bcrypt, cost 12)
- ✅ Rate limiting on auth endpoints
- ✅ Structured logging with correlation IDs
- ✅ Custom error classes with proper HTTP codes
- ✅ Repository pattern for testability
- See: [AGENT_RULES.md](AGENT_RULES.md)

#### 🏗 Architecture (Score: 7/10)
- ✅ Feature-based organization
- ✅ Repository pattern (I/O abstraction)
- ✅ Service layer (business logic)
- ✅ Testability-first design
- ✅ Mock implementations for testing
- See: [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)

#### 📊 Observability (Score: 8/10)
- ✅ Structured JSON logging
- ✅ Correlation ID tracking
- ✅ Operation duration metrics
- ✅ Error context capture
- See: [lib/logger.ts](src/lib/logger.ts)

### Database Schema

The application includes a comprehensive database schema:

- **Users** - Authentication and role management
- **Clinics** - Multi-tenant support
- **Patients** - Patient information and medical history
- **Appointments** - Scheduling and calendar management
- **Medical Records** - EHR functionality with body charts
- **Invoices** - Billing and payment tracking
- **Body Charts** - Visual medical documentation

See: [prisma/schema.prisma](prisma/schema.prisma)

---

## 💻 Development

### Available Scripts

```bash
# Development
yarn dev              # Start development server (http://localhost:3000)

# Building
yarn build            # Build for production
yarn start            # Start production server

# Quality
yarn lint             # Run ESLint
yarn type-check       # Run TypeScript checks

# Database
npx prisma generate   # Generate Prisma client
npx prisma db push    # Push schema changes
npx prisma studio     # Open Prisma Studio
yarn db:seed          # Seed database with demo data
```

### Development Guidelines

When contributing to this codebase, please follow:

1. **Read the [AGENT_RULES.md](AGENT_RULES.md)** - Contains all architectural and coding standards
2. **Follow the Repository Pattern** - All I/O operations must be abstracted
3. **Write Tests** - Aim for >85% coverage (see: [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md))
4. **Use TypeScript** - All code must be type-safe
5. **Validate Input** - Use Zod schemas at API boundaries
6. **Log Operations** - All operations must log start/success/failure
7. **Handle Errors** - Use custom error classes with proper status codes

### Code Quality

| Metric | Current Score | Target |
|-----------------------|--------|
| Security | 7/10 | 9/10 |
| Architecture | 7/10 | 9/10 |
| Error Handling | 8/10 | 9/10 |
| Logging | 8/10 | 9/10 |
| Test Coverage | 0% | >85% |
| **Overall** | **6.5/10** | **9/10** |

See: [CODE_AUDIT.md](CODE_AUDIT.md) for details.

---

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables:
   ```env
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_URL="https://your-domain.com"
   NEXTAUTH_SECRET="your-secure-secret-key"
   ```
3. Deploy automatically on push to main

### Environment Variables for Production

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Auth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secure-secret-key-min-32-chars"

# Optional: Payment Gateway
STRIPE_PUBLIC_KEY="pk_live_your-stripe-public-key"
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"

# Optional: Email Service
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-email-password"
```

### Production Optimizations

- ✅ **Connection Pooling** - PgBouncer for database
- ✅ **CDN** - Vercel Edge Network for static assets
- ✅ **Logging** - Structured JSON logs for analysis
- ✅ **Error Tracking** - Custom error handling
- 🔄 **Redis Caching** - For sessions (planned)
- 🔄 **Monitoring** - Sentry/LogRocket (planned)
- 🔄 **Database Backups** - Automated backups (planned)

### Docker

```bash
# Build
docker build -t clinic-saas .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  clinic-saas
```

---

## 🗺️ Roadmap

### ✅ Phase 1: Foundation (Complete)
- [x] Authentication & authorization
- [x] Patient management
- [x] Appointment scheduling
- [x] Medical records (EHR)
- [x] Billing & invoicing
- [x] Dashboard & analytics
- [x] Multi-language support
- [x] Landing page

### 🔄 Phase 2: Enhancement (Q2 2026)
- [ ] Online patient portal (self-scheduling)
- [ ] SMS/email notifications (Twilio)
- [ ] Payment gateway integration (Stripe)
- [ ] Advanced reporting
- [ ] Mobile apps (iOS/Android)
- [ ] Telemedicine support
- [ ] Document management

### 📋 Phase 3: Expansion (Q3 2026)
- [ ] Multi-location support
- [ ] Inventory management
- [ ] Staff scheduling
- [ ] Insurance claims
- [ ] Lab integrations
- [ ] E-prescribing
- [ ] Chat system

### 🚀 Phase 4: Intelligence (Q4 2026)
- [ ] AI diagnosis assistance
- [ ] Predictive analytics
- [ ] Automated reminders
- [ ] Smart scheduling
- [ ] Revenue optimization
- [ ] Population health

See: [PRD.md](PRD.md) for detailed feature specifications.

---

## 🔒 Security Considerations

### Implemented Security Measures

- ✅ **Password Security** - Bcrypt hashing (cost 12), 12+ char requirements
- ✅ **Rate Limiting** - 5 requests per 15 minutes on auth endpoints
- ✅ **Input Validation** - All API input validated with Zod schemas
- ✅ **Error Sanitization** - Stack traces never sent to clients
- ✅ **Session Management** - Secure HTTP-only cookies
- ✅ **Correlation IDs** - All requests traceable
- ✅ **Structured Logging** - Security events logged

### HIPAA Compliance

- ✅ Data encryption at rest and in transit
- ✅ Audit logging for all data access
- ✅ Role-based access control
- ✅ Secure authentication (MFA planned)
- 🔄 Business Associate Agreements (planned)
- 🔄 Security training modules (planned)

### Best Practices

When deploying to production:
1. Use strong, unique `NEXTAUTH_SECRET` (min 32 characters)
2. Enable HTTPS everywhere
3. Configure database backups
4. Set up monitoring and alerts
5. Regular security audits
6. Keep dependencies updated

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Read the [AGENT_RULES.md](AGENT_RULES.md)
4. Follow the architectural patterns
5. Write tests for your changes
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Review Process

All PRs must:
- Follow the [AGENT_RULES.md](AGENT_RULES.md)
- Pass TypeScript compilation
- Pass ESLint checks
- Include tests (when applicable)
- Update documentation (when applicable)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### Documentation
- 📖 [Product Requirements](PRD.md)
- 📖 [Development Guidelines](AGENT_RULES.md)
- 📖 [Implementation Guide](IMPLEMENTATION_GUIDE.md)
- 📖 [Code Audit](CODE_AUDIT.md)

### Getting Help
- Create an issue in the [GitHub repository](https://github.com/draconra/saas-clinic/issues)
- Check existing documentation
- Review the demo credentials above

### Business Inquiries
For enterprise features, custom integrations, or partnership opportunities:
- Email: support@clinicsaas.com (hypothetical)
- Website: https://clinicsaas.com (hypothetical)

---

## 🙏 Acknowledgments

Built with ❤️ for small health clinics everywhere using:

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Vercel](https://vercel.com/)

---

**⭐ Star us on GitHub** — it helps!

**Made with ❤️ by the ClinicSaaS Team**

---

*Last updated: February 6, 2026*
