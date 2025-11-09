import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3004', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

app.use(express.json());

app.use("/api/v1/posts", postRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "post-service" }));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Post service running on port ${PORT}`));
