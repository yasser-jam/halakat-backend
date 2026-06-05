# Halakat Backend - System Overview

## Project Description
Halakat is a comprehensive Quran memorization management system built with NestJS and Prisma. The system provides end-to-end functionality for managing Quran memorization campaigns, students, teachers, attendance, evaluations, and curriculum tracking.

## Architecture
- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT-based with role-based access control
- **API Documentation**: Swagger/OpenAPI

## Core Modules

### 1. Authentication & Authorization ([auth](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/auth:0:0-0:0))
**Service**: [AuthService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/auth/auth.service.ts:91:0-353:1)  
**Controller**: [AuthController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/auth/auth.controller.ts:17:0-90:1)

**Features**:
- Multi-role authentication (Admin, Teacher, Student)
- Admin login with elevated privileges
- Teacher login with campaign assignments and permissions
- Student login with password verification
- Unified login returning management context
- Profile retrieval with role-based data
- Permission management per campaign
- JWT token generation and validation

**Key Endpoints**:
- `POST /auth/login/admin` - Admin authentication
- `POST /auth/login/teacher` - Teacher authentication
- `POST /auth/login/student` - Student authentication
- `POST /auth/login` - Unified login
- `POST /auth/profile` - Get user profile
- `POST /auth/my-permissions` - Get campaign-specific permissions

---

### 2. Attendance Management ([attendance](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/attendance:0:0-0:0))
**Service**: [AttendanceService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/attendance/attendance.service.ts:6:0-540:1)  
**Controller**: [AttendanceController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/attendance/attendance.controller.ts:25:0-191:1)

**Features**:
- Automatic attendance record creation based on campaign schedule
- Batch attendance updates for multiple students
- Attendance status tracking (ATTEND, MISSED, DELAY, NOT_TAKEN)
- Delay time tracking
- Group-based attendance filtering
- Date-specific attendance queries
- Attendance statistics and analytics
- Student attendance history
- Campaign-wide attendance reports

**Key Endpoints**:
- `GET /attendance/group/:groupId` - Get all attendance for group
- `GET /attendance/group/:groupId` - Get attendance by date
- `POST /attendance/batch-update` - Batch update attendance
- `GET /attendance/stats/:campaignId` - Get group statistics
- `GET /attendance/campaign/all` - Get all attendance grouped by groups
- `POST /attendance/record` - Create or update single record

**Special Features**:
- Automatic day calculation based on campaign schedule
- Integration with logging service for audit trail
- Teacher and student information inclusion
- Support for custom date ranges

---

### 3. Campaign Management ([campaign](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/campaign:0:0-0:0))
**Service**: [CampaignService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/campaign/campaign.service.ts:5:0-144:1)  
**Controller**: [CampaignsController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/campaign/campaign.controller.ts:25:0-106:1)

**Features**:
- Quran memorization campaign lifecycle management
- Campaign-mosque association
- Teacher assignment to campaigns
- Student enrollment in campaigns
- Campaign schedule management (start/end dates, days)
- Current campaign status checking
- Role-based campaign access (ORGANIZATION_ADMIN, MOSQUE_ADMIN)

**Key Endpoints**:
- `GET /campaigns` - Get all campaigns
- `POST /campaigns` - Create new campaign
- `GET /campaigns/my-campaigns` - Get teacher's campaigns
- `GET /campaigns/:id` - Get campaign by ID
- `PUT /campaigns/:id` - Update campaign
- `DELETE /campaigns/:id` - Delete campaign

---

### 4. Curriculum Management ([curriculum](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/curriculum:0:0-0:0), [category](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/category:0:0-0:0))
**Services**: [CurriculumService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/curriculum/curriculum.service.ts:4:0-182:1), [CategoryService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/category/category.service.ts:4:0-111:1)  
**Controllers**: [CurriculumController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/curriculum/curriculum.controller.ts:22:0-70:1), [CategoryController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/category/category.controller.ts:22:0-70:1)

**Features**:
- Hierarchical curriculum organization
- Category-based curriculum classification
- Organization-scoped curriculum management
- Category-curriculum many-to-many relationships
- Color-coded categories for visual organization
- Protection against deletion when in use

