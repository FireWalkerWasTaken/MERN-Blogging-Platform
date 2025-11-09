import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug log
console.log('MONGO_URL:', process.env.MONGO_URL);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
await connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);

// Health check
app.get('/health', (req, res) => res.send('User service is healthy 🚀'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
