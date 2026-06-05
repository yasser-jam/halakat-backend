# Organization & Mosque Management

## Overview

Organizations and Mosques form the top-level hierarchy. Organizations own curricula and categories. Mosques host campaigns and students.

## Data Model

```prisma
model Organization {
  id            Int      @id @default(autoincrement())
  name          String
  description   String?
  contact_email String?
  contact_phone String?
  address       String?
  is_active     Boolean  @default(true)
  metadata      Json?
  // Relations
  mosques       Mosque[]
  managers      OrganizationManager[]
  Curriculum    Curriculum[]
  Category      Category[]
}

model Mosque {
  id              Int      @id @default(autoincrement())
  organization_id Int
  name            String
  city            String?
  address_area    String?
  address_details String?
  contact_phone   String?
  contact_email   String?
  is_active       Boolean  @default(true)
  metadata        Json?
  // Relations
  organization    Organization @relation(fields: [organization_id], references: [id], onDelete: Cascade)
  managers        MosqueManager[]
  campaigns       Campaign[]
  students        Student[]
}
```

## Organization Endpoints

### POST `/organizations`
Create organization with optional owner teacher

**Body** (`CreateOrganizationDto`):
```typescript
{
  name: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  // Owner teacher fields (auto-created):
  owner_phone?: string;
  owner_password?: string;
  owner_first_name?: string;
  owner_last_name?: string;
}
```

**Transaction Flow**:
1. Create Organization
2. If owner info provided: Create Teacher → Create OrganizationManager (role: OWNER)

**Response**: `{ message, data: { org, owner? } }`

---

### GET `/organizations`
List all organizations

**Response**: `{ message, data: Organization[] }`

---

### GET `/organizations/:id`
Get organization by ID

**Response**: `{ message, data: Organization }`

---

### PUT `/organizations/:id`
Update organization

---

### DELETE `/organizations/:id`
Delete organization (cascades to mosques, campaigns, etc.)

## Mosque Endpoints

### POST `/mosques`
Create mosque

**Body** (`CreateMosqueDto`): `{ organization_id, name, city?, address_area?, address_details?, contact_phone?, contact_email? }`

---

### GET `/mosques`
List mosques (filtered by organization)

**Headers**: `organization_id` (optional)

---

### GET `/mosques/:id`
Get mosque by ID

---

### PUT `/mosques/:id`
Update mosque

---

### DELETE `/mosques/:id`
Delete mosque (cascades to campaigns)

## Admin Teacher Management

Teachers with elevated roles are linked via:

```prisma
model OrganizationManager {
  teacher_id      Int
  organization_id Int
  role            OrgRole  // OWNER | ADMIN | MANAGER
  is_active       Boolean  @default(true)
  @@unique([teacher_id, organization_id])
}

model MosqueManager {
  teacher_id Int
  mosque_id  Int
  role       MosqueRole  // ADMIN | MANAGER
  is_active  Boolean  @default(true)
  @@unique([teacher_id, mosque_id])
}
```

These are created automatically when:
- Organization is created with owner info (OrganizationManager with OWNER role)
- Teacher login detects ORGANIZATION_ADMIN or MOSQUE_ADMIN roles
