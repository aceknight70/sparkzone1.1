import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { validate, schemas } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = Router();

// Create character
router.post('/', validate(schemas.createCharacter), async (req: Request, res: Response) => {
  const characterData = req.body;
  
  try {
    const character = await prisma.character.create({
      data: {
        ...characterData,
        userId: req.user!.id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    logger.info(`Character created: ${character.name} by ${req.user!.username}`);
    res.status(201).json({ message: 'Character created successfully', character });
  } catch (error) {
    logger.error('Create character error:', error);
    throw error;
  }
});

// Get user's characters
router.get('/my-characters', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  try {
    const characters = await prisma.character.findMany({
      where: { userId: req.user!.id },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true
          }
        },
        _count: {
          select: {
            stories: true,
            posts: true,
            parties: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.character.count({
      where: { userId: req.user!.id }
    });

    res.json({
      characters,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get user characters error:', error);
    throw error;
  }
});

// Get character by ID
router.get('/:characterId', async (req: Request, res: Response) => {
  const { characterId } = req.params;

  try {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            isPremium: true
          }
        },
        stories: {
          include: {
            story: {
              select: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                likes: true,
                views: true,
                createdAt: true
              }
            }
          }
        },
        _count: {
          select: {
            stories: true,
            posts: true,
            parties: true
          }
        }
      }
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // Increment uses count
    await prisma.character.update({
      where: { id: characterId },
      data: { uses: { increment: 1 } }
    });

    res.json(character);
  } catch (error) {
    logger.error('Get character error:', error);
    throw error;
  }
});

// Update character
router.put('/:characterId', validate(schemas.createCharacter), async (req: Request, res: Response) => {
  const { characterId } = req.params;
  const updates = req.body;

  try {
    // Check ownership
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      select: { userId: true }
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    if (character.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to update this character' });
    }

    const updatedCharacter = await prisma.character.update({
      where: { id: characterId },
      data: {
        ...updates,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true
          }
        }
      }
    });

    logger.info(`Character updated: ${updatedCharacter.name} by ${req.user!.username}`);
    res.json({ message: 'Character updated successfully', character: updatedCharacter });
  } catch (error) {
    logger.error('Update character error:', error);
    throw error;
  }
});

// Delete character
router.delete('/:characterId', async (req: Request, res: Response) => {
  const { characterId } = req.params;

  try {
    // Check ownership
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      select: { userId: true, name: true }
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    if (character.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to delete this character' });
    }

    await prisma.character.delete({
      where: { id: characterId }
    });

    logger.info(`Character deleted: ${character.name} by ${req.user!.username}`);
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    logger.error('Delete character error:', error);
    throw error;
  }
});

// Browse characters
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy as string || 'recent';
  const ageRating = req.query.ageRating as string;
  const tags = req.query.tags as string;

  try {
    let orderBy: any = { createdAt: 'desc' };
    
    switch (sortBy) {
      case 'popular':
        orderBy = { likes: 'desc' };
        break;
      case 'most-used':
        orderBy = { uses: 'desc' };
        break;
      case 'alphabetical':
        orderBy = { name: 'asc' };
        break;
    }

    const where: any = {};

    if (ageRating) {
      where.ageRating = ageRating;
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      where.tags = {
        hasSome: tagArray
      };
    }

    const characters = await prisma.character.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            isPremium: true
          }
        },
        _count: {
          select: {
            stories: true,
            posts: true
          }
        }
      },
      orderBy
    });

    const total = await prisma.character.count({ where });

    res.json({
      characters,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Browse characters error:', error);
    throw error;
  }
});

// Search characters
router.get('/search/:query', async (req: Request, res: Response) => {
  const { query } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  try {
    const characters = await prisma.character.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { personality: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } }
        ]
      },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
            isPremium: true
          }
        }
      },
      orderBy: { likes: 'desc' }
    });

    const total = await prisma.character.count({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { personality: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } }
        ]
      }
    });

    res.json({
      characters,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Search characters error:', error);
    throw error;
  }
});

// Like/Unlike character
router.post('/:characterId/like', async (req: Request, res: Response) => {
  const { characterId } = req.params;
  const userId = req.user!.id;

  try {
    // For characters, we'll use a simpler approach and just increment/decrement likes
    // In a real app, you might want to track individual likes
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      select: { likes: true }
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    // For simplicity, we'll just increment likes
    // In production, you'd want to track individual user likes to prevent spam
    const updatedCharacter = await prisma.character.update({
      where: { id: characterId },
      data: { likes: { increment: 1 } }
    });

    logger.info(`Character liked: ${characterId} by ${userId}`);
    res.json({ message: 'Character liked', likes: updatedCharacter.likes });
  } catch (error) {
    logger.error('Like character error:', error);
    throw error;
  }
});

export default router;