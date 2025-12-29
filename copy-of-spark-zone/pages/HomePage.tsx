
import React, { useState, useEffect } from 'react';
import { trendingData, allUsers, parties as activeParties } from '../mockData';
import { TrendingItem, Post, UserCreation, User, Party } from '../types';
import { currentUser } from '../mockData';
import UserAvatar from '../components/UserAvatar';
import PostCard from '../components/PostCard';
import CharacterSelectorModal from '../components/CharacterSelectorModal';
import PostCreationModal from '../components/PostCreationModal';
import DailySparkWidget from '../components/DailySparkWidget';

// --- Reusable Icon Components ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 1c3.866 0 7 1.79 7 4s-3.134 4-7 4-7-1.79-7-4 3.134-4 7-4zm5.694 8.13c.464-.264.91-.583 1.306-.952V10c0 2.21-3.134 4-7 4s-7-1.79-7-4V8.178c.396.37.842.688 1.306.953C5.838 10.006 7.854 10.5 10 10.5s4.162-.494 5.694-1.37z" clipRule="evenodd" /><path d="M5.5 4C6.328 4 7 4.672 7 5.5S6.328 7 5.5 7 4 6.328 4 5.5 4.672 4 5.5 4zM10 4c.828 0 1.5.672 1.5 1.5S10.828 7 10 7s-1.5-.672-1.5-1.5S9.172 4 10 4zM14.5 4c.828 0 1.5.672 1.5 1.5S15.328 7 14.5 7 13 6.328 13 5.5 13.672 4 14.5 4z" /></svg>;
const FireIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500"><path fillRule="evenodd" d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.031.04.068.079.111.119.35.33.754.6 1.187.808 3.07 1.474 6.916 1.298 9.006-1.737.54-.78.54-1.922 0-2.702l-1.026-1.483a.75.75 0 01.935-1.125l2.091 1.253a.75.75 0 01-.735 1.328l-1.474-.884a.75.75 0 00-.767 1.288l1.474.884a.75.75 0 01-.735 1.328l-2.091-1.253a.75.75 0 00-.935 1.125l1.026 1.483z" clipRule="evenodd" /></svg>;
const SignalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.414a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 5.414a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM15.657 14.586a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM6.464 14.586a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0z" /></svg>;

// --- Helper Functions ---
const getRankTitle = (power: number) => {
    if (power < 1000) return "Novice";
    if (power < 1500) return "Apprentice";
    if (power < 2000) return "Duelist";
    if (power < 2500) return "Gladiator";
    if (power < 3000) return "Warlord";
    return "Grandmaster";
};

// --- Page Components ---

interface PostCreationBoxProps {
    onCreatePost: (content: string, character?: UserCreation) => void;
    userCreations: UserCreation[];
}

const PostCreationBox: React.FC<PostCreationBoxProps> = ({ onCreatePost, userCreations }) => {
    const [content, setContent] = useState('');
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectedVoiceId, setSelectedVoiceId] = useState<number>(currentUser.id);
    
    const userCharacters = userCreations.filter(c => c.type === 'Character' || c.type === 'AI Character') as UserCreation[];
    
    const selectedVoice = selectedVoiceId === currentUser.id
        ? { ...currentUser, name: 'You', epithet: 'Yourself', imageUrl: currentUser.avatarUrl }
        : userCharacters.find(c => c.id === selectedVoiceId);
        
    const handleSubmit = () => {
        if (!content.trim()) return;
        const character = selectedVoiceId === currentUser.id ? undefined : userCharacters.find(c => c.id === selectedVoiceId);
        onCreatePost(content, character);
        setContent('');
    };

    return (
        <>
            <div className="hidden md:flex items-start gap-4 p-4 bg-gray-900/80 backdrop-blur-sm border border-violet-500/20 rounded-xl mb-8 shadow-lg">
                <div className="relative group">
                    <UserAvatar src={selectedVoice?.imageUrl} size="12" className="border-2 border-violet-500/30" />
                    <button 
                        onClick={() => setIsSelectorOpen(true)}
                        className="absolute -bottom-2 -right-2 bg-gray-800 rounded-full p-1 border border-gray-600 text-xs text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        title="Change Speaking As"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.313.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" /></svg>
                    </button>
                </div>
                <div className="flex-grow">
                    <textarea
                        className="w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none resize-none text-lg leading-relaxed h-16"
                        rows={1}
                        placeholder={`What's happening, ${selectedVoice?.name}?`}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                        <div className="flex gap-2">
                            {/* Future: Add image/media buttons here */}
                        </div>
                         <button 
                            onClick={handleSubmit} 
                            className="px-6 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm" 
                            disabled={!content.trim()}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
            {isSelectorOpen && (
                 <CharacterSelectorModal
                    isOpen={isSelectorOpen}
                    onClose={() => setIsSelectorOpen(false)}
                    characters={userCharacters}
                    currentUser={currentUser}
                    selectedId={selectedVoiceId}
                    onSelect={(id) => {
                        setSelectedVoiceId(id);
                        setIsSelectorOpen(false);
                    }}
                />
            )}
        </>
    );
};

