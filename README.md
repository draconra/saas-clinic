# ClinicSaaS - Health Clinic Management System

A comprehensive, modern SaaS platform for small health clinics built with Next.js 15, TypeScript, and Prisma.

## 🏥 Features

### ✅ Core Features Implemented

- **🔐 Authentication & Security**
  - NextAuth.js integration with credentials provider
  - Secure password hashing with bcryptjs
  - Role-based access control (Admin, Doctor, Nurse, Staff)
  - Session management and protected routes

- **📊 Dashboard & Analytics**
  - Real-time statistics and metrics
  - Recent appointments overview
  - Quick action buttons
  - Responsive design with Tailwind CSS
  - Clean, modern UI with sidebar navigation

- **👥 Patient Management**
  - Complete CRUD operations for patient records
  - Comprehensive patient profiles with medical information
  - Advanced search and filtering
  - Patient demographics and contact management
  - Medical history tracking

- **📅 Appointment Scheduling**
  - Smart appointment booking system
  - Different appointment types (Consultation, Emergency, Surgery, etc.)
  - Status tracking (Scheduled, Completed, Cancelled, No-show)
  - Doctor-patient assignment
  - Time slot management

- **💼 Billing & Invoicing**
  - Invoice generation and management
  - Payment status tracking
  - Revenue analytics
  - Automatic invoice numbering
  - Due date management

- **📋 Electronic Health Records (EHR)**
  - Digital medical records management
  - Diagnosis and treatment tracking
  - Prescription management
  - Vital signs recording
  - Follow-up appointment scheduling

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Prisma ORM with SQLite (easily migratable to PostgreSQL)
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Development**: ESLint, PostCSS, TypeScript

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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

## 📱 Demo Credentials

The application comes pre-seeded with demo data:

- **Admin**: `admin@clinic.com` / `admin123`
- **Doctor**: `doctor@clinic.com` / `doctor123`

## 🗄 Database Schema

The application includes a comprehensive database schema:

- **Users** - Authentication and role management
- **Clinics** - Multi-tenant support
- **Patients** - Patient information and medical history
- **Appointments** - Scheduling and calendar management
- **Medical Records** - EHR functionality
- **Invoices** - Billing and payment tracking

## 📁 Project Structure

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application pages
│   └── patients/          # Patient management pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── prisma/               # Database schema and migrations
```

## 🔧 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn db:seed` - Seed database with demo data

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically

### Docker

```bash
# Build
docker build -t clinic-saas .

# Run
docker run -p 3000:3000 clinic-saas
```

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secure-secret-key"
STRIPE_PUBLIC_KEY="pk_live_your-stripe-public-key"
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"
```

## 🔒 Security Considerations

- All API routes are protected with authentication
- Passwords are securely hashed using bcryptjs
- Role-based access control for different user types
- Input validation and sanitization
- Environment variable protection

## 🔄 Database Migration to PostgreSQL

For production, migrate from SQLite to PostgreSQL:

1. Update your `DATABASE_URL` in `.env`
2. Change the provider in `prisma/schema.prisma`
3. Run `npx prisma db push` to create the new schema
4. Migrate existing data if needed

## 📈 Production Optimizations

- Implement connection pooling (PgBouncer)
- Add Redis caching for sessions
- Set up CDN for static assets
- Configure database backups
- Implement proper logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the demo credentials above

---

Built with ❤️ for small health clinics everywhere.