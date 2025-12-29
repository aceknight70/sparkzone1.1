import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { validate, schemas } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = Router();

// Register
router.post('/register', validate(schemas.register), async (req: Request, res: Response) => {
  const { email, username, password, name } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists',
        field: existingUser.email === email.toLowerCase() ? 'email' : 'username'
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        isPremium: true,
        sparks: true,
        battlePower: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken(user as any);

    logger.info(`New user registered: ${user.username} (${user.id})`);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    logger.error('Registration error:', error);
    throw error;
  }
});

// Login
router.post('/login', validate(schemas.login), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() }
    });

    // Generate token
    const token = generateToken(user);

    // Return user data
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      isPremium: user.isPremium,
      sparks: user.sparks,
      battlePower: user.battlePower,
      createdAt: user.createdAt,
      lastActive: user.lastActive
    };

    logger.info(`User logged in: ${user.username} (${user.id})`);

    res.json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error) {
    logger.error('Login error:', error);
    throw error;
  }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  try {
    const decoded = require('../utils/auth').verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        isPremium: true,
        sparks: true,
        battlePower: true,
        lastActive: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const newToken = generateToken(user as any);

    res.json({
      user,
      token: newToken
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout (client-side token removal, but we can track it server-side)
router.post('/logout', (req: Request, res: Response) => {
  // In a production app, you might want to blacklist the token
  logger.info(`User logged out: ${req.user?.username || 'unknown'}`);
  res.json({ message: 'Logged out successfully' });
});

export default router;