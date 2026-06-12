# Saving Sessions API Reference

## Base URL

```
POST   /saving-sessions           → Create new recitation session (with dynamic splitting)
GET    /saving-sessions           → List all sessions
GET    /saving-sessions/filter    → Filter sessions
GET    /saving-sessions/:id       → Get session by ID
DELETE /saving-sessions/:id       → Delete session
```

---

## 1. Create Recitation Session

### `POST /saving-sessions`

Creates a session, dynamically splits pages into PASSED/FAILED portions based on error deductions vs evaluation threshold.

### Request Body

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
    {
      "page_number": 2,
      "mistake_ids": [1, 3]
    },
    {
      "page_number": 3,
      "mistake_ids": []
    },
    {
      "page_number": 4,
      "mistake_ids": [5]
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teacherId` | int | yes | Teacher conducting the session |
| `studentId` | int | yes | Student being tested |
| `campaign_id` | int | yes | Campaign the session belongs to |
| `evaluation_id` | int | yes | Evaluation criteria (provides `minimum_marks` pass threshold) |
| `rating` | int | yes | Teacher rating 1-5 |
| `duration` | int | yes | Session duration in seconds |
| `notes` | string | no | Free text notes |
| `pages` | array | yes | Ordered list of pages recited |

### Page Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `page_number` | int | yes | The Mushaf page number (1-604) |
| `mistake_ids` | int[] | yes | Array of Mistake IDs that occurred on this page (empty = no errors) |

### Server Logic (Dynamic Splitting)

1. Pages are processed **in order** by `page_number`
2. For each page: `portion_score = max(0, 100 - Σ(mistake.reduced_marks))`
3. If `portion_score >= evaluation.minimum_marks` → portion is **PASSED**
4. If `portion_score < evaluation.minimum_marks` → portion is **FAILED**, remaining pages are **SKIPPED** (session stops)
5. `total_score = max(0, 100 - SUM(all deductions across all pages))`

### Session Status Calculation

| Condition | Status |
|-----------|--------|
| All portions PASSED | `PASSED` |
| Some PASSED + one FAILED (stopped mid-session) | `PARTIALLY_PASSED` |
| First page FAILED (no portions passed) | `FAILED` |

### Response (201 Created)

```json
{
  "id": 1,
  "teacher_id": 1,
  "student_id": 2,
  "campaign_id": 3,
  "evaluation_id": 1,
  "rating": 4,
  "duration": 1200,
  "total_score": 85,
  "status": "PARTIALLY_PASSED",
  "notes": "جلسة اليوم جيدة",
  "created_at": "2026-06-12T10:30:00Z",
  "portions": [
    {
      "id": 1,
      "portion_type": "FULL_PAGE",
      "surah_id": null,
      "start_page": 2,
      "end_page": 2,
      "portion_score": 92,
      "status": "PASSED",
      "evaluation_id": 1,
      "notes": null,
      "errors": [
        {
          "id": 1,
          "mistake_id": 1,
          "page_number": 2,
          "created_at": "2026-06-12T10:30:00Z",
          "mistake": {
            "id": 1,
            "title": "خطأ في المد",
            "reduced_marks": 5
          }
        },
        {
          "id": 2,
          "mistake_id": 3,
          "page_number": 2,
          "created_at": "2026-06-12T10:30:00Z",
          "mistake": {
            "id": 3,
            "title": "خطأ في الإخفاء",
            "reduced_marks": 3
          }
        }
      ]
    },
    {
      "id": 2,
      "portion_type": "FULL_PAGE",
      "surah_id": null,
      "start_page": 3,
      "end_page": 3,
      "portion_score": 100,
      "status": "PASSED",
      "evaluation_id": 1,
      "notes": null,
      "errors": []
    },
    {
      "id": 3,
      "portion_type": "FULL_PAGE",
      "surah_id": null,
      "start_page": 4,
      "end_page": 4,
      "portion_score": 75,
      "status": "FAILED",
      "evaluation_id": 1,
      "notes": null,
      "errors": [
        {
          "id": 3,
          "mistake_id": 5,
          "page_number": 4,
          "created_at": "2026-06-12T10:30:00Z",
          "mistake": {
            "id": 5,
            "title": "خطأ في النبر",
            "reduced_marks": 25
          }
        }
      ]
    }
  ],
  "student": { "id": 2, "first_name": "خالد", "last_name": "الطالب" },
  "teacher": { "id": 1, "first_name": "أحمد", "last_name": "المعلم" },
  "campaign": { "id": 3, "name": "الفصل الدراسي الأول 1446" },
  "evaluation": {
    "id": 1,
    "title": "جيد جداً",
    "points": 10,
    "minimum_marks": 80
  }
}
```

---

## 2. List All Sessions

### `GET /saving-sessions`

Returns all recitation sessions with full nested relations.

**Response (200):** Array of session objects (same structure as create response).

---

## 3. Filter Sessions

### `GET /saving-sessions/filter`

**Query Parameters** (all optional):

| Parameter | Type | Description |
|-----------|------|-------------|
| `studentId` | int | Filter by student |
| `teacherId` | int | Filter by teacher |
| `campaignId` | int | Filter by campaign |
| `evaluationId` | int | Filter by evaluation |
| `mistakeId` | int | Find sessions containing a specific mistake |
| `dateFrom` | string (ISO) | Start date filter |
| `dateTo` | string (ISO) | End date filter |

**Response (200):** Array of filtered sessions with camelCase portions and errors.

---

## 4. Get Session By ID

### `GET /saving-sessions/:id`

**Response (200):** Full session object with nested portions, errors, and relations.

---

## 5. Delete Session

### `DELETE /saving-sessions/:id`

Cascades to all portions, errors, and related data.

**Response (200):** Deleted session object.
