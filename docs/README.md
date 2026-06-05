# Halakat Backend - Documentation

Quran memorization management system built with NestJS, Prisma, and PostgreSQL.

## Contents

### Architecture & Overview
- [System Architecture](architecture.md) - Module structure, patterns, tech stack

### Data Model
- [Data Model & Relationships](data-model.md) - Prisma schema, entity relationships, indexes

### Workflows
- [Authentication & Authorization](workflows/auth-workflow.md) - Login flows, JWT, RBAC
- [Campaign Management](workflows/campaign-management.md) - Campaign lifecycle, scheduling
- [Student Management](workflows/student-management.md) - Enrollment, grouping, profiles
- [Teacher Management](workflows/teacher-management.md) - Assignment, roles, permissions
- [Attendance Tracking](workflows/attendance-workflow.md) - Daily attendance, batch updates, stats
- [Curriculum Management](workflows/curriculum-management.md) - Curriculum creation, templates, lesson sessions, progress tracking
- [Evaluation & Saving Sessions](workflows/evaluation-workflow.md) - Evaluation criteria, saving sessions, mistake tracking, scoring
- [Activity Logging](workflows/logging-workflow.md) - Audit trail, event tracking
- [Reporting](workflows/reporting-workflow.md) - Campaign reports, analytics

### Reference
- [Complete API Reference](api-reference.md) - All endpoints, DTOs, response formats
- [Permissions & Roles](permissions-roles.md) - RBAC system, permission enums
