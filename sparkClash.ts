// Updated Spark Clash Types with enhanced card system
export enum CardRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export enum CardType {
  CREATURE = 'CREATURE',
  SPELL = 'SPELL',
  ARTIFACT = 'ARTIFACT',
  ENCHANTMENT = 'ENCHANTMENT'
}

export interface SparkClashCard {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  cost: number; // Mana/energy cost
  attack: number; // Attack power (0 for non-creature cards)
  health: number; // Health points (0 for non-creature cards)
  description: string; // Card effect description
  imageUrl: string;
  abilities: string[]; // List of special abilities
  flavorText: string; // Lore text
  tags?: string[]; // Optional tags for filtering (e.g., ['Tech', 'Digital', 'Warrior'])
  artist?: string; // Card artist credit
  set?: string; // Expansion set name
}

export interface SparkClashDeck {
  id: string;
  name: string;
  cardIds: string[];
  userId: string;
  isPublic: boolean;
  description?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SparkClashProfile {
  userId: string;
  sparks: number; // Currency
  battlePower: number; // Overall rating
  wins: number;
  losses: number;
  rank: SparkClashRank;
  currentDeck?: SparkClashDeck;
  ownedCards: string[]; // Array of card IDs
  collection: CardCollection;
  achievements: Achievement[];
  seasonStats: SeasonStats;
}

export interface CardCollection {
  [cardId: string]: number; // Card ID to quantity owned
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface SeasonStats {
  season: number;
  wins: number;
  losses: number;
  highestRank: SparkClashRank;
  sparksEarned: number;
  gamesPlayed: number;
}

export enum SparkClashRank {
  NOVICE = 'NOVICE',
  APPRENTICE = 'APPRENTICE', 
  DUELIST = 'DUELIST',
  GLADIATOR = 'GLADIATOR',
  WARLORD = 'WARLORD',
  GRANDMASTER = 'GRANDMASTER',
  LEGEND = 'LEGEND'
}

export interface SparkClashMatch {
  id: string;
  player1Id: string;
  player2Id: string;
  player1Deck: string[];
  player2Deck: string[];
  winner?: string;
  turns: MatchTurn[];
  status: MatchStatus;
  startedAt: Date;
  endedAt?: Date;
  spectators?: string[]; // User IDs watching the match
}

export enum MatchStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}

export interface MatchTurn {
  turnNumber: number;
  playerId: string;
  actions: GameAction[];
  timestamp: Date;
}

export interface GameAction {
  type: ActionType;
  cardId?: string;
  targetId?: string;
  position?: number;
  metadata?: any;
}

export enum ActionType {
  DRAW_CARD = 'DRAW_CARD',
  PLAY_CARD = 'PLAY_CARD',
  ATTACK = 'ATTACK',
  END_TURN = 'END_TURN',
  USE_ABILITY = 'USE_ABILITY',
  SURRENDER = 'SURRENDER'
}

export interface GameState {
  matchId: string;
  currentTurn: number;
  activePlayer: string;
  player1: PlayerState;
  player2: PlayerState;
  phase: GamePhase;
  winner?: string;
}

export interface PlayerState {
  userId: string;
  health: number;
  mana: number;
  maxMana: number;
  hand: SparkClashCard[];
  deck: SparkClashCard[];
  board: BoardCreature[];
  graveyard: SparkClashCard[];
}

export interface BoardCreature extends SparkClashCard {
  currentAttack: number;
  currentHealth: number;
  canAttack: boolean;
  summondThisTurn: boolean;
  effects: CardEffect[];
}

export interface CardEffect {
  id: string;
  name: string;
  description: string;
  duration: number; // -1 for permanent
  source: string; // Card ID that applied this effect
}

export enum GamePhase {
  MULLIGAN = 'MULLIGAN',
  MAIN = 'MAIN',
  COMBAT = 'COMBAT',
  END = 'END'
}

// Card packs and store
export interface CardPack {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sparkCost: number;
  guaranteedRarity?: CardRarity;
  cardCount: number;
  set?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sparkCost: number;
  realMoneyCost?: number; // In cents
  type: StoreItemType;
  quantity?: number; // For limited items
  expiresAt?: Date;
}

export enum StoreItemType {
  CARD_PACK = 'CARD_PACK',
  INDIVIDUAL_CARD = 'INDIVIDUAL_CARD',
  AVATAR = 'AVATAR',
  CARD_BACK = 'CARD_BACK',
  BOARD_SKIN = 'BOARD_SKIN',
  PREMIUM_CURRENCY = 'PREMIUM_CURRENCY'
}

// Tournament system
export interface Tournament {
  id: string;
  name: string;
  description: string;
  entryFee: number; // In sparks
  maxParticipants: number;
  participants: string[]; // User IDs
  brackets: TournamentBracket[];
  status: TournamentStatus;
  startDate: Date;
  endDate?: Date;
  prizes: TournamentPrize[];
}

export interface TournamentBracket {
  round: number;
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  player1Id: string;
  player2Id: string;
  winnerId?: string;
  matchId?: string; // Reference to SparkClashMatch
}

export interface TournamentPrize {
  placement: number; // 1st, 2nd, 3rd, etc.
  sparks?: number;
  cards?: string[]; // Card IDs
  cosmetics?: string[]; // Cosmetic item IDs
}

export enum TournamentStatus {
  REGISTRATION = 'REGISTRATION',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// Arena/Draft mode
export interface ArenaRun {
  id: string;
  userId: string;
  wins: number;
  losses: number;
  deck: string[]; // Card IDs
  isActive: boolean;
  rewards: ArenaReward[];
  startedAt: Date;
  endedAt?: Date;
}

export interface ArenaReward {
  type: RewardType;
  quantity: number;
  cardIds?: string[];
}

export enum RewardType {
  SPARKS = 'SPARKS',
  CARDS = 'CARDS',
  PACKS = 'PACKS',
  COSMETICS = 'COSMETICS'
}

// Daily quests and progression
export interface DailyQuest {
  id: string;
  name: string;
  description: string;
  requirement: QuestRequirement;
  reward: QuestReward;
  expiresAt: Date;
  completedBy: string[]; // User IDs who completed this quest
}

export interface QuestRequirement {
  type: QuestType;
  target: number;
  condition?: any; // Additional conditions
}

export interface QuestReward {
  sparks?: number;
  cards?: string[];
  packs?: number;
  experience?: number;
}

export enum QuestType {
  WIN_GAMES = 'WIN_GAMES',
  PLAY_CARDS = 'PLAY_CARDS',
  DEAL_DAMAGE = 'DEAL_DAMAGE',
  PLAY_CARD_TYPE = 'PLAY_CARD_TYPE',
  WIN_WITH_CLASS = 'WIN_WITH_CLASS'
}