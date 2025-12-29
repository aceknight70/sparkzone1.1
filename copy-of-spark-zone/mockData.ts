
import { 
    User, UserCreation, Post, Conversation, World, Story, Party, Character, 
    Comment, Community, Notification, TrendingItem, DiscoverableItem, 
    SparkCardTemplate, ShopItem, MemeTemplate, PartyShopItem
} from './types';

// --- Mock Data ---

export const currentUser: User = {
    id: 100,
    name: 'Traveler',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    bio: 'Explorer of digital realms.',
    isPremium: true,
    sparkClashProfile: {
        sparks: 1250,
        battlePower: 2100,
        inventory: [],
        deck: { id: 'deck1', name: 'Starter Deck', cardIds: ['100', '101', '102', '103', '1'] }
    },
    communityIds: [1],
    followingIds: [2, 3]
};

export const allUsers: User[] = [
    currentUser,
    {
        id: 1,
        name: 'Narrator',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
        sparkClashProfile: { sparks: 5000, battlePower: 3500 }
    },
    {
        id: 2,
        name: 'PixelArtist',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
        sparkClashProfile: { sparks: 800, battlePower: 1200 }
    },
    {
        id: 3,
        name: 'Loremaster',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        sparkClashProfile: { sparks: 1500, battlePower: 2800 }
    }
];

export const characters: Character[] = [
    {
        id: 10,
        type: 'Character',
        name: 'Kaelen',
        epithet: 'The Shadow Rogue',
        tagline: 'Shadows are my shield.',
        archetypeTags: ['Rogue', 'Stealth', 'Anti-Hero'],
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
        authorId: 100,
        status: 'Active',
        physicalDetails: { Age: '24', Height: "5'11" },
        personality: { description: 'Quiet and calculating.', traits: [], quirks: [] },
        gallery: { images: [] },
        contentMetadata: { ageRating: 'Teen', warnings: [] }
    },
    {
        id: 11,
        type: 'Character',
        name: 'Elara',
        epithet: 'Lightbringer',
        tagline: 'The light shall prevail.',
        archetypeTags: ['Paladin', 'Healer', 'Hero'],
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
        authorId: 2,
        status: 'Active',
        contentMetadata: { ageRating: 'Everyone', warnings: [] }
    }
];

export const worlds: World[] = [
    {
        id: 20,
        type: 'World',
        name: 'Aethelgard',
        tagline: 'A realm of floating islands.',
        synopsis: 'In a world shattered by ancient cataclysm, civilizations survive on floating remnants of earth.',
        genreTags: ['Fantasy', 'Adventure', 'Steampunk'],
        imageUrl: 'https://images.unsplash.com/photo-1560252019-35eb6ca2c685?q=80&w=800&auto=format&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1560252019-35eb6ca2c685?q=80&w=1200&auto=format&fit=crop',
        authorId: 100, // Fixed to match currentUser so it shows in Workshop
        status: 'Active',
        locations: [
            { category: 'CITIES', channels: [{ id: 201, name: 'Skyport-Alpha', description: 'The main trading hub.', messages: [] }] },
            { category: 'WILDERNESS', channels: [{ id: 202, name: 'The-Drift', description: 'Dangerous floating debris fields.', messages: [] }] }
        ],
        lorebook: [
            { id: 1, name: 'Skyships', category: 'Item', description: 'Vessels powered by aether crystals.' }
        ],
        members: [{ id: 100, name: 'Traveler', role: 'Member' }, { id: 3, name: 'Loremaster', role: 'Creator' }],
        roles: [{ id: 1, name: 'Citizen', color: '#ccc', permissions: [] }],
        contentMetadata: { ageRating: 'Teen', warnings: [] }
    }
];

export const stories: Story[] = [
    {
        id: 30,
        type: 'Story',
        name: 'The Last Starship',
        synopsis: 'A crew stranded in deep space finds something ancient.',
        genreTags: ['Sci-Fi', 'Horror'],
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
        authorId: 100,
        status: 'Draft',
        mainCharacterIds: [10],
        chapters: [
            { id: 301, title: 'Awakening', content: 'The cryo-pods hissed open...', status: 'Draft', visuals: [] }
        ],
        cast: [],
        lorebook: [],
        contentMetadata: { ageRating: 'Mature', warnings: ['Horror'] }
    }
];

