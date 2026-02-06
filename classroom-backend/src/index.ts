import "dotenv/config";
import express from "express";
import cors from "cors";
import securityMiddleWare from "./middleware/security.js";
import sessionMiddleware from "./middleware/session.js";
import { toNodeHandler } from "better-auth/node"
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



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: (origin, callback) => {
    const originsEnv = process.env.ALLOWED_ORIGINS || process.env.CORS_ORIGIN || "http://localhost:5173";
    const allowedList = originsEnv.split(",").map(o => o.trim());
    
    // Allow requests with no origin (like mobile apps or curl) 
    // or if the origin is in the allowed list
    if (!origin || allowedList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"], // Added Cookie to headers
}));

// Auth handler - handles all /api/auth/* routes (login, register, OAuth callbacks, etc.)
// Remove the asterisk (*) and the colon (:)
app.use('/api/auth', toNodeHandler(auth));


// Session middleware - extracts user from session for role-based rate limiting
app.use(sessionMiddleware);

// Security/Rate-limiting middleware
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
