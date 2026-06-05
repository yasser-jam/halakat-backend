# Evaluation & Saving Sessions Workflow

## Overview

The evaluation system tracks student memorization (saving) sessions, with configurable evaluation criteria, surah templates, and mistake tracking with score calculation.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Evaluation   │     │  Mistake     │     │ SessionSurahTemp.│
│  (Criteria)   │     │  (Catalog)   │     │ (Quran pages)    │
│  title        │     │  title       │     │ surahNumber      │
│  points       │     │  reduced_    │     │ pageNumber       │
│  minimum_marks│     │  marks       │     │ weight           │
│  campaign_id  │     │  campaign_id │     │                  │
└──────┬───────┘     └──────┬───────┘     └────────┬─────────┘
       │                    │                       │
       └──────┬─────────────┴───────────┬───────────┘
              │                         │
     ┌────────▼────────┐     ┌──────────▼──────────┐
     │  SavingSession   │     │  SessionSurah        │
     │  teacher_id      │     │  saving_session_id   │
     │  student_id      │     │  template_id          │
     │  campaign_id     │     │  evaluation_id        │
     │  evaluation_id   │     │  isPassed             │
     │  start / end     │     │  rawScore (100 - Σ)   │
     │  rating          │     │  weightedScore        │
     │  duration        │     │  isCompleted          │
     │  totalScore      │     │  mistakes[]           │
     │  maxPossibleScore│     │                       │
     └────────┬────────┘     └──────────┬──────────────┘
              │                         │
              │              ┌──────────▼──────────┐
              │              │  MistakeInSession    │
              │              │  session_surah_id    │
              └──────────────│  mistake_id          │
                             └─────────────────────┘
```

## Data Model

```prisma
model Evaluation {
  id            Int    @id @default(autoincrement())
  title         String
  points        Int
  minimum_marks Int      // Minimum score to pass
  campaign_id   Int
  sessions       SavingSession[]
  session_surahs SessionSurah[]
}

model Mistake {
  id            Int    @id @default(autoincrement())
  campaign_id   Int
  title         String    // e.g., "Mistake in elongation"
  reduced_marks Int       // Points deducted
  mistakes      MistakeInSession[]
}

model SessionSurahTemplate {
  id          Int    @id @default(autoincrement())
  surahNumber Int
  surahName   String     // Arabic name
  pageNumber  Int
  startLine   Int?
  endLine     Int?
  weight      Float      // 1.0 = full page, < 1.0 = partial
  @@unique([surahNumber, pageNumber])
}

model SavingSession {
  id               Int      @id @default(autoincrement())
  teacher_id       Int
  student_id       Int
  campaign_id      Int
  evaluation_id    Int?
  start            Int         // Start page
  end              Int         // End page
  rating           Int
  duration         Int         // Minutes
  totalScore       Float?
  maxPossibleScore Float?
  created_at       DateTime @default(now())
  session_surahs   SessionSurah[]
}

model SessionSurah {
  id                Int      @id @default(autoincrement())
  saving_session_id Int
  template_id       Int
  evaluation_id     Int
  isPassed          Boolean?
  score             Int?
  rawScore          Int?        // 100 - Σ(mistake.reduced_marks), min 0
  weightedScore     Float?      // rawScore * template.weight
  isCompleted       Boolean     @default(false)
  notes             String?
  mistakes          MistakeInSession[]
}

model MistakeInSession {
  id               Int @id @default(autoincrement())
  session_surah_id Int
  mistake_id       Int
}
```

## Workflows

### 1. Evaluation & Mistake Configuration (per campaign)

```
POST /evaluations         →  Create evaluation criteria
POST /mistakes            →  Create mistake catalog
POST /evaluations/assert  →  Sync evaluations (bulk update/create/delete)
POST /mistakes/assert     →  Sync mistakes (bulk update/create/delete)
```

**Evaluation Endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/evaluations` | Create evaluation (title, points, minimum_marks, campaign_id) |
| `POST` | `/evaluations/assert` | Bulk sync (update existing, create new, delete missing) |
| `GET` | `/evaluations` | List (headers: campaign_id) with usage flags |
| `GET` | `/evaluations/campaign/:campaignId` | By campaign |
| `GET` | `/evaluations/campaign/:campaignId/stats` | Usage statistics |
| `GET` | `/evaluations/:id` | By ID with usage count |
| `PUT` | `/evaluations/:id` | Update |
| `DELETE` | `/evaluations/:id` | Delete (blocked if in use) |

