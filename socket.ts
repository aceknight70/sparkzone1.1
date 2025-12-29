import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { logger } from '../utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

let io: Server;

export const initializeSocket = (socketServer: Server) => {
  io = socketServer;

  // Authentication middleware for Socket.IO
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
      
      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, username: true }
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User connected: ${socket.username} (${socket.userId})`);

    // Join user to their personal room for notifications
    socket.join(`user_${socket.userId}`);

    // Handle joining party rooms
    socket.on('join_party', (partyId: string) => {
      socket.join(`party_${partyId}`);
      logger.info(`${socket.username} joined party ${partyId}`);
    });

    // Handle leaving party rooms
    socket.on('leave_party', (partyId: string) => {
      socket.leave(`party_${partyId}`);
      logger.info(`${socket.username} left party ${partyId}`);
    });

    // Handle party messages
    socket.on('party_message', async (data) => {
      try {
        const { partyId, content, type = 'TEXT', characterId } = data;

        // Verify user is in the party
        const membership = await prisma.partyMember.findUnique({
          where: {
            userId_partyId: {
              userId: socket.userId!,
              partyId
            }
          }
        });

        if (!membership) {
          socket.emit('error', { message: 'Not a member of this party' });
          return;
        }

        // Create message in database
        const message = await prisma.partyMessage.create({
          data: {
            content,
            type,
            partyId,
            userId: socket.userId!,
            characterId
          }
        });

        // Get user and character data
        const user = await prisma.user.findUnique({
          where: { id: socket.userId! },
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true
          }
        });

        let character = null;
        if (characterId) {
          character = await prisma.character.findUnique({
            where: { id: characterId },
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          });
        }

        const messageData = {
          ...message,
          user,
          character
        };

        // Broadcast to party room
        io.to(`party_${partyId}`).emit('party_message', messageData);
        
        // Update party's last activity
        await prisma.party.update({
          where: { id: partyId },
          data: { updatedAt: new Date() }
        });

        logger.info(`Party message from ${socket.username} in party ${partyId}`);
      } catch (error) {
        logger.error('Party message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle private messages
    socket.on('private_message', async (data) => {
      try {
        const { conversationId, content, type = 'TEXT' } = data;

        // Verify user is part of the conversation
        const participant = await prisma.conversationParticipant.findUnique({
          where: {
            userId_conversationId: {
              userId: socket.userId!,
              conversationId
            }
          }
        });

        if (!participant) {
          socket.emit('error', { message: 'Not part of this conversation' });
          return;
        }

        // Create message
        const message = await prisma.message.create({
          data: {
            content,
            type,
            senderId: socket.userId!,
            conversationId
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        });

        // Get all participants
        const participants = await prisma.conversationParticipant.findMany({
          where: { conversationId },
          select: { userId: true }
        });

        // Send to all participants
        participants.forEach(participant => {
          io.to(`user_${participant.userId}`).emit('private_message', message);
        });

        // Update conversation timestamp
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { lastMessageAt: new Date() }
        });

        logger.info(`Private message from ${socket.username} in conversation ${conversationId}`);
      } catch (error) {
        logger.error('Private message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle user status updates
    socket.on('user_status', async (status) => {
      try {
        await prisma.user.update({
          where: { id: socket.userId! },
          data: { lastActive: new Date() }
        });

        // Broadcast status to followers
        const followers = await prisma.follow.findMany({
          where: { followingId: socket.userId! },
          select: { followerId: true }
        });

        followers.forEach(follower => {
          io.to(`user_${follower.followerId}`).emit('user_status_update', {
            userId: socket.userId,
            username: socket.username,
            status,
            lastActive: new Date()
          });
        });
      } catch (error) {
        logger.error('User status update error:', error);
      }
    });

    // Handle Spark Clash game events
    socket.on('spark_battle_move', async (data) => {
      try {
        const { battleId, moveData } = data;

        // Verify user is part of the battle
        const battle = await prisma.sparkBattle.findUnique({
          where: { id: battleId },
          select: {
            participant1Id: true,
            participant2Id: true,
            status: true
          }
        });

        if (!battle || battle.status !== 'IN_PROGRESS') {
          socket.emit('error', { message: 'Battle not found or not active' });
          return;
        }

        if (battle.participant1Id !== socket.userId && battle.participant2Id !== socket.userId) {
          socket.emit('error', { message: 'Not part of this battle' });
          return;
        }

        // Process the move and update battle state
        // This would include game logic for Spark Clash
        
        // Broadcast move to both players
        const opponentId = battle.participant1Id === socket.userId ? 
          battle.participant2Id : battle.participant1Id;
        
        io.to(`user_${socket.userId}`).to(`user_${opponentId}`).emit('spark_battle_move', {
          battleId,
          playerId: socket.userId,
          moveData,
          timestamp: new Date()
        });

        logger.info(`Spark battle move in ${battleId} by ${socket.username}`);
      } catch (error) {
        logger.error('Spark battle move error:', error);
        socket.emit('error', { message: 'Failed to process move' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.username} (${socket.userId})`);
    });
  });

  return io;
};

// Helper functions to send notifications
export const sendNotification = async (userId: string, notification: any) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification', notification);
  }
};

export const sendToParty = (partyId: string, event: string, data: any) => {
  if (io) {
    io.to(`party_${partyId}`).emit(event, data);
  }
};

export const sendToUser = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
};

export { io };