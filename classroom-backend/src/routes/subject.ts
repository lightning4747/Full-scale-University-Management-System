import { desc, eq, getTableColumns, ilike, or, and, count } from "drizzle-orm";
import express from "express";
import { departments, subjects } from "../db/schema/index.js";
import { db } from "../db/db.js";

const router = express.Router();

/**
 * GET /subjects
 * Get all subjects with optional search, filtering, and pagination.
 * Role-based: Admin sees all, Teacher/Student see only their department's subjects.
 */
router.get("/", async (req, res) => {
    try {
        const { search, department, page = 1, limit = 10 } = req.query;

        // --- Pagination Setup ---
        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.min(
            Math.max(1, parseInt(String(limit), 10) || 10),
            100
        );
        const offset = (currentPage - 1) * limitPerPage;

        // --- Filter Logic ---
        const filterConditions = [];

        // 1. Role-based isolation
        const role = req.user?.role;
        const userDeptId = req.user?.departmentId;


        // 2. Search by subject name or code
        if (search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`)
                )
            );
        }

        // 3. Filter by department name (requires join)
        if (department) {
            filterConditions.push(ilike(departments.name, `%${department}%`));
        }

        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        // --- Execute Count Query ---
        // We use the count() helper to avoid BigInt/String casting issues
        const [countResult] = await db
            .select({ total: count() })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause);

        const totalCount = Number(countResult?.total ?? 0);

        // --- Execute Data Query ---
        const subjectList = await db
            .select({
                ...getTableColumns(subjects),
                department: getTableColumns(departments), // Nested for cleaner JSON structure
            })
            .from(subjects)
            .leftJoin(departments, eq(subjects.departmentId, departments.id))
            .where(whereClause)
            .orderBy(desc(subjects.createdAt))
            .limit(limitPerPage)
            .offset(offset);

        // --- Response ---
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
        console.error(`GET /subjects error:`, e);
        res.status(500).json({ error: "Failed to get subjects" });
    }
});

export default router;