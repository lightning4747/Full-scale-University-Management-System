# Database Documentation

This directory contains comprehensive documentation for the University Management System database.

## Documentation Index

### 📋 [Database Schema Design](./database-schema.md)
Complete reference for all database tables, columns, relationships, and data integrity rules.

**Topics Covered**:
- Table structures and constraints
- Relationships and foreign keys
- Type safety with Drizzle ORM
- Migration strategy
- Best practices

### 🛠️ [Database Setup Guide](./database-setup.md)
Step-by-step instructions for setting up and configuring the database.

**Topics Covered**:
- Initial setup and configuration
- Environment variables
- Running migrations
- Using the database client
- Troubleshooting common issues

### 🔗 [Entity Relationship Diagram](./database-erd.md)
Visual representation of database relationships and entity descriptions.

**Topics Covered**:
- ERD diagrams
- Relationship cardinality
- Data flow patterns
- Query examples
- Normalization details

## Quick Start

1. **Set up environment**: See [Database Setup Guide](./database-setup.md#initial-setup)
2. **Review schema**: See [Database Schema Design](./database-schema.md#tables)
3. **Understand relationships**: See [Entity Relationship Diagram](./database-erd.md#relationship-details)

## Database Overview

The current database schema includes:

- **Departments**: Academic departments (e.g., Computer Science, Mathematics)
- **Subjects**: Courses/subjects offered by departments (e.g., CS101, MATH201)

### Key Features

- ✅ Type-safe database operations with Drizzle ORM
- ✅ Automatic timestamp tracking (created_At, updated_At)
- ✅ Foreign key constraints with RESTRICT on delete
- ✅ Unique constraints on department and subject codes
- ✅ Migration-based schema management

## Technology Stack

- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Migration Tool**: Drizzle Kit
- **Connection**: Neon WebSocket driver

## Common Tasks

### Generate a Migration
```bash
npm run db:generate
```

### Apply Migrations
```bash
npm run db:migrate
```

### Query Example
```typescript
import { db } from './db/db';
import { departments, subjects } from './db/schema';
import { eq } from 'drizzle-orm';

// Get all subjects in a department
const csSubjects = await db.select()
  .from(subjects)
  .where(eq(subjects.departmentsId, 1));
```

## Contributing

When modifying the database schema:

1. Update `src/db/schema/app.ts`
2. Generate migration: `npm run db:generate`
3. Review generated SQL
4. Apply migration: `npm run db:migrate`
5. Update relevant documentation

## Support

For issues or questions:
- Check [Troubleshooting](./database-setup.md#troubleshooting) section
- Review [Database Schema Design](./database-schema.md) for structure details
- Consult [Entity Relationship Diagram](./database-erd.md) for relationship clarity
