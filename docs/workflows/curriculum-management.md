# Curriculum Management Workflow

## Overview

The curriculum system has four layers: base Curriculum → Campaign-specific Template → Node hierarchy → Lesson Sessions. This enables reusable curriculum definitions with campaign-specific implementations.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  ORGANIZATION LEVEL                                      │
│  ┌────────────┐    ┌────────────┐                       │
│  │ Curriculum │────│ Categories │   (Reusable)           │
│  └────────────┘    └────────────┘                       │
├─────────────────────────────────────────────────────────┤
│  CAMPAIGN LEVEL                                          │
│  ┌──────────────────┐                                   │
│  │ CurriculumTemp..  │  (Implements a Curriculum)         │
│  └──────────────────┘                                   │
│         │                                                │
│  ┌──────┴─────────┐                                     │
│  │ Template Nodes  │  (Hierarchical, ordered)            │
│  │ ├─ Node 1       │  status: PLANNED | IN_PROGRESS     │
│  │ ├─ Node 2       │         | LATE | COMPLETED          │
│  │ └─ Node 3       │  lesson_span: expected sessions     │
│  └──────┬─────────┘                                     │
│         │                                                │
│  ┌──────┴─────────┐                                     │
│  │ Lesson Sessions │  (Actual delivery)                   │
│  │ session_number  │  is_late tracking                   │
│  │ is_finished     │  duration                           │
│  └────────────────┘                                     │
├─────────────────────────────────────────────────────────┤
│  GROUP LEVEL                                             │
│  ┌──────────────────┐                                   │
│  │ GroupCurriculum   │  (Template assigned to group)     │
│  │ target_end_date   │                                   │
│  └──────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
```

## Data Model

```prisma
model Curriculum {
  id              Int      @id @default(autoincrement())
  organization_id Int?     // NULL = global
  name            String
  description     String?
  categories      CurriculumCategory[]
  templates       CurriculumTemplate[]
}

model Category {
  id              Int      @id @default(autoincrement())
  organization_id Int?
  name            String
  description     String?
  color           String?
  curricula       CurriculumCategory[]
}

model CurriculumTemplate {
  id            Int      @id @default(autoincrement())
  curriculum_id Int         // FK to Curriculum
  campaign_id   Int         // FK to Campaign
  name          String?
  notes         String?
  nodes         CurriculumTemplateNode[]
  group_curricula GroupCurriculum[]
  @@unique([curriculum_id, campaign_id])
}

model CurriculumTemplateNode {
  id                         Int      @id @default(autoincrement())
  template_id                Int
  parent_id                  Int?         // Self-referential
  name                       String
  description                String?
  node_type                  String?
  order_index                Int
  estimated_lessons_count    Int?
  estimated_duration_minutes Int?
  lesson_span                Int?         // Expected lessons
  status                     NodeStatus   @default(PLANNED)
  parent           CurriculumTemplateNode? @relation("NodeHierarchy")
  children         CurriculumTemplateNode[] @relation("NodeHierarchy")
  lesson_sessions  CurriculumLessonSession[]
}

model CurriculumLessonSession {
  id                      Int       @id @default(autoincrement())
  node_id                 Int
  group_id                Int
  teacher_id              Int
  campaign_id             Int
  session_number          Int
  date                    DateTime?
  is_finished             Boolean   @default(false)
  duration_minutes        Int?
  notes                   String?
  is_late                 Boolean   @default(false)
  @@unique([node_id, group_id, session_number])
}

model GroupCurriculum {
  id              Int       @id @default(autoincrement())
  group_id        Int
  template_id     Int
  campaign_id     Int
  assigned_date   DateTime  @default(now())
  target_end_date DateTime?
  is_active       Boolean   @default(true)
  @@unique([group_id, template_id, campaign_id])
}
```

## Workflows

### 1. Curriculum Creation

```
POST /curriculum  →  Create base curriculum with categories
       │
       ▼
POST /category    →  Create categories (color-coded)
       │
       ▼
Curriculum linked to categories via CurriculumCategory
```

**Endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/curriculum` | Create curriculum with category_ids |
| `GET` | `/curriculum` | List (filter by organizationId) |
| `GET` | `/curriculum/:id` | Get with categories |
| `PUT` | `/curriculum/:id` | Update (replace categories) |
| `DELETE` | `/curriculum/:id` | Delete |
| `POST` | `/category` | Create category |
| `GET` | `/category` | List (filter by organizationId) |
| `PATCH` | `/category/:id` | Update category |
| `DELETE` | `/category/:id` | Delete (blocked if in use) |

---

### 2. Template & Node Setup

```
POST /curriculum-template  →  Create template (curriculum + campaign)
       │
       ▼
POST /curriculum-template/node  →  Create nodes in sequence
       │                              (with parent_id for hierarchy)
       ▼
POST /curriculum-template/assign  →  Assign template to group
```

