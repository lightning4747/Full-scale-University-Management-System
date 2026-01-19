# Database Setup Guide

## Prerequisites

- Node.js (v18 or higher recommended)
- A Neon PostgreSQL database account
- npm or yarn package manager

## Initial Setup

### 1. Install Dependencies

All required dependencies should already be installed:

```bash
npm install
```

**Key Dependencies**:
- `drizzle-orm` - Type-safe ORM for TypeScript
- `@neondatabase/serverless` - Neon database driver (WebSocket)
- `dotenv` - Environment variable management
- `ws` - WebSocket library for Node.js

**Dev Dependencies**:
- `drizzle-kit` - Migration and schema management tool
- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution tool
- `@types/node` - Node.js type definitions

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

**Getting Your Connection String**:
1. Log in to [Neon Console](https://console.neon.tech)
2. Select your project
3. Go to **Dashboard** → **Connect**
4. Copy the connection string
5. Replace placeholders in the `.env` file

**Important**: Never commit `.env` files to version control. The `.gitignore` should already exclude them.

### 3. Database Connection Configuration

The database connection is configured in `src/db/db.ts`:

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// WebSocket configuration for Node.js
neonConfig.webSocketConstructor = ws;

// Create connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
```

**Connection Type**: WebSocket (persistent connection)
- Best for: Long-running applications like Express servers
- Benefits: Efficient connection pooling, lower latency for frequent queries

## Running Migrations

### Generate Migration Files

When you modify the schema in `src/db/schema/app.ts`, generate migration files:

```bash
npm run db:generate
```

This command:
- Analyzes schema changes
- Generates SQL migration files in `drizzle/` directory
- Creates migration metadata files

### Apply Migrations

Apply pending migrations to your database:

```bash
npm run db:migrate
```

This command:
- Executes SQL migration files against your Neon database
- Updates the database schema
- Records migration history

### Migration Workflow

1. **Modify Schema**: Edit `src/db/schema/app.ts`
2. **Generate Migration**: `npm run db:generate`
3. **Review Migration**: Check generated SQL in `drizzle/` directory
4. **Apply Migration**: `npm run db:migrate`
5. **Verify**: Check your database to confirm changes

## Database Schema Location

The database schema is defined in:
- **Main Schema**: `src/db/schema/app.ts`
- **Public API**: `src/db/schema/index.ts` (re-exports from app.ts)

## Using the Database Client

### Import the Database Client

```typescript
import { db } from './db/db';
import { departments, subjects } from './db/schema';
```

### Example Queries

**Create a Department**:
```typescript
const [newDept] = await db.insert(departments).values({
  code: 'CS',
  name: 'Computer Science',
  description: 'Department of Computer Science'
}).returning();
```

**Query with Relations**:
```typescript
import { eq } from 'drizzle-orm';

// Get department with all subjects
const deptWithSubjects = await db.query.departments.findFirst({
  where: eq(departments.id, 1),
  with: {
    subjects: true
  }
});
```

**Update a Subject**:
```typescript
await db.update(subjects)
  .set({ name: 'Advanced Computer Science' })
  .where(eq(subjects.id, 1));
```

**Delete a Subject**:
```typescript
await db.delete(subjects)
  .where(eq(subjects.id, 1));
```

## Connection Pooling

The database uses a connection pool managed by Neon's Pool class:

- **Automatic Management**: Pool handles connection lifecycle
- **Connection Reuse**: Efficiently reuses connections
- **Graceful Shutdown**: Always close the pool when shutting down:

```typescript
import { pool } from './db/db';

// In your cleanup code
await pool.end();
```

## Troubleshooting

### Connection Errors

**Error**: `DATABASE_URL is not defined`
- **Solution**: Ensure `.env` file exists and contains `DATABASE_URL`

**Error**: `Connection refused` or `ECONNREFUSED`
- **Solution**: Check your Neon connection string and network connectivity
- Verify SSL mode is set correctly (`sslmode=require`)

### Migration Errors

**Error**: `Migration already applied`
- **Solution**: Check `drizzle/meta/_journal.json` for migration history
- Only apply migrations that haven't been executed

**Error**: `Table already exists`
- **Solution**: The migration may have been partially applied
- Check database state and migration history
- Consider rolling back and reapplying

### Type Errors

**Error**: `Cannot find module './db/schema'`
- **Solution**: Ensure `src/db/schema/index.ts` exports from `app.ts`
- Check TypeScript compilation: `npm run build`

## Development vs Production

### Development
- Use local `.env` file for connection string
- Run migrations manually: `npm run db:migrate`
- Use `tsx` for running TypeScript directly: `npm run dev`

### Production
- Use environment variables from hosting platform
- Automate migrations in deployment pipeline
- Use compiled JavaScript: `npm run build && npm start`

## Backup and Recovery

### Before Migrations
Always backup your database before running migrations in production:

1. Use Neon Console to create a database branch
2. Test migrations on the branch first
3. Create a manual backup if needed

### Rollback Strategy
- Drizzle doesn't provide automatic rollback
- Keep migration files for reference
- Use Neon's point-in-time recovery if needed

## Performance Considerations

1. **Indexes**: Foreign keys are automatically indexed
2. **Connection Pooling**: Configured automatically by Neon Pool
3. **Query Optimization**: Use Drizzle's query builder efficiently
4. **Batch Operations**: Use transactions for multiple related operations

## Security Best Practices

1. **Never commit `.env` files**
2. **Use SSL connections** (`sslmode=require`)
3. **Rotate database credentials** regularly
4. **Use least-privilege database users**
5. **Validate all user inputs** before database operations
6. **Use parameterized queries** (Drizzle handles this automatically)
