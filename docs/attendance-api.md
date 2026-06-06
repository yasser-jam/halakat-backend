# Attendance API

## POST /attendance

Create or update a single attendance record (upsert).

If a record already exists for the same **student + campaign + day**, it will be updated. Otherwise, a new record is created.

### Auth

Requires `Bearer access-token` with teacher role.

### Request Body

```json
{
  "student_id": 1,
  "group_id": 1,
  "campaign_id": 1,
  "taken_date": "2025-12-14T08:00:00.000Z",
  "status": "attend",
  "duration": 60
}
```

### Fields

| Field         | Type   | Required | Description                                     |
|---------------|--------|----------|-------------------------------------------------|
| student_id    | number | yes      | Student ID                                      |
| group_id      | number | yes      | Group ID                                        |
| campaign_id   | number | yes      | Campaign ID                                     |
| taken_date    | string | yes      | ISO 8601 date/time of the session               |
| status        | enum   | yes      | One of: `attend`, `missed`, `delay`             |
| duration      | number | yes      | Duration in minutes (e.g. 60)                   |

### Status Values

| Value    | Meaning  |
|----------|----------|
| `attend` | حاضر     |
| `missed` | غائب     |
| `delay`  | متأخر    |

### Example cURL

```bash
curl -X POST http://localhost:3002/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <teacher-token>" \
  -d '{
    "student_id": 1,
    "group_id": 1,
    "campaign_id": 1,
    "taken_date": "2025-12-14T08:00:00.000Z",
    "status": "attend",
    "duration": 60
  }'
```

### Success Response (201)

```json
{
  "id": 42,
  "student_id": 1,
  "group_id": 1,
  "campaign_id": 1,
  "taken_date": "2025-12-14T08:00:00.000Z",
  "status": "ATTEND",
  "duration": 60,
  "delay_time": -1,
  "created_at": "2025-12-14T08:00:00.000Z",
  "updated_at": "2025-12-14T08:00:00.000Z"
}
```

### Notes

- `status` is stored internally in uppercase (`ATTEND`, `MISSED`, `DELAY`) but the API accepts lowercase.
- `delay_time` is automatically set to `duration` when status is `delay`, otherwise `-1`.
- If the teacher marks attendance again for the same student/campaign/day, the previous record is updated (no duplicates).
