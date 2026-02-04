import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { db } from "../db/db.js";
import * as schema from "../db/schema/auth.js"

// The only email allowed to have admin role
const ADMIN_EMAIL = "vignesh112847@gmail.com";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    trustedOrigins: [process.env.FRONTEND_URL!],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            role: {
                type: "string", required: true, defaultValue: "student", input: true
            },
            imageCldPubId: {
                type: "string", required: false, input: true
            }
        }
    },
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            // Only apply to sign-up endpoint
            if (ctx.path !== "/sign-up/email") {
                return;
            }

            const body = ctx.body as { email?: string; role?: string } | undefined;
            const requestedRole = body?.role;
            const email = body?.email;

            // If someone tries to register as admin but email doesn't match, reject
            if (requestedRole === "admin" && email !== ADMIN_EMAIL) {
                throw new APIError("BAD_REQUEST", {
                    message: "Only the designated admin email can register as admin."
                });
            }

            // If the admin email is used, automatically set role to admin
            if (email === ADMIN_EMAIL) {
                return {
                    context: {
                        ...ctx,
                        body: {
                            ...ctx.body,
                            role: "admin"
                        }
                    }
                };
            }
        })
    }
});