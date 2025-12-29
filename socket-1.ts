import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore, useUIStore, useSocialStore } from '../store';
import toast from 'react-hot-toast';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      maxReconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventHandlers();
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  private setupEventHandlers() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
      this.reconnectAttempts = 0;
      toast.success('Connected to real-time services');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect - don't reconnect
        return;
      }
      toast.error('Lost connection. Attempting to reconnect...');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Unable to connect to real-time services');
      }
    });

    // Real-time events
    this.socket.on('notification', (notification) => {
      const { addNotification } = useUIStore.getState();
      addNotification(notification);
      
      // Show toast notification
      toast(notification.content, {
        icon: this.getNotificationIcon(notification.type),
        duration: 4000,
      });
    });

    this.socket.on('user_status_update', (data) => {
      // Handle user status updates (online/offline, etc.)
      console.log('User status update:', data);
    });

    this.socket.on('party_message', (message) => {
      // Handle party messages
      console.log('Party message received:', message);
      // You would typically update the party chat state here
    });

    this.socket.on('private_message', (message) => {
      // Handle private messages
      console.log('Private message received:', message);
      // You would typically update the conversation state here
    });

    this.socket.on('spark_battle_move', (data) => {
      // Handle Spark Clash game moves
      console.log('Battle move received:', data);
      // Update game state
    });

    this.socket.on('post_update', (data) => {
      // Handle real-time post updates (likes, comments)
      const { updatePost } = useSocialStore.getState();
      updatePost(data.postId, data.updates);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error(error.message || 'An error occurred');
    });
  }

  private getNotificationIcon(type: string): string {
    switch (type) {
      case 'LIKE':
        return '❤️';
      case 'COMMENT':
        return '💬';
      case 'FOLLOW':
        return '👤';
      case 'MENTION':
        return '📢';
      case 'PARTY_INVITE':
        return '🎭';
      case 'COMMUNITY_INVITE':
        return '🏘️';
      case 'SPARK_BATTLE_CHALLENGE':
        return '⚔️';
      default:
        return '🔔';
    }
  }

  // Party/Chat methods
  joinParty(partyId: string) {
    this.socket?.emit('join_party', partyId);
  }

  leaveParty(partyId: string) {
    this.socket?.emit('leave_party', partyId);
  }

  sendPartyMessage(partyId: string, content: string, type = 'TEXT', characterId?: string) {
    this.socket?.emit('party_message', {
      partyId,
      content,
      type,
      characterId,
    });
  }

  sendPrivateMessage(conversationId: string, content: string, type = 'TEXT') {
    this.socket?.emit('private_message', {
      conversationId,
      content,
      type,
    });
  }

  // Game methods
  sendBattleMove(battleId: string, moveData: any) {
    this.socket?.emit('spark_battle_move', {
      battleId,
      moveData,
    });
  }

  updateUserStatus(status: string) {
    this.socket?.emit('user_status', status);
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Create singleton instance
const socketService = new SocketService();

// Custom hook for using socket
export function useSocket() {
  const { user, token, isAuthenticated } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      const socket = socketService.connect(token);
      
      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);
      
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      
      setIsConnected(socket.connected);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
      };
    } else {
      socketService.disconnect();
      setIsConnected(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    // Clean up on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  return {
    socket: socketService.getSocket(),
    isConnected,
    // Exposed methods
    joinParty: socketService.joinParty.bind(socketService),
    leaveParty: socketService.leaveParty.bind(socketService),
    sendPartyMessage: socketService.sendPartyMessage.bind(socketService),
    sendPrivateMessage: socketService.sendPrivateMessage.bind(socketService),
    sendBattleMove: socketService.sendBattleMove.bind(socketService),
    updateUserStatus: socketService.updateUserStatus.bind(socketService),
  };
}

// Hook for party chat functionality
export function usePartyChat(partyId: string) {
  const { joinParty, leaveParty, sendPartyMessage } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (partyId) {
      joinParty(partyId);
      
      return () => {
        leaveParty(partyId);
      };
    }
  }, [partyId, joinParty, leaveParty]);

  const sendMessage = (content: string, characterId?: string) => {
    sendPartyMessage(partyId, content, 'TEXT', characterId);
  };

  return {
    messages,
    sendMessage,
  };
}

// Hook for private messaging
export function usePrivateChat(conversationId: string) {
  const { sendPrivateMessage } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);

  const sendMessage = (content: string) => {
    sendPrivateMessage(conversationId, content);
  };

  return {
    messages,
    sendMessage,
  };
}

export default socketService;