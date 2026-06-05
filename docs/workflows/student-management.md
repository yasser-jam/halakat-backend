# Student Management Workflow

## Overview

Students have global profiles but are enrolled per-campaign and assigned to groups within campaigns.

## Data Model

```prisma
model Student {
  id              Int       @id @default(autoincrement())
  mosque_id       Int?          // Home mosque
  first_name      String?
  last_name       String?
  student_mobile  String    @unique   // Global unique identifier
  password        String?       // For student login
  birth_date      DateTime?
  educational_class Int?
  school          String?
  father_name     String?
  mother_name     String?
  // ... extensive contact fields (father/mother phones, addresses)
  // ... health, talent, preserved parts
  image_url       String?
  
  // Relations
  mosque               Mosque? @relation
  campaign_enrollments StudentCampaign[]
  groups               StudentGroup[]
  attendance           Attendance[]
  saving_sessions      SavingSession[]
  logs                 Log[]
}
```

## Student Lifecycle

```
┌──────────┐    ┌─────────────┐    ┌──────────┐    ┌───────────┐
│  Create  │───▶│  Enroll in  │───▶│  Assign  │───▶│  Track    │
│ Student  │    │  Campaign   │    │ to Group │    │ via       │
│          │    │             │    │          │    │ Attendance│
└──────────┘    └─────────────┘    └──────────┘    └───────────┘
                                                    │
                                                    ├── Saving Sessions
                                                    └── Reports
```

## Endpoints

### GET `/students/all`
Get all students (optionally filtered by mosque IDs)

**Query**: `mosqueIds` (comma-separated, optional)

**Response**:
```typescript
Student[]  // with mosque: { id, name }
```

**Service**: `student.service.ts:findAll()`

---

### POST `/students`
Create student and auto-enroll in campaign

**Headers**: `campaign_id` (required)

**Body** (`CreateStudentDto`):
```typescript
{
  student_mobile: string;    // Unique identifier
  first_name?: string;
  last_name?: string;
  birth_date?: Date;
  educational_class?: number;
  school?: string;
  father_name?: string;
  mother_name?: string;
  // ... all contact/parent fields
  image_url?: string;
  password?: string;
}
```

**Flow**: Create student → Create `StudentCampaign` enrollment → Return

**Response**: `{ message: "Student created and assigned to campaign", data: Student }`

**Service**: `student.service.ts:create()`

---

### GET `/students`
List students enrolled in a campaign

**Headers**: `campaign_id` (required)

**Response**:
```typescript
Student[]  // each with group_title (the group they're assigned to in this campaign)
```

**Logic**: Find students where `campaign_enrollments` has matching `campaign_id`

**Service**: `student.service.ts:findAllCampaign()`

---

### GET `/students/unassigned`
List unassigned students in a campaign

**Headers**: `campaign_id` (required)

**Response**: `{ message, data: Student[] }`

**Logic**: All students minus students who have a `StudentGroup` for this campaign

**Service**: `student.service.ts:listUnassigned()`

---

### GET `/students/:id`
Get student by ID

**Response**: `Student`

**Service**: `student.service.ts:findOne()`

---

### PUT `/students/:id`
Update student

**Body**: `UpdateStudentDto`

**Response**: `{ message, data: Student }`

**Service**: `student.service.ts:update()`

---

### DELETE `/students/:id`
Delete student (cascades to enrollments, attendance, sessions)

**Response**: `{ message: "Student {id} deleted" }`

**Service**: `student.service.ts:delete()`

## Assignment to Groups

Students are assigned to groups via `GET /groups/assign/:groupId/:studentId` (see [Group Workflow](campaign-management.md)), which:
1. Verifies group, student, campaign exist
2. Creates attendance records for all scheduled campaign days (auto-generated)
3. Creates `StudentGroup` junction record

## Key Integration Points

| Module | Relationship |
|--------|-------------|
| **Group** | Student assigned via `StudentGroup` (student + group + campaign) |
| **Attendance** | Auto-generated when assigned to group, tracked daily |
| **SavingSession** | Student's memorization test sessions |
| **Campaign** | Enrolled via `StudentCampaign` |
| **Log** | Student referenced in log entries |

## Key Service Methods (`src/student/student.service.ts`)

| Method | Purpose |
|--------|---------|
| `findAll(filters?)` | All students with optional mosque filter |
| `findAllCampaign(campaignId)` | Students in campaign with group info |
| `create(dto, campaignId)` | Create + enroll in campaign |
| `findOne(id)` | By ID |
| `update(id, dto)` | Update profile |
| `delete(id)` | Remove student |
| `listUnassigned(campaignId)` | Students without group in campaign |
