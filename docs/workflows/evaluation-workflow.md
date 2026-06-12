# Evaluation & Recitation Sessions Workflow

## Overview

The evaluation system tracks student memorization (recitation) sessions with **dynamic portion splitting**. Pages are evaluated one-by-one against an evaluation's `minimum_marks` threshold, and the session stops when a page fails.

---

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Evaluation   │     │  Mistake     │     │ SessionSurahTemp.│
│  (Criteria)   │     │  (Catalog)   │     │ (Quran pages)    │
│  title        │     │  title       │     │ surahNumber      │
│  points       │     │  reduced_    │     │ pageNumber       │
│  minimum_marks│     │  marks       │     │ weight           │
│  is_passed    │     │  campaign_id │     │                  │
│  campaign_id  │     └──────┬───────┘     └────────┬─────────┘
└──────┬───────┘            │                       │
       │                    │                       │
       └──────┬─────────────┴───────────┬───────────┘
              │                         │
     ┌────────▼────────┐      ┌─────────▼─────────┐
     │ RecitationSession │      │  SessionPortion    │
     │  teacher_id       │      │  session_id        │
     │  student_id       │      │  portion_type      │
     │  campaign_id      │      │  start_page        │
     │  evaluation_id    │      │  end_page          │
     │  rating           │      │  portion_score     │
     │  duration         │      │  status (PASS/FAIL)│
     │  total_score      │      │  evaluation_id     │
     │  status (PASS/FAIL│      │  errors[]          │
     │   /PARTIAL)       │      └────────┬───────────┘
     │  notes            │               │
     └────────┬──────────┘     ┌─────────▼──────────┐
              │               │  SessionError       │
              └───────────────│  portion_id         │
                              │  mistake_id         │
                              │  page_number        │
                              └─────────────────────┘
