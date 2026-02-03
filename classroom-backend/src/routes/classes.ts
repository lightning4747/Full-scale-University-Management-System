import express from "express";
import { db } from "../db/db.js";
import { classes, departments, subjects, user } from '../db/schema/index.js'
import { and, eq, getTableColumns, ilike, or, sql, desc } from "drizzle-orm";
import { error } from "node:console";

const router = express.Router();

router.post('/', async (req, res) => { 
    try {
        const [createdClass] = await db
        .insert(classes)
        .values({...req.body, inviteCode: crypto.randomUUID(), schedules:[]})
        .returning({ id: classes.id});

        if(!createdClass) throw Error;

        res.status(201).json({ data: createdClass});
    }
    catch (error) { 
        console.error(" POST/ Error creating class:", error);
        res.status(500).json({error: error})
    }
});

router.get("/", async (req, res) => {
    try {
      const { search, subject, teacher, page = 1, limit = 10 } = req.query;
  
      const currentPage = Math.max(1, +page);
      const limitPerPage = Math.max(1, +limit);
      const offset = (currentPage - 1) * limitPerPage;
  
      const filterConditions = [];
  
      if (search) {
        filterConditions.push(
          or(
            ilike(classes.name, `%${search}%`),
            ilike(classes.inviteCode, `%${search}%`)
          )
        );
      }
  
      if (subject) {
        filterConditions.push(ilike(subjects.name, `%${subject}%`));
      }
  
      if (teacher) {
        filterConditions.push(ilike(user.name, `%${teacher}%`));
      }
  
      const whereClause =
        filterConditions.length > 0 ? and(...filterConditions) : undefined;
  
      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(classes)
        .leftJoin(subjects, eq(classes.subjectId, subjects.id))
        .leftJoin(user, eq(classes.teacherId, user.id))
        .where(whereClause);
  
      const totalCount = countResult[0]?.count ?? 0;
  
      const classesList = await db
        .select({
          ...getTableColumns(classes),
          subject: {
            ...getTableColumns(subjects),
          },
          teacher: {
            ...getTableColumns(user),
          },
        })
        .from(classes)
        .leftJoin(subjects, eq(classes.subjectId, subjects.id))
        .leftJoin(user, eq(classes.teacherId, user.id))
        .where(whereClause)
        .orderBy(desc(classes.createdAt))
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
      console.error("GET /classes error:", error);
      res.status(500).json({ error: "Failed to fetch classes" });
    }
  });

router.get("/:id", async (req, res) => {
    try {
        const classId = Number(req.params.id);

        if(!Number.isFinite(classId)) return res.status(400).json({ error: "cannot found class" });

        const [classData] = await db
        .select({
            ...getTableColumns(classes),
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
        .from(classes)
        .leftJoin(subjects, eq(classes.subjectId, subjects.id))
        .leftJoin(user, eq(classes.teacherId, user.id))
        .leftJoin(departments, eq(subjects.departmentId,user.id))
        .where(eq(classes.id, classId))

        if(!classData) return res.status(404).json({error: "class not found"});
        
        res.status(200).json({data: classData});
    }
    catch (error) {
        console.error("GET /classes/:id error:", error);
        res.status(500).json({ error: "Failed to fetch class" });
    }
});

export default router;