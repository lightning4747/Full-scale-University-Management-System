import express from "express";
import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";

import { fromNodeHeaders } from "better-auth/node";
import { user, departments } from "../db/schema/index.js";
import { db } from "../db/db.js";
import { auth } from "../lib/auth.js";

const router = express.Router();

// Get all users with optional search, filtering and pagination
router.get("/", async (req, res) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100); // Max 100 records per page

        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions = [];

        // If search query exists, filter by user name OR user email
        if (search) {
            filterConditions.push(
                or(
                    ilike(user.name, `%${search}%`),
                    ilike(user.email, `%${search}%`)
                )
            );
        }

        // If role filter exists, match exact role
        if (role) {
            filterConditions.push(eq(user.role, role as any));
        }

        // Combine all filters using AND if any exist
        const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(user)
            .where(whereClause);

        const totalCount = countResult[0]?.count ?? 0;

        const usersList = await db
            .select({
                ...getTableColumns(user),
            }).from(user)
            .where(whereClause)
            .orderBy(desc(user.createdAt))
            .limit(limitPerPage)
            .offset(offset);

        res.status(200).json({
            data: usersList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitPerPage),
            }
        })

    } catch (e) {
        console.error(`GET /users error: ${e}`);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

// Update current user's role
router.post("/me/role", async (req, res) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { role } = req.body;

        if (!role || !["student", "teacher", "admin"].includes(role)) {
            res.status(400).json({ error: "Invalid role" });
            return;
        }

        await db.update(user)
            .set({ role })
            .where(eq(user.id, session.user.id));

        res.json({ success: true, role });
    } catch (e) {
        console.error("Update role error:", e);
        res.status(500).json({ error: "Failed to update role" });
    }
});

// Update current user's department
router.post("/me/department", async (req, res) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (!session) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { departmentId } = req.body;

        if (departmentId !== null && departmentId !== undefined) {
            const deptId = Number(departmentId);
            if (!Number.isFinite(deptId)) {
                res.status(400).json({ error: "Invalid department ID" });
                return;
            }

            // Verify the department exists
            const [dept] = await db
                .select({ id: departments.id })
                .from(departments)
                .where(eq(departments.id, deptId));

            if (!dept) {
                res.status(404).json({ error: "Department not found" });
                return;
            }

            await db.update(user)
                .set({ departmentId: deptId })
                .where(eq(user.id, session.user.id));

            res.json({ success: true, departmentId: deptId });
        } else {
            // Allow clearing department assignment
            await db.update(user)
                .set({ departmentId: null })
                .where(eq(user.id, session.user.id));

            res.json({ success: true, departmentId: null });
        }
    } catch (e) {
        console.error("Update department error:", e);
        res.status(500).json({ error: "Failed to update department" });
    }
});

export default router;