export const parties: Party[] = [
    {
        id: 40,
        type: 'RP Card',
        name: 'Friday Night Dungeon',
        description: 'Weekly crawl through the depths.',
        imageUrl: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=800&auto=format&fit=crop',
        authorId: 100,
        hostId: 100,
        status: 'Active',
        isPublic: true,
        rpFormat: 'Group',
        members: [{ ...currentUser, isHost: true }, { ...allUsers[1], isHost: false }],
        chat: [
            { id: 1, text: 'Roll for initiative!', timestamp: '10:00 PM', sender: { ...currentUser, isHost: true } }
        ],
        stage: {
            mode: 'tabletop',
            tabletop: {
                mapUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
                tokens: [
                    { instanceId: 't1', characterId: 10, x: 20, y: 30, size: 1, currentHp: 20, maxHp: 20, conditions: [] }
                ],
                showGrid: true,
                gridSize: 50,
                initiative: [],
                activeTurnIndex: 0
            }
        },
        contentMetadata: { ageRating: 'Teen', warnings: [] }
    }
];

export const communities: Community[] = [
    {
        id: 1,
        type: 'Community',
        name: 'Cosmic Wanderers',
        tag: '[COSMIC]',
        description: 'A place for sci-fi enthusiasts.',
        tags: ['Sci-Fi', 'Space', 'Futuristic'],
        bannerUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop',
        imageUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=200&auto=format&fit=crop',
        authorId: 2,
        status: 'Active',
        isPublic: true,
        leaderId: 2,
        level: 5,
        xp: 2500,
        members: [
            { userId: 2, role: 'Leader', joinedAt: '2023-01-01' },
            { userId: 100, role: 'Member', joinedAt: '2023-02-15' }
        ],
        showcase: [],
        feed: [],
        contentMetadata: { ageRating: 'Everyone', warnings: [] }
    }
];

export const initialUserCreations: UserCreation[] = [
    ...characters.filter(c => c.authorId === 100),
    ...worlds.filter(w => w.authorId === 100),
    ...stories.filter(s => s.authorId === 100),
    ...parties.filter(p => p.authorId === 100)
];

