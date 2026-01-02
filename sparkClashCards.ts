import { SparkClashCard, CardRarity, CardType } from '../types/sparkClash';

// 20 New Spark Clash Cards
export const newSparkClashCards: SparkClashCard[] = [
  // Legendary Cards (4)
  {
    id: 'legendary_001',
    name: 'Quantum Phoenix',
    type: CardType.CREATURE,
    rarity: CardRarity.LEGENDARY,
    cost: 9,
    attack: 8,
    health: 8,
    description: 'When Quantum Phoenix dies, return it to your hand and reduce its cost by 3.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&auto=format&fit=crop',
    abilities: ['Phoenix Rebirth: On death, return to hand with -3 cost'],
    flavorText: 'Death is merely another dimension to traverse.'
  },
  {
    id: 'legendary_002',
    name: 'Void Empress',
    type: CardType.CREATURE,
    rarity: CardRarity.LEGENDARY,
    cost: 10,
    attack: 7,
    health: 9,
    description: 'Battlecry: Destroy all enemy creatures with cost 4 or less.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop',
    abilities: ['Void Purge: Destroy enemy creatures (cost ≤4)'],
    flavorText: 'In the void, all lesser beings fade to nothing.'
  },
  {
    id: 'legendary_003',
    name: 'Chrono Sage',
    type: CardType.CREATURE,
    rarity: CardRarity.LEGENDARY,
    cost: 8,
    attack: 5,
    health: 7,
    description: 'At the start of your turn, draw an extra card and gain +1 mana crystal this turn.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    abilities: ['Time Mastery: +1 card draw, +1 mana per turn'],
    flavorText: 'Time bends to the will of those who understand its secrets.'
  },
  {
    id: 'legendary_004',
    name: 'Reality Weaver',
    type: CardType.SPELL,
    rarity: CardRarity.LEGENDARY,
    cost: 12,
    attack: 0,
    health: 0,
    description: 'Transform all creatures on the battlefield into random creatures that cost 2 more.',
    imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=400&auto=format&fit=crop',
    abilities: ['Reality Shift: Transform all creatures (+2 cost)'],
    flavorText: 'With a gesture, the very fabric of existence reshapes itself.'
  },

  // Epic Cards (6)
  {
    id: 'epic_001',
    name: 'Cyber Drake',
    type: CardType.CREATURE,
    rarity: CardRarity.EPIC,
    cost: 6,
    attack: 6,
    health: 5,
    description: 'Rush. When Cyber Drake attacks, deal 2 damage to all other enemies.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop',
    abilities: ['Rush', 'Lightning Breath: 2 AoE damage on attack'],
    flavorText: 'Steel wings carry electric death across the digital sky.'
  },
  {
    id: 'epic_002',
    name: 'Shadow Assassin',
    type: CardType.CREATURE,
    rarity: CardRarity.EPIC,
    cost: 5,
    attack: 7,
    health: 3,
    description: 'Stealth. Cannot be targeted by spells or abilities until it attacks.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop',
    abilities: ['Stealth', 'Untargetable until attack'],
    flavorText: 'Strikes from the shadows, vanishes before retaliation.'
  },
  {
    id: 'epic_003',
    name: 'Crystal Guardian',
    type: CardType.CREATURE,
    rarity: CardRarity.EPIC,
    cost: 7,
    attack: 4,
    health: 8,
    description: 'Taunt. Whenever Crystal Guardian takes damage, gain +1/+1.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop',
    abilities: ['Taunt', 'Crystal Growth: +1/+1 when damaged'],
    flavorText: 'Each strike only makes it stronger and more beautiful.'
  },
  {
    id: 'epic_004',
    name: 'Plasma Cannon',
    type: CardType.SPELL,
    rarity: CardRarity.EPIC,
    cost: 4,
    attack: 0,
    health: 0,
    description: 'Deal 5 damage to target enemy. If it dies, deal 3 damage to all other enemies.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&auto=format&fit=crop',
    abilities: ['Chain Destruction: AoE on kill'],
    flavorText: 'Pure energy tears through matter and spreads destruction.'
  },
  {
    id: 'epic_005',
    name: 'Mana Storm',
    type: CardType.SPELL,
    rarity: CardRarity.EPIC,
    cost: 3,
    attack: 0,
    health: 0,
    description: 'Draw 3 cards. Your next spell costs 0.',
    imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=400&auto=format&fit=crop',
    abilities: ['Arcane Surge: +3 cards, next spell free'],
    flavorText: 'Raw magical energy flows through the caster\'s mind.'
  },
  {
    id: 'epic_006',
    name: 'Dimensional Rift',
    type: CardType.SPELL,
    rarity: CardRarity.EPIC,
    cost: 5,
    attack: 0,
    health: 0,
    description: 'Summon a random creature from your opponent\'s deck.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop',
    abilities: ['Dimensional Theft: Summon enemy card'],
    flavorText: 'Sometimes the best strategy is to use your enemy\'s own weapons.'
  },

  // Rare Cards (6)
  {
    id: 'rare_001',
    name: 'Tech Warrior',
    type: CardType.CREATURE,
    rarity: CardRarity.RARE,
    cost: 4,
    attack: 4,
    health: 4,
    description: 'Battlecry: Give all friendly creatures +1 attack this turn.',
    imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
    abilities: ['Battle Cry: +1 attack to allies'],
    flavorText: 'Advanced technology amplifies the warrior\'s natural prowess.'
  },
  {
    id: 'rare_002',
    name: 'Energy Shield',
    type: CardType.SPELL,
    rarity: CardRarity.RARE,
    cost: 2,
    attack: 0,
    health: 0,
    description: 'Give a friendly creature +0/+4 and \"Cannot take more than 3 damage at once.\"',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&auto=format&fit=crop',
    abilities: ['Damage Cap: Max 3 damage per hit'],
    flavorText: 'Pure energy forms an impenetrable barrier.'
  },
  {
    id: 'rare_003',
    name: 'Holo Duplicate',
    type: CardType.SPELL,
    rarity: CardRarity.RARE,
    cost: 3,
    attack: 0,
    health: 0,
    description: 'Choose a friendly creature. Summon a 1/1 copy of it with the same abilities.',
    imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=400&auto=format&fit=crop',
    abilities: ['Holographic Copy: 1/1 clone with abilities'],
    flavorText: 'Light-based technology creates perfect tactical duplicates.'
  },
  {
    id: 'rare_004',
    name: 'Spark Engineer',
    type: CardType.CREATURE,
    rarity: CardRarity.RARE,
    cost: 3,
    attack: 2,
    health: 3,
    description: 'At the end of your turn, reduce the cost of a random card in your hand by 1.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    abilities: ['Innovation: Random card cost -1 per turn'],
    flavorText: 'Every problem has an elegant solution waiting to be discovered.'
  },
  {
    id: 'rare_005',
    name: 'Void Stalker',
    type: CardType.CREATURE,
    rarity: CardRarity.RARE,
    cost: 5,
    attack: 5,
    health: 4,
    description: 'When Void Stalker attacks and kills an enemy, it can attack again.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop',
    abilities: ['Hunt: Extra attack on kill'],
    flavorText: 'Once it tastes victory, nothing can stop its rampage.'
  },
  {
    id: 'rare_006',
    name: 'Quantum Bomb',
    type: CardType.SPELL,
    rarity: CardRarity.RARE,
    cost: 6,
    attack: 0,
    health: 0,
    description: 'Deal damage equal to the number of cards in your hand to all enemies.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop',
    abilities: ['Hand Size Scaling: Damage = cards in hand'],
    flavorText: 'The more knowledge you possess, the greater the explosion.'
  },

  // Common Cards (4)
  {
    id: 'common_001',
    name: 'Data Miner',
    type: CardType.CREATURE,
    rarity: CardRarity.COMMON,
    cost: 2,
    attack: 1,
    health: 3,
    description: 'Battlecry: Draw a card.',
    imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
    abilities: ['Data Extraction: Draw 1 card'],
    flavorText: 'Information is the most valuable currency in the digital age.'
  },
  {
    id: 'common_002',
    name: 'Spark Bolt',
    type: CardType.SPELL,
    rarity: CardRarity.COMMON,
    cost: 1,
    attack: 0,
    health: 0,
    description: 'Deal 2 damage to any target.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&auto=format&fit=crop',
    abilities: ['Direct Damage: 2 to any target'],
    flavorText: 'A simple but effective application of concentrated energy.'
  },
  {
    id: 'common_003',
    name: 'Repair Bot',
    type: CardType.CREATURE,
    rarity: CardRarity.COMMON,
    cost: 2,
    attack: 1,
    health: 2,
    description: 'At the end of your turn, restore 1 health to all friendly creatures.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    abilities: ['Auto-Repair: +1 health to allies per turn'],
    flavorText: 'Maintenance is the key to longevity in the digital realm.'
  },
  {
    id: 'common_004',
    name: 'Code Injection',
    type: CardType.SPELL,
    rarity: CardRarity.COMMON,
    cost: 1,
    attack: 0,
    health: 0,
    description: 'Give a friendly creature +2 attack until end of turn.',
    imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=400&auto=format&fit=crop',
    abilities: ['Temporary Boost: +2 attack this turn'],
    flavorText: 'A few lines of code can dramatically enhance performance.'
  }
];

