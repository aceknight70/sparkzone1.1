
import React, { useState, useMemo } from 'react';
import { discoverableItems } from '../mockData';
import { User, Community, World, Story, Party, Character, DiscoverableItem } from '../types';
import DiscoveryCard from '../components/DiscoveryCard';
import CommunityCard from '../components/CommunityCard';

// --- Icons ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>;
const GlobeAltIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-6.709v.992a3.25 3.25 0 00-1.934.999l-2.5 2.5a.75.75 0 00.176 1.19 3.25 3.25 0 011.575 2.12l.92 3.215a.75.75 0 001.256.223l2.5-2.5a.75.75 0 00-.53-1.28h-.5a.75.75 0 01-.75-.75V9.75a.75.75 0 01.75-.75h.5a.75.75 0 00.75-.75v-.5a.75.75 0 00-.75-.75h-.938l-.632-1.896a3.25 3.25 0 01-.072-.912l.072-.292z" clipRule="evenodd" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" /></svg>;

interface ExplorePageProps {
    onSelectWorld: (worldId: number) => void;
    onViewStory: (storyId: number) => void;
    onSelectParty: (partyId: number) => void;
    onSelectCommunity?: (communityId: number) => void;
    onStartConversation: (userId: number) => void;
    currentUser: User;
    communities?: Community[];
    worlds?: World[];
    stories?: Story[];
    parties?: Party[];
    characters?: Character[];
}

type ExploreTab = 'Discover' | 'Creations' | 'Library' | 'Communities';
type CreationFilter = 'All' | 'Character' | 'World' | 'Story' | 'RP Card';

