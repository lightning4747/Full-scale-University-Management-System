import express from "express";
import { db } from "../db/db.js";
import { classes } from '../db/schema/index.js'

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

export default router;