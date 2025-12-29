import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { validate, schemas } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = Router();

// Get user profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatarUrl: true,
        bannerUrl: true,
        bio: true,
        pronouns: true,
        gender: true,
        age: true,
        nationality: true,
        isPremium: true,
        sparks: true,
        battlePower: true,
        maxAgeRating: true,
        blockedTags: true,
        createdAt: true,
        lastActive: true,
        _count: {
          select: {
            characters: true,
            worlds: true,
            stories: true,
            posts: true,
            followers: true,
            follows: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Get profile error:', error);
    throw error;
  }
});

// Update user profile
router.put('/profile', validate(schemas.updateProfile), async (req: Request, res: Response) => {
  const updates = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...updates,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatarUrl: true,
        bannerUrl: true,
        bio: true,
        pronouns: true,
        gender: true,
        age: true,
        nationality: true,
        isPremium: true,
        sparks: true,
        battlePower: true,
        maxAgeRating: true,
        blockedTags: true,
        updatedAt: true
      }
    });

    logger.info(`Profile updated for user: ${user.username} (${user.id})`);
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    logger.error('Update profile error:', error);
    throw error;
  }
});

// Get user by username or ID
router.get('/:identifier', async (req: Request, res: Response) => {
  const { identifier } = req.params;
  
  try {
    // Check if identifier is a UUID (ID) or username
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    
    const user = await prisma.user.findUnique({
      where: isUUID ? { id: identifier } : { username: identifier.toLowerCase() },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        bannerUrl: true,
        bio: true,
        pronouns: true,
        isPremium: true,
        sparks: true,
        battlePower: true,
        createdAt: true,
        _count: {
          select: {
            characters: true,
            worlds: true,
            stories: true,
            posts: true,
            followers: true,
            follows: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if current user follows this user
    let isFollowing = false;
    if (req.user) {
      const followRelation = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: req.user.id,
            followingId: user.id
          }
        }
      });
      isFollowing = !!followRelation;
    }

    res.json({ ...user, isFollowing });
  } catch (error) {
    logger.error('Get user error:', error);
    throw error;
  }
});

// Follow/Unfollow user
router.post('/:userId/follow', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const followerId = req.user!.id;

  if (followerId === userId) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  try {
    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userId
        }
      }
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId: userId
          }
        }
      });

      logger.info(`User ${followerId} unfollowed ${userId}`);
      res.json({ message: 'Unfollowed successfully', isFollowing: false });
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId,
          followingId: userId
        }
      });

      // Create notification
      await prisma.notification.create({
        data: {
          type: 'FOLLOW',
          title: 'New Follower',
          content: `${req.user!.username} started following you`,
          userId,
          data: {
            followerId: req.user!.id,
            followerUsername: req.user!.username
          }
        }
      });

      logger.info(`User ${followerId} followed ${userId}`);
      res.json({ message: 'Followed successfully', isFollowing: true });
    }
  } catch (error) {
    logger.error('Follow/unfollow error:', error);
    throw error;
  }
});

// Get user's followers
router.get('/:userId/followers', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      skip,
      take: limit,
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            bio: true,
            isPremium: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.follow.count({
      where: { followingId: userId }
    });

    res.json({
      followers: followers.map(f => f.follower),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get followers error:', error);
    throw error;
  }
});

// Get user's following
router.get('/:userId/following', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  try {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      skip,
      take: limit,
      include: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            bio: true,
            isPremium: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.follow.count({
      where: { followerId: userId }
    });

    res.json({
      following: following.map(f => f.following),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get following error:', error);
    throw error;
  }
});

// Search users
router.get('/search/:query', async (req: Request, res: Response) => {
  const { query } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } }
        ]
      },
      skip,
      take: limit,
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        isPremium: true,
        sparks: true,
        battlePower: true
      },
      orderBy: [
        { isPremium: 'desc' },
        { sparks: 'desc' }
      ]
    });

    const total = await prisma.user.count({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } }
        ]
      }
    });

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Search users error:', error);
    throw error;
  }
});

export default router;