import { NextFunction, Request, Response } from "express";

// roleCheck.ts
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    console.log("Checking Admin Access. User Object:", req.user);
    
    if (req.user?.role !== "admin") {
        console.log("Access Denied. Role is:", req.user?.role);
        res.status(403).json({ error: "Forbidden: Admins only" });
        return;
    }
    next();
};
