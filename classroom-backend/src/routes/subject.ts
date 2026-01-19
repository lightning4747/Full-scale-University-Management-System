import { desc, eq, getTableColumns, ilike, or, sql, and } from "drizzle-orm";
import express  from "express";
import { departments, subjects } from "../db/schema";
import { db } from "../db/db";

const router = express.Router();

//Get all search with optional search and filtering and pagination
router.get('/', async (req, res) => {
    try {
        const {search, department, page =1 , limit = 10 } = req.query;

        const currentPage = Math.max(1, +page);
        const limitPerPage = Math.max(1, +limit);

        const offset = (currentPage - 1) * limitPerPage;

        const filterConditions = [];

        //filter by eitehr subject name or code. both will work
        if(search) {
            filterConditions.push(or(
                ilike(subjects.name, `%${search}%`),
                ilike(subjects.code, `%${search}%`),
        )
       );
     }

     //if exists, match department names
     if(department) {
        filterConditions.push(ilike(departments.name, `%${department}%`))
     }

     const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

     const countResult = await db.select({ count: sql<number>`count(*)`})
                                 .from(subjects)
                                 .leftJoin(departments, eq(subjects.departmentsId, departments.id))
                                 .where(whereClause);

     const totalCount = countResult[0]?.count ?? 0;
     
     const subjectList = await db.select({...getTableColumns(subjects), departments: {...getTableColumns(departments)}})
                                 .from(subjects).leftJoin(departments, eq(subjects.departmentsId, departments.id))
                                 .where(whereClause)
                                 .orderBy(desc(subjects.created_At))
                                 .limit(limitPerPage)
                                 .offset(offset);

                                 res.status(200).json({
                                    data: subjectList,
                                    limit: limitPerPage,
                                    total: totalCount,
                                    totalPage: Math.ceil(totalCount / limitPerPage)
                                 })
    }
    //need to update it in the future with an separate error page
    catch(e) {
        console.error(`GET /subjects error: ${e}`);
        res.status(500).json({error: "Failed to get subjects"});
    }
})