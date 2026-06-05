# Data Model & Relationships

## Entity Relationship Diagram

```
Organization (1) ──→ (N) Mosque (1) ──→ (N) Campaign
     │                      │                    │
     │                      │                    ├── (N) StudentCampaign
     │                      │                    ├── (N) TeacherCampaign
     │                      │                    ├── (N) GroupCampaigns
     │                      │                    ├── (N) Attendance
     │                      │                    ├── (N) Evaluation
     │                      │                    ├── (N) Mistake
     │                      │                    └── (N) Log
     │                      │
     ├── (N) Curriculum     └── (N) Student
     └── (N) Category

Curriculum (1) ──→ (N) CurriculumTemplate (1) ──→ (N) CurriculumTemplateNode (1) ──→ (N) CurriculumLessonSession
Curriculum (N) ──→ (N) Category  (via CurriculumCategory)

Group (1) ──→ (N) StudentGroup (N) ──→ (1) Student
Group (1) ──→ (N) TeacherGroup (N) ──→ (1) Teacher
Group (1) ──→ (N) GroupCurriculum (N) ──→ (1) CurriculumTemplate
Group (N) ──→ (N) Campaign (via GroupCampaigns)

SavingSession (1) ──→ (N) SessionSurah (N) ──→ (N) MistakeInSession (N) ──→ (1) Mistake
SessionSurah (N) ──→ (1) SessionSurahTemplate
SavingSession (N) ──→ (1) Evaluation

Teacher (1) ──→ (N) TeacherRole (N) ──→ (1) AppRole
```

## Core Models

### Organization (Top-Level)
```prisma
model Organization {
  id            Int      @id @default(autoincrement())
  name          String
  description   String?
  contact_email String?
  contact_phone String?
  address       String?
  is_active     Boolean  @default(true)
  metadata      Json?
  // Relations
  mosques       Mosque[]
  managers      OrganizationManager[]
  Curriculum    Curriculum[]
  Category      Category[]
}
```

### Mosque
```prisma
model Mosque {
  id              Int      @id @default(autoincrement())
  organization_id Int
  name            String
  city            String?
  // ... contact/address fields
  // Relations
  organization    Organization @relation(fields: [organization_id], references: [id], onDelete: Cascade)
  managers        MosqueManager[]
  campaigns       Campaign[]
  students        Student[]
}
```

### Campaign
```prisma
model Campaign {
  id                      Int       @id @default(autoincrement())
  mosque_id               Int
  name                    String
  start_date              DateTime
  end_date                DateTime?
  assign_start_date       DateTime?
  assign_end_date         DateTime?
  days                    String?     // Comma-separated: "sun,mon,tue..."
  timing_approach         String      @default("hours")
  start_time              String?
  end_time                String?
  status                  Boolean     @default(false)
  // Relations to groups, students, teachers, attendance, evaluations, etc.
}
```

### Student
```prisma
model Student {
  id              Int      @id @default(autoincrement())
  mosque_id       Int?
  first_name      String?
  last_name       String?
  student_mobile  String   @unique
  password        String?
  father_name     String?
  mother_name     String?
  // ... extensive contact/address/health/education fields
  // Relations
  campaign_enrollments StudentCampaign[]
  groups               StudentGroup[]
  attendance           Attendance[]
  saving_sessions      SavingSession[]
  logs                 Log[]
}
```

### Teacher
```prisma
model Teacher {
  id                  Int       @id @default(autoincrement())
  mobile_phone_number String    @unique
  password            String
  role                Role      @default(TEACHER)
  first_name          String?
  last_name           String?
  // ... education/address fields
  // Relations
  organization_management OrganizationManager[]
  mosque_management       MosqueManager[]
  campaign_assignments    TeacherCampaign[]
  groups                  TeacherGroup[]
  saving_sessions         SavingSession[]
  teacher_roles           TeacherRole[]
  logs                    Log[]
  CurriculumLessonSession CurriculumLessonSession[]
}
```

### Group
```prisma
model Group {
  id                 Int      @id @default(autoincrement())
  mosque_id          Int?
  title              String
  class              Int?
  current_teacher_id Int?
  // Relations
  students StudentGroup[]
  teachers TeacherGroup[]
  campaigns GroupCampaigns[]
  attendance Attendance[]
  CurriculumLessonSession CurriculumLessonSession[]
  GroupCurriculum GroupCurriculum[]
  logs Log[]
}
```

### Attendance
```prisma
model Attendance {
  id          Int      @id @default(autoincrement())
  student_id  Int
  group_id    Int
  campaign_id Int
  taken_date  DateTime @default(now())
  delay_time  Int
  status      String   // ATTEND | MISSED | DELAY | NOT_TAKEN
}
```