export const posts: Post[] = [
    {
        id: 1001,
        author: allUsers[1],
        content: 'Just finished detailing the new map for my campaign!',
        timestamp: '2h ago',
        sparks: 15,
        sparkedBy: [],
        comments: 2
    },
    {
        id: 1002,
        author: allUsers[2],
        content: 'Check out this character art I commissioned.',
        media: { type: 'image', url: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop' },
        timestamp: '5h ago',
        sparks: 42,
        sparkedBy: [100],
        comments: 5
    }
];

export const comments: Comment[] = [
    {
        id: 2001,
        postId: 1001,
        author: currentUser,
        content: 'Looks amazing! Can I join?',
        timestamp: '1h ago',
        sparks: 1,
        sparkedBy: []
    }
];

export const conversations: Conversation[] = [
    {
        id: 3001,
        participant: allUsers[1],
        messages: [
            { id: 1, text: 'Hey, are you free for a session?', senderId: 1, timestamp: 'Yesterday' },
            { id: 2, text: 'Sure! What time?', senderId: 100, timestamp: 'Today' }
        ],
        unreadCount: 0
    }
];

export const mockNotifications: Notification[] = [
    { id: 1, type: 'spark', message: 'Narrator sparked your post', timestamp: '10m ago', read: false, actorId: 1 },
    { id: 2, type: 'system', message: 'Welcome to Spark Zone!', timestamp: '1d ago', read: true }
];

export const trendingData: TrendingItem[] = [
    { id: 20, type: 'World', title: 'Aethelgard', author: 'Traveler', imageUrl: worlds[0].imageUrl || '', engagementScore: 95 },
    { id: 30, type: 'Story', title: 'The Last Starship', author: 'Traveler', imageUrl: stories[0].imageUrl || '', engagementScore: 88 }
];

export const discoverableItems: DiscoverableItem[] = [
    ...worlds.map(w => ({ id: w.id, type: 'World' as const, title: w.name, author: 'User ' + w.authorId, authorId: w.authorId, imageUrl: w.imageUrl })),
    ...characters.map(c => ({ id: c.id, type: 'Character' as const, title: c.name, author: 'User ' + c.authorId, authorId: c.authorId, imageUrl: c.imageUrl }))
];

export const memeTemplates: MemeTemplate[] = [
    { id: '1', name: 'Drake', imageUrl: 'https://i.imgflip.com/30b1gx.jpg' },
    { id: '2', name: 'Distracted Boyfriend', imageUrl: 'https://i.imgflip.com/1ur9b0.jpg' },
    { id: '3', name: 'Two Buttons', imageUrl: 'https://i.imgflip.com/1g8my4.jpg' }
];

export const cardTemplates: SparkCardTemplate[] = [
    {
        id: '1',
        name: 'Solar Strike',
        description: 'A blazing fast attack that burns the enemy.',
        energyCost: 1,
        type: 'Attack',
        element: 'Solar',
        rarity: 'Common',
        baseStats: { damage: 5 },
        effectType: 'Burn',
        effectValue: 3,
        price: 10
    },
    {
        id: '2',
        name: 'Lunar Guard',
        description: 'Channel the moon to deflect damage.',
        energyCost: 1,
        type: 'Defense',
        element: 'Lunar',
        rarity: 'Common',
        baseStats: { shield: 6 },
        effectType: 'None',
        price: 10
    },
    {
        id: '3',
        name: 'Terra Smash',
        description: 'Shake the ground with a heavy hit.',
        energyCost: 2,
        type: 'Attack',
        element: 'Terra',
        rarity: 'Common',
        baseStats: { damage: 8 },
        effectType: 'Stun',
        price: 15
    },
    {
        id: '99',
        name: 'Void Singularity',
        description: 'Unleash the full power of the Void.',
        energyCost: 5,
        type: 'Ultimate',
        element: 'Void',
        rarity: 'Ultimate',
        baseStats: { damage: 50, shield: 20 },
        effectType: 'Stun',
        effectValue: 1,
        price: 9999
    },
    // Standard Neutral/Basic Cards
    { id: '100', name: 'Iron Strike', description: 'Physical attack.', energyCost: 1, type: 'Attack', element: 'Neutral', rarity: 'Common', baseStats: { damage: 4 }, effectType: 'None', price: 5 },
    { id: '101', name: 'Steel Guard', description: 'Raise shield.', energyCost: 1, type: 'Defense', element: 'Neutral', rarity: 'Common', baseStats: { shield: 5 }, effectType: 'None', price: 5 },
    { id: '102', name: 'Adrenaline', description: 'Draw a card.', energyCost: 1, type: 'Utility', element: 'Neutral', rarity: 'Common', effectType: 'Draw', effectValue: 1, price: 15 },
    { id: '103', name: 'First Aid', description: 'Patch up wounds.', energyCost: 2, type: 'Utility', element: 'Neutral', rarity: 'Rare', baseStats: { healing: 8 }, effectType: 'Heal', effectValue: 8, price: 30 }
];

export const shopItems: ShopItem[] = [
    {
        id: 'bundle_1',
        type: 'bundle',
        name: 'Handful of Sparks',
        description: 'Perfect for a quick boost.',
        price: 0.99,
        currencyAmount: 100
    },
    {
        id: 'sub_1',
        type: 'subscription',
        name: 'Spark Premium',
        description: 'Unlock exclusive features.',
        price: 9.99,
        perks: ['Profile Badge', 'Monthly Sparks', 'Advanced AI Tools']
    },
    {
        id: 'cosmetic_1',
        type: 'cosmetic',
        name: 'Neon Frame',
        description: 'A glowing frame for your avatar.',
        price: 500,
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200&auto=format&fit=crop'
    }
];

export const partyShopItems: PartyShopItem[] = [
    {
        id: 'gift_1',
        type: 'gift',
        name: 'Neon Cheers',
        description: 'Send a glowing toast to a friend!',
        price: 50,
        imageUrl: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=200&auto=format&fit=crop',
        rarity: 'Common'
    },
    {
        id: 'gift_2',
        type: 'gift',
        name: 'Pixel Rose',
        description: 'A digital flower that never fades.',
        price: 100,
        imageUrl: 'https://images.unsplash.com/photo-1560780552-ba546eb4226f?q=80&w=200&auto=format&fit=crop',
        rarity: 'Rare'
    },
    {
        id: 'template_1',
        type: 'template',
        name: 'Cyberpunk Hub',
        description: 'A high-tech layout for your party room.',
        price: 500,
        imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400&auto=format&fit=crop',
        rarity: 'Epic'
    },
    {
        id: 'template_2',
        type: 'template',
        name: 'Enchanted Forest',
        description: 'A magical, green theme for nature lovers.',
        price: 300,
        imageUrl: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?q=80&w=400&auto=format&fit=crop',
        rarity: 'Rare'
    },
    {
        id: 'sticker_1',
        type: 'sticker',
        name: 'Party Parrot',
        description: 'The classic grooving bird.',
        price: 25,
        imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30ebd1?q=80&w=200&auto=format&fit=crop',
        rarity: 'Common'
    }
];
