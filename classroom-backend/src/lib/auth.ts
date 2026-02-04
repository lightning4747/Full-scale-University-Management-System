import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
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
        before: [
            {
                matcher: (ctx) => ctx.path === "/sign-up/email",
                handler: async (ctx) => {
                    const body = ctx.body as { email?: string; role?: string } | undefined;
                    const requestedRole = body?.role;
                    const email = body?.email;

                    // If someone tries to register as admin but email doesn't match, reject
                    if (requestedRole === "admin" && email !== ADMIN_EMAIL) {
                        throw new Error("Only the designated admin email can register as admin.");
                    }

                    // If the admin email is used, automatically set role to admin
                    if (email === ADMIN_EMAIL && ctx.body) {
                        (ctx.body as { role?: string }).role = "admin";
                    }

                    return { context: ctx };
                }
            }
        ]
    }
});