# Complete API Reference

## Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login/admin` | No | Admin login (role: ADMIN/SUPER_ADMIN) |
| POST | `/auth/login/teacher` | No | Teacher login with campaign context |
| POST | `/auth/login/student` | No | Student login (password check) |
| POST | `/auth/login` | No | Unified login with management context |
| POST | `/auth/profile` | JWT | Get teacher profile |
| POST | `/auth/my-permissions` | JWT | Get campaign permissions |

## Organizations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/organizations` | No | Create org with optional owner |
| GET | `/organizations` | No | List all |
| GET | `/organizations/:id` | No | By ID |
| PUT | `/organizations/:id` | No | Update |
| DELETE | `/organizations/:id` | No | Delete |

## Mosques

| Method | Endpoint | Headers | Description |
|--------|----------|---------|-------------|
| POST | `/mosques` | — | Create |
| GET | `/mosques` | `organization_id` | List (filtered) |
| GET | `/mosques/:id` | — | By ID |
| PUT | `/mosques/:id` | — | Update |
| DELETE | `/mosques/:id` | — | Delete |

## Campaigns

| Method | Endpoint | Auth | Headers | Description |
|--------|----------|------|---------|-------------|
| GET | `/campaigns` | No | `mosque_id` | List |
| POST | `/campaigns` | No | — | Create |
| GET | `/campaigns/my-campaigns` | JWT | `mosque_id` | Teacher's campaigns |
| GET | `/campaigns/:id` | No | — | By ID |
| PUT | `/campaigns/:id` | No | — | Update |
| DELETE | `/campaigns/:id` | No | — | Delete |

## Groups

| Method | Endpoint | Auth | Headers | Description |
|--------|----------|------|---------|-------------|
| GET | `/groups` | No | `campaign_id` | List |
| POST | `/groups` | No | `campaign_id` | Create |
| GET | `/groups/assign/:groupId/:studentId` | No | `campaign_id` | Assign student (auto-generates attendance) |
| GET | `/groups/unassign/:groupId/:studentId` | No | `campaign_id` | Unassign student |
| GET | `/groups/my-groups` | JWT | `campaign-id` | Teacher's groups |
| GET | `/groups/:id` | No | — | By ID |
| GET | `/groups/details/:id` | No | — | Details with teacher/students |
| PUT | `/groups/:id` | No | — | Update |
| DELETE | `/groups/:id` | No | — | Delete |
| GET | `/groups/byteacher/:teacherId` | No | — | By teacher |
| GET | `/groups/bystudent/:studentId/campaign/:campaignId` | No | — | By student + campaign |

## Students

| Method | Endpoint | Headers | Description |
|--------|----------|---------|-------------|
| GET | `/students/all` | — | All (filter by `mosqueIds` query) |
| POST | `/students` | `campaign_id` | Create + enroll in campaign |
| GET | `/students` | `campaign_id` | List for campaign |
| GET | `/students/unassigned` | `campaign_id` | Unassigned students |
| GET | `/students/:id` | — | By ID |
| PUT | `/students/:id` | — | Update |
| DELETE | `/students/:id` | — | Delete |

## Teachers

| Method | Endpoint | Headers | Description |
|--------|----------|---------|-------------|
| GET | `/teachers` | `campaign_id` | List |
| POST | `/teachers` | `campaign_id` | Create + assign to campaign |
| GET | `/teachers/unassigned` | `campaign_id` | Without group |
| GET | `/teachers/:id` | `campaign_id` | By ID with roles |
| GET | `/teachers/mobile/:id` | `campaign_id` (query) | Full info (mobile) |
| PUT | `/teachers/:id` | — | Update (replaces roles) |
| DELETE | `/teachers/:id` | — | Delete |

## Attendance

| Method | Endpoint | Headers/Params | Description |
|--------|----------|---------------|-------------|
| GET | `/attendance/group/:groupId` | `campaign_id` | All for group |
| GET | `/attendance/group/:groupId` | `campaign_id` (default: today) | By date |
| GET | `/attendance/group/:groupId/student/:studentId` | `campaign_id` | Student in group |
| POST | `/attendance/batch-update` | — | Batch update + audit log |
| POST | `/attendance/record` | — | Create or update single |
| GET | `/attendance/stats/:campaignId` | `startDate`, `endDate` | Stats per group |
| GET | `/attendance/campaign/all` | `campaign_id` | Grouped by group |
| GET | `/attendance/campaign/simple` | `campaign_id` | Flat list |
| GET | `/attendance/:id` | — | By ID |
| PUT | `/attendance/:id` | — | Update |

## Curriculum

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/curriculum` | Create (with category_ids) |
| GET | `/curriculum` | List (?organizationId) |
| GET | `/curriculum/:id` | By ID |
| PUT | `/curriculum/:id` | Update (replaces categories) |
| DELETE | `/curriculum/:id` | Delete |

## Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/category` | Create |
| GET | `/category` | List (?organizationId) |
| GET | `/category/:id` | By ID |
| PATCH | `/category/:id` | Update |
| DELETE | `/category/:id` | Delete (blocked if in use) |

