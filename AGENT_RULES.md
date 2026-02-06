# Agent Rules - Development Guidelines

**This document contains all architectural and development rules that MUST be followed when working on this codebase.**

## Table of Contents

1. [Core Design Principles](#core-design-principles)
2. [Rugged Software Constitution](#rugged-software-constitution)
3. [Security Mandate & Principles](#security-mandate--principles)
4. [Architectural Patterns - Testability-First Design](#architectural-patterns---testability-first-design)
5. [Code Organization Principles](#code-organization-principles)
6. [Project Structure](#project-structure)
7. [API Design Principles](#api-design-principles)
8. [Error Handling Principles](#error-handling-principles)
9. [Logging and Observability Mandate](#logging-and-observability-mandate)
10. [Testing Strategy](#testing-strategy)
11. [Resource and Memory Management](#resource-and-memory-management)
12. [Code Idioms and Conventions](#code-idioms-and-conventions)

---

## Core Design Principles

### SOLID Principles

**Single Responsibility Principle (SRP):**
- Each class, module, or function should have ONE and ONLY ONE reason to change
- Generate focused, cohesive units of functionality
- If explaining what something does requires "and", it likely violates SRP

**Open/Closed Principle (OCP):**
- Software entities should be open for extension but closed for modification
- Design abstractions (interfaces, ports) that allow behavior changes without modifying existing code
- Use composition and dependency injection to enable extensibility

**Liskov Substitution Principle (LSP):**
- Subtypes must be substitutable for their base types without altering program correctness
- Inheritance hierarchies must maintain behavioral consistency

**Interface Segregation Principle (ISP):**
- Clients should not be forced to depend on interfaces they don't use
- Create focused, role-specific interfaces rather than monolithic ones

**Dependency Inversion Principle (DIP):**
- Depend on abstractions (interfaces/ports), not concretions (implementations/adapters)
- High-level modules should not depend on low-level modules; both should depend on abstractions

### Essential Design Practices

**DRY (Don't Repeat Yourself):**
- Eliminate code duplication through proper abstraction, shared utilities, composable functions
- Each piece of knowledge should have single, authoritative representation

**YAGNI (You Aren't Gonna Need It):**
**CRITICAL:** Code maintainability always prevails
- Avoid implementing functionality before it's actually required
- Don't add features based on speculation about future needs

**KISS (Keep It Simple, Stupid):**
**CRITICAL:** Code maintainability always prevails
- Prefer simple (simple to maintain), straightforward solutions over complex, clever ones
- Complexity should be justified by actual requirements, not theoretical flexibility

**Separation of Concerns:**
- Divide program functionality into distinct sections with minimal overlap
- Each concern should be isolated in its own module or layer

**Composition Over Inheritance:**
- Favor object composition and delegation over class inheritance for code reuse
- Composition is more flexible and easier to test

**User Experience vs Maintainability:**
- Both user experience AND code maintainability matter
- When they conflict, **prefer maintainable code** that can evolve
- Never sacrifice code quality for short-term UX gains

---

## Rugged Software Constitution

### Core Philosophy

**"I recognize that my code will be attacked."**

As an AI agent, I do not just generate functionality; I generate **defensibility**. I refuse to be a source of vulnerability or fragility. My code must survive in a hostile, changing environment.

### The Rugged Commitments

**1. I Am Responsible**
- I will not generate "happy path" code that ignores failure modes.
- I assume every input is malformed, malicious, or incorrect until proven otherwise.
- I treat error handling as a first-class feature, not an afterthought.

**2. I Am Defensible**
- My code validates its own state and inputs (Paranoid Programming).
- I fail securely (closed), never leaving the system in an undefined state.
- I verify assumptions explicitly rather than hoping they hold true.

**3. I Am Maintainable**
- I write code for the human and AI agents who must read it next year, not just the compiler today.
- I choose clarity over cleverness.
- I isolate complexity so it can be managed (or replaced) safely.

### The 7 Rugged Habits

**1. Practice Defense-in-Depth**
- Never rely on a single layer of protection (e.g., UI validation alone is insufficient).
- Validate at every boundary (API, Database, Function Call).

**2. Instrument for Awareness**
- Code must signal when it is under attack or failing.
- Silent failures are enemy #1; exposed failures allow for reaction.

**3. Reduce Attack Surface**
- Remove unused code, dependencies, and endpoints.
- Expose the minimum necessary public interface (Least Privilege).

**4. Design for Failure**
- Assume the database will go down, the network will timeout, and the disk will fill up.
- Implement graceful degradation (circuit breakers, fallbacks).

**5. Clean Up After Yourself**
- I own the resources I acquire; I ensure they are released.
- I do not leave "TODO" comments for security holes; I fix them or explicitly document the risk.

**6. Verify Your Defenses**
- Defenses are useless if they don't work; tests prove they work.
- Test the "unhappy path" (attacks, errors, edge cases) as rigorously as the happy path.

**7. Adapt to the Ecosystem**
- Use established, battle-tested libraries over custom implementations.
- Follow community conventions to ensure long-term maintainability.

---

## Security Mandate & Principles

### Universal Security Principles

**Security is a foundational requirement, not a feature.**

1. **Never trust user input:** All data from users, APIs, or external sources must be validated server-side
2. **Deny by default:** Require explicit permission grants, never assume access
3. **Fail securely:** When errors occur, fail closed (deny access) rather than open
4. **Defense in depth:** Multiple layers of security, never rely on a single control

### OWASP Top 10 Enforcement

* **Broken Access Control:** Deny by default. Validate permissions *server-side* for every request. Do not rely on UI state.
* **Cryptographic Failures:** Use TLS 1.2+ everywhere. Encrypt PII/Secrets at rest. Use standard algorithms (AES-256, RSA-2048, Ed25519). *Never* roll your own crypto.
* **Injection:** ZERO TOLERANCE for string concatenation in queries. Use Parameterized Queries (SQL) or ORM bindings. Sanitize all HTML/JS output.
* **SSRF Prevention:** Validate all user-provided URLs against an allowlist. Disable HTTP redirects in fetch clients. Block requests to internal IPs (metadata services, localhost).
* **Insecure Design:** Threat model every new feature. Fail securely (closed), not openly.
* **Vulnerable Components:** Pin dependency versions. Scan for CVEs in CI/CD.

### Authentication & Authorization

* **Passwords:** Hash with Argon2id or Bcrypt (min cost 12). Never plain text.
* **Tokens:**
  * *Access Tokens:* Short-lived (15-30 mins). HS256 or RS256.
  * *Refresh Tokens:* Long-lived (7-30 days). Rotate on use. Store in `HttpOnly; Secure; SameSite=Strict` cookies.
* **Rate Limiting:** Enforce strictly on public endpoints (Login, Register, Password Reset). Standard: 5 attempts / 15 mins.
* **MFA:** Required for Admin and Sensitive Data access.
* **RBAC:** Map permissions to Roles, not Users. Check permissions at the Route AND Resource level.

### Input Validation & Sanitization

* **Principle:** "All Input is Evil until Proven Good."
* **Validation:** Validate against a strict Schema (Zod/Pydantic) at the *Controller/Port* boundary.
* **Allowlist:** Check for "Good characters" (e.g., `^[a-zA-Z0-9]+$`), do not try to filter "Bad characters."
* **Sanitization:** Strip dangerous tags from rich text input using a proven library.

### Secrets Management

* **Storage:** Never commit secrets to git. Use `.env` (local) or Secret Managers (Prod - e.g., Vault/GSM).

---

## Architectural Patterns - Testability-First Design

### Core Principle

**All code must be independently testable without running the full application or external infrastructure.**

### Universal Architecture Rules

#### Rule 1: I/O Isolation

**Problem:** Tightly coupled I/O makes tests slow, flaky, and environment-dependent.

**Solution:** Abstract all I/O behind interfaces/contracts:
- Database queries
- HTTP calls (to external APIs)
- File system operations
- Time/randomness (for determinism)
- Message queues

**Example (TypeScript):**

```typescript
// Contract (service layer)
export interface TaskAPI {
  createTask(title: string): Promise<Task>;
  getTasks(): Promise<Task[]>;
}

// Production adapter
export class BackendTaskAPI implements TaskAPI { /* ... */ }

// Test adapter (vi.mock or manual)
export class MockTaskAPI implements TaskAPI { /* ... */ }
```

#### Rule 2: Pure Business Logic

**Problem:** Business rules mixed with I/O are impossible to test without infrastructure.

**Solution:** Extract calculations, validations, transformations into pure functions:
- Input → Output, no side effects
- Deterministic: same input = same output
- No I/O inside business rules

**Correct approach:**

```typescript
// ✅ Pure function - easy to test
function calculateDiscount(items: Item[], coupon: Coupon): number {
  // Pure calculation, returns value
}

// ❌ Impure - database call inside
async function calculateDiscount(items: Item[], coupon: Coupon): Promise<number> {
  const validCoupon = await db.getCoupon(coupon.ID) // NO!
}

// Correct: Fetch first, then pass to pure logic
const validCoupon = await store.getCoupon(coupon.ID);
const discount = calculateDiscount(items, validCoupon);
```

#### Rule 3: Dependency Direction

**Principle:** Dependencies point inward toward business logic.

```
Infrastructure Layer (DB, HTTP, Files, External APIs)
         ↓ Depends on
Contracts/Interfaces Layer (Abstract ports)
         ↓ Depends on
Business Logic Layer (Pure functions, domain rules)
```

**Never:**
- Business logic imports database driver
- Domain entities import HTTP framework
- Core calculations import config files

**Always:**
- Infrastructure implements interfaces defined by business layer
- Business logic receives dependencies via injection

---

## Code Organization Principles

- Generate small, focused functions with clear single purposes (typically 10-50 lines)
- Keep cognitive complexity low (cyclomatic complexity < 10 for most functions)
- Maintain clear boundaries between different layers (presentation, business logic, data access)
- Design for testability from the start, avoiding tight coupling that prevents testing
- Apply consistent naming conventions that reveal intent without requiring comments

### Module Boundaries

**Directory Structure (TypeScript/Next.js):**

```
src/features/patient/
- index.ts              # Public exports
- patient.service.ts    # Business logic
- patient.api.ts        # interface PatientAPI
- patient.api.backend.ts # implements PatientAPI
- patient.store.ts      # Store (uses PatientAPI)
- patient.service.spec.ts  # Unit tests (mock API)
```

### Feature Interaction Patterns

**Direct Import**

When a feature needs another feature's capabilities, import its Service directly:

```typescript
// In features/appointment/logic.ts
import { PatientService } from '@/features/patient';

export class AppointmentLogic {
  constructor(private patientService: PatientService) {}

  async createAppointment(data: CreateAppointmentDTO) {
    const patient = await this.patientService.getPatient(data.patientId);
    // ... rest of logic
  }
}
```

**Rules:**
- Only import Service (public API), never internal files like logic.ts or storage.ts
- Declare dependency in the dependent feature's Service constructor
- Wire dependencies in initialization code

---

## Project Structure

**Project Structure Philosophy:**

- **Organize by FEATURE, not by technical layer**
- Each feature is a vertical slice
- Enables modular growth, clear boundaries, and independent deployability

**Universal Rule: Context → Feature → Layer**

### Layout Examples

**Next.js App Router Structure:**

```
src/
  features/                     # Business features organized as vertical slices
    patient/                   # Patient management
      components/              # Feature-specific components
        PatientForm.tsx
        PatientList.tsx
      services/
        patient.service.ts     # Business logic
      api/
        patient.api.ts         # interface PatientAPI
        patient.api.backend.ts # Production implementation
      types/
        patient.types.ts       # TypeScript interfaces
      index.ts                 # Public exports
    appointment/               # Appointment management
      # ... same structure
  components/                   # Shared components
    ui/                        # UI primitives (Button, Input)
      Button.tsx
      Input.tsx
  lib/                         # Shared utilities
    prisma.ts                  # Database client
    auth.ts                    # Auth configuration
    utils.ts                   # Helper functions
  app/                         # Next.js app router
    api/                       # API routes
      patients/
        route.ts               # Patients endpoint
```

---

## API Design Principles

### RESTful API Standards

**Resource-Based URLs:**
- Use plural nouns for resources: `/api/{version}/users`, `/api/{version}/orders`
- Hierarchical relationships: `/api/{version}/users/:userId/orders`
- Avoid verbs in URLs

**HTTP Methods:**
- GET: Read/retrieve resource (safe, idempotent, cacheable)
- POST: Create new resource (not idempotent)
- PUT: Replace entire resource (idempotent)
- PATCH: Partial update (idempotent)
- DELETE: Remove resource (idempotent)

**Versioning:**
- URL path versioning: `/api/{version}/users` e.g. `/api/v1/users`

### HTTP Status Codes and Error Categories

**Success Codes:**
- 200 OK: Success (GET, PUT, PATCH)
- 201 Created: Resource created successfully (POST)
- 204 No Content: Success with no response body (DELETE)

**Client Error Codes (4xx):**
- 400 Bad Request: User input doesn't meet requirements
- 401 Unauthorized: Identity verification failed
- 403 Forbidden: Permission denied
- 404 Not Found: Resource doesn't exist
- 409 Conflict / 422 Unprocessable Entity: Domain rule violations
- 429 Too Many Requests: Rate limit exceeded

**Server Error Codes (5xx):**
- 500/502/503: Database down, network timeout, external service failure

### API Success Response Format

```typescript
{
  data: { /* resource or array of resources */ },
  meta: {
    total: 100,
    page: 1,
    perPage: 20
  },
  links: {
    self: "/api/v1/users?page=1",
    next: "/api/v1/users?page=2",
    prev: null
  }
}
```

### API Error Response Format

```typescript
{
  status: "error",
  code: 400,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid email format",
    details: {
      field: "email",
      reason: "Must be a valid address"
    }
  },
  correlationId: "req-1234567890"
}
```

---

## Error Handling Principles

**1. Never Fail Silently:**
- All errors must be handled explicitly (no empty catch blocks)
- If you catch an error, do something with it (log, return, transform, retry)

**2. Fail Fast:**
- Detect and report errors as early as possible
- Validate at system boundaries before processing

**3. Provide Context:**
- Include error codes, correlation IDs, actionable messages
- Enough information for debugging without exposing sensitive details

**4. Separate Concerns:**
- Different handlers for different error types
- Business errors ≠ technical errors ≠ security errors

**5. Resource Cleanup:**
- Always clean up in error scenarios (close files, release connections, unlock resources)
- Use language-appropriate patterns (try/finally)

**6. No Information Leakage:**
- Sanitize error messages for external consumption
- Don't expose stack traces, SQL queries, file paths to users
- Log full details internally, show generic message externally

---

## Logging and Observability Mandate

### Universal Requirement: All Operations Must Be Logged

**Every operation entry point MUST include logging. No exceptions.**

**What constitutes an "operation" (mandatory logging):**
- API endpoints and request handlers
- Background jobs and queue workers
- Event handlers and message consumers
- Scheduled tasks and cron jobs
- CLI commands
- External service calls (to third-party APIs)
- Database transactions

**What is NOT an operation (no direct logging):**
- Pure business logic functions (called within operations)
- Utility and helper functions
- Data transformations and validators

**Minimum logging requirement (3 points):**
1. **Operation start:** Log at entry with context (correlationId, userId, operation name)
2. **Operation success:** Log completion with duration and result identifiers
3. **Operation failure:** Log error with full context (correlationId, error details, stack trace)

**Mandatory context in all logs:**
- `correlationId`: UUID for tracing across services
- `operation`: Clear operation name (e.g., "create_order", "process_payment")
- `duration`: Execution time in milliseconds
- `userId`: Actor who triggered the operation (when applicable)
- `error`: Full error context on failures

---

## Testing Strategy

### Test Pyramid

**Unit Tests (70% of tests):**
- **What:** Test domain logic in isolation with mocked dependencies
- **Speed:** Fast (<100ms per test)
- **Scope:** Single function, class, or module
- **Dependencies:** All external dependencies mocked
- **Coverage Goal:** >85% of domain logic

**Integration Tests (20% of tests):**
- **What:** Test adapters against real infrastructure
- **Speed:** Medium (100ms-5s per test)
- **Scope:** Component interaction with infrastructure
- **Dependencies:** Real infrastructure via Testcontainers
- **Coverage Goal:** All adapter implementations, critical integration points

**End-to-End Tests (10% of tests):**
- **What:** Test complete user journeys through all layers
- **Speed:** Slow (5s-30s per test)
- **Scope:** Full system from HTTP request to database and back
- **Dependencies:** Entire system running
- **Coverage Goal:** Happy paths, critical business flows

### Test Organization

**Universal Rule: Co-locate implementation tests; Separate system tests.**

**1. Unit & Integration Tests (Co-located)**
- **Rule:** Place tests **next to the file** they test.
- **Why:** Keeps tests visible, encourages maintenance, and supports refactoring.

**Naming Convention Example:**
- **TS/TSX:** `*.spec.ts` (Unit), `*.integration.spec.ts` (Integration)

**2. End-to-End Tests (Separate)**
- **Rule:** Place in a dedicated `e2e/` folder
- **Why:** E2E tests cross boundaries and don't belong to a single feature.

**Naming:** Follow `{feature}-{ui/api}.e2e.test.{ext}`

### Test Quality Standards

**AAA Pattern (Arrange-Act-Assert):**

```typescript
// Arrange: Set up test data and mocks
const user = { id: '123', email: 'test@example.com' };
const mockRepo = createMockRepository();

// Act: Execute the code under test
const result = await userService.createUser(user);

// Assert: Verify expected outcome
expect(result.id).toBe('123');
expect(mockRepo.save).toHaveBeenCalledWith(user);
```

**Test Naming:**
- Descriptive: `should [expected behavior] when [condition]`
- Examples:
  - `should return 404 when user not found`
  - `should hash password before saving to database`

---

## Resource and Memory Management

### Universal Resource Management Rules

**1. Always Clean Up Resources**

**Resources requiring cleanup:**
- Files, network connections, database connections
- Locks, semaphores, mutexes
- Memory allocations (in manual-memory languages)
- OS handles, GPU resources

**Clean up in ALL paths:**
- Success path: Normal completion
- Error path: Exception thrown, error returned
- Early return path: Guard clauses, validation failures

**Use language-appropriate patterns:**
- TypeScript: try/finally
- Automatic cleanup via proper scoping

**2. Timeout All I/O Operations**

**Timeout recommendations:**
- Network requests: 30s default, shorter (5-10s) for interactive
- Database queries: 10s default, configure per query complexity
- File operations: Usually fast, but timeout on network filesystems

**3. Pool Expensive Resources**

**Resources to pool:**
- Database connections: Pool size 5-20 per app instance
- HTTP connections: Reuse with keep-alive

---

## Code Idioms and Conventions

### Universal Principle

**Write idiomatic code for the target language:**

- Code should look natural to developers familiar with that language
- Follow established community conventions, not personal preferences
- Use language built-ins and standard library effectively
- Apply language-appropriate patterns (don't force patterns from other languages)

### Idiomatic Code Characteristics

- Leverages language features (don't avoid features unnecessarily)
- Follows language naming conventions
- Uses appropriate error handling for language
- Applies established community patterns

### Avoid Cross-Language Anti-Patterns

- ❌ Don't write "Java in Python" or "C in TypeScript"
- ❌ Don't force OOP patterns in functional languages
- ❌ Don't avoid language features because they're "unfamiliar"
- ✅ Learn and apply language-specific idioms

---

## TypeScript/Next.js Specific Guidelines

### File Naming Conventions

- **Components:** PascalCase (e.g., `PatientForm.tsx`)
- **Utilities:** camelCase (e.g., `formatDate.ts`)
- **Types:** camelCase with `.types.ts` suffix (e.g., `patient.types.ts`)
- **Tests:** Same as file with `.spec.ts` or `.test.ts` suffix
- **Integration Tests:** `.integration.spec.ts` suffix
- **E2E Tests:** `.e2e.test.ts` suffix

### Import Organization

```typescript
// 1. External dependencies
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

// 2. Internal dependencies (absolute imports with @ alias)
import { prisma } from '@/lib/prisma'
import { PatientService } from '@/features/patient'

// 3. Relative imports (avoid when possible)
import { formatDate } from '../utils/formatDate'
```

---

## Code Review Checklist

Before marking any code as complete, verify:

- [ ] Can I run unit tests without starting database/external services?
- [ ] Are all I/O operations behind an abstraction?
- [ ] Is business logic pure (no side effects)?
- [ ] Do all operations include proper logging (start, success, failure)?
- [ ] Are all errors handled explicitly (no silent failures)?
- [ ] Is user input validated at the API boundary?
- [ ] Are sensitive details sanitized before returning to client?
- [ ] Are resources cleaned up in all error scenarios?
- [ ] Does the pattern match existing codebase (>80% consistency)?
- [ ] Are tests written (unit, integration, e2e)?
- [ ] Is code documented (why, not what)?