**Mistake Endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/mistakes` | Create (campaign_id, title, reduced_marks) |
| `POST` | `/mistakes/assert` | Bulk sync |
| `GET` | `/mistakes` | List (headers: campaign_id) with usage flags |
| `GET` | `/mistakes/campaign/:campaignId` | By campaign |
| `GET` | `/mistakes/:id` | By ID |
| `PUT` | `/mistakes/:id` | Update |
| `DELETE` | `/mistakes/:id` | Delete |

---

### 2. Saving Session Creation

```
POST /saving-sessions  →  Create session with surahs and mistakes
```

**Request Body** (`CreateSavingSessionDto`):
```typescript
{
  teacherId: number;
  studentId: number;
  campaign_id: number;
  evaluation_id?: number;
  start: number;       // Start page
  end: number;         // End page
  rating: number;
  duration: number;
  totalScore?: number;
  maxPossibleScore?: number;
  sessionSurahs: {
    templateId: number;
    evaluationId: number;
    isPassed?: boolean;
    score?: number;
    rawScore?: number;        // 100 - sum of mistake deductions
    weightedScore?: number;   // rawScore * template.weight
    isCompleted?: boolean;
    notes?: string;
    mistakes?: { mistakeId: number }[];
  }[];
}
```

**Flow**:
1. Create `SavingSession` with basic data
2. Create nested `SessionSurah` records with templates
3. Create nested `MistakeInSession` for each surah
4. Create activity log entry

**Log Entry**: `تم إنشاء جلسة تسميع جديدة للطالب من الصفحة {start} إلى {end}`

**Response**: Full session with nested surahs, templates, evaluations, mistakes

---

### 3. Session Surah Management

After a session is created, individual surahs can be managed:

**Session Surah Endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/session-surahs/session/:sessionId` | Get surahs for a session |
| `PUT` | `/session-surahs/:id` | Update surah (isPassed, score, notes) |
| `POST` | `/session-surahs/:id/mistakes` | Add mistake to surah |
| `DELETE` | `/session-surahs/:id/mistakes/:mistakeId` | Remove mistake from surah |
| `GET` | `/session-surahs/stats/:sessionId` | Session statistics |

**Surah Template Endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/session-surahs/templates` | All templates |
| `GET` | `/session-surahs/templates/surah/:surahNumber` | By surah number |
| `GET` | `/session-surahs/templates/pages?startPage=&endPage=` | By page range |
| `GET` | `/session-surahs/surahs` | List all surahs (distinct) |

---

### 4. Session Filtering

```
GET /saving-sessions/filter?studentId=&teacherId=&campaignId=&evaluationId=&dateFrom=&dateTo=&mistakeId=
```

**Filters**: All optional, can be combined:
- `studentId` — Filter by student
- `teacherId` — Filter by teacher
- `campaignId` — Filter by campaign
- `evaluationId` — Filter by evaluation
- `mistakeId` — Find sessions containing a specific mistake
- `dateFrom` / `dateTo` — Date range

---

### 5. Score Calculation

```
rawScore = 100 - Σ(mistake.reduced_marks)   // minimum 0
weightedScore = rawScore * template.weight   // template.weight ≤ 1.0
```

**Pass/Fail**: A surah passes if `score >= evaluation.minimum_marks`

**Session Stats** (`GET /session-surahs/stats/:sessionId`):
```typescript
{
  totalSurahs: number;
  passedSurahs: number;
  failedSurahs: number;
  totalMistakes: number;
  averageScore: number;
  passRate: number;    // percentage
}
```

## Audit Integration

```typescript
// In saving-session.service.ts:createSavingSession()
await this.logService.create({
  event: 'SAVING_SESSION_CREATED',
  teacher_id: teacherId,
  student_id: studentId,
  notes: `تم إنشاء جلسة تسميع جديدة للطالب من الصفحة ${start} إلى ${end}`,
  metadata: { saving_session_id: session.id }
}, campaign_id);
```

## Getting Sessions

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/saving-sessions` | All sessions with full relations |
| `GET` | `/saving-sessions/filter` | Filtered sessions (key filters) |
| `GET` | `/saving-sessions/:id` | By ID |
| `DELETE` | `/saving-sessions/:id` | Delete (cascades to surahs, mistakes) |

## Key Service Methods

### EvaluationService (`src/evaluation/evaluation.service.ts`)

| Method | Purpose |
|--------|---------|
| `create(dto)` | Create evaluation |
| `assert(campaignId, evaluations[])` | Sync: create/update/delete with usage check |
| `findAll(campaignId)` | List with usage flags |
| `findByCampaign(campaignId)` | Raw list |
| `getEvaluationStats(campaignId)` | Usage statistics |
| `findById(id)` | By ID with usage |
| `update(id, dto)` | Update |
| `delete(id)` | Delete (blocked if in use) |

### SavingSessionService (`src/saving-session/saving-session.service.ts`)

| Method | Purpose |
|--------|---------|
| `createSavingSession(dto)` | Create with nested surahs + mistakes + log |
| `getAll()` | All with full relations |
| `getById(id)` | By ID |
| `filter(dto)` | Filtered search |
| `remove(id)` | Delete session |

### SessionSurahService (`src/session-surah/session-surah.service.ts`)

| Method | Purpose |
|--------|---------|
| `getTemplates()` | All surah templates |
| `getTemplatesBySurah(surahNumber)` | By surah |
| `getTemplatesByPageRange(start, end)` | By page range |
| `getSessionSurahsBySession(sessionId)` | Surahs for session |
| `updateSessionSurah(id, data)` | Update score/pass |
| `addMistakeToSessionSurah(...)` | Add mistake |
| `removeMistakeFromSessionSurah(...)` | Remove mistake |
| `getSessionSurahStats(sessionId)` | Statistics |
| `getSurahsList()` | Distinct surah list |

### MistakeService (`src/mistake/mistake.service.ts`)

| Method | Purpose |
|--------|---------|
| `create(dto)` | Create mistake |
| `assertCampaignMistakes(campaignId, mistakes[])` | Sync batch |
| `findAll(campaignId)` | List with usage |
| `findByCampaign(campaignId)` | Raw list |
| `findOne(params)` | By ID |
| `update(params, dto)` | Update |
| `delete(params)` | Delete |