// Card database with all existing and new cards
export const allSparkClashCards: SparkClashCard[] = [
  // Existing starter cards (keeping original 5)
  {
    id: '100',
    name: 'Digital Warrior',
    type: CardType.CREATURE,
    rarity: CardRarity.COMMON,
    cost: 3,
    attack: 3,
    health: 3,
    description: 'A basic warrior in the digital realm.',
    imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
    abilities: [],
    flavorText: 'First steps into the spark zone.'
  },
  {
    id: '101',
    name: 'Cyber Mage',
    type: CardType.CREATURE,
    rarity: CardRarity.COMMON,
    cost: 2,
    attack: 1,
    health: 4,
    description: 'Battlecry: Deal 1 damage to any target.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    abilities: ['Magic Missile: 1 damage'],
    flavorText: 'Knowledge is power, quite literally.'
  },
  {
    id: '102',
    name: 'Energy Shield',
    type: CardType.SPELL,
    rarity: CardRarity.COMMON,
    cost: 1,
    attack: 0,
    health: 0,
    description: 'Give a friendly creature +0/+2.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&auto=format&fit=crop',
    abilities: ['Shield Boost: +2 health'],
    flavorText: 'Protection in the form of pure energy.'
  },
  {
    id: '103',
    name: 'Lightning Strike',
    type: CardType.SPELL,
    rarity: CardRarity.COMMON,
    cost: 2,
    attack: 0,
    health: 0,
    description: 'Deal 3 damage to any target.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop',
    abilities: ['Lightning: 3 damage'],
    flavorText: 'Swift as thought, deadly as lightning.'
  },
  {
    id: '1',
    name: 'Spark Guardian',
    type: CardType.CREATURE,
    rarity: CardRarity.RARE,
    cost: 4,
    attack: 3,
    health: 6,
    description: 'Taunt. When Spark Guardian takes damage, gain +1 Attack.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&auto=format&fit=crop',
    abilities: ['Taunt', 'Rage: +1 attack when damaged'],
    flavorText: 'Guardian of the first spark, protector of digital souls.'
  },

  // Add all 20 new cards
  ...newSparkClashCards
];

