import { relations } from "drizzle-orm";
import { pgTable,integer, timestamp, varchar } from "drizzle-orm/pg-core";

const timeStamps = {
    created_At: timestamp('created_At').defaultNow().notNull(),
    updated_At: timestamp('updated_At').defaultNow().$onUpdate(()=> new Date()).notNull()
}

export const departments = pgTable('departments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    code : varchar('code' ,{length: 50}).notNull().unique(),
    name: varchar('name', {length: 255}).notNull(),
    description: varchar('description', {length:255}),
    ...timeStamps
});

export const subjects = pgTable('subjects', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    departmentsId: integer('departmentsId').notNull().references(() => departments.id, {onDelete: 'restrict'}),
    name: varchar('name', {length: 255}).notNull(),
    code : varchar('code' ,{length: 50}).notNull().unique(),
    description: varchar('description', {length:255}),
    ...timeStamps
});

export const departmentsRelation = relations(departments, ({ many }) => ({subjects: many(subjects)}))

export const subjectsRelation = relations(subjects, ({ one, many }) => ({
    departments: one(departments, {
        fields: [subjects.departmentsId],
        references: [departments.id]
    })
}));

export type Departments = typeof departments.$inferSelect;
export type NewDepartments = typeof departments.$inferInsert;

export type Subjects = typeof subjects.$inferSelect;
export type NewSubjects = typeof subjects.$inferInsert;