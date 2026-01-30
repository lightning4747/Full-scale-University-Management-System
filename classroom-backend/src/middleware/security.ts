import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";
import { Client } from "@neondatabase/serverless";
import type {Request, Response, NextFunction } from "express";
import aj from "../config/arcjet"

const securityMiddleWare = async (req:Request, res:Response, next:NextFunction) => {
    if(process.env.NODE_ENV !== 'test') return next();

    try {
        const role: RateLimitRole = req.user?.role ?? 'guest';

        let limit: number;
        let message: string;

        switch(role) {
            case "admin":
                limit = 20;
                message= 'Admin request limit exceeded (20 per minute). Slow Down.';
                break;
            case "teacher":
            case "student":
                limit=10;
                message = 'User request limit exceeded (10 per minute). please wait.';
                break;
            default :
                limit = 5;
                message = "Guest user limit exceeded (5 per minute). please sign up for higer limits." ;
                break;
        }

        const client = aj.withRule(
            slidingWindow({
                mode:'LIVE',
                interval:'1m',
                max:limit
            })
        )

        const arcjetRequest: ArcjetNodeRequest = {
            headers:req.headers,
            method:req.method,
            url:req.originalUrl ?? req.url,
            socket: {remoteAddress: req.socket.remoteAddress ?? req.ip ?? '0.0.0.0'}
        }

        const decision = await client.protect(arcjetRequest);

    }
    catch (e) {
        console.error('Arcjet middleWare error: ', e);
        res.status(500).json({error: "Internal error", message : "Something went wrong with security middleware"});
    }
}