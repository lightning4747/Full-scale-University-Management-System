import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

/**
 * Middleware to extract user session from better-auth and attach to req.user
 * This enables role-based rate limiting in the security middleware
 */
const sessionMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (session?.user) {
            const userRole = (session.user as { role?: string }).role;
            const imageCldPubId = (session.user as { imageCldPubId?: string }).imageCldPubId;

            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: (userRole as "admin" | "teacher" | "student") || "student",
                ...(session.user.image && { image: session.user.image }),
                ...(imageCldPubId && { imageCldPubId })
            };
        }
    } catch (error) {
        // Session extraction failed - user will be treated as guest
        console.error("Session extraction error:", error);
    }

    next();
};

export default sessionMiddleware;
