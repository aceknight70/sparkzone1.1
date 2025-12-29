import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User, token: string) => {
        localStorage.setItem('spark_token', token);
        localStorage.setItem('spark_user', JSON.stringify(user));
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        localStorage.removeItem('spark_token');
        localStorage.removeItem('spark_user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          localStorage.setItem('spark_user', JSON.stringify(updatedUser));
          set({ user: updatedUser });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'spark-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// UI State Store
interface UIState {
  sidebarOpen: boolean;
  notifications: any[];
  unreadCount: number;
  activeModal: string | null;
  theme: 'dark' | 'light';
  setSidebarOpen: (open: boolean) => void;
  setNotifications: (notifications: any[]) => void;
  setUnreadCount: (count: number) => void;
  addNotification: (notification: any) => void;
  markNotificationAsRead: (notificationId: string) => void;
  setActiveModal: (modal: string | null) => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: false,
      notifications: [],
      unreadCount: 0,
      activeModal: null,
      theme: 'dark',

      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

      setNotifications: (notifications: any[]) =>
        set({ notifications }),

      setUnreadCount: (count: number) => set({ unreadCount: count }),

      addNotification: (notification: any) => {
        const currentNotifications = get().notifications;
        set({
          notifications: [notification, ...currentNotifications],
          unreadCount: get().unreadCount + 1,
        });
      },

      markNotificationAsRead: (notificationId: string) => {
        const notifications = get().notifications.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        );
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount });
      },

      setActiveModal: (modal: string | null) => set({ activeModal: modal }),

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.className = newTheme;
        set({ theme: newTheme });
      },
    }),
    {
      name: 'spark-ui',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// Social State Store
interface SocialState {
  feed: any[];
  characters: any[];
  worlds: any[];
  stories: any[];
  communities: any[];
  parties: any[];
  following: string[];
  followers: string[];
  setFeed: (posts: any[]) => void;
  addPost: (post: any) => void;
  updatePost: (postId: string, updates: any) => void;
  removePost: (postId: string) => void;
  setCharacters: (characters: any[]) => void;
  addCharacter: (character: any) => void;
  updateCharacter: (characterId: string, updates: any) => void;
  removeCharacter: (characterId: string) => void;
  setFollowing: (userIds: string[]) => void;
  addFollowing: (userId: string) => void;
  removeFollowing: (userId: string) => void;
  setFollowers: (userIds: string[]) => void;
  addFollower: (userId: string) => void;
  removeFollower: (userId: string) => void;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  feed: [],
  characters: [],
  worlds: [],
  stories: [],
  communities: [],
  parties: [],
  following: [],
  followers: [],

  setFeed: (posts: any[]) => set({ feed: posts }),

  addPost: (post: any) => {
    const currentFeed = get().feed;
    set({ feed: [post, ...currentFeed] });
  },

  updatePost: (postId: string, updates: any) => {
    const feed = get().feed.map(post =>
      post.id === postId ? { ...post, ...updates } : post
    );
    set({ feed });
  },

  removePost: (postId: string) => {
    const feed = get().feed.filter(post => post.id !== postId);
    set({ feed });
  },

  setCharacters: (characters: any[]) => set({ characters }),

  addCharacter: (character: any) => {
    const currentCharacters = get().characters;
    set({ characters: [character, ...currentCharacters] });
  },

  updateCharacter: (characterId: string, updates: any) => {
    const characters = get().characters.map(char =>
      char.id === characterId ? { ...char, ...updates } : char
    );
    set({ characters });
  },

  removeCharacter: (characterId: string) => {
    const characters = get().characters.filter(char => char.id !== characterId);
    set({ characters });
  },

  setFollowing: (userIds: string[]) => set({ following: userIds }),

  addFollowing: (userId: string) => {
    const following = [...get().following, userId];
    set({ following });
  },

  removeFollowing: (userId: string) => {
    const following = get().following.filter(id => id !== userId);
    set({ following });
  },

  setFollowers: (userIds: string[]) => set({ followers: userIds }),

  addFollower: (userId: string) => {
    const followers = [...get().followers, userId];
    set({ followers });
  },

  removeFollower: (userId: string) => {
    const followers = get().followers.filter(id => id !== userId);
    set({ followers });
  },
}));

// Game State Store (for Spark Clash)
interface GameState {
  sparks: number;
  battlePower: number;
  cards: any[];
  decks: any[];
  activeBattles: any[];
  leaderboard: any[];
  setSparks: (sparks: number) => void;
  setBattlePower: (power: number) => void;
  setCards: (cards: any[]) => void;
  addCard: (card: any) => void;
  setDecks: (decks: any[]) => void;
  updateDeck: (deckId: string, updates: any) => void;
  setActiveBattles: (battles: any[]) => void;
  addBattle: (battle: any) => void;
  updateBattle: (battleId: string, updates: any) => void;
  setLeaderboard: (leaderboard: any[]) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  sparks: 0,
  battlePower: 0,
  cards: [],
  decks: [],
  activeBattles: [],
  leaderboard: [],

  setSparks: (sparks: number) => set({ sparks }),

  setBattlePower: (power: number) => set({ battlePower: power }),

  setCards: (cards: any[]) => set({ cards }),

  addCard: (card: any) => {
    const currentCards = get().cards;
    set({ cards: [...currentCards, card] });
  },

  setDecks: (decks: any[]) => set({ decks }),

  updateDeck: (deckId: string, updates: any) => {
    const decks = get().decks.map(deck =>
      deck.id === deckId ? { ...deck, ...updates } : deck
    );
    set({ decks });
  },

  setActiveBattles: (battles: any[]) => set({ activeBattles: battles }),

  addBattle: (battle: any) => {
    const currentBattles = get().activeBattles;
    set({ activeBattles: [battle, ...currentBattles] });
  },

  updateBattle: (battleId: string, updates: any) => {
    const battles = get().activeBattles.map(battle =>
      battle.id === battleId ? { ...battle, ...updates } : battle
    );
    set({ activeBattles: battles });
  },

  setLeaderboard: (leaderboard: any[]) => set({ leaderboard }),
}));