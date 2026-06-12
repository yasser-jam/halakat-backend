# Saving Sessions Workflow & Architecture

## Overview

The Saving Session module tracks student Quran memorization (recitation) sessions with **dynamic portion splitting** — pages are evaluated one by one, and the session stops when a page fails to meet the minimum score threshold.

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

### Evaluation (Existing — used as pass threshold)

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | PK |
| `title` | string | Arabic evaluation title (e.g. "ممتاز", "جيد جداً") |
| `points` | int | Points awarded for this grade |
| `minimum_marks` | int | **Minimum score needed to pass a portion** (e.g. 80) |
| `is_passed` | boolean | Admin classification: is this a passing grade? (default: true) |
| `campaign_id` | int | FK to Campaign |

### Mistake (Existing — unchanged)

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | PK |
| `campaign_id` | int | FK to Campaign |
| `title` | string | Error description (e.g. "خطأ في المد") |
| `reduced_marks` | int | Points deducted when this mistake occurs |

### RecitationSession (Replaces SavingSession)

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | PK |
| `teacher_id` | int | FK to Teacher |
| `student_id` | int | FK to Student |
| `campaign_id` | int | FK to Campaign |
| `evaluation_id` | int? | FK to Evaluation (the pass threshold used) |
| `rating` | int | Teacher rating 1-5 |
| `duration` | int | Duration in seconds |
| `total_score` | float? | Final score = max(0, 100 - SUM(all deductions)) |
| `status` | enum | `PASSED` / `FAILED` / `PARTIALLY_PASSED` |
| `notes` | string? | Free text notes |
| `created_at` | datetime | Auto-generated |

### SessionPortion (Replaces SessionSurah)

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | PK |
| `session_id` | int | FK to RecitationSession |
| `portion_type` | enum | `FULL_PAGE` / `HALF_PAGE` / `SURAH` |
| `surah_id` | int? | FK to SessionSurahTemplate (for SURAH type) |
| `start_page` | int | First page of this portion |
| `end_page` | int | Last page of this portion |
| `portion_score` | float? | Score for this portion = max(0, 100 - Σ deductions on this page) |
| `status` | enum | `PASSED` / `FAILED` |
| `evaluation_id` | int? | FK to Evaluation (optional label) |
| `notes` | string? | Free text notes |

### SessionError (Replaces MistakeInSession)

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | PK |
| `portion_id` | int | FK to SessionPortion |
| `mistake_id` | int | FK to Mistake |
| `page_number` | int | Which page the error occurred on (for granularity) |
| `created_at` | datetime | Auto-generated |

---

## Scoring Logic

### Per-Page Score

```
page_score = max(0, 100 - SUM(mistake.reduced_marks for errors on this page))
```

### Pass/Fail Decision

```
page_score >= evaluation.minimum_marks  →  PASSED
page_score <  evaluation.minimum_marks  →  FAILED  (session stops)
```

### Total Session Score

```
total_score = max(0, 100 - SUM(all mistake.reduced_marks across all pages))
```

### Session Status

| Condition | Status |
|-----------|--------|
| All portions PASSED | `PASSED` |
| Some PASSED, then a FAILED occurred (session stopped) | `PARTIALLY_PASSED` |
| First portion FAILED (no PASSED portions) | `FAILED` |

---

## Workflow: Create Session

```
Mobile App                          Backend
    │                                  │
    │  POST /saving-sessions           │
    │  {                               │
    │    teacherId, studentId,         │
    │    campaign_id, evaluation_id,   │
    │    rating, duration,             │
    │    pages: [                      │
    │      { page_number, mistake_ids } │
    │    ]                             │
    │  }                               │
    │─────────────────────────────────>│
    │                                  │
    │                    ┌─────────────┴──────────┐
    │                    │ 1. Validate evaluation │
    │                    │ 2. Create session      │
    │                    │ 3. Loop pages order:   │
    │                    │    a. Sum deductions   │
    │                    │    b. Calc page_score  │
    │                    │    c. Create portion   │
    │                    │    d. If fail → STOP   │
    │                    │ 4. Calc total_score    │
    │                    │ 5. Set session status  │
    │                    │ 6. Update session      │
    │                    │ 7. Create log          │
    │                    └─────────────┬──────────┘
    │                                  │
    │  Response: session with portions │
    │  and nested errors + mistakes    │
    │<─────────────────────────────────│
```

---

## Key Design Decisions

### 1. Dynamic Splitting

Instead of the mobile app pre-calculating scores, the **server** processes pages in order and creates portions. This guarantees the splitting logic is consistent and can be updated without mobile app changes.

### 2. Evaluation.minimum_marks as Threshold

The `evaluation_id` on the session determines the pass threshold. The selected evaluation's `minimum_marks` value is compared against each page's score. This allows admins to define multiple evaluation levels (excellent, good, acceptable, poor) with different thresholds.

### 3. Large Deductions Replace Fatal Errors

Instead of a special `is_fatal` flag, admins can create a mistake with a high `reduced_marks` value (e.g. 100) that instantly drops the page score below any threshold, effectively ending the session.

### 4. Page Number on SessionError

Each error records the `page_number` where it occurred, enabling:
- Per-page error heatmaps
- Analytics on which pages students struggle with most
- Detailed session reports

---

## Analytical Queries

### Student Progress Tracking

Sum of pages from `SessionPortion` where `status = 'PASSED'` grouped by `student_id`.

### Error Heatmap

Count of `mistake_id` grouped by `page_number` to detect weak points in student memorization.

### Session Success Rate

Count of sessions grouped by `status` (`PASSED` / `FAILED` / `PARTIALLY_PASSED`) per campaign.

---

## Audit Log

On session creation, a log entry is created:

```json
{
  "event": "SAVING_SESSION_CREATED",
  "teacher_id": 1,
  "student_id": 2,
  "notes": "تم إنشاء جلسة تسميع جديدة للطالب - التقييم: جيد جداً - الحالة: PARTIALLY_PASSED",
  "metadata": {
    "recitation_session_id": 1,
    "total_score": 85,
    "status": "PARTIALLY_PASSED"
  }
}
```
