# Activity Logging Workflow

## Overview

The logging system provides a comprehensive audit trail, tracking key events across all modules.

## Data Model

```prisma
model Log {
  id          Int      @id @default(autoincrement())
  event       LogEvent
  timestamp   DateTime @default(now())
  teacher_id  Int?        // Who performed the action
  student_id  Int?        // Who the action was performed on
  group_id    Int?
  campaign_id Int
  notes       String?
  metadata    Json?       // Flexible additional context
  created_at  DateTime @default(now())
  
  // Relations
  teacher  Teacher?  @relation(fields: [teacher_id], references: [id], onDelete: SetNull)
  student  Student?  @relation(fields: [student_id], references: [id], onDelete: SetNull)
  group    Group?    @relation(fields: [group_id], references: [id], onDelete: SetNull)
  campaign Campaign  @relation(fields: [campaign_id], references: [id], onDelete: Cascade)
}
```

## Event Types

```typescript
enum LogEvent {
  TEACHER_LOGIN,           // Teacher logged in
  STUDENT_LOGIN,           // Student logged in
  SAVING_SESSION_CREATED,  // Memorization session conducted
  CURRICULUM_STARTED,      // Curriculum/template started
  CURRICULUM_END,          // Lesson session completed
  ATTENDANCE_MARKED,       // Attendance batch updated
  MISTAKE_ASSERTED,        // Mistakes synced
  EVALUATION_ASSERTED,     // Evaluations synced
  ROLE_ASSIGNED,           // Role assigned to teacher
  CAMPAIGN_CREATED,        // New campaign created
}
```

## Endpoints

### POST `/logs`
Create a log entry

**Headers**: `campaign-id` (required)

**Body** (`CreateLogDto`):
```typescript
{
  event: LogEvent;
  teacher_id?: number;
  student_id?: number;
  group_id?: number;
  notes?: string;
  metadata?: any;    // JSON
}
```

**Response**: `{ message: "Log created successfully", data: Log }`

**Service**: `log.service.ts:create()`

---

### GET `/logs`
List logs (optionally filtered by campaign)

**Headers**: `campaign-id` (optional)

**Response**: `{ message, data: Log[] }` (with teacher/student details)

**Service**: `log.service.ts:findAll()`

---

### GET `/logs/campaign/:campaignId`
Get all logs for a specific campaign

**Response**: `{ message, data: Log[] }`

**Service**: `log.service.ts:findByCampaign()`

---

### GET `/logs/:id`
Get log by ID

**Response**: `{ message, data: Log }`

**Service**: `log.service.ts:findOne()`

---

### DELETE `/logs/:id`
Delete a log entry

**Response**: `{ message: "Log {id} deleted successfully", data: Log }`

**Service**: `log.service.ts:delete()`

## Integration Points

Logs are auto-created by these modules:

### Attendance → ATTENDANCE_MARKED
```typescript
// attendance.service.ts:batchUpdate()
await this.logService.create({
  event: 'ATTENDANCE_MARKED',
  teacher_id: teacherId,
  group_id: groupId,
  notes: `تم تسجيل حضور ${count} طالب في المجموعة ${groupTitle}`,
  metadata: { group_id: groupId, students_count: count }
}, campaignId);
```

### Curriculum Lesson Session → CURRICULUM_END
```typescript
// curriculum-lesson-session.service.ts:markAsFinished()
await this.logService.create({
  event: 'CURRICULUM_END',
  teacher_id: session.teacher_id,
  group_id: session.group_id,
  notes: `تم إنهاء الدرس: ${nodeName}`,
  metadata: { lesson_id, group_id }
}, campaignId);
```

### Saving Session → SAVING_SESSION_CREATED
```typescript
// saving-session.service.ts:createSavingSession()
await this.logService.create({
  event: 'SAVING_SESSION_CREATED',
  teacher_id: teacherId,
  student_id: studentId,
  notes: `تم إنشاء جلسة تسميع جديدة للطالب من الصفحة ${start} إلى ${end}`,
  metadata: { saving_session_id: session.id }
}, campaignId);
```

## Audit Trail Query Examples

```sql
-- Get all attendance marking activity for a campaign
SELECT * FROM "Log" 
WHERE event = 'ATTENDANCE_MARKED' 
  AND campaign_id = 1;

-- Get all activity by a specific teacher
SELECT * FROM "Log" 
WHERE teacher_id = 5 
ORDER BY created_at DESC;

-- Get all activity for a specific student
SELECT * FROM "Log" 
WHERE student_id = 10 
ORDER BY created_at DESC;

-- Get recent activity across all campaigns
SELECT * FROM "Log" 
ORDER BY created_at DESC 
LIMIT 50;
```

## Key Service Methods (`src/log/log.service.ts`)

| Method | Purpose |
|--------|---------|
| `create(dto, campaignId)` | Create log with relations |
| `findAll(campaignId?)` | List with optional campaign filter |
| `findByCampaign(campaignId)` | All logs for campaign |
| `findOne(id)` | By ID |
| `delete(id)` | Remove log entry |
