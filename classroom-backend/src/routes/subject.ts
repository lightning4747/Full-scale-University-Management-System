import { desc, eq, getTableColumns, ilike, or, sql, and } from "drizzle-orm";
import express from "express";
import { departments, subjects } from "../db/schema/index.js";
import { db } from "../db/db.js";

const router = express.Router();

// Get all subjects with optional search and filtering and pagination
// Role-based: Admin sees all, Teacher/Student see only their department's subjects
router.get("/", async (req, res) => {
    try {
        const { search, department, page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.min(
            Math.max(1, parseInt(String(limit), 10) || 10),
            100
        );

        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions = [];

        // Department-based isolation for non-admin users
        const role = req.user?.role;
        const userDeptId = req.user?.departmentId;

        if (role && role !== "admin" && userDeptId) {
            filterConditions.push(eq(subjects.departmentId, userDeptId));
        }

        // filter by either subject name or code. both will work
        if (search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)
                )
            );
        }

        // if exists, match department names
        if (department) {
            filterConditions.push(ilike(departments.name, `%${department}%`));
        }

        const whereClause =
            filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause);

        const totalCount = countResult[0]?.count ?? 0;

        const subjectList = await db
            .select({
                ...getTableColumns(subjects),
                departments: { ...getTableColumns(departments) },
            })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause)
            .orderBy(desc(subjects.createdAt))
            .limit(limitPerPage)
            .offset(offset);

        res.status(200).json({
            data: subjectList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage),
            },
        });
    } catch (e) {
        console.error(`GET /subjects error: ${e}`);
        res.status(500).json({ error: "Failed to get subjects" });
    }
});

export default router;