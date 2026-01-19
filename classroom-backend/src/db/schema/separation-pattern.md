Benefits of using `schema/index.ts` to re-export from `app.ts`:

## Benefits of the separation pattern

### 1. Scalability and organization
As the app grows, you can split schemas by domain:
```
schema/
  ├── index.ts      (re-exports everything)
  ├── app.ts        (core app tables: department, subjects)
  ├── users.ts      (user-related tables)
  ├── courses.ts    (course-related tables)
  └── enrollments.ts (enrollment tables)
```

Then `schema/index.ts` becomes:
```typescript
export * from './app';
export * from './users';
export * from './courses';
export * from './enrollments';
```

### 2. Single import point
Instead of:
```typescript
import { department } from './db/schema/app';
import { users } from './db/schema/users';
import { courses } from './db/schema/courses';
```

You can do:
```typescript
import { department, users, courses } from './db/schema';
```

### 3. Easier refactoring
If you rename or move `app.ts`, you only update `schema/index.ts`; other files keep importing from `'./schema'`.

### 4. Cleaner public API
`index.ts` acts as a public interface, exposing only what should be used elsewhere.

### 5. Avoids circular dependencies
Organizing schemas across files and re-exporting through `index.ts` helps prevent circular imports.

---

## When to use it

- Small projects: writing directly in one file is fine.
- Medium/large projects: this pattern helps maintainability.

