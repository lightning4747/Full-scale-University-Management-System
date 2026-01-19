# Database Schema Design

## Overview

This document describes the database schema for the University Management System. The database is built using PostgreSQL with Drizzle ORM for type-safe database operations.

## Database Technology Stack

- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: Drizzle ORM
- **Connection**: Neon WebSocket driver for persistent connections
- **Migration Tool**: Drizzle Kit

## Schema Architecture

The database schema is organized using a modular approach:

```
src/db/
├── db.ts              # Database connection and client
├── schema/
│   ├── index.ts       # Public API - re-exports all schemas
│   └── app.ts         # Core application tables
```

## Tables

### 1. Departments Table

The `departments` table stores information about academic departments within the university.

**Table Name**: `departments`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `integer` | PRIMARY KEY, GENERATED ALWAYS AS IDENTITY | Unique identifier for the department |
| `code` | `varchar(50)` | NOT NULL, UNIQUE | Department code (e.g., "CS", "MATH") |
| `name` | `varchar(255)` | NOT NULL | Full name of the department |
| `description` | `varchar(255)` | NULLABLE | Optional description of the department |
| `created_At` | `timestamp` | NOT NULL, DEFAULT now() | Timestamp when the record was created |
| `updated_At` | `timestamp` | NOT NULL, DEFAULT now() | Timestamp when the record was last updated |

**Indexes**:
- Primary key on `id`
- Unique constraint on `code`

**Example Data**:
```sql
INSERT INTO departments (code, name, description) VALUES
('CS', 'Computer Science', 'Department of Computer Science and Engineering'),
('MATH', 'Mathematics', 'Department of Mathematics and Statistics');
```

### 2. Subjects Table

The `subjects` table stores information about academic subjects/courses offered by departments.

**Table Name**: `subjects`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `integer` | PRIMARY KEY, GENERATED ALWAYS AS IDENTITY | Unique identifier for the subject |
| `departmentsId` | `integer` | NOT NULL, FOREIGN KEY | Reference to the department this subject belongs to |
| `name` | `varchar(255)` | NOT NULL | Full name of the subject |
| `code` | `varchar(50)` | NOT NULL, UNIQUE | Subject code (e.g., "CS101", "MATH201") |
| `description` | `varchar(255)` | NULLABLE | Optional description of the subject |
| `created_At` | `timestamp` | NOT NULL, DEFAULT now() | Timestamp when the record was created |
| `updated_At` | `timestamp` | NOT NULL, DEFAULT now() | Timestamp when the record was last updated |

**Indexes**:
- Primary key on `id`
- Unique constraint on `code`
- Foreign key constraint on `departmentsId` referencing `departments.id`

**Foreign Key Constraint**:
- `subjects.departmentsId` → `departments.id`
- **On Delete**: `RESTRICT` (prevents deletion of a department if it has subjects)
- **On Update**: `NO ACTION`

**Example Data**:
```sql
INSERT INTO subjects (departmentsId, code, name, description) VALUES
(1, 'CS101', 'Introduction to Computer Science', 'Fundamental concepts of computer science'),
(1, 'CS201', 'Data Structures', 'Study of data structures and algorithms'),
(2, 'MATH101', 'Calculus I', 'Introduction to differential and integral calculus');
```

## Relationships

### One-to-Many: Departments → Subjects

- **Relationship Type**: One-to-Many
- **Description**: One department can have many subjects
- **Implementation**: Foreign key `subjects.departmentsId` references `departments.id`
- **Cascade Behavior**: 
  - Deletion is **RESTRICTED** - cannot delete a department if it has subjects
  - This ensures data integrity and prevents orphaned subject records

**Drizzle Relations**:
```typescript
// Department can have many subjects
departmentsRelation = relations(departments, ({ many }) => ({
  subjects: many(subjects)
}))

// Subject belongs to one department
subjectsRelation = relations(subjects, ({ one }) => ({
  departments: one(departments, {
    fields: [subjects.departmentsId],
    references: [departments.id]
  })
}))
```

## Common Patterns

### Timestamps Pattern

All tables include standardized timestamp fields using a shared pattern:

```typescript
const timeStamps = {
  created_At: timestamp('created_At').defaultNow().notNull(),
  updated_At: timestamp('updated_At').defaultNow().$onUpdate(() => new Date()).notNull()
}
```

**Benefits**:
- Consistent audit trail across all tables
- Automatic tracking of record creation and modification times
- `updated_At` automatically updates on record modification

## Type Safety

Drizzle ORM provides TypeScript type inference for all tables:

```typescript
// Select type (for reading)
export type Departments = typeof departments.$inferSelect;
export type Subjects = typeof subjects.$inferSelect;

// Insert type (for creating)
export type NewDepartments = typeof departments.$inferInsert;
export type NewSubjects = typeof subjects.$inferInsert;
```

## Data Integrity Rules

1. **Department Code Uniqueness**: Each department must have a unique code
2. **Subject Code Uniqueness**: Each subject must have a unique code across all departments
3. **Department Deletion Protection**: Departments cannot be deleted if they have associated subjects
4. **Required Fields**: Department and subject codes and names are mandatory
5. **Automatic Timestamps**: All records automatically track creation and update times

## Future Schema Extensions

Potential tables to add as the system grows:

- **Users/Students**: User accounts and student information
- **Instructors**: Faculty and instructor information
- **Enrollments**: Student-subject enrollment records
- **Classes**: Class instances/sections of subjects
- **Grades**: Grade records for enrolled students
- **Schedules**: Class schedules and timetables

## Migration Strategy

Migrations are managed using Drizzle Kit:

1. **Generate Migration**: `npm run db:generate`
   - Creates migration files in `drizzle/` directory
   - Analyzes schema changes and generates SQL

2. **Apply Migration**: `npm run db:migrate`
   - Executes pending migrations against the database
   - Updates database schema to match code definitions

3. **Migration Files**: Located in `drizzle/` directory
   - SQL files: `0000_*.sql`, `0001_*.sql`, etc.
   - Metadata: `meta/_journal.json`, `meta/*_snapshot.json`

## Best Practices

1. **Always use migrations** - Never modify the database schema directly
2. **Test migrations** - Test migrations in development before applying to production
3. **Backup before migration** - Always backup production data before running migrations
4. **Use transactions** - Wrap related operations in transactions when possible
5. **Index foreign keys** - Foreign keys are automatically indexed by PostgreSQL
6. **Use type-safe queries** - Leverage Drizzle's type inference for compile-time safety
