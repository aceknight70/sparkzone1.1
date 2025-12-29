import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import characterRoutes from './routes/characters';
import worldRoutes from './routes/worlds';
import storyRoutes from './routes/stories';
import postRoutes from './routes/posts';
import communityRoutes from './routes/communities';
import partyRoutes from './routes/parties';
import sparkClashRoutes from './routes/spark-clash';
import uploadRoutes from './routes/upload';
import aiRoutes from './routes/ai';

// Import services
import { initializeRedis } from './services/redis';
import { initializeSocket } from './services/socket';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  }
});

// Initialize services
initializeRedis();
initializeSocket(io);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "wss:"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/characters', authenticateToken, characterRoutes);
app.use('/api/worlds', authenticateToken, worldRoutes);
app.use('/api/stories', authenticateToken, storyRoutes);
app.use('/api/posts', authenticateToken, postRoutes);
app.use('/api/communities', authenticateToken, communityRoutes);
app.use('/api/parties', authenticateToken, partyRoutes);
app.use('/api/spark-clash', authenticateToken, sparkClashRoutes);
app.use('/api/upload', authenticateToken, uploadRoutes);
app.use('/api/ai', authenticateToken, aiRoutes);

// Error handling
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  logger.info(`🔥 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { app, io };