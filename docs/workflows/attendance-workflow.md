# Attendance Tracking Workflow

## Overview

Attendance records are auto-generated when students are assigned to groups, then updated daily by teachers.

## Data Model

```prisma
model Attendance {
  id          Int      @id @default(autoincrement())
  student_id  Int
  group_id    Int
  campaign_id Int
  taken_date  DateTime @default(now())
  delay_time  Int         // -1 = not set, 0+ = minutes delayed
  status      String      // ATTEND | MISSED | DELAY | NOT_TAKEN
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
  
  @index([student_id])
  @index([campaign_id])
  @index([taken_date])
}
```

## Attendance Lifecycle

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Auto-Generate  │───▶│  Teacher Marks  │───▶│  Reports &      │
│  on Student     │    │  Daily via      │    │  Statistics     │
│  Group Assign   │    │  Batch Update   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Auto-Generation Logic
When a student is assigned to a group (`GET /groups/assign/:groupId/:studentId`):
1. Read campaign's `start_date`, `end_date`, `days` (comma-separated day names)
2. Calculate all matching days between start/end
3. For each day, create `Attendance` record with `status: "NOT_TAKEN"`, `delay_time: -1`

## Endpoints

### GET `/attendance/group/:groupId`
Get all attendance for a group in a campaign

**Headers**: `campaign_id`

**Response**:
```typescript
{
  id, student_id, group_id, campaign_id, taken_date, delay_time, status,
  student: { first_name, last_name, educational_class }
}[]
```

**Service**: `attendance.service.ts:findAll()`

---

### GET `/attendance/group/:groupId` (by date)
Get attendance for group filtered by today's date

**Headers**: `campaign_id`

**Default**: Today's date (YYYY-MM-DD)

**Response**: Same as above, filtered to current day

**Service**: `attendance.service.ts:getByGroup()`

---

### POST `/attendance/batch-update`
Batch update attendance records

**Body** (`BulkUpdateAttendanceDto[]`):
```typescript
{
  student_id: number;
  campaign_id: number;
  date: string;       // "YYYY-MM-DD"
  status: string;     // ATTEND | MISSED | DELAY
  delay: number;      // minutes
}[]
```

**Flow** (for each record):
1. Find attendance by `student_id + campaign_id + date`
2. Update `status` and `delay_time`
3. After all updates: Create single log entry `ATTENDANCE_MARKED`

**Log Entry**: `تم تسجيل حضور {count} طالب في المجموعة {groupTitle}`

**Response**:
```typescript
{ student_id, campaign_id, date, data: status }[]
```

**Service**: `attendance.service.ts:batchUpdate()`

---

### POST `/attendance/record`
Create or update a single attendance record

**Body** (`CreateOrUpdateAttendanceRecordDto`):
```typescript
{
  student_id: number;
  group_id: number;
  campaign_id: number;
  taken_date: string;    // "YYYY-MM-DD"
  status: string;
  delay_time?: number;
}
```

**Logic**: Check existing by composite key → Update if exists, Create if not

**Service**: `attendance.service.ts:createOrUpdateAttendance()`

---

### GET `/attendance/stats/:campaignId`
Get attendance statistics for all groups in a date range

**Query**: `startDate`, `endDate`

**Response**:
```typescript
{
  groupId, groupName,
  attended: number,
  missed: number,
  delayed: number
}[]
```

**Service**: `attendance.service.ts:getGroupAttendanceStats()`

---

### GET `/attendance/campaign/all`
Get all attendance for a campaign grouped by groups

**Headers**: `campaign_id`

**Response**:
```typescript
{
  groupId, groupKey, groupTitle,
  groupTeachers: string[],   // "First Last" names
  attendances: Attendance[]
}[]
```

**Service**: `attendance.service.ts:getAllAttendanceByCampaign()`

---

### GET `/attendance/group/:groupId/student/:studentId`
Get attendance for a specific student in a group

**Headers**: `campaign_id`

**Logic**: Excludes `NOT_TAKEN` records

**Service**: `attendance.service.ts:getByStudentAndGroupAndCampaign()`

---

### PUT `/attendance/:id`
Update single attendance record

**Body**: `UpdateAttendanceDto`

**Service**: `attendance.service.ts:update()`

---

### GET `/attendance/campaign/simple`
Get all attendance records for a campaign (flat)

**Headers**: `campaign_id`

**Response**: Attendance with `student: { id, first_name, last_name, educational_class }`, `group: { id, title }`

**Service**: `attendance.service.ts:getAttendancesByCampaign()`

---

### GET `/attendance/:id`
Get attendance record by ID

**Service**: `attendance.service.ts:getAttendanceById()`

## Day Matching Logic

The `getMatchingDaysBetweenDates` utility calculates attendance dates:

```typescript
// dayMap
{ sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 }

// For campaign with days="sun,mon,wed" between start_date and end_date
// Returns all dates falling on Sunday, Monday, Wednesday in that range
```

## Audit Integration

Attendance batch updates automatically create activity logs:

```typescript
// In attendance.service.ts:batchUpdate()
await this.logService.create({
  event: 'ATTENDANCE_MARKED',
  teacher_id: group.current_teacher_id,
  group_id: groupId,
  notes: `تم تسجيل حضور ${updatedCount} طالب في المجموعة ${groupTitle}`,
  metadata: { group_id: groupId, students_count: updatedCount }
}, campaignId);
```

## Key Service Methods (`src/attendance/attendance.service.ts`)

| Method | Purpose |
|--------|---------|
| `findAll(campaignId, groupId)` | All attendance for group |
| `getByGroup(campaignId, groupId, date?)` | Attendance by date |
| `batchUpdate(data[])` | Batch status update + log |
| `getGroupAttendanceStats(campaignId, start, end)` | Stats per group |
| `getAllAttendanceByCampaign(campaignId)` | Grouped by group |
| `getByStudentAndGroupAndCampaign(...)` | Student-specific history |
| `createOrUpdateAttendance(data)` | Upsert single record |
| `createAll(campaignId, groupId, studentId)` | Auto-generate records |
