# Reporting Workflow

## Overview

The reporting system provides comprehensive campaign analytics across five dimensions: global stats, lesson distribution, saving session outcomes, missed students, and delayed students.

## Endpoint

### GET `/reports/campaign`
Generate campaign report for a date range

**Authentication**: JWT required (Protected by `JwtAuthGuard`)

**Query Parameters**:
```typescript
{
  campaign_id: number;
  start_date: string;    // "YYYY-MM-DD"
  end_date: string;      // "YYYY-MM-DD"
}
```

## Response Structure

```typescript
{
  globalInfo: {
    studentsCount: number;       // Active enrolled students
    teachersCount: number;       // Active assigned teachers
    attendStudents: number;      // Distinct students who attended
    delayedStudentsCount: number; // Total delay occurrences
  },
  lessons: {
    categoryName: string;        // Curriculum category
    groupTitle: string;          // Group name
    lessonsCount: number;        // Lessons delivered
  }[],
  savingSessions: {
    total: number;               // Total saving sessions
    passed: number;              // Sessions where all surahs passed
    notPassed: number;           // Sessions with at least one fail
  },
  missedStudents: {
    studentId: number;
    firstName: string;
    lastName: string;
    phoneNumbers: {
      studentMobile: string;
      fatherPhone: string;
      motherPhone: string;
      studentMobileNumber: string;
      studentHomeNumber: string;
      motherHomeNumber: string;
      fatherWorkNumber: string;
    };
    missedDates: {
      date: Date;
      groupTitle: string;
    }[];
  }[],
  delayedStudents: {
    studentId: number;
    firstName: string;
    lastName: string;
    delays: {
      date: Date;
      delayTime: number;    // Minutes
      groupTitle: string;
    }[];
  }[]
}
```

## Data Sources

Each section queries different Prisma models in parallel:

### Global Info
```typescript
// Sources:
studentsCount    → StudentCampaign.count({ campaign_id, is_active: true })
teachersCount    → TeacherCampaign.count({ campaign_id, is_active: true })
attendStudents   → Attendance.findMany({ status: 'ATTEND', dateRange }) (distinct students)
delayedStudentsCount → Attendance.count({ status: 'DELAY', dateRange })
```

### Lessons
```typescript
// Sources:
CurriculumLessonSession.findMany({
  where: { campaign_id, created_at: dateRange },
  include: { lesson_node → template → curriculum → categories → category, group }
})
// Grouped by: categoryName | groupTitle
```

### Saving Sessions
```typescript
// Sources:
SavingSession.findMany({
  where: { campaign_id, created_at: dateRange },
  include: { session_surahs: { select: { isPassed } } }
})
// All surahs in session must be passed → "passed"
```

### Missed Students
```typescript
// Sources:
Attendance.findMany({
  where: { status: 'MISSED', dateRange },
  include: { student (with contact info), group }
})
// Grouped by student with all phone numbers
```

### Delayed Students
```typescript
// Sources:
Attendance.findMany({
  where: { status: 'DELAY', dateRange },
  include: { student, group }
})
// Grouped by student with delay details
```

## Performance

All five data queries run in parallel using `Promise.all`:

```typescript
const [globalInfo, lessons, savingSessions, missedStudents, delayedStudents] = 
  await Promise.all([
    this.getGlobalInfo(campaign_id, startDate, endDate),
    this.getLessonsData(campaign_id, startDate, endDate),
    this.getSavingSessionsData(campaign_id, startDate, endDate),
    this.getMissedStudents(campaign_id, startDate, endDate),
    this.getDelayedStudents(campaign_id, startDate, endDate),
  ]);
```

## Related Data Flows

| Report Section | Source Module | Key Models |
|----------------|--------------|------------|
| Global Info | Campaign, Student, Teacher, Attendance | StudentCampaign, TeacherCampaign, Attendance |
| Lessons | Curriculum | CurriculumLessonSession, CurriculumTemplate, Category |
| Saving Sessions | Evaluation | SavingSession, SessionSurah |
| Missed Students | Attendance | Attendance (status: MISSED) |
| Delayed Students | Attendance | Attendance (status: DELAY) |

## Key Service Methods (`src/report/report.service.ts`)

| Method | Purpose |
|--------|---------|
| `generateCampaignReport(dto)` | Main report generator (parallel queries) |
| `getGlobalInfo(campaignId, start, end)` | Student/teacher counts, attendance stats |
| `getLessonsData(campaignId, start, end)` | Lessons grouped by category + group |
| `getSavingSessionsData(campaignId, start, end)` | Pass/fail session counts |
| `getMissedStudents(campaignId, start, end)` | Missed students with contact info |
| `getDelayedStudents(campaignId, start, end)` | Delayed students with timestamps |
