import express from "express";
import cors from "cors";
import subjectsRouter from "./routes/subject";

const app = express();
const PORT = 8000;

// CORS – correct for local development
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// JSON middleware
app.use(express.json());

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
