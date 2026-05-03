import type { NextFunction, Request, Response } from "express";

/**
 * BE-02 — requireRole(role)
 *
 * A middleware factory that enforces role-based access control on a route.
 * MUST be composed after `requireAuth` — it assumes req.user is already populated.
 *
 * Accepts a single role string or an array of roles (NFR-SCALE-01).
 * Returns 403 when the caller's role is not in the allowed set.
 * The response body does not expose which roles are permitted (NFR-SEC-04).
 *
 * Usage (single role):
 *   router.post("/classes", requireAuth, requireRole("teacher"), handler);
 *
 * Usage (multiple roles):
 *   router.get("/classes", requireAuth, requireRole(["admin", "teacher"]), handler);
 */
export const requireRole = (
    allowed: UserRoles | UserRoles[]
) => {
    const allowedRoles: UserRoles[] = Array.isArray(allowed) ? allowed : [allowed];

    return (req: Request, res: Response, next: NextFunction): void => {
        const role = req.user?.role;

        if (!role || !allowedRoles.includes(role)) {
            res.status(403).json({ error: "Forbidden", message: "You do not have permission to perform this action." });
            return;
        }

        next();
    };
};

/**
 * Convenience alias — backwards-compatible with any existing `isAdmin` usage.
 * Prefer `requireRole("admin")` in new route definitions.
 */
export const isAdmin = requireRole("admin");