```

---

## Data Model

### Evaluation

```prisma
model Evaluation {
  id            Int    @id @default(autoincrement())
  title         String
  points        Int
  minimum_marks Int      // Minimum score to pass a portion
  is_passed     Boolean  @default(true) // Admin classification
  campaign_id   Int
  sessions       RecitationSession[]
  portions       SessionPortion[]
}
```

### Mistake (Unchanged)

```prisma
model Mistake {
  id            Int    @id @default(autoincrement())
  campaign_id   Int
  title         String    // e.g., "Mistake in elongation"
  reduced_marks Int       // Points deducted when this error occurs
  errors        SessionError[]
}
```

### RecitationSession (Replaces SavingSession)

```prisma
model RecitationSession {
  id            Int           @id @default(autoincrement())
  teacher_id    Int
  student_id    Int
  campaign_id   Int
  evaluation_id Int?
  rating        Int
  duration      Int
  total_score   Float?
  status        SessionStatus  // PASSED / FAILED / PARTIALLY_PASSED
  notes         String?
  created_at    DateTime       @default(now())
  portions      SessionPortion[]
}
```

### SessionPortion (Replaces SessionSurah)

```prisma
model SessionPortion {
  id            Int           @id @default(autoincrement())
  session_id    Int
  portion_type  PortionType   // FULL_PAGE / HALF_PAGE / SURAH
  surah_id      Int?          // FK to SessionSurahTemplate
  start_page    Int
  end_page      Int
  portion_score Float?        // 100 - Σ(deductions for this page)
  status        PortionStatus // PASSED / FAILED
  evaluation_id Int?
  notes         String?
  created_at    DateTime      @default(now())
  errors        SessionError[]
}
```

### SessionError (Replaces MistakeInSession)

```prisma
model SessionError {
  id          Int      @id @default(autoincrement())
  portion_id  Int
  mistake_id  Int
  page_number Int    // Which page the error occurred on
  created_at  DateTime @default(now())
}
```

### SessionSurahTemplate (Unchanged — Quran Metadata)

```prisma
model SessionSurahTemplate {
  id          Int    @id @default(autoincrement())
  surahNumber Int
  surahName   String
  pageNumber  Int
  startLine   Int?
  endLine     Int?
  weight      Float
}
```

---

## Scoring Logic

### Per-Page Score

```
page_score = max(0, 100 - SUM(mistake.reduced_marks on this page))
```

### Pass/Fail Decision

| Condition | Result |
|-----------|--------|
| `page_score >= evaluation.minimum_marks` | Portion = **PASSED** → Continue |
| `page_score < evaluation.minimum_marks` | Portion = **FAILED** → Stop session |

### Total Session Score

```
total_score = max(0, 100 - SUM(all deductions across all pages))
```

### Session Status

| Condition | Status |
|-----------|--------|
| All portions PASSED | `PASSED` |
| Some PASSED + one FAILED (stopped mid-session) | `PARTIALLY_PASSED` |
| First page FAILED (no PASSED portions) | `FAILED` |

---

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
| `POST` | `/evaluations` | Create evaluation (title, points, minimum_marks, is_passed, campaign_id) |
| `POST` | `/evaluations/assert` | Bulk sync (update existing, create new, delete missing) |
| `GET` | `/evaluations` | List (headers: campaign_id) with usage flags |
| `GET` | `/evaluations/campaign/:campaignId` | By campaign |
| `GET` | `/evaluations/campaign/:campaignId/stats` | Usage statistics |
| `GET` | `/evaluations/:id` | By ID with usage count |
| `PUT` | `/evaluations/:id` | Update |
| `DELETE` | `/evaluations/:id` | Delete (blocked if in use) |

**Mistake Endpoints** (unchanged):

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

### 2. Recitation Session Creation (with Dynamic Splitting)

```
POST /saving-sessions  →  Create session — server dynamically splits pages into portions
```

**Request Body**:

```json
{
  "teacherId": 1,
  "studentId": 2,
  "campaign_id": 3,
  "evaluation_id": 1,
  "rating": 4,
  "duration": 1200,
  "notes": "جلسة اليوم جيدة",
  "pages": [
    { "page_number": 2, "mistake_ids": [1, 3] },
    { "page_number": 3, "mistake_ids": [] },
    { "page_number": 4, "mistake_ids": [5] }
  ]
}
```

**Processing Flow**:

1. Fetch Evaluation → get `minimum_marks` threshold
2. Create `RecitationSession` (basic info)
3. **For each page** (in order of `page_number`):
   - Fetch mistakes → sum `reduced_marks`
   - `portion_score = max(0, 100 - sum_deductions)`
   - If `portion_score >= evaluation.minimum_marks` → create PASSED portion
   - Else → create FAILED portion → **stop** (skip remaining pages)
4. Calculate `total_score = max(0, 100 - SUM(all deductions))`
5. Determine session `status` (PASSED / FAILED / PARTIALLY_PASSED)
6. Update session with final values
7. Create audit log

**Log Entry**: `تم إنشاء جلسة تسميع جديدة للطالب - التقييم: {title} - الحالة: {status}`

---

### 3. Quran Templates (SessionSurahTemplate — unchanged)

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

### 5. Getting Sessions

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/saving-sessions` | All sessions with full relations |
| `GET` | `/saving-sessions/filter` | Filtered sessions |
| `GET` | `/saving-sessions/:id` | By ID |
| `DELETE` | `/saving-sessions/:id` | Delete (cascades to portions, errors) |

---

## Key Design Changes

| What Changed | Old | New |
|-------------|-----|-----|
| Main table | `SavingSession` (start/end pages, maxPossibleScore) | `RecitationSession` (total_score, status, notes) |
| Sub-items | `SessionSurah` (template, weight, raw/weighted score) | `SessionPortion` (page range, portion_score, PASS/FAIL) |
| Errors | `MistakeInSession` → Mistake | `SessionError` → Mistake (adds page_number) |
| Evaluation | `minimum_marks` for per-surah pass | `minimum_marks` for **threshold**, `is_passed` for admin label |
| Splitting | Client submits pre-calculated scores | **Server** dynamically splits pages into portions |
| Session status | No status field | `PASSED` / `FAILED` / `PARTIALLY_PASSED` |
