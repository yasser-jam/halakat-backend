# Authentication System Documentation

## Overview

The Halakat backend uses a flexible authentication system that supports multiple user types with different roles and capabilities. The system is designed around the concept that **Teachers** are the primary users who can have various management responsibilities in addition to their teaching duties.

## User Types

### 1. Teacher (Primary User Type)
All non-student users in the system are `Teacher` records. Teachers can have multiple roles:
- Regular teachers who teach in groups
- Mosque administrators who manage specific mosques
- Organization administrators who manage organizations
- System administrators

### 2. Student
Students are kept separate with their own authentication flow. They login with their student mobile number and password.

## Management Relations

### Organization Management (M-M)
Teachers can manage multiple organizations, and organizations can have multiple managers. This relationship is defined through the `OrganizationManager` junction table.

**OrganizationManager Fields:**
- `teacher_id`: Reference to the Teacher
- `organization_id`: Reference to the Organization
- `role`: The management role (from `OrgRole` enum)
- `is_active`: Whether this management relationship is active
- `assigned_date`: When the teacher was assigned as manager

**OrgRole Enum:**
- `OWNER`: Full control over the organization
- `ADMIN`: Can manage organization settings and assign managers
- `MANAGER`: Limited management capabilities

### Mosque Management (M-M)
Teachers can manage multiple mosques within an organization, and mosques can have multiple managers. This relationship is defined through the `MosqueManager` junction table.

**MosqueManager Fields:**
- `teacher_id`: Reference to the Teacher
- `mosque_id`: Reference to the Mosque
- `role`: The management role (from `MosqueRole` enum)
- `is_active`: Whether this management relationship is active
- `assigned_date`: When the teacher was assigned as manager

**MosqueRole Enum:**
- `ADMIN`: Can manage mosque settings, campaigns, and assign managers
- `MANAGER`: Limited mosque management capabilities

**Important:** Mosque managers should belong to mosques within organizations they have access to.

## Teaching Relations

In addition to management roles, teachers can be assigned to campaigns and groups for teaching purposes:

### Campaign Assignments (M-M)
- `TeacherCampaign`: Links teachers to campaigns they teach in
- Teachers can teach in multiple campaigns across different mosques

### Group Assignments (M-M)
- `TeacherGroup`: Links teachers to specific groups they teach
- `StudentGroup`: Links students to groups within campaigns

## Role Hierarchy

### Teacher.role Enum
The `Teacher` model has a `role` field that defines their system-level role:
- `TEACHER`: Regular teacher
- `MANAGER`: General manager
- `ADMIN`: System admin
- `SUPER_ADMIN`: Super administrator with full access
- `MANAGER_ASSISTANT`: Assistant to manager
- `AUDIBLE`: Audio/pronunciation specialist
- `AUDIBLE_ASSISTANT`: Assistant to audible specialist

**Note:** The previous `ORGANIZATION_ADMIN` and `MOSQUE_ADMIN` roles have been removed. These are now handled through the management junction tables (`OrganizationManager` and `MosqueManager`).

## Authentication Flow

