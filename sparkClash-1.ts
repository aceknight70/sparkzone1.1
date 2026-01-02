import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { allSparkClashCards, newSparkClashCards, getCardById, createRandomDeck } from '../data/sparkClashCards';
import { SparkClashCard, CardRarity, GameState, SparkClashMatch, MatchStatus } from '../types/sparkClash';

const router = Router();
const prisma = new PrismaClient();

// Get all available cards
router.get('/cards', async (req, res) => {
  try {
    const { rarity, type, search, limit = 50, offset = 0 } = req.query;
    
    let filteredCards = allSparkClashCards;
    
    // Filter by rarity
    if (rarity) {
      filteredCards = filteredCards.filter(card => card.rarity === rarity);
    }
    
    // Filter by type
    if (type) {
      filteredCards = filteredCards.filter(card => card.type === type);
    }
    
    // Search by name or description
    if (search) {
      const searchTerm = search.toString().toLowerCase();
      filteredCards = filteredCards.filter(card => 
        card.name.toLowerCase().includes(searchTerm) ||
        card.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Pagination
    const startIndex = parseInt(offset.toString());
    const limitNum = parseInt(limit.toString());
    const paginatedCards = filteredCards.slice(startIndex, startIndex + limitNum);
    
    res.json({
      cards: paginatedCards,
      total: filteredCards.length,
      hasMore: startIndex + limitNum < filteredCards.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// Get card by ID
router.get('/cards/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = getCardById(cardId);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch card' });
  }
});

// Get user's Spark Clash profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // This would typically fetch from database
    // For now, using mock data structure
    const profile = {
      userId,
      sparks: 1250,
      battlePower: 2100,
      wins: 15,
      losses: 8,
      rank: 'DUELIST',
      ownedCards: allSparkClashCards.map(card => card.id), // User owns all cards for demo
      currentDeck: {
        id: 'deck1',
        name: 'Starter Deck',
        cardIds: ['100', '101', '102', '103', '1', 'common_001', 'common_002', 'rare_001', 'epic_001', 'legendary_001']
      },
      achievements: [
        {
          id: 'first_win',
          name: 'First Victory',
          description: 'Win your first Spark Clash match',
          iconUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=100&auto=format&fit=crop',
          unlockedAt: new Date('2024-01-15')
        }
      ],
      collection: allSparkClashCards.reduce((acc, card) => {
        acc[card.id] = card.rarity === CardRarity.LEGENDARY ? 1 : 
                      card.rarity === CardRarity.EPIC ? 2 : 
                      card.rarity === CardRarity.RARE ? 3 : 5;
        return acc;
      }, {} as { [key: string]: number })
    };
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Create or update deck
router.post('/decks', authMiddleware, async (req, res) => {
  try {
    const { name, cardIds, description } = req.body;
    const userId = req.user.id;
    
    // Validate deck
    if (!cardIds || cardIds.length < 20 || cardIds.length > 30) {
      return res.status(400).json({ error: 'Deck must contain 20-30 cards' });
    }
    
    // Validate all cards exist
    const invalidCards = cardIds.filter((id: string) => !getCardById(id));
    if (invalidCards.length > 0) {
      return res.status(400).json({ error: `Invalid cards: ${invalidCards.join(', ')}` });
    }
    
    const deck = {
      id: `deck_${Date.now()}`,
      name,
      cardIds,
      userId,
      description,
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    res.json(deck);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create deck' });
  }
});

// Get user's decks
router.get('/decks', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Mock user decks
    const decks = [
      {
        id: 'deck1',
        name: 'Starter Deck',
        cardIds: ['100', '101', '102', '103', '1', 'common_001', 'common_002'],
        userId,
        description: 'Basic starter deck for new players',
        isPublic: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: 'deck2',
        name: 'Legendary Power',
        cardIds: ['legendary_001', 'legendary_002', 'legendary_003', 'legendary_004', 'epic_001', 'epic_002'],
        userId,
        description: 'High-cost legendary focused deck',
        isPublic: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      }
    ];
    
    res.json(decks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch decks' });
  }
});

// Start matchmaking
router.post('/matchmaking', authMiddleware, async (req, res) => {
  try {
    const { deckId } = req.body;
    const userId = req.user.id;
    
    // Validate deck exists and belongs to user
    // In real implementation, would check database
    
    const matchId = `match_${Date.now()}`;
    const match = {
      id: matchId,
      player1Id: userId,
      player2Id: null, // Will be assigned when opponent found
      status: MatchStatus.WAITING,
      startedAt: new Date(),
      deckId
    };
    
    res.json({
      matchId,
      status: 'searching',
      estimatedWaitTime: '30 seconds'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start matchmaking' });
  }
});

// Get match state
router.get('/matches/:matchId', authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;
    
    // Mock match state
    const gameState = {
      matchId,
      currentTurn: 1,
      activePlayer: userId,
      phase: 'MAIN',
      player1: {
        userId,
        health: 30,
        mana: 3,
        maxMana: 3,
        handSize: 5,
        deckSize: 25,
        board: []
      },
      player2: {
        userId: 'opponent_123',
        health: 30,
        mana: 3,
        maxMana: 3,
        handSize: 5,
        deckSize: 25,
        board: []
      }
    };
    
    res.json(gameState);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch match state' });
  }
});

// Play a card
router.post('/matches/:matchId/play', authMiddleware, async (req, res) => {
  try {
    const { matchId } = req.params;
    const { cardId, targetId, position } = req.body;
    const userId = req.user.id;
    
    // Validate card exists
    const card = getCardById(cardId);
    if (!card) {
      return res.status(400).json({ error: 'Invalid card' });
    }
    
    // In real implementation, would validate game state and execute card
    const action = {
      type: 'PLAY_CARD',
      cardId,
      targetId,
      position,
      playerId: userId,
      timestamp: new Date()
    };
    
    res.json({
      success: true,
      action,
      newGameState: {
        // Would return updated game state
        message: `Played ${card.name}`
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to play card' });
  }
});

// Open card pack
router.post('/packs/open', authMiddleware, async (req, res) => {
  try {
    const { packType = 'standard' } = req.body;
    const userId = req.user.id;
    
    // Generate random cards based on rarity distribution
    const cards = [];
    const rarityChances = {
      [CardRarity.COMMON]: 0.65,
      [CardRarity.RARE]: 0.25,
      [CardRarity.EPIC]: 0.08,
      [CardRarity.LEGENDARY]: 0.02
    };
    
    // Generate 5 cards
    for (let i = 0; i < 5; i++) {
      const rand = Math.random();
      let selectedRarity: CardRarity;
      
      if (rand < rarityChances[CardRarity.COMMON]) {
        selectedRarity = CardRarity.COMMON;
      } else if (rand < rarityChances[CardRarity.COMMON] + rarityChances[CardRarity.RARE]) {
        selectedRarity = CardRarity.RARE;
      } else if (rand < rarityChances[CardRarity.COMMON] + rarityChances[CardRarity.RARE] + rarityChances[CardRarity.EPIC]) {
        selectedRarity = CardRarity.EPIC;
      } else {
        selectedRarity = CardRarity.LEGENDARY;
      }
      
      const cardsOfRarity = allSparkClashCards.filter(card => card.rarity === selectedRarity);
      if (cardsOfRarity.length > 0) {
        const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
        cards.push(randomCard);
      }
    }
    
    // Guarantee at least one rare or better in pack
    if (cards.every(card => card.rarity === CardRarity.COMMON)) {
      const rareCards = allSparkClashCards.filter(card => card.rarity === CardRarity.RARE);
      if (rareCards.length > 0) {
        cards[0] = rareCards[Math.floor(Math.random() * rareCards.length)];
      }
    }
    
    res.json({
      packId: `pack_${Date.now()}`,
      cards,
      sparkValue: cards.reduce((total, card) => {
        switch (card.rarity) {
          case CardRarity.LEGENDARY: return total + 400;
          case CardRarity.EPIC: return total + 100;
          case CardRarity.RARE: return total + 20;
          default: return total + 5;
        }
      }, 0)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to open pack' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    // Mock leaderboard data
    const leaderboard = [
      {
        userId: 'user_001',
        username: 'CardMaster',
        battlePower: 3500,
        rank: 'GRANDMASTER',
        wins: 150,
        losses: 45,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'
      },
      {
        userId: 'user_002',
        username: 'SparkLord',
        battlePower: 3200,
        rank: 'WARLORD',
        wins: 120,
        losses: 38,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop'
      }
    ];
    
    res.json({
      leaderboard,
      total: leaderboard.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Generate random deck
router.post('/decks/random', authMiddleware, async (req, res) => {
  try {
    const { theme, rarity, size = 30 } = req.body;
    const userId = req.user.id;
    
    const cardIds = createRandomDeck(size);
    const cards = cardIds.map(id => getCardById(id)).filter(Boolean);
    
    const deck = {
      id: `deck_random_${Date.now()}`,
      name: `Random Deck - ${new Date().toLocaleDateString()}`,
      cardIds,
      userId,
      description: 'AI-generated random deck',
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      cards
    };
    
    res.json(deck);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate random deck' });
  }
});

// Get daily quest
router.get('/quests/daily', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const dailyQuests = [
      {
        id: 'daily_001',
        name: 'Victory March',
        description: 'Win 3 Spark Clash matches',
        requirement: { type: 'WIN_GAMES', target: 3 },
        reward: { sparks: 100, experience: 50 },
        progress: 1,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        id: 'daily_002',
        name: 'Spell Caster',
        description: 'Play 10 spell cards',
        requirement: { type: 'PLAY_CARD_TYPE', target: 10, condition: 'SPELL' },
        reward: { sparks: 50, packs: 1 },
        progress: 3,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    ];
    
    res.json(dailyQuests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daily quests' });
  }
});

export default router;