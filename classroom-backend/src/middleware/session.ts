import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

/**
 * Middleware to extract user session from better-auth and attach to req.user.
 * This runs globally on every request. It never blocks — it only populates req.user
 * when a valid session exists. Use `requireAuth` to enforce authentication on a route.
 */
const sessionMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if (session?.user) {
            const userRole = (session.user as { role?: string }).role;
            const imageCldPubId = (session.user as { imageCldPubId?: string }).imageCldPubId;
            const departmentId = (session.user as { departmentId?: number | null }).departmentId;

            req.user = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                role: (userRole as "admin" | "teacher" | "student") || "student",
                ...(session.user.image && { image: session.user.image }),
                ...(imageCldPubId && { imageCldPubId }),
                departmentId: departmentId ?? null,
            };
        }
    } catch (error) {
        // Session extraction failed — req.user remains undefined, requireAuth will reject.
        console.error("Session extraction error:", error);
    }

    next();
};

/**
 * BE-01 — requireAuth
 *
 * A route-level guard that MUST be applied to every protected endpoint.
 * Requires sessionMiddleware to have already run (it is mounted globally in index.ts).
 *
 * Behaviour:
 *  - req.user present  → calls next() and the route handler executes.
 *  - req.user absent   → responds 401 and terminates the middleware chain.
 *
 * Contract (NFR-SEC-01):
 *  - Returns exactly `401 Unauthorized` — no session details are leaked.
 *  - Must be composed before requireRole() on any route.
 *
 * Usage:
 *  router.get("/protected", requireAuth, requireRole("admin"), handler);
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized", message: "Authentication required." });
        return;
    }
    next();
};

export default sessionMiddleware;
