import express from "express";
import { and, eq, getTableColumns, desc, sql } from "drizzle-orm";

import { db } from "../db/db.js";
import {
    classes,
    departments,
    enrollments,
    subjects,
    user,
} from "../db/schema/index.js";

const router = express.Router();

/**
 * GET /my-students
 * For Teachers: Lists all students enrolled in the teacher's classes.
 * Joins classes → enrollments → user to find students.
 */
router.get("/my-students", async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (role !== "teacher" && role !== "admin") {
            return res
                .status(403)
                .json({ error: "Only teachers can view their students" });
        }

        const { page = 1, limit = 10 } = req.query;
        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);
        const offset = (currentPage - 1) * limitPerPage;

        // For admin, they could optionally filter by teacherId query param
        const teacherId = role === "admin" && req.query.teacherId
            ? String(req.query.teacherId)
            : userId;

        // Count distinct students enrolled in teacher's classes
        const countResult = await db
            .select({ count: sql<number>`count(distinct ${user.id})` })
            .from(enrollments)
            .leftJoin(classes, eq(enrollments.classId, classes.id))
            .leftJoin(user, eq(enrollments.studentId, user.id))
            .where(eq(classes.teacherId, teacherId));

        const totalCount = countResult[0]?.count ?? 0;

        // Get students with class info
        const studentsList = await db
            .select({
                studentId: user.id,
                studentName: user.name,
                studentEmail: user.email,
                studentImage: user.image,
                studentRole: user.role,
                classId: classes.id,
                className: classes.name,
                subjectName: subjects.name,
                departmentName: departments.name,
                enrolledAt: enrollments.createdAt,
            })
            .from(enrollments)
            .leftJoin(classes, eq(enrollments.classId, classes.id))
            .leftJoin(user, eq(enrollments.studentId, user.id))
            .leftJoin(subjects, eq(classes.subjectId, subjects.id))
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(eq(classes.teacherId, teacherId))
            .orderBy(desc(enrollments.createdAt))
            .limit(limitPerPage)
            .offset(offset);

        res.status(200).json({
            data: studentsList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage),
            },
        });
    } catch (error) {
        console.error("GET /my-students error:", error);
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

/**
 * GET /my-classes
 * For Students: Lists all classes the student is enrolled in,
 * including the teacher's profile details for each class.
 */
router.get("/my-classes", async (req, res) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (role !== "student" && role !== "admin") {
            return res
                .status(403)
                .json({ error: "Only students can view their classes" });
        }

        const { page = 1, limit = 10 } = req.query;
        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);
        const offset = (currentPage - 1) * limitPerPage;

        const studentId = role === "admin" && req.query.studentId
            ? String(req.query.studentId)
            : userId;

        // Count classes the student is enrolled in
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(enrollments)
            .where(eq(enrollments.studentId, studentId));

        const totalCount = countResult[0]?.count ?? 0;

        // Alias for teacher user to avoid conflict with student user
        // We'll use a subquery approach or just select specific columns
        const classesList = await db
            .select({
                enrollmentId: enrollments.id,
                enrolledAt: enrollments.createdAt,
                class: {
                    ...getTableColumns(classes),
                },
                subject: {
                    ...getTableColumns(subjects),
                },
                department: {
                    ...getTableColumns(departments),
                },
                teacher: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                },
            })
            .from(enrollments)
            .leftJoin(classes, eq(enrollments.classId, classes.id))
            .leftJoin(subjects, eq(classes.subjectId, subjects.id))
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .leftJoin(user, eq(classes.teacherId, user.id))
            .where(eq(enrollments.studentId, studentId))
            .orderBy(desc(enrollments.createdAt))
            .limit(limitPerPage)
            .offset(offset);

        res.status(200).json({
            data: classesList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage),
            },
        });
    } catch (error) {
        console.error("GET /my-classes error:", error);
        res.status(500).json({ error: "Failed to fetch classes" });
    }
});

export default router;