### Curriculum Hierarchy
```prisma
model Curriculum {
  id              Int      @id @default(autoincrement())
  organization_id Int?
  name            String
  description     String?
  categories      CurriculumCategory[]
  templates       CurriculumTemplate[]
}

model CurriculumTemplate {
  id            Int      @id @default(autoincrement())
  curriculum_id Int      // Which curriculum this implements
  campaign_id   Int      // Which campaign this is for
  name          String?
  notes         String?
  nodes         CurriculumTemplateNode[]
  group_curricula GroupCurriculum[]
  @@unique([curriculum_id, campaign_id])
}

model CurriculumTemplateNode {
  id                         Int      @id @default(autoincrement())
  template_id                Int
  parent_id                  Int?     // Self-referential hierarchy
  name                       String
  node_type                  String?
  order_index                Int
  lesson_span                Int?     // Expected lesson count
  status                     NodeStatus @default(PLANNED)
  // Relations
  parent           CurriculumTemplateNode? @relation("NodeHierarchy")
  children         CurriculumTemplateNode[] @relation("NodeHierarchy")
  lesson_sessions  CurriculumLessonSession[]
}

model CurriculumLessonSession {
  id                      Int       @id @default(autoincrement())
  node_id                 Int
  group_id                Int
  teacher_id              Int
  campaign_id             Int
  session_number          Int
  date                    DateTime?
  is_finished             Boolean   @default(false)
  duration_minutes        Int?
  is_late                 Boolean   @default(false)
  @@unique([node_id, group_id, session_number])
}
```

### Saving Session & Evaluation
```prisma
model Evaluation {
  id            Int    @id @default(autoincrement())
  title         String
  points        Int
  minimum_marks Int
  campaign_id   Int
  sessions       SavingSession[]
  session_surahs SessionSurah[]
}

model SavingSession {
  id               Int      @id @default(autoincrement())
  teacher_id       Int
  student_id       Int
  campaign_id      Int
  evaluation_id    Int?
  start            Int      // Start page
  end              Int      // End page
  rating           Int
  duration         Int
  totalScore       Float?
  maxPossibleScore Float?
  session_surahs   SessionSurah[]
}

model SessionSurah {
  id                Int      @id @default(autoincrement())
  saving_session_id Int
  template_id       Int
  evaluation_id     Int
  isPassed          Boolean?
  score             Int?
  rawScore          Int?     // 100 - Σ(mistake.reduced_marks)
  weightedScore     Float?   // rawScore * template.weight
  isCompleted       Boolean  @default(false)
  mistakes          MistakeInSession[]
}

model Mistake {
  id            Int    @id @default(autoincrement())
  campaign_id   Int
  title         String
  reduced_marks Int
  mistakes      MistakeInSession[]
}
```

### RBAC

```prisma
model AppRole {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  permissions Json     // Array of Permission enum values
  campaign_id Int
  teacher_roles TeacherRole[]
}

model TeacherRole {
  id          Int      @id @default(autoincrement())
  teacher_id  Int
  group_id    Int?
  campaign_id Int
  role_id     Int
  @@unique([teacher_id, group_id, campaign_id, role_id])
}
```

### Log (Audit Trail)
```prisma
model Log {
  id          Int      @id @default(autoincrement())
  event       LogEvent
  timestamp   DateTime @default(now())
  teacher_id  Int?
  student_id  Int?
  group_id    Int?
  campaign_id Int
  notes       String?
  metadata    Json?
}
```

## Enums

| Enum | Values |
|------|--------|
| `Role` | TEACHER, MANAGER, ADMIN, SUPER_ADMIN, MANAGER_ASSISTANT, AUDIBLE, AUDIBLE_ASSISTANT, ORGANIZATION_ADMIN, MOSQUE_ADMIN |
| `Permission` | STUDENT_MANAGEMENT, TEACHER_MANAGEMENT, ROLES_MANAGEMENT, SAVING_SESSION_MANAGEMENT, ATTENDANCE_MANAGEMENT, CURRICULUM_MANAGEMENT, SETTINGS_MANAGEMENT, POINTS_MANAGEMENT, AWARDS_MANAGEMENT |
| `LogEvent` | TEACHER_LOGIN, STUDENT_LOGIN, SAVING_SESSION_CREATED, CURRICULUM_STARTED, CURRICULUM_END, ATTENDANCE_MARKED, MISTAKE_ASSERTED, EVALUATION_ASSERTED, ROLE_ASSIGNED, CAMPAIGN_CREATED |
| `NodeStatus` | PLANNED, IN_PROGRESS, COMPLETED, LATE, SKIPPED, CANCELLED |
| `STATUS` | ALIVE, DEAD, MISSED |
| `MARITAL` | MARRIED, SEPARATED, DIVORCED |

## Key Junction Tables

| Table | Purpose | Composite Key |
|-------|---------|---------------|
| `OrganizationManager` | Teacher manages organization | `[teacher_id, organization_id]` |
| `MosqueManager` | Teacher manages mosque | `[teacher_id, mosque_id]` |
| `StudentCampaign` | Student enrolled in campaign | `[student_id, campaign_id]` |
| `TeacherCampaign` | Teacher assigned to campaign | `[teacher_id, campaign_id]` |
| `GroupCampaigns` | Group associated with campaign | `[group_id, campaign_id]` |
| `StudentGroup` | Student in group + campaign | `[student_id, group_id, campaign_id]` |
| `TeacherGroup` | Teacher assigned to group + campaign | `[teacher_id, group_id, campaign_id]` |
| `CurriculumCategory` | Curriculum-category many-to-many | `[curriculum_id, category_id]` |
| `GroupCurriculum` | Template assigned to group | `[group_id, template_id, campaign_id]` |
