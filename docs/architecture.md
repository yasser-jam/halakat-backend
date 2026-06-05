# System Architecture

## Overview

Halakat is a NestJS-based backend for managing Quran memorization programs. It uses a modular architecture with 19 service modules and 21 controllers, backed by PostgreSQL via Prisma ORM.

## Technology Stack

| Component        | Technology                            |
|-----------------|---------------------------------------|
| Framework       | NestJS (TypeScript)                   |
| ORM             | Prisma                                |
| Database        | PostgreSQL                            |
| Auth            | JWT + bcryptjs                        |
| API Docs        | Swagger/OpenAPI                       |
| Validation      | class-validator                       |
| Deployment      | Vercel                                |

## Module Dependency Graph

```
src/
├── app.module.ts          # Root module
├── prisma.service.ts      # PrismaClient singleton
├── main.ts                # Bootstrap (port 3002)
│
├── organization/          # Top-level entity
├── mosque/                # Belongs to organization
│
├── auth/                  # JWT auth, guards, strategies
├── role/                  # RBAC: AppRole, TeacherRole
├── permission/            # Permission enums
│
├── campaign/              # Campaign lifecycle
├── group/                 # Student groups
├── student/               # Student profiles & enrollment
├── teacher/               # Teacher profiles & assignment
│
├── attendance/            # Daily attendance
├── curriculum/            # Base curriculum definitions
├── category/              # Curriculum categories
├── curriculum-template/   # Campaign-specific curriculum plans
├── curriculum-lesson-session/  # Lesson delivery tracking
│
├── evaluation/            # Evaluation criteria
├── mistake/               # Recitation mistakes catalog
├── session-surah/         # Surah templates & session surahs
├── saving-session/        # Memorization test sessions
│
├── log/                   # Activity logging (audit trail)
└── report/                # Campaign analytics
```

## Architectural Patterns

### RESTful API Design
- All endpoints follow REST conventions
- Swagger documentation on every endpoint
- Request validation via DTOs + class-validator
- Consistent response format: `{ message, data }` or direct objects

### Authentication Flow
```
Request → JwtAuthGuard → Passport Strategy → JWT Payload → Controller → Service
```

### Entity Hierarchy
```
Organization → Mosque → Campaign → Group → Student
```

### Cross-Cutting Concerns
- **Logging**: `LogService` injected into attendance, curriculum-lesson-session, saving-session
- **Guards**: `JwtAuthGuard` protects authenticated routes, `RolesGuard` checks permissions
- **Context Headers**: `campaign_id`, `organization_id`, `mosque_id` passed via headers

## Key Design Decisions

1. **Campaign-centric isolation**: Most operations require `campaign_id` context header
2. **Dual student/teacher models**: Global student & teacher profiles, campaign-specific enrollments via junction tables
3. **Curriculum separation**: Base curriculum (organization-level) vs campaign-specific templates with node hierarchies
4. **Automatic attendance generation**: Attendance records auto-created when students are assigned to groups
5. **Node status automation**: Node status (PLANNED → IN_PROGRESS → LATE/COMPLETED) auto-updated based on lesson sessions