### Unified Login (POST /auth/login)

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "mobile_phone_number": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": 1,
    "mobile_phone_number": "+1234567890",
    "first_name": "Ahmed",
    "last_name": "Hassan",
    "role": "TEACHER",
    "managedOrganizations": [
      {
        "id": 1,
        "name": "Islamic Center",
        "role": "OWNER",
        "organization": { /* full org object */ }
      }
    ],
    "managedMosques": [
      {
        "id": 1,
        "name": "Al-Noor Mosque",
        "role": "ADMIN",
        "mosque": { /* full mosque object with organization */ }
      }
    ],
    "teachingCampaigns": [
      {
        "id": 1,
        "name": "Summer 2024",
        "campaign": { /* full campaign object with mosque and organization */ }
      }
    ],
    "teachingGroups": [
      {
        "group": { /* group details */ },
        "campaign": { /* campaign details */ }
      }
    ]
  }
}
```

### Student Login (POST /auth/login/student)

**Endpoint:** `POST /auth/login/student`

**Request Body:**
```json
{
  "student_mobile": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_here"
}
```

### Legacy Endpoints (Kept for Backward Compatibility)

- `POST /auth/login/admin` - Login for system admins
- `POST /auth/login/teacher` - Login for teachers (returns limited context)

## JWT Token Structure

### Teacher Token Payload:
```json
{
  "sub": 1,           // Teacher ID
  "userType": "TEACHER",
  "role": "TEACHER",  // System role
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Student Token Payload:
```json
{
  "sub": 1,           // Student ID
  "userType": "STUDENT",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Frontend Routing Strategy

The frontend should route users based on their management and teaching context:

```javascript
const response = await login(phone, password);

// Priority 1: Super Admin
if (response.user.role === 'SUPER_ADMIN') {
  navigate('/super-admin/dashboard');
}
// Priority 2: Organization Management
else if (response.user.managedOrganizations.length > 0) {
  if (response.user.managedOrganizations.length === 1) {
    const org = response.user.managedOrganizations[0];
    navigate(`/organization/${org.id}/dashboard`);
  } else {
    // Multiple orgs - show selector
    navigate('/select-organization');
  }
}
// Priority 3: Mosque Management
else if (response.user.managedMosques.length > 0) {
  if (response.user.managedMosques.length === 1) {
    const mosque = response.user.managedMosques[0];
    navigate(`/mosque/${mosque.id}/dashboard`);
  } else {
    // Multiple mosques - show selector
    navigate('/select-mosque');
  }
}
// Priority 4: Regular Teacher
else if (response.user.teachingCampaigns.length > 0) {
  navigate('/teacher/dashboard');
}
// No assignments
else {
  navigate('/no-access');
}
```

**Important:** Any dashboard (organization, mosque, or teacher) can show teaching features if the user has `teachingCampaigns` or `teachingGroups`.

## Creating Organizations with Owners

When creating a new organization, you can optionally specify an owner:

**Endpoint:** `POST /organizations`

**Request Body:**
```json
{
  "name": "Islamic Center",
  "description": "Community Islamic Center",
  "contact_email": "info@islamic-center.org",
  "contact_phone": "+1234567890",
  "address": "123 Main St",
  "owner_phone": "+9876543210",
  "owner_first_name": "Ahmed",
  "owner_last_name": "Hassan",
  "owner_password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Organization created",
  "data": {
    "org": { /* organization object */ },
    "owner": { /* teacher object */ }
  }
}
```

**What Happens:**
1. Organization is created
2. A Teacher record is created with the provided phone and credentials
3. An `OrganizationManager` record is created linking the teacher to the organization with role `OWNER`

## Adding Additional Managers

### Add Organization Manager

```typescript
// In OrganizationService
async addManager(organizationId: number, teacherId: number, role: OrgRole) {
  return this.prisma.organizationManager.create({
    data: {
      organization_id: organizationId,
      teacher_id: teacherId,
      role: role,
      is_active: true,
    },
  });
}
```

### Add Mosque Manager

```typescript
// In MosqueService
async addManager(mosqueId: number, teacherId: number, role: MosqueRole) {
  // Optional: Verify teacher has access to parent organization
  const mosque = await this.prisma.mosque.findUnique({
    where: { id: mosqueId },
    include: { organization: true },
  });

  const hasOrgAccess = await this.prisma.organizationManager.findUnique({
    where: {
      teacher_id_organization_id: {
        teacher_id: teacherId,
        organization_id: mosque.organization_id,
      },
    },
  });

  if (!hasOrgAccess) {
    throw new Error('Teacher must manage parent organization first');
  }

  return this.prisma.mosqueManager.create({
    data: {
      mosque_id: mosqueId,
      teacher_id: teacherId,
      role: role,
      is_active: true,
    },
  });
}
```

## Permission Checking

### Check Organization Management Permission
```typescript
async hasOrgPermission(teacherId: number, organizationId: number, requiredRole?: OrgRole) {
  const manager = await this.prisma.organizationManager.findUnique({
    where: {
      teacher_id_organization_id: {
        teacher_id: teacherId,
        organization_id: organizationId,
      },
    },
  });

  if (!manager || !manager.is_active) return false;
  
  if (requiredRole) {
    // Implement role hierarchy checking if needed
    return manager.role === requiredRole;
  }
  
  return true;
}
```

### Check Mosque Management Permission
```typescript
async hasMosquePermission(teacherId: number, mosqueId: number, requiredRole?: MosqueRole) {
  const manager = await this.prisma.mosqueManager.findUnique({
    where: {
      teacher_id_mosque_id: {
        teacher_id: teacherId,
        mosque_id: mosqueId,
      },
    },
  });

  if (!manager || !manager.is_active) return false;
  
  if (requiredRole) {
    return manager.role === requiredRole;
  }
  
  return true;
}
```

## Migration Notes

### Breaking Changes from Previous System

1. **OrganizationUser Model Removed**
   - All organization users are now Teachers with OrganizationManager relationships
   - Migration required to convert existing OrganizationUser records to Teachers

2. **Role Enum Updated**
   - `ORGANIZATION_ADMIN` removed (use OrganizationManager with OWNER/ADMIN role)
   - `MOSQUE_ADMIN` removed (use MosqueManager with ADMIN role)

3. **Authentication Changes**
   - New unified `/auth/login` endpoint returns full context
   - Legacy endpoints still work but return limited data

### Migration Steps

1. **Backup your database**
2. **Update schema**: `npx prisma db push` or create migration
3. **Run data migration script** (if you have existing OrganizationUser records)
4. **Update frontend** to use new login endpoint and routing logic
5. **Test authentication flows** thoroughly

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 10
2. **JWT Expiration**: Tokens expire after 7 days (configurable)
3. **Cascade Deletion**: Deleting a teacher removes their management relationships
4. **Active Flag**: Management relationships can be deactivated without deletion
5. **Phone Number Uniqueness**: Teacher mobile numbers are globally unique

## Best Practices

1. **Always check `is_active`** when querying management relationships
2. **Verify parent organization access** before assigning mosque managers
3. **Use transactions** when creating organizations with owners
4. **Include full context** in login response for efficient frontend routing
5. **Cache management context** on the frontend to avoid repeated API calls

## API Endpoints Summary

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/auth/login` | POST | Unified login for all teachers | No |
| `/auth/login/student` | POST | Student login | No |
| `/auth/login/admin` | POST | Admin login (legacy) | No |
| `/auth/login/teacher` | POST | Teacher login (legacy) | No |
| `/auth/profile` | POST | Get teacher profile | Yes |
| `/auth/my-permissions` | POST | Get permissions for campaign | Yes |
| `/organizations` | POST | Create organization with owner | No |
| `/organizations/:id` | GET | Get organization details | No |
| `/organizations/:id` | PUT | Update organization | Yes |
| `/organizations/:id` | DELETE | Delete organization | Yes |

## Examples

### Example 1: Create Organization with Owner
```typescript
const result = await createOrganization({
  name: "Al-Rahman Islamic Center",
  description: "Community center for Islamic education",
  owner_phone: "+1234567890",
  owner_first_name: "Ahmed",
  owner_last_name: "Hassan",
  owner_password: "securePass123"
});

// Result includes both org and owner
console.log(result.data.org.id);
console.log(result.data.owner.id);
```

### Example 2: Login and Route
```typescript
const response = await login("+1234567890", "password");

// Check what they manage
if (response.user.managedOrganizations.length > 0) {
  // Organization manager
  const org = response.user.managedOrganizations[0];
  console.log(`Managing ${org.name} as ${org.role}`);
}

if (response.user.teachingCampaigns.length > 0) {
  // Also teaching
  console.log(`Teaching in ${response.user.teachingCampaigns.length} campaigns`);
}
```

### Example 3: Check Permissions
```typescript
// Check if teacher can manage organization
const canManage = await hasOrgPermission(teacherId, orgId);

// Check specific role
const isOwner = await hasOrgPermission(teacherId, orgId, 'OWNER');
```

## Troubleshooting

### Issue: Teacher can't login after creating organization
**Solution**: Verify the teacher was created with a hashed password and the mobile_phone_number is unique.

### Issue: Management context not showing in login response
**Solution**: Check that `is_active` is true in the OrganizationManager/MosqueManager record.

### Issue: Teacher assigned to mosque in different organization
**Solution**: Add validation to ensure mosque managers belong to parent organization.

### Issue: Duplicate teacher when adding manager
**Solution**: Check if teacher already exists with the phone number before creating a new one.

## Future Enhancements

1. **Email-based login** for organization managers
2. **Two-factor authentication** for sensitive roles
3. **Role hierarchy validation** (e.g., OWNER > ADMIN > MANAGER)
4. **Audit logging** for management assignments
5. **Temporary management assignments** with expiration dates
6. **Delegated permissions** for fine-grained access control


