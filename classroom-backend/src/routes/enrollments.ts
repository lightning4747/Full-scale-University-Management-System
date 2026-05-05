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
import { requireAuth } from "../middleware/session.js";
import { requireRole } from "../middleware/roleCheck.js";

const router = express.Router();

const getEnrollmentDetails = async (enrollmentId: number) => {
  const [enrollment] = await db
    .select({
      ...getTableColumns(enrollments),
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
        ...getTableColumns(user),
      },
    })
    .from(enrollments)
    .leftJoin(classes, eq(enrollments.classId, classes.id))
    .leftJoin(subjects, eq(classes.subjectId, subjects.id))
    .leftJoin(departments, eq(subjects.departmentId, departments.id))
    .leftJoin(user, eq(classes.teacherId, user.id))
    .where(eq(enrollments.id, enrollmentId));

  return enrollment;
};

// GET /enrollments — role-based isolation
// Admin: all enrollments
// Teacher: only enrollments in teacher's classes
// Student: only their own enrollments
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);
    const offset = (currentPage - 1) * limitPerPage;

    const role = req.user?.role;
    const userId = req.user?.id;

    // Build role-based filter
    const filterConditions = [];

    if (role === "teacher" && userId) {
      // Teachers see enrollments only for their own classes
      filterConditions.push(eq(classes.teacherId, userId));
    } else if (role === "student" && userId) {
      // Students see only their own enrollments
      filterConditions.push(eq(enrollments.studentId, userId));
    }
    // Admin: no extra filter — sees everything

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .leftJoin(classes, eq(enrollments.classId, classes.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const enrollmentsList = await db
      .select({
        ...getTableColumns(enrollments),
        class: {
          ...getTableColumns(classes),
        },
        subject: {
          ...getTableColumns(subjects),
        },
        department: {
          ...getTableColumns(departments),
        },
        student: {
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
      .leftJoin(user, eq(enrollments.studentId, user.id))
      .where(whereClause)
      .orderBy(desc(enrollments.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: enrollmentsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error("GET /enrollments error:", error);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});

// GET /enrollments/:id
router.get("/:id", async (req, res) => {
  try {
    const enrollmentId = Number(req.params.id);
    if (!Number.isFinite(enrollmentId)) {
      return res.status(400).json({ error: "Invalid enrollment id" });
    }

    const enrollment = await getEnrollmentDetails(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    // Role-based access check
    const role = req.user?.role;
    const userId = req.user?.id;

    if (role === "teacher" && userId) {
      // Teacher can only view enrollments in their own classes
      if ((enrollment as any).class?.teacherId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
    } else if (role === "student" && userId) {
      // Student can only view their own enrollment
      if (enrollment.studentId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }
    }

    res.status(200).json({ data: enrollment });
  } catch (error) {
    console.error("GET /enrollments/:id error:", error);
    res.status(500).json({ error: "Failed to fetch enrollment" });
  }
});

// Create enrollment
router.post("/", requireAuth, requireRole("student"), async (req, res) => {
  console.log("POST /enrollments - Body:", req.body);
  console.log("POST /enrollments - Query:", req.query);
  console.log("POST /enrollments - User:", req.user?.id);
  try {
    const { classId } = req.body;
    const studentId = req.user!.id;

    if (!classId) {
      return res.status(400).json({ error: "classId is required" });
    }

    // Check if class exists
    const [classRecord] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, classId));

    if (!classRecord) return res.status(404).json({ error: "Class not found" });

    // Check for existing enrollment (BE-08 requirement + DC-03 enforcement)
    const [existingEnrollment] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.classId, classId),
          eq(enrollments.studentId, studentId)
        )
      );

    if (existingEnrollment) {
      console.log("POST /enrollments - Conflict: Already enrolled");
      return res.status(409).json({ error: "You are already enrolled in this class" });
    }

    const [createdEnrollment] = await db
      .insert(enrollments)
      .values({ classId, studentId })
      .returning({ id: enrollments.id });

    if (!createdEnrollment) {
      return res.status(500).json({ error: "Failed to create enrollment" });
    }

    const enrollment = await getEnrollmentDetails(createdEnrollment.id);

    console.log("POST /enrollments - Success: Enrollment created", createdEnrollment.id);
    res.status(201).json({ data: enrollment });
  } catch (error) {
    console.error("POST /enrollments error:", error);
    res.status(500).json({ error: "Failed to create enrollment" });
  }
});

// Join class by invite code
router.post("/join", requireAuth, requireRole("student"), async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const studentId = req.user!.id;

    if (!inviteCode) {
      return res.status(400).json({ error: "inviteCode is required" });
    }

    const [classRecord] = await db
      .select()
      .from(classes)
      .where(eq(classes.inviteCode, inviteCode));

    if (!classRecord) return res.status(404).json({ error: "Invalid invite code" });

    // Check for existing enrollment
    const [existingEnrollment] = await db
      .select({ id: enrollments.id })
      .from(enrollments)
      .where(
        and(
          eq(enrollments.classId, classRecord.id),
          eq(enrollments.studentId, studentId)
        )
      );

    if (existingEnrollment) {
      return res.status(409).json({ error: "You are already enrolled in this class" });
    }

    const [createdEnrollment] = await db
      .insert(enrollments)
      .values({ classId: classRecord.id, studentId })
      .returning({ id: enrollments.id });

    if (!createdEnrollment) {
      return res.status(500).json({ error: "Failed to join class" });
    }

    const enrollment = await getEnrollmentDetails(createdEnrollment.id);

    res.status(201).json({ data: enrollment });
  } catch (error) {
    console.error("POST /enrollments/join error:", error);
    res.status(500).json({ error: "Failed to join class" });
  }
});

// DELETE /enrollments/:id — remove enrollment
router.delete("/:id", async (req, res) => {
  try {
    const enrollmentId = Number(req.params.id);
    if (!Number.isFinite(enrollmentId)) {
      return res.status(400).json({ error: "Invalid enrollment id" });
    }

    const [deleted] = await db
      .delete(enrollments)
      .where(eq(enrollments.id, enrollmentId))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    res.status(200).json({ data: deleted });
  } catch (error) {
    console.error("DELETE /enrollments/:id error:", error);
    res.status(500).json({ error: "Failed to delete enrollment" });
  }
});

export default router;