// Export card collections by rarity for deck building
export const cardsByRarity = {
  [CardRarity.COMMON]: allSparkClashCards.filter(card => card.rarity === CardRarity.COMMON),
  [CardRarity.RARE]: allSparkClashCards.filter(card => card.rarity === CardRarity.RARE),
  [CardRarity.EPIC]: allSparkClashCards.filter(card => card.rarity === CardRarity.EPIC),
  [CardRarity.LEGENDARY]: allSparkClashCards.filter(card => card.rarity === CardRarity.LEGENDARY)
};

// Export card collections by type
export const cardsByType = {
  [CardType.CREATURE]: allSparkClashCards.filter(card => card.type === CardType.CREATURE),
  [CardType.SPELL]: allSparkClashCards.filter(card => card.type === CardType.SPELL)
};

// Deck building helpers
export const getRandomCard = (): SparkClashCard => {
  const randomIndex = Math.floor(Math.random() * allSparkClashCards.length);
  return allSparkClashCards[randomIndex];
};

export const getCardById = (id: string): SparkClashCard | undefined => {
  return allSparkClashCards.find(card => card.id === id);
};

export const getCardsByRarity = (rarity: CardRarity): SparkClashCard[] => {
  return cardsByRarity[rarity] || [];
};

export const createRandomDeck = (size: number = 30): string[] => {
  const deck: string[] = [];
  const rarityWeights = {
    [CardRarity.COMMON]: 0.5,
    [CardRarity.RARE]: 0.3,
    [CardRarity.EPIC]: 0.15,
    [CardRarity.LEGENDARY]: 0.05
  };

  for (let i = 0; i < size; i++) {
    const rand = Math.random();
    let selectedRarity: CardRarity;

    if (rand < rarityWeights[CardRarity.COMMON]) {
      selectedRarity = CardRarity.COMMON;
    } else if (rand < rarityWeights[CardRarity.COMMON] + rarityWeights[CardRarity.RARE]) {
      selectedRarity = CardRarity.RARE;
    } else if (rand < rarityWeights[CardRarity.COMMON] + rarityWeights[CardRarity.RARE] + rarityWeights[CardRarity.EPIC]) {
      selectedRarity = CardRarity.EPIC;
    } else {
      selectedRarity = CardRarity.LEGENDARY;
    }

    const cardsOfRarity = getCardsByRarity(selectedRarity);
    if (cardsOfRarity.length > 0) {
      const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
      deck.push(randomCard.id);
    }
  }

  return deck;
};