**Template Endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/curriculum-template` | Create (links curriculum to campaign) |
| `GET` | `/curriculum-template` | List (filter by campaignId, curriculumId) |
| `GET` | `/curriculum-template/:id` | Get with nodes |
| `PUT` | `/curriculum-template/:id` | Update |
| `DELETE` | `/curriculum-template/:id` | Delete |
| `GET` | `/curriculum-template/group/:groupId` | Templates by group |
| `POST` | `/curriculum-template/assign` | Assign template to group |

**Node Endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/curriculum-template/node` | Create node |
| `GET` | `/curriculum-template/:templateId/nodes` | All nodes for template |
| `GET` | `/curriculum-template/:templateId/next-node` | Get next node (IN_PROGRESS or first PLANNED) |
| `GET` | `/curriculum-template/node/:id` | Get node details |
| `PUT` | `/curriculum-template/node/:id` | Update node |
| `DELETE` | `/curriculum-template/node/:id` | Delete node |

---

### 3. Lesson Delivery

```
POST /curriculum-lesson-session  →  Create lesson session
       │
       ▼ (teacher conducts lesson)
       │
PATCH /curriculum-lesson-session/:id/finish  →  Mark as finished
       │
       ▼
Node status auto-updates: PLANNED → IN_PROGRESS → LATE/COMPLETED
```

**Session Endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/curriculum-lesson-session` | Create session (checks unique [node, group, session_number]) |
| `GET` | `/curriculum-lesson-session` | List (filter by campaign, group, teacher, node) |
| `GET` | `/curriculum-lesson-session/by-node-group/:nodeId/:groupId` | Sessions for node+group |
| `GET` | `/curriculum-lesson-session/group/:groupId` | All sessions for group |
| `GET` | `/curriculum-lesson-session/group/:groupId/current-node` | Current node + progress |
| `GET` | `/curriculum-lesson-session/progress/:nodeId/:groupId` | Detailed progress |
| `PATCH` | `/curriculum-lesson-session/:id/finish` | Mark finished (+ log) |
| `PATCH` | `/curriculum-lesson-session/:id` | Update session |
| `DELETE` | `/curriculum-lesson-session/:id` | Delete session |

---

### 4. Node Status Auto-Management

When creating or updating lesson sessions, the system automatically updates node status:

```typescript
// curriculum-lesson-session.service.ts

create(dto) → Check if session_number > node.lesson_span → Set is_late = true
            → Update node status via updateNodeStatusIfNeeded()

updateNodeStatusIfNeeded(nodeId, groupId):
  ├─ If any late lessons → status = LATE
  ├─ Else if lessons exist → status = IN_PROGRESS
  └─ Else → status = PLANNED (unchanged)
```

**NodeStatus Enum**:
```typescript
enum NodeStatus {
  PLANNED,       // Not started
  IN_PROGRESS,   // Has lessons, within span
  COMPLETED,     // Finished within span (manually set)
  LATE,          // Exceeded lesson_span
  SKIPPED,       // Intentionally skipped
  CANCELLED,     // Removed from plan
}
```

### 5. Next Node Recommendation

```
GET /curriculum-template/:templateId/next-node
```

**Logic**:
1. Find first node with `IN_PROGRESS` status (resume in-progress work)
2. If none, find first node with `PLANNED` status (start new node)
3. Return `null` if no more nodes

---

### 6. Current Node for Group

```
GET /curriculum-lesson-session/group/:groupId/current-node
```

**Logic**:
1. Find latest lesson session for group
2. Get its node
3. Calculate progress: total, completed, late lessons
4. Check if over span

**Response**:
```typescript
{
  node: { id, name, description, node_type, order_index, lesson_span, status },
  progress: {
    total_lessons, completed_lessons, late_lessons,
    is_over_span, last_lesson_date
  }
}
```

## Audit Integration

Lesson session completion creates activity logs:

```typescript
// In curriculum-lesson-session.service.ts:markAsFinished()
await this.logService.create({
  event: 'CURRICULUM_END',
  teacher_id: session.teacher_id,
  group_id: session.group_id,
  notes: `تم إنهاء الدرس: ${nodeName}`,
  metadata: { lesson_id, group_id }
}, campaignId);
```

## Key Service Methods

### CurriculumTemplateService (`src/curriculum-template/curriculum-template.service.ts`)

| Method | Purpose |
|--------|---------|
| `create(dto)` | Create template (unique per curriculum+campaign) |
| `findAll(campaignId?, curriculumId?)` | Filtered list |
| `findByGroup(groupId)` | Templates assigned to group |
| `assignTemplateToGroup(dto)` | Assign with target end date |
| `createNode(dto)` | Create node with parent hierarchy |
| `findNodesByTemplate(templateId)` | Ordered nodes |
| `getNextNode(templateId)` | IN_PROGRESS or first PLANNED |
| `updateNode(id, dto)` | Update + status |

### CurriculumLessonSessionService (`src/curriculum-lesson-session/curriculum-lesson-session.service.ts`)

| Method | Purpose |
|--------|---------|
| `create(dto)` | Create with late detection + status update |
| `findAll(campaignId?, groupId?, teacherId?, nodeId?)` | Filtered list |
| `findByNodeAndGroup(nodeId, groupId)` | Ordered sessions |
| `findAllByGroup(groupId)` | All sessions for group |
| `getCurrentNodeForGroup(groupId)` | Current node + progress |
| `markAsFinished(id, duration?, notes?)` | Complete + log |
| `updateNodeStatusIfNeeded(nodeId, groupId)` | Auto-status logic |
