# Authentication & Authorization Workflow

## Overview

Multi-role authentication supporting Admin, Teacher, and Student logins with JWT-based sessions and RBAC.

## Flow Diagram

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐     ┌─────────────┐
│  Client     │────▶│  Auth        │────▶│  Passport   │────▶│  JWT Token  │
│ (Mobile/Web)│     │  Controller  │     │  Strategy   │     │             │
└─────────────┘     └──────────────┘     └────────────┘     └──────┬──────┘
                                                                    │
                                          ┌─────────────────────────┘
                                          ▼
                                   ┌──────────────┐
                                   │  Subsequent  │
                                   │  Requests    │
                                   │  (Bearer)    │
                                   └──────┬───────┘
                                          │
                                          ▼
                                   ┌──────────────┐     ┌─────────────┐
                                   │ JwtAuthGuard  │────▶│  Controller │
                                   │ (validates)   │     │  (role-check)│
                                   └──────────────┘     └─────────────┘
```

## Endpoints

### POST `/auth/login/admin`
**Purpose**: Admin authentication with role verification

**Data Structure**:
```typescript
// dto: LoginAdminDto
{ mobile_phone_number: string }

// Response:
{ access_token: string }  // JWT with { sub, userType: 'ADMIN', role }
```

**Flow**: Find teacher by mobile → Verify role is ADMIN/SUPER_ADMIN → Return JWT

---

### POST `/auth/login/teacher`
**Purpose**: Teacher login with campaign context

**Data Structure**:
```typescript
// dto: LoginTeacherDto
{ mobile_phone_number: string }

// Response:
{
  access_token: string,  // JWT with { sub, userType: 'TEACHER' }
  teacher: { id, first_name, last_name, mobile_phone_number, ... },
  assigned_org?: Organization,       // If ORGANIZATION_ADMIN
  assigned_mosque?: Mosque           // If MOSQUE_ADMIN
}
```

**Flow**: Find teacher → Include latest active campaign assignment → Remove sensitive fields → Optionally inject org/mosque context

---

### POST `/auth/login/student`
**Purpose**: Student login with password verification

**Data Structure**:
```typescript
// dto: LoginStudentDto
{ student_mobile: string, password: string }

// Response:
{ access_token: string }  // JWT with { sub, userType: 'STUDENT' }
```

**Flow**: Find student by mobile → bcrypt.compare password → Return JWT

---

### POST `/auth/login` (Unified)
**Purpose**: Single login returning teacher with full management context

**Data Structure**:
```typescript
// dto: LoginTeacherDto
{ mobile_phone_number: string }

// Response:
{
  access_token: string,
  user: { id, first_name, last_name, role, ... },
  assigned_organization?: Organization
}
```

---

### POST `/auth/profile` (Protected)
**Purpose**: Get teacher profile (plain info, no roles)

**Headers**: `Authorization: Bearer <token>`

**Response**: `{ id, first_name, last_name, ... }` (teacher without password)

---

### POST `/auth/my-permissions` (Protected)
**Purpose**: Get teacher's roles and permissions for a specific campaign

**Headers**: `Authorization: Bearer <token>`, `campaign_id: <id>`

**Response**:
```typescript
{
  roles: string[],  // e.g., ["Teacher", "Admin"]
  permissions: Permission[]  // e.g., ["STUDENT_MANAGEMENT", "ATTENDANCE_MANAGEMENT"]
}
```

**Flow**: Find teacher → Find TeacherRole by campaign → Aggregate permissions from role JSON field

## Data Structures

### JWT Payload
```typescript
{
  sub: number,          // User ID
  userType: 'TEACHER' | 'STUDENT' | 'ADMIN',
  role?: string         // Only for admin login
}
```

### Teacher Entity (key fields for auth)
```prisma
model Teacher {
  id                  Int      @id @default(autoincrement())
  mobile_phone_number String   @unique
  password            String   // bcrypt hashed
  role                Role     @default(TEACHER)
  first_name          String?
  last_name           String?
}
```

### Roles & Permissions
```prisma
model AppRole {
  id          Int      @id @default(autoincrement())
  name        String
  permissions Json     // Array of Permission enum values
  campaign_id Int
}

model TeacherRole {
  id          Int      @id @default(autoincrement())
  teacher_id  Int
  group_id    Int?
  campaign_id Int
  role_id     Int      // FK to AppRole
}
```

## Role Hierarchy

```
SUPER_ADMIN ──→ all permissions
ADMIN ──→ all permissions
ORGANIZATION_ADMIN ──→ org-scoped permissions
MOSQUE_ADMIN ──→ mosque-scoped permissions
TEACHER ──→ campaign-scoped, role-based permissions
```

## Permission Enum
```typescript
enum Permission {
  STUDENT_MANAGEMENT,
  TEACHER_MANAGEMENT,
  ROLES_MANAGEMENT,
  SAVING_SESSION_MANAGEMENT,
  ATTENDANCE_MANAGEMENT,
  CURRICULUM_MANAGEMENT,
  SETTINGS_MANAGEMENT,
  POINTS_MANAGEMENT,
  AWARDS_MANAGEMENT,
}
```

## Guard Protection

| Guard | Purpose | Used On |
|-------|---------|---------|
| `JwtAuthGuard` | Validates JWT from Bearer token | auth/profile, auth/my-permissions, campaign/my-campaigns, group/my-groups, logs, reports |
| `RolesGuard` | Checks user.role against required roles | curriculum-guarded endpoints (currently commented out) |

## Key Service Methods (`src/auth/auth.service.ts`)

| Method | Purpose |
|--------|---------|
| `loginAdmin(dto)` | Admin login with role check |
| `loginTeacher(dto)` | Teacher login with campaign context |
| `loginStudent(dto)` | Student login with bcrypt password check |
| `getTeacherProfile(userId)` | Teacher info with roles/permissions |
| `getTeacherPermissionsForCampaign(userId, campaignId)` | Filtered permissions per campaign |
| `login(dto)` | Unified login with org/mosque management context |
