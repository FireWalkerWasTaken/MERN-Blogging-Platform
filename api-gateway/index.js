import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware } from "http-proxy-middleware";
import { authenticate } from "./middleware/authMiddleware.js";
import { requestLogger } from "./middleware/logger.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(requestLogger);

// ✅ Rate limiter (100 requests per 15 min per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later" },
});
app.use(limiter);

// ✅ Routes Proxy Configuration
const userService = process.env.USER_SERVICE_URL;
const postService = process.env.POST_SERVICE_URL;
const commentService = process.env.COMMENT_SERVICE_URL;

// --- Public Routes (No Auth Needed) ---
app.use(
  "/api/v1/auth",
  createProxyMiddleware({
    target: userService,
    changeOrigin: true,
    pathRewrite: { "^/api/v1/auth": "/api/v1/auth" },
  })
);

// --- Protected Routes (Require JWT) ---
app.use(
  "/api/v1/posts",
  authenticate,
  createProxyMiddleware({
    target: postService,
    changeOrigin: true,
    pathRewrite: { "^/api/v1/posts": "/api/v1/posts" },
  })
);

app.use(
  "/api/v1/comments",
  authenticate,
  createProxyMiddleware({
    target: commentService,
    changeOrigin: true,
    pathRewrite: { "^/api/v1/comments": "/api/v1/comments" },
  })
);

// ✅ Health Check for Gateway
app.get("/health", (req, res) => res.json({ status: "ok", service: "api-gateway" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚪 API Gateway running on port ${PORT}`));
