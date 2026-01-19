# Database Entity Relationship Diagram (ERD)

## Visual Representation

```
┌─────────────────────────────────┐
│         DEPARTMENTS             │
├─────────────────────────────────┤
│ PK │ id              (integer)  │
│    │ code            (varchar)  │ ← UNIQUE
│    │ name            (varchar)  │
│    │ description     (varchar)  │
│    │ created_At      (timestamp)│
│    │ updated_At      (timestamp)│
└─────────────────────────────────┘
           │
           │ 1
           │
           │ has many
           │
           ▼
┌─────────────────────────────────┐
│           SUBJECTS              │
├─────────────────────────────────┤
│ PK │ id              (integer)  │
│ FK │ departmentsId   (integer)  │──┐
│    │ code            (varchar)  │ ← UNIQUE
│    │ name            (varchar)  │  │
│    │ description     (varchar)  │  │
│    │ created_At      (timestamp)│  │
│    │ updated_At      (timestamp)│  │
└─────────────────────────────────┘  │
                                     │
                                     │ references
                                     │
                                     └─── departments.id
```

## Relationship Details

### Departments → Subjects (One-to-Many)

**Cardinality**: One Department can have Many Subjects

**Relationship Type**: Parent-Child

**Foreign Key**:
- Table: `subjects`
- Column: `departmentsId`
- References: `departments.id`
- Constraint: `ON DELETE RESTRICT`

**Business Rules**:
- A subject must belong to exactly one department
- A department can have zero or more subjects
- Cannot delete a department if it has subjects (RESTRICT)
- Subject codes must be unique across all departments

## Entity Descriptions

### Department Entity

**Purpose**: Represents an academic department within the university.

**Key Attributes**:
- `code`: Short identifier (e.g., "CS", "MATH")
- `name`: Full department name
- `description`: Optional detailed description

**Uniqueness Constraints**:
- `code` must be unique across all departments

**Lifecycle**:
- Created when a new department is established
- Cannot be deleted if it has associated subjects
- Automatically tracks creation and update timestamps

### Subject Entity

**Purpose**: Represents an academic subject/course offered by a department.

**Key Attributes**:
- `code`: Subject identifier (e.g., "CS101", "MATH201")
- `name`: Full subject name
- `description`: Optional course description
- `departmentsId`: Links to parent department

**Uniqueness Constraints**:
- `code` must be unique across all subjects (globally unique)

**Dependencies**:
- Requires a valid department to exist
- Cannot exist without a parent department

**Lifecycle**:
- Created when a new subject is added to a department
- Can be deleted independently (doesn't restrict department deletion)
- Automatically tracks creation and update timestamps

## Data Flow

### Creating a Subject

```
1. Verify department exists
   ↓
2. Check subject code uniqueness
   ↓
3. Insert subject with departmentsId
   ↓
4. Auto-set created_At and updated_At
```

### Deleting a Department

```
1. Check if department has subjects
   ↓
2. If subjects exist → RESTRICT (prevent deletion)
   ↓
3. If no subjects → Allow deletion
```

### Querying with Relations

**Get Department with Subjects**:
```typescript
const dept = await db.query.departments.findFirst({
  where: eq(departments.id, 1),
  with: {
    subjects: true  // Eagerly loads all subjects
  }
});
```

**Get Subject with Department**:
```typescript
const subject = await db.query.subjects.findFirst({
  where: eq(subjects.id, 1),
  with: {
    departments: true  // Eagerly loads parent department
  }
});
```

## Cardinality Summary

| Relationship | Type | Cardinality | Description |
|--------------|------|-------------|-------------|
| Departments → Subjects | One-to-Many | 1:N | One department has many subjects |
| Subjects → Departments | Many-to-One | N:1 | Many subjects belong to one department |

## Future Relationships

As the schema expands, potential relationships:

```
DEPARTMENTS (1) ──< (N) SUBJECTS (1) ──< (N) CLASSES
                                              │
                                              │ (N)
                                              │
                                              ▼
                                          ENROLLMENTS (N) ──> (1) STUDENTS
```

This would create:
- **Subjects → Classes**: One-to-Many (a subject can have multiple class instances)
- **Classes → Enrollments**: One-to-Many (a class can have many enrollments)
- **Students → Enrollments**: One-to-Many (a student can enroll in many classes)
- **Enrollments**: Junction table linking Students and Classes

## Normalization

The current schema follows **Third Normal Form (3NF)**:

✅ **1NF**: All columns contain atomic values
✅ **2NF**: No partial dependencies (all non-key attributes depend on full primary key)
✅ **3NF**: No transitive dependencies (subject attributes depend only on subject, not on department attributes through department)

**Benefits**:
- No data redundancy
- Easy to maintain
- Clear separation of concerns
- Efficient storage

## Indexes

**Primary Indexes** (automatically created):
- `departments.id` (PRIMARY KEY)
- `subjects.id` (PRIMARY KEY)

**Unique Indexes**:
- `departments.code` (UNIQUE constraint)
- `subjects.code` (UNIQUE constraint)

**Foreign Key Indexes** (automatically created by PostgreSQL):
- `subjects.departmentsId` (indexed for join performance)

## Query Patterns

### Common Queries

**Find all subjects in a department**:
```sql
SELECT * FROM subjects WHERE departmentsId = ?;
```

**Find department for a subject**:
```sql
SELECT d.* FROM departments d
JOIN subjects s ON d.id = s.departmentsId
WHERE s.id = ?;
```

**Count subjects per department**:
```sql
SELECT d.name, COUNT(s.id) as subject_count
FROM departments d
LEFT JOIN subjects s ON d.id = s.departmentsId
GROUP BY d.id, d.name;
```