**Curriculum Endpoints**:
- `POST /curriculum` - Create curriculum
- `GET /curriculum` - List curricula (with organization filter)
- `GET /curriculum/:id` - Get curriculum details
- `PUT /curriculum/:id` - Update curriculum
- `DELETE /curriculum/:id` - Delete curriculum

**Category Endpoints**:
- `POST /category` - Create category
- `GET /category` - List categories (with organization filter)
- `GET /category/:id` - Get category details
- `PATCH /category/:id` - Update category
- `DELETE /category/:id` - Delete category

---

### 5. Curriculum Templates ([curriculum-template](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/curriculum-template:0:0-0:0))
**Service**: [CurriculumTemplateService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/curriculum-template/curriculum-template.service.ts:18:0-556:1)  
**Controller**: [CurriculumTemplateController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/curriculum-template/curriculum-template.controller.ts:29:0-152:1)

**Features**:
- Template-based curriculum planning
- Hierarchical node structure (parent-child relationships)
- Lesson span management for planning
- Node status tracking (PLANNED, IN_PROGRESS, LATE, COMPLETED)
- Template assignment to groups
- Target end date management
- Next node recommendation
- Order-based node sequencing

**Template Endpoints**:
- `POST /curriculum-template` - Create template
- `GET /curriculum-template` - List templates
- `GET /curriculum-template/group/:groupId` - Get templates by group
- `POST /curriculum-template/assign` - Assign template to group
- `GET /curriculum-template/:id` - Get template details
- `PUT /curriculum-template/:id` - Update template
- `DELETE /curriculum-template/:id` - Delete template

**Node Endpoints**:
- `POST /curriculum-template/node` - Create node
- `GET /curriculum-template/:templateId/nodes` - Get template nodes
- `GET /curriculum-template/:templateId/next-node` - Get next node
- `GET /curriculum-template/node/:id` - Get node details
- `PUT /curriculum-template/node/:id` - Update node
- `DELETE /curriculum-template/node/:id` - Delete node

---

### 6. Curriculum Lesson Sessions ([curriculum-lesson-session](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/curriculum-lesson-session:0:0-0:0))
**Service**: [CurriculumLessonSessionService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/curriculum-lesson-session/curriculum-lesson-session.service.ts:14:0-597:1)  
**Controller**: [CurriculumLessonSessionController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/curriculum-lesson-session/curriculum-lesson-session.controller.ts:35:0-473:1)

**Features**:
- Individual lesson session tracking
- Session number management within nodes
- Late lesson detection and tracking
- Lesson completion marking with duration
- Progress tracking by group and node
- Current node identification for groups
- Teacher and group association
- Automatic status updates based on progress
- Integration with logging for audit trail

**Key Endpoints**:
- `POST /curriculum-lesson-session` - Create lesson session
- `GET /curriculum-lesson-session` - List sessions (with filters)
- `GET /curriculum-lesson-session/by-node-group/:nodeId/:groupId` - Get by node and group
- `GET /curriculum-lesson-session/group/:groupId` - Get all group sessions
- `GET /curriculum-lesson-session/group/:groupId/current-node` - Get current node
- `GET /curriculum-lesson-session/progress/:nodeId/:groupId` - Get progress
- `PATCH /curriculum-lesson-session/:id/finish` - Mark as finished
- `DELETE /curriculum-lesson-session/:id` - Delete session

---

### 7. Evaluation System ([evaluation](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/evaluation:0:0-0:0))
**Service**: [EvaluationService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/evaluation/evaluation.service.ts:4:0-228:1)  
**Controller**: [EvaluationController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/evaluation/evaluation.controller.ts:25:0-121:1)

**Features**:
- Evaluation criteria management
- Points and minimum marks configuration
- Campaign-specific evaluations
- Usage tracking (sessions, session surahs)
- Bulk evaluation synchronization
- Evaluation statistics and reporting
- Protection against deletion when in use

