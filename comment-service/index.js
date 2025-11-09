import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/comments", commentRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "comment-service" }));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Comment service running on port ${PORT}`));
