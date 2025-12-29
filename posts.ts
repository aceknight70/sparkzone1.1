import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { validate, schemas } from '../middleware/validation';
import { logger } from '../utils/logger';

const router = Router();

// Create post
router.post('/', validate(schemas.createPost), async (req: Request, res: Response) => {
  const postData = req.body;
  
  try {
    const post = await prisma.post.create({
      data: {
        ...postData,
        userId: req.user!.id
      },
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
        character: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        },
        community: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    logger.info(`Post created by ${req.user!.username}: ${post.id}`);
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    logger.error('Create post error:', error);
    throw error;
  }
});

// Get feed (posts from followed users)
router.get('/feed', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    // Get users that current user follows
    const following = await prisma.follow.findMany({
      where: { followerId: req.user!.id },
      select: { followingId: true }
    });

    const followingIds = following.map(f => f.followingId);
    followingIds.push(req.user!.id); // Include own posts

    const posts = await prisma.post.findMany({
      where: {
        userId: { in: followingIds }
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
        },
        character: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        },
        community: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        },
        likes: {
          where: { userId: req.user!.id },
          select: { id: true }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add isLiked field
    const postsWithLikes = posts.map(post => ({
      ...post,
      isLiked: post.likes.length > 0,
      likes: undefined // Remove the likes array, we only need the count
    }));

    const total = await prisma.post.count({
      where: {
        userId: { in: followingIds }
      }
    });

    res.json({
      posts: postsWithLikes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get feed error:', error);
    throw error;
  }
});

// Get all posts (explore/discover)
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const type = req.query.type as string;
  const communityId = req.query.communityId as string;

  try {
    const where: any = {};
    
    if (type) {
      where.type = type;
    }
    
    if (communityId) {
      where.communityId = communityId;
    }

    const posts = await prisma.post.findMany({
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
        character: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        },
        community: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        },
        likes: req.user ? {
          where: { userId: req.user.id },
          select: { id: true }
        } : false,
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add isLiked field if user is authenticated
    const postsWithLikes = posts.map(post => ({
      ...post,
      isLiked: req.user ? (post.likes as any[]).length > 0 : false,
      likes: undefined
    }));

    const total = await prisma.post.count({ where });

    res.json({
      posts: postsWithLikes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get posts error:', error);
    throw error;
  }
});

// Get single post
router.get('/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
        character: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            description: true
          }
        },
        community: {
          select: {
            id: true,
            name: true,
            imageUrl: true
          }
        },
        likes: req.user ? {
          where: { userId: req.user.id },
          select: { id: true }
        } : false,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true
              }
            },
            likes: req.user ? {
              where: { userId: req.user.id },
              select: { id: true }
            } : false,
            _count: {
              select: {
                likes: true,
                replies: true
              }
            }
          },
          where: { parentId: null }, // Only top-level comments
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Format the response
    const formattedPost = {
      ...post,
      isLiked: req.user ? (post.likes as any[]).length > 0 : false,
      likes: undefined,
      comments: (post.comments as any[]).map(comment => ({
        ...comment,
        isLiked: req.user ? comment.likes.length > 0 : false,
        likes: undefined
      }))
    };

    res.json(formattedPost);
  } catch (error) {
    logger.error('Get post error:', error);
    throw error;
  }
});

// Like/Unlike post
router.post('/:postId/like', async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = req.user!.id;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id }
      });

      await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } }
      });

      logger.info(`Post unliked: ${postId} by ${userId}`);
      res.json({ message: 'Post unliked', isLiked: false });
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId,
          postId
        }
      });

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { likeCount: { increment: 1 } },
        select: { userId: true }
      });

      // Create notification for post owner
      if (updatedPost.userId !== userId) {
        await prisma.notification.create({
          data: {
            type: 'LIKE',
            title: 'Post Liked',
            content: `${req.user!.username} liked your post`,
            userId: updatedPost.userId,
            data: {
              postId,
              likerId: userId,
              likerUsername: req.user!.username
            }
          }
        });
      }

      logger.info(`Post liked: ${postId} by ${userId}`);
      res.json({ message: 'Post liked', isLiked: true });
    }
  } catch (error) {
    logger.error('Like/unlike post error:', error);
    throw error;
  }
});

// Add comment to post
router.post('/:postId/comments', async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { content, parentId } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: 'Comment content is required' });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        userId: req.user!.id,
        postId,
        parentId: parentId || null
      },
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
            likes: true,
            replies: true
          }
        }
      }
    });

    // Update post comment count
    await prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } }
    });

    // Create notification for post owner
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true }
    });

    if (post && post.userId !== req.user!.id) {
      await prisma.notification.create({
        data: {
          type: 'COMMENT',
          title: 'New Comment',
          content: `${req.user!.username} commented on your post`,
          userId: post.userId,
          data: {
            postId,
            commentId: comment.id,
            commenterUsername: req.user!.username
          }
        }
      });
    }

    logger.info(`Comment added to post ${postId} by ${req.user!.username}`);
    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    logger.error('Add comment error:', error);
    throw error;
  }
});

// Delete post
router.delete('/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await prisma.post.delete({
      where: { id: postId }
    });

    logger.info(`Post deleted: ${postId} by ${req.user!.username}`);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    logger.error('Delete post error:', error);
    throw error;
  }
});

export default router;