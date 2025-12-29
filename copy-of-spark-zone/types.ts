
export enum Page {
    Home = 'Home',
    Explore = 'Explore',
    Workshop = 'Workshop',
    Party = 'Party',
    Messenger = 'Messenger',
    Profile = 'Profile',
    Notifications = 'Notifications'
}

export type AgeRating = 'Everyone' | 'Teen' | 'Mature';
export type ContentWarning = 'Violence' | 'Romance' | 'Horror' | 'Strong Language' | 'Dark Themes' | 'Politics' | 'Substance Use';

export interface ContentMetadata {
    ageRating: AgeRating;
    warnings: ContentWarning[];
}

export interface User {
    id: number;
    name: string;
    avatarUrl?: string;
    bannerUrl?: string;
    bio?: string;
    email?: string;
    isPremium?: boolean;
    pronouns?: string;
    gender?: string;
    age?: string;
    nationality?: string;
    communityIds?: number[];
    followingIds?: number[];
    safetySettings?: {
        maxAgeRating: AgeRating;
        blockedTags: ContentWarning[];
    };
    sparkClashProfile?: {
        sparks: number;
        battlePower: number;
        deck?: SparkDeck;
        inventory?: SparkCard[];
    };
}

export interface UserCreation {
    id: number;
    type: 'Character' | 'World' | 'Story' | 'RP Card' | 'Community' | 'Meme' | 'AI Character';
    name: string;
    imageUrl?: string;
    status: 'Draft' | 'Published' | 'Active';
    authorId: number;
    contentMetadata?: ContentMetadata;
    // ... potentially other common fields or union types
}

export interface CharacterConnection {
    characterId: number;
    relationship: string;
    description?: string;
}

export interface Character extends UserCreation {
    type: 'Character' | 'AI Character';
    epithet?: string;
    tagline?: string;
    archetypeTags: string[];
    bannerUrl?: string;
    appearance?: string;
    physicalDetails?: { [key: string]: string };
    personality?: {
        description: string;
        traits: { name: string; value: number; labels: [string, string] }[];
        quirks: string[];
    };
    backstory?: string;
    abilities?: { name: string; description: string }[];
    gallery?: {
        images: string[];
        themeSongUrl?: string;
    };
    connections?: CharacterConnection[];
    // New Advanced Features
    voiceConfig?: {
        voiceId: string;
        pitch: number;
        style: string;
    };
    clashConfig?: {
        element: SparkElement;
        class: SparkCardType;
        hp: number;
        atk: number;
        def: number;
        specialAbility: {
            name: string;
            description: string;
        };
    };
}

export interface World extends UserCreation {
    type: 'World';
    tagline?: string;
    synopsis?: string;
    introduction?: string;
    rules?: string;
    genreTags: string[];
    bannerUrl?: string;
    locations: { category: string; channels: WorldLocation[] }[];
    lorebook: WorldLoreEntry[];
    mapImageUrl?: string;
    mapPins?: MapPin[];
    timeline?: TimelineEvent[];
    members: { id: number; name: string; avatarUrl?: string; role: string }[];
    roles?: WorldRole[];
    visibility?: 'Public' | 'Private';
    joinPolicy?: 'Open' | 'Approval' | 'Invite';
    joinQuestions?: string[];
    welcomeMessage?: string;
    bannedWords?: string[];
    statusLabel?: 'Active' | 'Recruiting' | 'Hiatus';
    systemSettings?: {
        enableDice: boolean;
        diceSystem: string;
        highlightCriticals: boolean;
    };
    customLoreCategories?: string[];
}

export interface GroupMessage {
    id: number;
    text: string;
    timestamp: string;
    sender: { id: number; name: string; avatarUrl?: string; role: string };
    character?: UserCreation;
    imageUrl?: string;
    audioUrl?: string;
}

export interface WorldLocation {
    id: number;
    name: string;
    description?: string;
    iconUrl?: string;
    imageUrl?: string;
    themeSongUrl?: string;
    messages: GroupMessage[];
}

export type WorldLoreCategory = 'Location' | 'Faction' | 'Item' | 'Character' | 'Event' | 'Concept';

export interface WorldLoreEntry {
    id: number;
    name: string;
    category: WorldLoreCategory | string;
    description: string;
}

export type WorldPermission = 'manage_channels' | 'manage_lore' | 'moderate_chat' | 'invite_members' | 'manage_roles';

export interface WorldRole {
    id: number;
    name: string;
    color: string;
    isDefault?: boolean;
    permissions: WorldPermission[];
}

export interface MapPin {
    id: number;
    x: number;
    y: number;
    label?: string;
    linkType: 'channel' | 'lore';
    linkId: number;
}

export interface TimelineEvent {
    id: number;
    dateLabel: string;
    title: string;
    description: string;
    imageUrl?: string;
}

export interface ChapterVisual {
    paragraphIndex: number;
    imageUrl: string;
    description?: string;
}

export interface Chapter {
    id: number;
    title: string;
    content: string;
    status: 'Draft' | 'Published';
    visuals?: ChapterVisual[];
}

export interface StoryCharacter {
    characterId: number;
    role: string;
}

export interface LoreEntry {
    id: number;
    name: string;
    category: string;
    description: string;
    imageUrl?: string;
    tags?: string[];
}

export interface Story extends UserCreation {
    type: 'Story';
    synopsis: string;
    genreTags: string[];
    mainCharacterIds: number[];
    chapters: Chapter[];
    cast: StoryCharacter[];
    lorebook: LoreEntry[];
    coAuthorIds?: number[];
    customLoreCategories?: string[];
}

