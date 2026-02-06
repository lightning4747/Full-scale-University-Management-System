import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { db } from "../db/db.js";
import * as schema from "../db/schema/auth.js"

// The only email allowed to have admin role
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "vignesh112847@gmail.com";

// Frontend URL for redirects after OAuth
const FRONTEND_URL = process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173";

// Build social providers config
const socialConfig: any = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    socialConfig.google = {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    socialConfig.github = {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    };
}

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,

    // The base path where auth routes are mounted (must match Express route)
    basePath: "/api/auth",

    // The base URL of the backend server
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8000",

    // Trusted origins that can make requests (frontend)
    trustedOrigins: [FRONTEND_URL],

    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),

    emailAndPassword: {
        enabled: true
    },

    // Social providers (Google, GitHub)
    ...(Object.keys(socialConfig).length > 0 && { socialProviders: socialConfig }),

    // Additional user fields
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "student",
                input: true
            },
            imageCldPubId: {
                type: "string",
                required: false,
                input: true
            }
        }
    },

    // Session configuration
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5 // 5 minutes
        }
    },

    // Hooks for custom logic
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