**Key Endpoints**:
- `POST /evaluations` - Create evaluation
- `POST /evaluations/assert` - Sync campaign evaluations
- `GET /evaluations` - List campaign evaluations
- `GET /evaluations/campaign/:campaignId/stats` - Get statistics
- `GET /evaluations/:id` - Get evaluation by ID
- `PUT /evaluations/:id` - Update evaluation
- `DELETE /evaluations/:id` - Delete evaluation

---

### 8. Group Management ([group](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/group:0:0-0:0))
**Service**: [GroupService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/group/group.service.ts:4:0-426:1)  
**Controller**: [GroupsController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/group/group.controller.ts:25:0-200:1)

**Features**:
- Student group organization
- Teacher assignment to groups
- Student assignment/unassignment to groups
- Campaign-group association
- Automatic attendance creation on assignment
- Current teacher tracking
- Group filtering by teacher, student, campaign
- Class/grade management

**Key Endpoints**:
- `GET /groups` - List groups
- `POST /groups` - Create group
- `GET /groups/assign/:groupId/:studentId` - Assign student
- `GET /groups/unassign/:groupId/:studentId` - Unassign student
- `GET /groups/my-groups` - Get teacher's groups
- `GET /groups/:id` - Get group details
- `PUT /groups/:id` - Update group
- `DELETE /groups/:id` - Delete group
- `GET /groups/byteacher/:teacherId` - Get by teacher
- `GET /groups/bystudent/:studentId/campaign/:campaignId` - Get by student and campaign

---

### 9. Mistake Tracking ([mistake](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/mistake:0:0-0:0))
**Service**: [MistakeService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/mistake/mistake.service.ts:8:0-133:1)  
**Controller**: [MistakeController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/mistake/mistake.controller.ts:19:0-85:1)

**Features**:
- Common Quran recitation mistakes catalog
- Marks reduction configuration
- Campaign-specific mistake sets
- Bulk mistake synchronization
- Usage tracking in sessions
- Mistake-session surah association

**Key Endpoints**:
- `POST /mistakes` - Create mistake
- `GET /mistakes` - List campaign mistakes
- `GET /mistakes/:id` - Get mistake by ID
- `PUT /mistakes/:id` - Update mistake
- `DELETE /mistakes/:id` - Delete mistake
- `GET /mistakes/campaign/:campaignId` - Get by campaign
- `POST /mistakes/assert` - Sync campaign mistakes

---

### 10. Organization & Mosque Management ([organization](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/organization:0:0-0:0), [mosque](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/mosque:0:0-0:0))
**Services**: [OrganizationService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/organization/organization.service.ts:4:0-77:1), [MosqueService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/mosque/mosque.service.ts:4:0-39:1)  
**Controllers**: [OrganizationController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/organization/organization.controller.ts:19:0-66:1), [MosqueController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/mosque/mosque.controller.ts:21:0-73:1)

**Organization Features**:
- Organization creation with owner account
- Owner teacher account generation
- Password hashing for security
- Organization-mosque hierarchy
- CRUD operations

**Mosque Features**:
- Mosque management within organizations
- Organization-based filtering
- Campaign association
- CRUD operations

**Organization Endpoints**:
- `POST /organizations` - Create organization
- `GET /organizations` - List organizations
- `GET /organizations/:id` - Get organization
- `PUT /organizations/:id` - Update organization
- `DELETE /organizations/:id` - Delete organization

**Mosque Endpoints**:
- `POST /mosques` - Create mosque
- `GET /mosques` - List mosques (with organization filter)
- `GET /mosques/:id` - Get mosque
- `PUT /mosques/:id` - Update mosque
- `DELETE /mosques/:id` - Delete mosque

---

### 11. Reporting System ([report](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/report:0:0-0:0))
**Service**: [ReportService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/report/report.service.ts:4:0-301:1)  
**Controller**: [ReportController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/report/report.controller.ts:17:0-63:1)

**Features**:
- Comprehensive campaign reporting
- Date-range based analytics
- Global statistics (students, teachers, attendance)
- Lesson completion tracking by category
- Saving session pass/fail rates
- Missed student identification with contact info
- Delayed student tracking
- Group-based lesson distribution