const ExplorePage: React.FC<ExplorePageProps> = ({ 
    onSelectWorld, 
    onViewStory, 
    onSelectParty, 
    onSelectCommunity,
    onStartConversation, 
    currentUser,
    communities = [],
    worlds = [],
    stories = [],
    parties = [],
    characters = []
}) => {
    const [activeTab, setActiveTab] = useState<ExploreTab>('Discover');
    const [creationFilter, setCreationFilter] = useState<CreationFilter>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDiscoverItems = useMemo(() => 
        discoverableItems.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase())), 
        [searchTerm]
    );

    const filteredCommunities = useMemo(() => 
        communities.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.tag.toLowerCase().includes(searchTerm.toLowerCase())
        ), 
        [searchTerm, communities]
    );

    // Combined Creation List from Live Props
    const allCreations = useMemo(() => {
        const items: DiscoverableItem[] = [
            ...worlds.map(w => ({ id: w.id, type: 'World' as const, title: w.name, author: `User ${w.authorId}`, authorId: w.authorId, imageUrl: w.imageUrl, contentMetadata: w.contentMetadata })),
            ...stories.map(s => ({ id: s.id, type: 'Story' as const, title: s.name, author: `User ${s.authorId}`, authorId: s.authorId, imageUrl: s.imageUrl, contentMetadata: s.contentMetadata })),
            ...parties.map(p => ({ id: p.id, type: 'RP Card' as const, title: p.name, author: `User ${p.authorId}`, authorId: p.authorId, imageUrl: p.imageUrl, contentMetadata: p.contentMetadata })),
            ...characters.map(c => ({ id: c.id, type: 'Character' as const, title: c.name, author: `User ${c.authorId}`, authorId: c.authorId, imageUrl: c.imageUrl, contentMetadata: c.contentMetadata }))
        ];
        return items.filter(item => 
            (creationFilter === 'All' || item.type === creationFilter) &&
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [worlds, stories, parties, characters, creationFilter, searchTerm]);

    // Library Items (Joined Content)
    const libraryItems = useMemo(() => {
        const myWorlds = worlds.filter(w => w.members.some(m => m.id === currentUser.id));
        const myParties = parties.filter(p => p.members.some(m => m.id === currentUser.id));
        
        return {
            worlds: myWorlds,
            parties: myParties
        };
    }, [worlds, parties, currentUser.id]);

    const handleItemClick = (type: string, id: number) => {
        if (type === 'World') onSelectWorld(id);
        else if (type === 'Story') onViewStory(id);
        else if (type === 'RP Card') onSelectParty(id);
    };

    const TabButton: React.FC<{ id: ExploreTab, label: string, icon: React.ReactNode }> = ({ id, label, icon }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap ${activeTab === id ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/30' : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:bg-gray-700'}`}
        >
            {icon}
            <span className="font-bold text-sm">{label}</span>
        </button>
    );

    return (
        <div className="container mx-auto px-4 py-8 animate-fadeIn h-full overflow-y-auto pb-20 md:pb-4">
            <h1 className="text-4xl font-bold text-cyan-400 mb-6">Explore</h1>
            
            {/* Search & Tabs */}
            <div className="mb-8 space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-gray-900/80 border border-violet-500/30 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-lg"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                        <SearchIcon />
                    </div>
                </div>

                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                    <TabButton id="Discover" label="Discover" icon={<GlobeAltIcon />} />
                    <TabButton id="Creations" label="Creations" icon={<SparklesIcon />} />
                    <TabButton id="Library" label="Library" icon={<BookOpenIcon />} />
                    <TabButton id="Communities" label="Communities" icon={<UserGroupIcon />} />
                </div>
            </div>

            {/* Content Grid */}
            <div className="animate-fadeIn">
                {activeTab === 'Discover' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredDiscoverItems.map(item => (
                            <DiscoveryCard 
                                key={`${item.type}-${item.id}`} 
                                item={item} 
                                onClick={() => handleItemClick(item.type, item.id)} 
                                onStartConversation={onStartConversation}
                                currentUserId={currentUser.id}
                            />
                        ))}
                        {filteredDiscoverItems.length === 0 && <p className="col-span-full text-center text-gray-500 py-12">No items found matching your search.</p>}
                    </div>
                )}

                {activeTab === 'Creations' && (
                    <div>
                        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
                            {(['All', 'Character', 'World', 'Story', 'RP Card'] as CreationFilter[]).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setCreationFilter(f)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${creationFilter === f ? 'bg-violet-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {allCreations.map(item => (
                                <DiscoveryCard 
                                    key={`c-${item.type}-${item.id}`} 
                                    item={item} 
                                    onClick={() => handleItemClick(item.type, item.id)} 
                                    onStartConversation={onStartConversation}
                                    currentUserId={currentUser.id}
                                />
                            ))}
                            {allCreations.length === 0 && <p className="col-span-full text-center text-gray-500 py-12">No public creations found.</p>}
                        </div>
                    </div>
                )}

                {activeTab === 'Library' && (
                    <div className="space-y-10">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <GlobeAltIcon /> Joined Worlds
                            </h2>
                            {libraryItems.worlds.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {libraryItems.worlds.map(world => (
                                        <div key={world.id} onClick={() => onSelectWorld(world.id)} className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-4 flex gap-4 cursor-pointer hover:border-violet-400 transition-colors">
                                            <img src={world.imageUrl} className="w-16 h-16 rounded-md object-cover" alt={world.name} />
                                            <div>
                                                <h3 className="font-bold text-white">{world.name}</h3>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{world.tagline}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">You haven't joined any worlds yet.</p>
                            )}
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <UserGroupIcon /> Active Parties
                            </h2>
                            {libraryItems.parties.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {libraryItems.parties.map(party => (
                                        <div key={party.id} onClick={() => onSelectParty(party.id)} className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-4 flex gap-4 cursor-pointer hover:border-cyan-400 transition-colors">
                                            <img src={party.imageUrl} className="w-16 h-16 rounded-md object-cover" alt={party.name} />
                                            <div>
                                                <h3 className="font-bold text-white">{party.name}</h3>
                                                <p className="text-xs text-gray-400 mt-1">Host: {party.members.find(m => m.isHost)?.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">You are not in any active parties.</p>
                            )}
                        </section>
                    </div>
                )}

                {activeTab === 'Communities' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCommunities.map(community => (
                            <CommunityCard 
                                key={community.id} 
                                community={community} 
                                onClick={() => onSelectCommunity && onSelectCommunity(community.id)}
                                isMember={currentUser.communityIds?.includes(community.id)}
                            />
                        ))}
                        {filteredCommunities.length === 0 && <p className="col-span-full text-center text-gray-500 py-12">No communities found matching your search.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;
