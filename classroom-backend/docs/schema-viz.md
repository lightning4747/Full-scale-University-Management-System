# Database Architecture Overview

```mermaid
erDiagram
    DEPARTMENTS {
        integer id PK "generatedAlwaysAsIdentity"
        varchar code "unique, not null"
        varchar name "not null"
        text description
    }
    SUBJECTS {
        integer id PK "generatedAlwaysAsIdentity"
        integer department_id FK "references departments.id"
        varchar name "not null"
        varchar code "unique, not null"
        text description
    }
    CLASSES {
        integer id PK "generatedAlwaysAsIdentity"
        integer subject_id FK "references subjects.id"
        text teacher_id FK "references user.id"
        varchar invite_code "unique, not null"
        varchar name "not null"
        varchar status "class_status enum"
        jsonb schedules "not null"
    }
    ENROLLMENTS {
        integer id PK "generatedAlwaysAsIdentity"
        text student_id FK "references user.id"
        integer class_id FK "references classes.id"
        integer grade
        varchar status "enrollment_status enum"
    }
    MATERIALS {
        integer id PK "generatedAlwaysAsIdentity"
        integer class_id FK "references classes.id"
        varchar title "not null"
        text url "not null"
        varchar type "default 'pdf'"
    }
    USER {
        text id PK
        text name "not null"
        text email "not null"
        varchar role "role enum (student, teacher, admin)"
        integer department_id FK "references departments.id"
        boolean email_verified "not null"
    }
    SESSION {
        text id PK
        text user_id FK "references user.id"
        text token "not null"
        timestamp expires_at "not null"
        text ip_address
        text user_agent
    }
    ACCOUNT {
        text id PK
        text user_id FK "references user.id"
        text account_id "not null"
        text provider_id "not null"
        text access_token
        text refresh_token
    }
    VERIFICATION {
        text id PK
        text identifier "not null"
        text value "not null"
        timestamp expires_at "not null"
    }

    DEPARTMENTS ||--o{ SUBJECTS : "contains"
    DEPARTMENTS ||--o{ USER : "assigned_to"
    SUBJECTS ||--o{ CLASSES : "taught_as"
    USER ||--o{ CLASSES : "teaches"
    USER ||--o{ ENROLLMENTS : "enrolled_as_student"
    CLASSES ||--o{ ENROLLMENTS : "has_enrollments"
    CLASSES ||--o{ MATERIALS : "contains_resources"
    USER ||--o{ SESSION : "owns_sessions"
    USER ||--o{ ACCOUNT : "has_accounts"
```

## Relationships Summary

- **Departments & Subjects**: One-to-Many relationship where each department can house multiple subjects.
- **Departments & Users**: One-to-Many optional relationship. Users (especially Teachers/Admin) can be assigned to a specific department.
- **Subjects & Classes**: One-to-Many relationship. A subject can have multiple class instances.
- **Users & Classes**: One-to-Many relationship where a User with a `teacher` role is assigned to lead a class.
- **Classes & Enrollments**: One-to-Many relationship tracking which students are in which classes.
- **Users & Enrollments**: One-to-Many relationship connecting Students to their course enrollments.
- **Classes & Materials**: One-to-Many relationship for educational resources assigned to a class.
- **Auth Tables**: `USER` is linked to `SESSION` and `ACCOUNT` for authentication management, while `VERIFICATION` handles token-based processes.