**Key Endpoints**:
- `GET /reports/campaign` - Generate campaign report
  - Query params: `campaign_id`, `start_date`, `end_date`

**Report Sections**:
- Global Info: Student/teacher counts, attendance stats
- Lessons: Category and group distribution
- Saving Sessions: Pass/fail statistics
- Missed Students: Detailed list with contact information
- Delayed Students: Delay tracking with timestamps

---

### 12. Role-Based Access Control ([role](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/role:0:0-0:0))
**Service**: [RoleService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/role/role.service.ts:4:0-50:1)  
**Controller**: [RoleController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/role/role.controller.ts:19:0-70:1)

**Features**:
- Custom role creation
- Permission assignment to roles
- Campaign-specific roles
- Bulk permission updates
- JSON-based permission storage
- Teacher-role association

**Key Endpoints**:
- `POST /roles` - Create role
- `GET /roles` - List campaign roles
- `GET /roles/:id` - Get role by ID
- `POST /roles/bulk-update-permissions` - Bulk update permissions

---

### 13. Saving Sessions ([saving-session](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/saving-session:0:0-0:0))
**Service**: [SavingSessionService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/saving-session/saving-session.service.ts:10:0-257:1)  
**Controller**: [SavingSessionController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/saving-session/saving-session.controller.ts:23:0-106:1)

**Features**:
- Quran memorization session management
- Multi-surah session support
- Evaluation integration
- Score calculation (raw, weighted)
- Pass/fail tracking
- Mistake association
- Teacher and student tracking
- Comprehensive filtering capabilities
- Automatic logging for audit trail

**Key Endpoints**:
- `POST /saving-sessions` - Create saving session
- `GET /saving-sessions` - List all sessions
- `GET /saving-sessions/filter` - Filter sessions
  - Filters: studentId, teacherId, mistakeId, campaignId, evaluationId, dateFrom, dateTo
- `GET /saving-sessions/:id` - Get session by ID
- `DELETE /saving-sessions/:id` - Delete session

---

### 14. Session Surah Management ([session-surah](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/session-surah:0:0-0:0))
**Service**: [SessionSurahService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/session-surah/session-surah.service.ts:3:0-128:1)  
**Controller**: [SessionSurahController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/session-surah/session-surah.controller.ts:19:0-151:1)

**Features**:
- Surah template management
- Page range based template retrieval
- Surah number based filtering
- Session-surah association
- Mistake tracking per surah
- Score and pass/fail management
- Statistics calculation
- Surah list with names

**Key Endpoints**:
- `GET /session-surahs/templates` - Get all templates
- `GET /session-surahs/templates/surah/:surahNumber` - Get by surah
- `GET /session-surahs/templates/pages` - Get by page range
- `GET /session-surahs/session/:sessionId` - Get by session
- `PUT /session-surahs/:id` - Update session surah
- `POST /session-surahs/:id/mistakes` - Add mistake
- `DELETE /session-surahs/:id/mistakes/:mistakeId` - Remove mistake
- `GET /session-surahs/stats/:sessionId` - Get statistics
- `GET /session-surahs/surahs` - Get surahs list

---

### 15. Student Management ([student](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/student:0:0-0:0))
**Service**: [StudentService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/student/student.service.ts:5:0-185:1)  
**Controller**: [StudentsController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/student/student.controller.ts:24:0-119:1)

**Features**:
- Student profile management
- Campaign enrollment
- Group assignment tracking
- Mosque association
- Contact information management
- Unassigned student identification
- Campaign-based student listing
- Educational class tracking

**Key Endpoints**:
- `GET /students/all` - Get all students (with mosque filter)
- `POST /students` - Create student
- `GET /students` - List campaign students
- `GET /students/unassigned` - List unassigned students
- `GET /students/:id` - Get student by ID
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student

---

### 16. Teacher Management ([teacher](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/teacher:0:0-0:0))
**Service**: [TeacherService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/teacher/teacher.service.ts:5:0-282:1)  
**Controller**: [TeachersController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/teacher/teacher.controller.ts:22:0-120:1)

