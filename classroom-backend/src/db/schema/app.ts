import { relations } from "drizzle-orm";
import { pgTable,integer, timestamp, varchar } from "drizzle-orm/pg-core";

const timeStamps = {
    created_At: timestamp('created_At').defaultNow().notNull(),
    updated_At: timestamp('updated_At').defaultNow().$onUpdate(()=> new Date()).notNull()
}

export const department = pgTable('deapartment', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    code : varchar('code' ,{length: 50}).notNull().unique(),
    name: varchar('name', {length: 255}).notNull(),
    description: varchar('description', {length:255}),
    ...timeStamps
});

export const subjects = pgTable('subjects', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    departmentId: integer('departmentId').notNull().references(() => department.id, {onDelete: 'restrict'}),
    name: varchar('name', {length: 255}).notNull(),
    code : varchar('code' ,{length: 50}).notNull().unique(),
    description: varchar('description', {length:255}),
    ...timeStamps
});

export const departmentRelation = relations(department, ({ many }) => ({subjects: many(subjects)}))

export const subjectsRelation = relations(subjects, ({ one, many }) => ({
    department: one(department, {
        fields: [subjects.departmentId],
        references: [department.id]
    })
}));

export type Department = typeof department.$inferSelect;
export type NewDepartment = typeof department.$inferInsert;

export type Subjects = typeof department.$inferSelect;
export type NewSubjects = typeof department.$inferInsert;