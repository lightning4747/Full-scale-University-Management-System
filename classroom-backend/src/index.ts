import express from "express";
import cors from "cors";
import subjectsRouter from "./routes/subject";
import securityMiddleWare from "./middleware/security";

const app = express();
const PORT = 8000;

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

app.use(
  cors({
    origin: getAllowedOrigins(),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// JSON middleware
app.use(express.json());

//middleware
app.use(securityMiddleWare);

// Routes
app.use("/api/subjects", subjectsRouter);

// Root
app.get("/", (_req, res) => {
  res.json({ message: "University Management System API" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
