# Teacher Management Workflow

## Overview

Teachers have global profiles, are assigned to campaigns, and can hold roles with specific permissions per campaign.

## Data Model

```prisma
model Teacher {
  id                  Int       @id @default(autoincrement())
  mobile_phone_number String    @unique
  password            String    // bcrypt hashed
  role                Role      @default(TEACHER)
  first_name          String?
  last_name           String?
  birth_date          DateTime?
  // education fields
  preserved_parts     Json?
  image_url           String?
  is_mojaz            Boolean?
  is_working          Boolean?
  
  // Relations
  organization_management OrganizationManager[]  // Org admins
  mosque_management       MosqueManager[]       // Mosque admins
  campaign_assignments    TeacherCampaign[]      // Campaign assignments
  groups                  TeacherGroup[]         // Group assignments
  saving_sessions         SavingSession[]
  teacher_roles           TeacherRole[]          // RBAC
  logs                    Log[]
  CurriculumLessonSession CurriculumLessonSession[]
}
```

## Teacher Lifecycle

```
┌──────────┐    ┌──────────────┐    ┌───────────┐    ┌───────────────┐
│  Create  │───▶│  Assign to   │───▶│  Assign   │───▶│  Assign Role  │
│ Teacher  │    │  Campaign    │    │ to Group  │    │ & Permissions │
└──────────┘    └──────────────┘    └───────────┘    └───────────────┘
```

## Endpoints

### GET `/teachers`
Get all teachers in a campaign

**Headers**: `campaign_id` (required)

**Response**:
```typescript
{
  id: number;
  first_name: string;
  last_name: string;
  mobile_phone_number: string;
  is_mojaz: boolean;
  role: string;        // From TeacherRole name
  permissions: string[];  // From AppRole permissions
}[]
```

**Service**: `teacher.service.ts:findAll()`

---

### POST `/teachers`
Create teacher and assign to campaign with default role

**Headers**: `campaign_id` (required)

**Body** (`CreateTeacherDto`):
```typescript
{
  mobile_phone_number: string;
  first_name?: string;
  last_name?: string;
  password?: string;      // Defaults to "password" hashed
  role?: Role;
  // education, address fields...
}
```

**Flow**: Create teacher → Assign to campaign (`TeacherCampaign`) → Assign default role (`TeacherRole` with role_id=1)

**Response**: `{ message: "Teacher created", data: Teacher }`

**Service**: `teacher.service.ts:create()`

---

### GET `/teachers/unassigned`
List teachers in campaign with no group assignments

**Headers**: `campaign_id` (required)

**Logic**: Teachers assigned to campaign but without `TeacherGroup` records

**Response**: `Teacher[]`

**Service**: `teacher.service.ts:listUnassigned()`

---

### GET `/teachers/:id`
Get teacher by ID with campaign context

**Headers**: `campaign_id`

**Response**:
```typescript
{
  ...teacher,
  roles: { role, campaign, group }[]
}
```

**Service**: `teacher.service.ts:findOne()`

---

### GET `/teachers/mobile/:id`
Get full teacher info for mobile (includes group + students)

**Query**: `campaign_id`

**Response**:
```typescript
{
  ...teacherData,
  role: { name, permissions },
  group: {
    id, title, class,
    students: { first_name, last_name, image, mobile_phone, class }[]
  }
}
```

**Service**: `teacher.service.ts:findInfo()`

---

### PUT `/teachers/:id`
Update teacher and optionally replace role assignments

**Body**: `CreateTeacherDto` (extended with `teacherRoles` array)

**Flow**: Update teacher info → Delete existing roles → Insert new roles

**Service**: `teacher.service.ts:update()`

---

### DELETE `/teachers/:id`
Delete teacher

**Response**: `{ message: "Teacher {id} deleted" }`

**Service**: `teacher.service.ts:delete()`

## Roles & Permissions

### AppRole (per-campaign)
```prisma
model AppRole {
  id          Int      @id @default(autoincrement())
  name        String     // e.g., "Teacher", "Admin", "Supervisor"
  description String?
  permissions Json       // Array: ["STUDENT_MANAGEMENT", "ATTENDANCE_MANAGEMENT", ...]
  campaign_id Int
  teacher_roles TeacherRole[]
}
```

### TeacherRole (assignment)
```prisma
model TeacherRole {
  id          Int      @id @default(autoincrement())
  teacher_id  Int
  group_id    Int?     // Optional group scope
  campaign_id Int
  role_id     Int      // FK to AppRole
  @@unique([teacher_id, group_id, campaign_id, role_id])
}
```

### Permission Enum
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

## Key Integration Points

| Module | Relationship |
|--------|-------------|
| **Campaign** | Assigned via `TeacherCampaign` |
| **Group** | Assigned via `TeacherGroup` |
| **Role** | RBAC via `TeacherRole` → `AppRole` |
| **Attendance** | Teacher marks attendance (batch updates log teacher_id) |
| **SavingSession** | Teacher conducts sessions |
| **CurriculumLessonSession** | Teacher delivers lessons |
| **Log** | Teacher as actor in audit trail |

## Organization/Mosque Admin Teachers

Teachers with role `ORGANIZATION_ADMIN` or `MOSQUE_ADMIN` have management access via:

```prisma
model OrganizationManager {
  teacher_id      Int
  organization_id Int
  role            OrgRole  // OWNER | ADMIN | MANAGER
  @@unique([teacher_id, organization_id])
}

model MosqueManager {
  teacher_id Int
  mosque_id  Int
  role       MosqueRole  // ADMIN | MANAGER
  @@unique([teacher_id, mosque_id])
}
```

## Key Service Methods (`src/teacher/teacher.service.ts`)

| Method | Purpose |
|--------|---------|
| `findAll(campaignId)` | Teachers in campaign with role/permissions |
| `create(dto, campaignId)` | Create + assign to campaign + default role |
| `findOne(id, campaign_id)` | Teacher with group/role details |
| `findInfo(id, campaign_id)` | Full mobile info with group/students |
| `update(id, dto)` | Update + replace roles |
| `delete(id)` | Remove teacher |
| `listUnassigned(campaignId)` | Teachers without groups |
