# Campaign Management Workflow

## Overview

Campaigns are the central organizing entity. Everything — groups, students, teachers, attendance, evaluations, curriculum — operates within a campaign context.

## Data Model

```prisma
model Campaign {
  id                      Int       @id @default(autoincrement())
  mosque_id               Int
  name                    String
  start_date              DateTime  @default(now())
  end_date                DateTime?
  assign_start_date       DateTime?
  assign_end_date         DateTime?
  is_campaign_continuous  Boolean   @default(false)
  limited_students_count  Boolean?
  students_count          Int?
  assign_by_link          Boolean?
  complete_count_approach String    @default("UNLIMIT_ASSIGN")
  days                    String?       // Comma-separated: "sun,mon,tue,wed,thu"
  timing_approach         String    @default("hours")
  start_time              String?
  status                  Boolean   @default(false)
  end_time                String?
  metadata                Json?
  
  // Relations
  mosque           Mosque            @relation
  groups           GroupCampaigns[]
  student_enrollments StudentCampaign[]
  teacher_assignments TeacherCampaign[]
  attendance       Attendance[]
  saving_sessions  SavingSession[]
  mistakes         Mistake[]
  evaluations      Evaluation[]
  teacher_roles    TeacherRole[]
  AppRole          AppRole[]
  CurriculumTemplate CurriculumTemplate[]
  CurriculumLessonSession CurriculumLessonSession[]
  GroupCurriculum  GroupCurriculum[]
  logs             Log[]
}
```

## Campaign Lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Create  │───▶│  Assign  │───▶│  Active  │───▶│  End     │
│ Campaign │    │ Teachers │    │ (status  │    │ (closed) │
│          │    │ & Groups │    │  = true) │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                    │
                                    ├── Attendance Tracking
                                    ├── Lesson Sessions
                                    ├── Saving Sessions
                                    └── Evaluations
```

## Endpoints

### GET `/campaigns`
List all campaigns (optionally filtered by mosque)

**Headers**: `mosque_id` (optional)

**Response**: `{ message: "All campaigns", data: Campaign[] }`

**Service**: `campaign.service.ts:findAll()`

---

### POST `/campaigns`
Create a new campaign

**Body** (`CreateCampaignDto`):
```typescript
{
  mosque_id: number;
  name: string;
  start_date: Date;
  end_date?: Date;
  assign_start_date?: Date;
  assign_end_date?: Date;
  is_campaign_continuous?: boolean;
  limited_students_count?: boolean;
  students_count?: number;
  assign_by_link?: boolean;
  complete_count_approach?: string;
  days?: string;     // "sun,mon,tue,wed,thu"
  timing_approach?: string;
  start_time?: string;
  status?: boolean;
  end_time?: string;
  metadata?: any;
}
```

**Response**: `{ message: "Campaign created", data: Campaign }`

**Service**: `campaign.service.ts:create()`

---

### GET `/campaigns/my-campaigns` (Protected)
Get campaigns for authenticated teacher

**Headers**: `Authorization: Bearer <token>`, `mosque_id` (optional for ORG_ADMIN)

**Logic**:
- `ORGANIZATION_ADMIN` → All campaigns for specified mosque
- Other roles → Campaigns where teacher is assigned via `TeacherCampaign`

**Response**: `Campaign[]` (with `id, days, name, mosque`)

**Service**: `campaign.service.ts:findByTeacherId()`

---

### GET `/campaigns/:id`
Get campaign by ID

**Response**: `Campaign`

**Service**: `campaign.service.ts:findOne()`

---

### PUT `/campaigns/:id`
Update campaign

**Body**: `UpdateCampaignDto`

**Response**: `{ message, data: Campaign }`

**Service**: `campaign.service.ts:update()`

---

### DELETE `/campaigns/:id`
Delete campaign (cascades to all related data)

**Response**: `{ message: "Campaign {id} deleted" }`

**Service**: `campaign.service.ts:delete()`

## Campaign Context Pattern

Most operations require a campaign context via headers:

```typescript
// Examples across modules:
@Headers('campaign_id') campaignId: number    // attendance, groups, logs, students, teachers
@Headers('mosque_id') mosqueId?: string        // campaigns, mosques
@Headers('organization_id') orgId?: string     // mosques
```

## Related Module Integrations

| Module | Integration |
|--------|-------------|
| **Group** | Groups created within campaigns via `GroupCampaigns` junction |
| **Student** | Students enrolled via `StudentCampaign` |
| **Teacher** | Teachers assigned via `TeacherCampaign` |
| **Attendance** | Campaign defines schedule (days, times) for auto-generation |
| **Curriculum** | Templates created per campaign |
| **Evaluation** | Evaluation criteria per campaign |
| **Mistake** | Mistake catalog per campaign |
| **Log** | All logs scoped to campaign |

## Key Service Methods (`src/campaign/campaign.service.ts`)

| Method | Purpose |
|--------|---------|
| `findAll(mosqueId?)` | Campaigns by mosque, or all |
| `create(dto)` | Create with all campaign config |
| `findOne(id)` | Unique lookup |
| `update(id, dto)` | Update campaign settings |
| `delete(id)` | Remove campaign (cascade) |
| `findByTeacherId(teacherId, role, mosqueId?)` | Role-aware campaign listing |
| `findByStudent(studentId)` | Campaigns where student is enrolled |