## Curriculum Templates

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/curriculum-template` | Create (links curriculum ↔ campaign) |
| GET | `/curriculum-template` | List (?campaignId, ?curriculumId) |
| GET | `/curriculum-template/group/:groupId` | By group |
| POST | `/curriculum-template/assign` | Assign to group |
| GET | `/curriculum-template/:id` | By ID |
| PUT | `/curriculum-template/:id` | Update |
| DELETE | `/curriculum-template/:id` | Delete |

### Template Nodes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/curriculum-template/node` | Create |
| GET | `/curriculum-template/:templateId/nodes` | All for template |
| GET | `/curriculum-template/:templateId/next-node` | Next (IN_PROGRESS or PLANNED) |
| GET | `/curriculum-template/node/:id` | By ID |
| PUT | `/curriculum-template/node/:id` | Update |
| DELETE | `/curriculum-template/node/:id` | Delete |

## Curriculum Lesson Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/curriculum-lesson-session` | Create (with late detection) |
| GET | `/curriculum-lesson-session` | List (?campaignId, ?groupId, ?teacherId, ?nodeId) |
| GET | `/curriculum-lesson-session/by-node-group/:nodeId/:groupId` | By node + group |
| GET | `/curriculum-lesson-session/group/:groupId` | All for group |
| GET | `/curriculum-lesson-session/group/:groupId/current-node` | Current node + progress |
| GET | `/curriculum-lesson-session/progress/:nodeId/:groupId` | Detailed progress |
| GET | `/curriculum-lesson-session/:id` | By ID |
| PATCH | `/curriculum-lesson-session/:id` | Update |
| PATCH | `/curriculum-lesson-session/:id/finish` | Mark finished |
| DELETE | `/curriculum-lesson-session/:id` | Delete |

## Evaluations

| Method | Endpoint | Headers | Description |
|--------|----------|---------|-------------|
| POST | `/evaluations` | — | Create |
| POST | `/evaluations/assert` | — | Bulk sync |
| GET | `/evaluations` | `campaign_id` | List |
| GET | `/evaluations/campaign/:campaignId` | — | By campaign |
| GET | `/evaluations/campaign/:campaignId/stats` | — | Usage stats |
| GET | `/evaluations/:id` | — | By ID |
| PUT | `/evaluations/:id` | — | Update |
| DELETE | `/evaluations/:id` | — | Delete (blocked if in use) |

## Mistakes

| Method | Endpoint | Headers | Description |
|--------|----------|---------|-------------|
| POST | `/mistakes` | — | Create |
| POST | `/mistakes/assert` | — | Bulk sync |
| GET | `/mistakes` | `campaign_id` | List with usage |
| GET | `/mistakes/campaign/:campaignId` | — | By campaign |
| GET | `/mistakes/:id` | — | By ID |
| PUT | `/mistakes/:id` | — | Update |
| DELETE | `/mistakes/:id` | — | Delete |

## Saving Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/saving-sessions` | Create with surahs + mistakes |
| GET | `/saving-sessions` | All |
| GET | `/saving-sessions/filter` | Filter (?studentId, ?teacherId, ?campaignId, ?evaluationId, ?mistakeId, ?dateFrom, ?dateTo) |
| GET | `/saving-sessions/:id` | By ID |
| DELETE | `/saving-sessions/:id` | Delete |

## Session Surahs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/session-surahs/templates` | All surah templates |
| GET | `/session-surahs/templates/surah/:surahNumber` | By surah |
| GET | `/session-surahs/templates/pages?startPage=&endPage=` | By page range |
| GET | `/session-surahs/session/:sessionId` | By session |
| PUT | `/session-surahs/:id` | Update surah |
| POST | `/session-surahs/:id/mistakes` | Add mistake |
| DELETE | `/session-surahs/:id/mistakes/:mistakeId` | Remove mistake |
| GET | `/session-surahs/stats/:sessionId` | Statistics |
| GET | `/session-surahs/surahs` | List distinct surahs |

## Logs

| Method | Endpoint | Headers | Description |
|--------|----------|---------|-------------|
| POST | `/logs` | `campaign-id` | Create entry |
| GET | `/logs` | `campaign-id` (optional) | List |
| GET | `/logs/campaign/:campaignId` | — | By campaign |
| GET | `/logs/:id` | — | By ID |
| DELETE | `/logs/:id` | — | Delete |

## Roles

| Method | Endpoint | Headers | Description |
|--------|----------|---------|-------------|
| POST | `/roles` | — | Create |
| GET | `/roles` | `campaign_id` | List |
| GET | `/roles/:id` | — | By ID |
| POST | `/roles/bulk-update-permissions` | — | Batch permission update |

## Reports

| Method | Endpoint | Auth | Query | Description |
|--------|----------|------|-------|-------------|
| GET | `/reports/campaign` | JWT | `campaign_id`, `start_date`, `end_date` | Campaign report |

## Common Patterns

### Context Headers
- `campaign_id` / `campaign-id` — Campaign context (used by: attendance, groups, students, teachers, logs, evaluations, mistakes)
- `mosque_id` — Mosque filter (used by: campaigns)
- `organization_id` — Organization filter (used by: mosques)

### Response Format
Most endpoints return: `{ message: string, data: T }` or direct object.

### Error Responses
- 400: Bad Request (validation, business logic)
- 401: Unauthorized (missing/invalid JWT)
- 404: Not Found
- 403: Forbidden (insufficient permissions)
