-- Fix enrollments table: replace composite PK with identity column PK
-- Drop existing constraints
ALTER TABLE "enrollments" DROP CONSTRAINT IF EXISTS "enrollments_student_id_class_id_pk";
ALTER TABLE "enrollments" DROP CONSTRAINT IF EXISTS "enrollments_student_id_class_id_unique";

-- Add the identity PK column
ALTER TABLE "enrollments" ADD COLUMN "id" integer GENERATED ALWAYS AS IDENTITY;
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id");

-- Add timestamp columns to enrollments (schema expects them)
ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "enrollments" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;

-- Add unique constraint on student_id + class_id (no duplicate enrollments)
CREATE UNIQUE INDEX IF NOT EXISTS "enrollments_student_class_unique" ON "enrollments" ("student_id", "class_id");

--> statement-breakpoint

-- Add department_id to user table (nullable FK to departments)
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "department_id" integer;
ALTER TABLE "user" ADD CONSTRAINT "user_department_id_departments_id_fk"
  FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id")
  ON DELETE SET NULL ON UPDATE NO ACTION;

-- Add index for faster department-based queries
CREATE INDEX IF NOT EXISTS "user_department_id_idx" ON "user" ("department_id");
