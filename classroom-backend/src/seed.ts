
import "dotenv/config";
import { db, pool } from "./db/db";
import { user } from "./db/schema/auth";
import { eq } from "drizzle-orm";
import { auth } from "./lib/auth";

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL ;
    const adminPassword = process.env.ADMIN_PASSWORD ;

    if (!adminEmail || !adminPassword) {
        console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env or passed as variables");
        process.exit(1);
    }

    console.log(`Seeding admin user: ${adminEmail}`);

    // Check if user already exists
    const existingUser = await db.select().from(user).where(eq(user.email, adminEmail));

    if (existingUser.length > 0) {
        console.log("Admin user already exists.");
    } else {
        try {
            const res = await auth.api.signUpEmail({
                body: {
                    email: adminEmail,
                    password: adminPassword,
                    name: "Admin User",
                    role: "admin"
                },
                asResponse: false
            });
            console.log("Admin user created successfully:", res.user);
        } catch (e) {
            console.error("Error creating admin user:", e);
        }
    }

    await pool.end();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
