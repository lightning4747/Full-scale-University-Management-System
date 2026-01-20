import express from 'express';
import subjectsRouter from "./routes/subject";
import cors from 'cors';
const app = express();
const PORT = 8000;

if(!process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL is not set in .env file');
}

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

// JSON middleware
app.use(express.json());

app.use('/api/subjects', subjectsRouter)

// Root GET route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the University Management System API' });
});

// Start server
app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server is running on ${url}`);
});

