# Permissions & Roles (RBAC)

## Overview

Role-based access control with campaign-specific roles and fine-grained permission management.

## Data Model

```prisma
model AppRole {
  id          Int      @id @default(autoincrement())
  name        String      // e.g., "Teacher", "Group Supervisor"
  description String?
  permissions Json        // Array of Permission enum values
  campaign_id Int         // Scoped to campaign
  teacher_roles TeacherRole[]
}

model TeacherRole {
  id          Int      @id @default(autoincrement())
  teacher_id  Int
  group_id    Int?        // Optional group-scoping
  campaign_id Int
  role_id     Int         // FK to AppRole
  @@unique([teacher_id, group_id, campaign_id, role_id])
}
```

## Permission Enum

```typescript
enum Permission {
  STUDENT_MANAGEMENT,       // Manage student profiles
  TEACHER_MANAGEMENT,       // Manage teacher profiles
  ROLES_MANAGEMENT,         // Manage roles & permissions
  SAVING_SESSION_MANAGEMENT,// Create/view saving sessions
  ATTENDANCE_MANAGEMENT,    // Mark attendance
  CURRICULUM_MANAGEMENT,    // Manage curriculum, templates, lessons
  SETTINGS_MANAGEMENT,      // Campaign settings
  POINTS_MANAGEMENT,        // Points/awards configuration
  AWARDS_MANAGEMENT,        // Awards management
}
```

## Endpoints

### POST `/roles`
Create role with permissions

**Body** (`CreateRoleDto`):
```typescript
{
  name: string;
  description?: string;
  campaign_id: number;
  permissions: Permission[];   // Array of permission strings
}
```

---

### GET `/roles`
Get all roles for a campaign

**Headers**: `campaign_id`

---

### GET `/roles/:id`
Get role by ID

---

### POST `/roles/bulk-update-permissions`
Batch update permissions for multiple roles

**Body**:
```typescript
{
  role_id: number;
  permissions: string[];
}[]
```

## Permission Resolution

When a teacher accesses campaign-specific features:

```
Auth Flow:
1. Teacher logs in → JWT with { sub, userType: 'TEACHER' }
2. Protected endpoint → JwtAuthGuard validates token
3. Permission check (in controller/service):
   - Get TeacherRole records for teacher + campaign
   - Join AppRole to get permissions JSON
   - Aggregate all permissions
   - Check required permission
```

## Built-in System Roles

| Role | Description |
|------|-------------|
| `TEACHER` | Base teacher with campaign permissions |
| `MANAGER` | Elevated management access |
| `ADMIN` | Admin-level access |
| `SUPER_ADMIN` | Full system access |
| `ORGANIZATION_ADMIN` | Organization-scoped admin |
| `MOSQUE_ADMIN` | Mosque-scoped admin |
| `MANAGER_ASSISTANT` | Assistant to manager |
| `AUDIBLE` | Auditor role |
| `AUDIBLE_ASSISTANT` | Assistant auditor |

## Teacher Role Assignment

When a teacher is created via `POST /teachers`:
1. Teacher created in DB
2. Assigned to campaign via `TeacherCampaign`
3. Default `TeacherRole` created with `role_id: 1`

When updating a teacher via `PUT /teachers/:id`:
1. All existing `TeacherRole` records deleted
2. New roles inserted from request body
