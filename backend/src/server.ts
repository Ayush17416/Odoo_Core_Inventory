import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import { query } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001');

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:8080,http://localhost:8081,http://localhost:8082,http://localhost:8083,http://localhost:8084').split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/profiles', profileRoutes);

// Root endpoint
app.get('/', (req, res) => res.json({ message: 'Count-Cat Backend API', version: '1.0.0' }));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Count-Cat Backend running on http://localhost:${PORT}`);
});