export interface DiceRoll {
    command: string;
    rolls: number[];
    modifier: number;
    total: number;
}

export interface PartyMember extends User {
    isHost?: boolean;
}

export interface PartyMessage {
    id: number;
    text: string;
    timestamp: string;
    sender: PartyMember;
    character?: UserCreation;
    roll?: DiceRoll;
    imageUrl?: string;
    audioUrl?: string;
}

export type TokenCondition = 'Stunned' | 'Prone' | 'Invisible' | 'Unconscious';

export interface Token {
    instanceId: string;
    characterId: number;
    x: number;
    y: number;
    size: number;
    currentHp: number;
    maxHp: number;
    conditions: TokenCondition[];
}

export interface Party extends UserCreation {
    type: 'RP Card';
    description: string;
    rpFormat?: 'Group' | '1x1' | 'Open';
    genreTags?: string[];
    castingCall?: string[];
    hostId: number;
    isPublic: boolean;
    members: PartyMember[];
    chat: PartyMessage[];
    stage: {
        mode: 'social' | 'tabletop' | 'theatre' | 'live';
        social?: { sharedImages: string[] };
        theatre?: { videoUrl: string; isPlaying: boolean; progress: number };
        tabletop?: { 
            mapUrl: string | null; 
            tokens: Token[]; 
            showGrid: boolean; 
            gridSize: number; 
            initiative: { instanceId: string; value: number }[]; 
            activeTurnIndex: number 
        };
    };
}

export type MessageType = 'text' | 'image' | 'audio' | 'challenge' | 'gift' | 'invite';

export interface Message {
    id: number;
    text: string;
    senderId: number;
    timestamp: string;
    character?: UserCreation;
    imageUrl?: string;
    audioUrl?: string;
    type?: MessageType;
    metadata?: any;
}

export interface Conversation {
    id: number;
    participant: User;
    messages: Message[];
    unreadCount?: number;
}

export interface Post {
    id: number;
    author: User;
    character?: UserCreation;
    timestamp: string;
    content: string;
    media?: { type: 'image' | 'video', url: string };
    sparks: number;
    sparkedBy: number[];
    comments: number;
}

export interface Comment {
    id: number;
    postId: number;
    author: User;
    character?: UserCreation;
    content: string;
    timestamp: string;
    sparks: number;
    sparkedBy: number[];
}

export type NotificationType = 'system' | 'spark' | 'comment' | 'follow' | 'clash_challenge' | 'invite';

export interface Notification {
    id: number;
    type: NotificationType;
    message: string;
    timestamp: string;
    read: boolean;
    actorId?: number;
    data?: any;
}

export type CommunityRole = 'Leader' | 'Officer' | 'Member';

export interface Community extends UserCreation {
    type: 'Community';
    tag: string;
    description: string;
    tags: string[];
    bannerUrl?: string;
    leaderId: number;
    isPublic: boolean;
    level: number;
    xp: number;
    members: { userId: number; role: CommunityRole; joinedAt: string }[];
    showcase: UserCreation[];
    feed: Post[];
}

export interface ShopItem {
    id: string;
    type: 'bundle' | 'subscription' | 'cosmetic' | 'tool';
    name: string;
    description: string;
    price: number;
    currencyAmount?: number;
    imageUrl?: string;
    highlight?: boolean;
    perks?: string[];
}

export interface PartyShopItem {
    id: string;
    type: 'gift' | 'template' | 'sticker' | 'effect';
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface TrendingItem {
    id: number;
    type: 'World' | 'Story' | 'Character' | 'RP Card';
    title: string;
    imageUrl: string;
    author: string;
    engagementScore: number;
}

export interface DiscoverableItem {
    id: number;
    type: UserCreation['type'];
    title: string;
    author: string;
    authorId: number;
    imageUrl?: string;
    contentMetadata?: ContentMetadata;
}

export interface CodexItem {
    type: 'character' | 'lore';
    data: any;
}

export interface MemeTemplate {
    id: string;
    name: string;
    imageUrl: string;
}

// Spark Clash Types
export type SparkElement = 'Solar' | 'Lunar' | 'Terra' | 'Void' | 'Neutral' | 'Stellar';
export type SparkCardRarity = 'Common' | 'Rare' | 'Epic' | 'Ultimate';
export type SparkCardType = 'Attack' | 'Defense' | 'Utility' | 'Ultimate';
export type SparkEffectType = 'Burn' | 'Stun' | 'Heal' | 'Draw' | 'Cleanse' | 'None';

export interface SparkCardTemplate {
    id: string;
    name: string;
    description: string;
    energyCost: number;
    type: SparkCardType;
    element: SparkElement;
    rarity: SparkCardRarity;
    baseStats?: {
        damage?: number;
        shield?: number;
        healing?: number;
        manaRecovery?: number;
    };
    effectType: SparkEffectType;
    effectValue?: number;
    price: number;
}

export interface SparkCard {
    id: string;
    templateId: string;
    ownerId: number;
    characterId?: number;
    customName?: string;
    level?: number;
}

export interface SparkDeck {
    id: string;
    name: string;
    cardIds: string[];
}

// Workshop
export type WorldWorkshopSection = 'landing' | 'blueprint' | 'lorebook' | 'channels' | 'atlas' | 'chronicle' | 'settings';
