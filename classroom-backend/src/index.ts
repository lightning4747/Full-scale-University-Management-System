import "dotenv/config";
import express from "express";
import cors from "cors";
import securityMiddleWare from "./middleware/security.js";
import {toNodeHandler} from "better-auth/node"
import { auth } from "./lib/auth.js";
import { webcrypto } from 'node:crypto';
import AgentAPI from "apminsight";
import subjectsRouter from "./routes/subject.js";
import usersRouter from "./routes/user.js";
import classesRouter from "./routes/classes.js";
AgentAPI.config()

if (!globalThis.crypto) {
  (globalThis as any).crypto = webcrypto;
}

const app = express();
const PORT = 8000;

app.set('trust proxy', true);

// CORS – configurable via environment variables
const getAllowedOrigins = (): string | string[] | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void) => {
  const originsEnv = process.env.ALLOWED_ORIGINS || process.env.CORS_ORIGIN;

  if (!originsEnv) {
    // Default fallback for local development
    return "http://localhost:5173";
  }

  // Check if it's a comma-separated list
  if (originsEnv.includes(",")) {
    const origins = originsEnv.split(",").map((origin) => origin.trim()).filter(Boolean);
    // Return a function to validate origin against the list
    return (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    };
  }

  // Single origin string
  return originsEnv.trim();
};


app.use(cors({
  origin: getAllowedOrigins(), // frontend origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.all('/api/auth/*splat', toNodeHandler(auth));

// JSON middleware
app.use(express.json());

//middleware
app.use(securityMiddleWare);

// Routes
app.use("/api/subjects", subjectsRouter);

// Users routes
app.use("/api/users", usersRouter);

// Classes routes
app.use("/api/classes", classesRouter);

// Root
app.get("/", (_req, res) => {
  res.json({ message: "University Management System API" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