**Features**:
- Teacher profile management
- Campaign assignment
- Role-based permissions
- Group assignment tracking
- Password hashing
- Unassigned teacher identification
- Mobile-optimized teacher info endpoint
- Educational certification tracking

**Key Endpoints**:
- `GET /teachers` - List teachers (with campaign filter)
- `POST /teachers` - Create teacher
- `GET /teachers/unassigned` - List unassigned teachers
- `GET /teachers/:id` - Get teacher by ID
- `GET /teachers/mobile/:id` - Get full teacher info (mobile)
- `PUT /teachers/:id` - Update teacher
- `DELETE /teachers/:id` - Delete teacher

---

### 17. Activity Logging ([log](cci:9://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/log:0:0-0:0))
**Service**: [LogService](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/log/log.service.ts:4:0-169:1)  
**Controller**: [LogController](cci:2://file:///media/yasser-jamal-al-deen/work/halakat/backend/src/log/log.controller.ts:24:0-121:1)

**Features**:
- Comprehensive activity logging
- Event type tracking (ATTENDANCE_MARKED, CURRICULUM_END, SAVING_SESSION_CREATED)
- Teacher and student association
- Campaign and group context
- Metadata storage for additional context
- Campaign-based filtering
- Audit trail capabilities

**Key Endpoints**:
- `POST /logs` - Create log entry
- `GET /logs` - List logs (with campaign filter)
- `GET /logs/campaign/:campaignId` - Get by campaign
- `GET /logs/:id` - Get log by ID
- `DELETE /logs/:id` - Delete log entry

---

## Key System Features

### Security & Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Campaign-specific permissions
- Guard-based route protection

### Data Integrity
- Prisma ORM for type-safe database operations
- Transaction support for complex operations
- Cascade delete protection
- Foreign key relationships
- Unique constraints enforcement

### Audit & Logging
- Comprehensive activity logging
- Event tracking across all modules
- Teacher and student context
- Campaign association
- Metadata support for custom data

### Reporting & Analytics
- Campaign-level reporting
- Date-range based analytics
- Attendance statistics
- Lesson progress tracking
- Student performance metrics
- Missed/delayed student identification

### Curriculum Management
- Template-based curriculum planning
- Hierarchical node structure
- Progress tracking with status management
- Late lesson detection
- Lesson span management
- Group-specific curriculum assignment

### Evaluation System
- Flexible evaluation criteria
- Points and minimum marks configuration
- Mistake tracking with marks reduction
- Session-based evaluation
- Bulk synchronization support

---

## Database Schema Highlights

The system uses Prisma with the following key relationships:
- Organization → Mosque → Campaign → Group → Student
- Curriculum → Category → Template → Node → Lesson Session
- Teacher → Campaign Assignment → Group → Student
- Evaluation → Saving Session → Session Surah → Mistake
- Attendance → Student + Group + Campaign

---

## API Design Patterns

### Consistent Patterns
- RESTful endpoint design
- Swagger documentation for all endpoints
- Header-based context (campaign_id, organization_id)
- DTO validation
- Error handling with proper HTTP status codes
- Response formatting with messages

### Authentication Flow
1. Login via appropriate endpoint (admin/teacher/student)
2. Receive JWT token
3. Include token in Authorization header
4. Access protected endpoints with campaign context

### Common Query Parameters
- `campaign_id` - Filter by campaign
- `organization_id` - Filter by organization
- `mosque_id` - Filter by mosque
- Date ranges for reporting
- ID-based filtering for relationships

---

## Technology Stack

- **Backend Framework**: NestJS
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Deployment**: Vercel (configured)

---

## Summary

The Halakat backend provides a comprehensive solution for Quran memorization management with:
- 19 service modules covering all aspects of memorization program management
- 21 controllers exposing RESTful APIs
- Role-based access control with campaign-specific permissions
- Comprehensive reporting and analytics
- Curriculum planning and progress tracking
- Evaluation and assessment system
- Activity logging and audit trails
- Multi-tenant support (organizations, mosques, campaigns)

The system is designed to scale across multiple organizations, mosques, and campaigns while maintaining data isolation and security through proper access controls and context-based filtering.