const ActiveSignalCard: React.FC<{ party: Party; onJoin: (id: number) => void }> = ({ party, onJoin }) => (
    <button 
        onClick={() => onJoin(party.id)}
        className="flex-shrink-0 w-24 flex flex-col items-center gap-2 group"
    >
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-500 animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0.5 rounded-2xl bg-black flex items-center justify-center overflow-hidden border-2 border-cyan-500/30 group-hover:border-transparent transition-colors">
                <img src={party.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={party.name} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-black shadow flex items-center gap-0.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                LIVE
            </div>
        </div>
        <div className="text-center w-full">
            <p className="text-xs font-bold text-gray-300 truncate w-full group-hover:text-white transition-colors">{party.name}</p>
            <p className="text-[10px] text-gray-500">{party.members.length} active</p>
        </div>
    </button>
);

const TrendingCard: React.FC<{ item: TrendingItem; onClick: () => void }> = ({ item, onClick }) => (
    <div 
        onClick={onClick}
        className="flex-shrink-0 w-64 h-36 rounded-xl overflow-hidden relative group border border-white/5 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/20 transition-all hover:border-cyan-500/50"
    >
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white border border-white/10 flex items-center gap-1">
            <FireIcon /> {item.engagementScore}
        </div>
        <div className="absolute bottom-0 left-0 p-3 text-white w-full">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide mb-1 inline-block ${item.type === 'Story' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>
                {item.type}
            </span>
            <h3 className="font-bold truncate text-lg leading-tight">{item.title}</h3>
            <p className="text-xs text-gray-400">by {item.author}</p>
        </div>
    </div>
);

const ChampionCard: React.FC<{ user: User; rank: number }> = ({ user, rank }) => {
    const bp = user.sparkClashProfile?.battlePower || 1000;
    
    // Gradient Borders for Top 3
    let borderClass = 'border-gray-700 bg-gray-800/40';
    let textClass = 'text-gray-400';
    let ringClass = 'ring-gray-700';
    
    if (rank === 1) {
        borderClass = 'border-yellow-500/50 bg-gradient-to-b from-yellow-900/20 to-black shadow-[0_0_15px_rgba(234,179,8,0.1)]';
        textClass = 'text-yellow-400';
        ringClass = 'ring-yellow-500';
    } else if (rank === 2) {
        borderClass = 'border-gray-300/50 bg-gradient-to-b from-gray-700/20 to-black';
        textClass = 'text-gray-200';
        ringClass = 'ring-gray-300';
    } else if (rank === 3) {
        borderClass = 'border-orange-700/50 bg-gradient-to-b from-orange-900/20 to-black';
        textClass = 'text-orange-400';
        ringClass = 'ring-orange-700';
    } else {
        textClass = 'text-cyan-400';
    }
    
    return (
        <div className={`flex-shrink-0 w-36 rounded-xl border p-3 flex flex-col items-center justify-center relative group hover:-translate-y-1 transition-all duration-300 ${borderClass}`}>
            <div className={`absolute -top-3 -left-2 w-8 h-8 flex items-center justify-center font-black text-lg rounded-lg border bg-black shadow-lg ${textClass} ${borderClass}`}>
                #{rank}
            </div>
            
            <div className={`relative mb-3 rounded-full p-0.5 ring-2 ${ringClass}`}>
                <UserAvatar src={user.avatarUrl} size="14" />
            </div>
            
            <h3 className="font-bold text-white text-center truncate w-full text-sm px-1 mb-0.5">{user.name}</h3>
            <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold mb-2">{getRankTitle(bp)}</p>
            
            <div className="w-full bg-black/40 rounded-lg py-1 px-2 flex justify-between items-center text-xs font-mono font-bold text-gray-300">
                <span>BP</span>
                <span className={textClass}>{bp}</span>
            </div>

            {/* Hover Action */}
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-[1px]">
                <button className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-200">
                    Challenge
                </button>
            </div>
        </div>
    );
};

const ContentShelf: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
    <div className="mb-8 animate-fadeIn">
        <div className="flex justify-between items-end mb-4 px-4 md:px-0">
            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
            {action}
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4 px-4 md:px-0 scrollbar-hide">
            {children}
        </div>
    </div>
);

interface HomePageProps {
    posts: Post[];
    onCreatePost: (content: string, character?: UserCreation) => void;
    onSparkPost: (postId: number) => void;
    onCommentPost: (postId: number) => void;
    userCreations: UserCreation[];
    currentUser: User;
    onStartConversation: (userId: number) => void;
    onStartStoryWithPrompt?: (prompt: string) => void;
    onSelectWorld: (worldId: number) => void;
    onViewStory: (storyId: number) => void;
    onSelectParty?: (partyId: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
    posts, 
    onCreatePost, 
    onSparkPost, 
    onCommentPost, 
    userCreations, 
    currentUser, 
    onStartConversation, 
    onStartStoryWithPrompt,
    onSelectWorld,
    onViewStory,
    onSelectParty
}) => {
    const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');
    const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [initialPostContent, setInitialPostContent] = useState('');

    useEffect(() => {
        const sortedData = [...trendingData].sort((a, b) => b.engagementScore - a.engagementScore);
        setTrendingItems(sortedData);
    }, []);

    const filteredPosts = activeTab === 'following' 
        ? posts.filter(post => currentUser.followingIds?.includes(post.author.id) || post.author.id === currentUser.id) 
        : posts;

    const topPlayers = [...allUsers].sort((a, b) => (b.sparkClashProfile?.battlePower || 0) - (a.sparkClashProfile?.battlePower || 0)).slice(0, 5);

    const handlePromptPost = (prompt: string) => {
        setInitialPostContent(prompt);
        setIsPostModalOpen(true);
    };

    const handleTrendingClick = (item: TrendingItem) => {
        if (item.type === 'World') {
            onSelectWorld(item.id);
        } else if (item.type === 'Story') {
            onViewStory(item.id);
        }
    };

    return (
        <div className="container mx-auto max-w-3xl px-0 md:px-4 py-4 animate-fadeIn h-full overflow-y-auto pb-20 md:pb-4 custom-scrollbar">
            
            {/* Live Signals Rail */}
            <div className="mb-6 overflow-x-auto scrollbar-hide px-4 md:px-0 flex gap-4 py-2 border-b border-white/5">
                <div className="flex-shrink-0 w-20 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => { setInitialPostContent(''); setIsPostModalOpen(true); }}>
                    <div className="w-20 h-20 rounded-2xl bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-400 group-hover:border-cyan-500 group-hover:text-cyan-400 transition-colors">
                        <PlusIcon />
                    </div>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-white">New Post</span>
                </div>
                {activeParties.map(party => (
                    <ActiveSignalCard 
                        key={party.id} 
                        party={party} 
                        onJoin={onSelectParty || (() => {})} 
                    />
                ))}
            </div>

            {/* Header Tabs */}
            <div className="px-4 md:px-0 mb-6 sticky top-0 bg-[#050505]/95 backdrop-blur-xl z-20 pt-2 pb-2 border-b border-white/10 flex justify-between items-center">
                <div className="flex space-x-6">
                    <button
                        onClick={() => setActiveTab('foryou')}
                        className={`py-2 px-1 font-bold text-lg transition-all ${activeTab === 'foryou' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        For You
                    </button>
                    <button
                        onClick={() => setActiveTab('following')}
                        className={`py-2 px-1 font-bold text-lg transition-all ${activeTab === 'following' ? 'text-white border-b-2 border-cyan-500' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Following
                    </button>
                </div>
                <div className="text-xs font-mono text-gray-600 hidden md:block">
                    {filteredPosts.length} signals
                </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-8">
                
                {/* Widgets Area (Only For You) */}
                {activeTab === 'foryou' && (
                    <>
                        <div className="px-4 md:px-0">
                            <DailySparkWidget 
                                onPost={handlePromptPost}
                                onStory={(prompt) => onStartStoryWithPrompt?.(prompt)}
                            />
                        </div>

                        <ContentShelf title="Trending Signals">
                            {trendingItems.map(item => (
                                <TrendingCard 
                                    key={item.id} 
                                    item={item} 
                                    onClick={() => handleTrendingClick(item)}
                                />
                            ))}
                        </ContentShelf>

                        <ContentShelf 
                            title="Clash Leaderboard" 
                            action={<button className="text-xs font-bold text-cyan-400 hover:underline">View All</button>}
                        >
                            {topPlayers.map((u, i) => <ChampionCard key={u.id} user={u} rank={i + 1} />)}
                        </ContentShelf>
                    </>
                )}

                {/* Inline Post Creator */}
                <div className="px-4 md:px-0">
                    <PostCreationBox onCreatePost={onCreatePost} userCreations={userCreations} />
                </div>

                {/* Feed Stream */}
                <div className="px-4 md:px-0 min-h-[300px] space-y-6">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <div key={post.id} className="animate-fadeInUp">
                                <PostCard 
                                    post={post}
                                    currentUser={currentUser}
                                    onSpark={onSparkPost}
                                    onComment={onCommentPost}
                                    onStartConversation={onStartConversation}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-900/30 rounded-2xl border border-dashed border-gray-800">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-600">
                                <SignalIcon />
                            </div>
                            <h3 className="text-lg font-bold text-gray-300">No signals detected</h3>
                            <p className="text-sm mt-1 max-w-xs text-center">
                                {activeTab === 'following' 
                                    ? "Follow more creators to populate your feed." 
                                    : "The void is quiet today."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile FAB */}
            <button
                onClick={() => { setInitialPostContent(''); setIsPostModalOpen(true); }}
                className="md:hidden fixed bottom-24 right-4 w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] transform hover:scale-110 transition-all z-50 border-2 border-white/20"
                aria-label="Create Post"
            >
                <PlusIcon />
            </button>
            
            <PostCreationModal
                isOpen={isPostModalOpen}
                onClose={() => { setIsPostModalOpen(false); setInitialPostContent(''); }}
                onCreatePost={onCreatePost}
                userCreations={userCreations}
                initialContent={initialPostContent}
            />
        </div>
    );
};

export default HomePage;
