
import React, { useState } from 'react';
import { UserCreation } from '../types';
import WorkshopItemCard from '../components/WorkshopItemCard';

// --- Icons ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const CharacterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const WorldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9.42 2.222a.75.75 0 011.16 0l4.25 6.5a.75.75 0 01-.58 1.168h-8.5a.75.75 0 01-.58-1.168l4.25-6.5zM10 8.25a.75.75 0 01.75.75v3.19l2.22 1.48a.75.75 0 11-.74 1.11l-2.5-1.667A.75.75 0 019.25 12V9a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>;
const StoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2.5 1a.5.5 0 00-.5.5v1.886c0 .041.012.08.034.114l1.192 1.589a.5.5 0 00.316.16h3.916a.5.5 0 00.316-.16l1.192-1.589A.5.5 0 0013.5 7.386V5.5a.5.5 0 00-.5-.5h-9z" clipRule="evenodd" /></svg>;
const PartyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M12.75 1.522a1.5 1.5 0 012.058 2.058l-6 6a1.5 1.5 0 01-2.058-2.058l6-6zM8.5 7.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5z" /><path d="M12.5 10a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /><path d="M3.66 4.01a.75.75 0 00-1.112 1.018l1.016 1.11a.75.75 0 001.112-1.018L3.66 4.01zM15.99 15.28a.75.75 0 00-1.017 1.112l1.11 1.016a.75.75 0 001.018-1.112l-1.11-1.016z" /></svg>;
const MemeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 9.22a.75.75 0 00-1.06 1.06L8.94 12l-1.72 1.72a.75.75 0 101.06 1.06L10 13.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 12l1.72-1.72a.75.75 0 00-1.06-1.06L10 10.94 8.28 9.22zM8 6.5a1 1 0 11-2 0 1 1 0 012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;

type CreationFilter = 'All' | UserCreation['type'];
const filters: { id: CreationFilter; label: string }[] = [
    { id: 'All', label: 'All' },
    { id: 'Character', label: 'Characters' },
    { id: 'World', label: 'Worlds' },
    { id: 'Story', label: 'Stories' },
    { id: 'RP Card', label: 'Parties' },
    { id: 'Community', label: 'Clans' },
    { id: 'Meme', label: 'Memes' },
];

interface WorkshopPageProps {
    userCreations: UserCreation[];
    onEditWorld: (worldId: number) => void;
    onCreateCharacter: () => void;
    onEditCharacter: (characterId: number) => void;
    onViewCharacter: (characterId: number) => void;
    onCreateWorld: () => void;
    onCreateStory: () => void;
    onEditStory: (storyId: number) => void;
    onViewStory: (storyId: number) => void;
    onCreateParty: () => void;
    onEditParty: (partyId: number) => void;
    onCreateMeme: () => void;
    onCreateCommunity?: () => void;
    onEditCommunity?: (communityId: number) => void;
}

const CreateMenuCard: React.FC<{ icon: React.ReactNode, label: string, desc: string, onClick: () => void, colorClass: string, glowClass: string }> = ({ icon, label, desc, onClick, colorClass, glowClass }) => (
    <button 
        onClick={onClick}
        className={`group relative p-4 rounded-2xl border border-white/10 bg-[#0f0f12] hover:bg-[#16161c] transition-all duration-500 text-left overflow-hidden flex flex-col gap-3 hover:scale-[1.03]`}
    >
        <div className={`absolute -right-2 -top-2 w-24 h-24 opacity-5 rounded-full blur-2xl group-hover:opacity-20 ${glowClass}`}></div>
        <div className={`p-3 rounded-xl w-fit ${colorClass} bg-white/5 border border-white/5`}>
            {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
        </div>
        <div>
            <h3 className="text-lg font-black text-white leading-none tracking-tighter uppercase italic">{label}</h3>
            <p className="text-gray-500 text-[10px] mt-1 font-medium leading-relaxed">{desc}</p>
        </div>
    </button>
);

const WorkshopPage: React.FC<WorkshopPageProps> = ({ 
    userCreations, 
    onEditWorld, 
    onCreateCharacter, 
    onEditCharacter, 
    onViewCharacter, 
    onCreateWorld, 
    onCreateStory, 
    onEditStory, 
    onViewStory, 
    onCreateParty, 
    onEditParty, 
    onCreateMeme, 
    onCreateCommunity, 
    onEditCommunity 
}) => {
    const [activeFilter, setActiveFilter] = useState<CreationFilter>('All');
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

    const filteredCreations = userCreations.filter(creation => activeFilter === 'All' || creation.type === activeFilter);

    const handleEdit = (creation: UserCreation) => {
        switch(creation.type) {
            case 'World': onEditWorld(creation.id); break;
            case 'Character': onEditCharacter(creation.id); break;
            case 'AI Character': onEditCharacter(creation.id); break;
            case 'Story': onEditStory(creation.id); break;
            case 'RP Card': onEditParty(creation.id); break;
            case 'Community': onEditCommunity && onEditCommunity(creation.id); break;
            default: console.log("Edit not implemented for", creation.type);
        }
    };

    const handleView = (creation: UserCreation) => {
        switch(creation.type) {
            case 'Character': onViewCharacter(creation.id); break;
            case 'AI Character': onViewCharacter(creation.id); break;
            case 'Story': onViewStory(creation.id); break;
            default: console.log("View not implemented for", creation.type);
        }
    };

    return (
        <div className="h-full w-full bg-[#050505] relative overflow-y-auto custom-scrollbar scroll-smooth">
            {/* Header - More proportional */}
            <div className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 pb-2 pt-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-2">
                                <span className="text-cyan-400 text-lg">⚡</span> Workshop
                            </h1>
                        </div>
                        
                        <button 
                            onClick={() => setIsCreateMenuOpen(true)}
                            className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-black font-black uppercase italic tracking-widest rounded-full shadow-lg hover:shadow-white/20 hover:scale-105 transition-all active:scale-95 text-xs"
                        >
                            <PlusIcon />
                            <span>Forge New</span>
                        </button>
                    </div>

                    {/* Filter Navigation - Compact */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 border whitespace-nowrap ${
                                    activeFilter === filter.id 
                                        ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(34,211,238,0.3)]' 
                                        : 'bg-gray-900/50 text-gray-500 border-white/5 hover:text-white'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Grid - Dense (2 cols on mobile) */}
            <div className="relative z-10 px-4 py-6 pb-32">
                <div className="container mx-auto">
                    {filteredCreations.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {filteredCreations.map((creation, index) => (
                                <div 
                                    key={creation.id} 
                                    className="animate-fadeInUp"
                                    style={{ animationDelay: `${index * 30}ms` }}
                                >
                                    <WorkshopItemCard 
                                        creation={creation} 
                                        onEdit={() => handleEdit(creation)}
                                        onView={['Character', 'AI Character', 'Story'].includes(creation.type) ? () => handleView(creation) : undefined}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                            <PlusIcon className="w-8 h-8 text-gray-700 mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest">No Creations Found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Menu Overlay - Proportional sizing */}
            {isCreateMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl animate-fadeIn flex flex-col overflow-y-auto">
                    <div className="container mx-auto px-6 py-10 flex-grow flex flex-col max-w-5xl">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Forge New</h2>
                                <p className="text-gray-500 text-xs mt-1">Select a blueprint to begin construction.</p>
                            </div>
                            <button 
                                onClick={() => setIsCreateMenuOpen(false)}
                                className="p-3 rounded-full bg-gray-900 border border-white/10 text-gray-400 hover:text-white active:scale-90"
                            >
                                <XMarkIcon />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full pb-20">
                            <CreateMenuCard 
                                label="Character" 
                                desc="Manifest a new persona with unique traits and AI voice." 
                                icon={<CharacterIcon />} 
                                colorClass="text-cyan-400"
                                glowClass="bg-cyan-500"
                                onClick={() => { onCreateCharacter(); setIsCreateMenuOpen(false); }}
                            />
                            <CreateMenuCard 
                                label="World" 
                                desc="Synthesize a new reality with maps and deep lore." 
                                icon={<WorldIcon />} 
                                colorClass="text-violet-400"
                                glowClass="bg-violet-500"
                                onClick={() => { onCreateWorld(); setIsCreateMenuOpen(false); }}
                            />
                            <CreateMenuCard 
                                label="Story" 
                                desc="Draft an interactive saga with branching visuals." 
                                icon={<StoryIcon />} 
                                colorClass="text-emerald-400"
                                glowClass="bg-emerald-500"
                                onClick={() => { onCreateStory(); setIsCreateMenuOpen(false); }}
                            />
                            <CreateMenuCard 
                                label="Party Room" 
                                desc="Social hub for roleplay, tabletop, and media." 
                                icon={<PartyIcon />} 
                                colorClass="text-indigo-400"
                                glowClass="bg-indigo-500"
                                onClick={() => { onCreateParty(); setIsCreateMenuOpen(false); }}
                            />
                            <CreateMenuCard 
                                label="Community" 
                                desc="Found a clan to unite travelers in your sector." 
                                icon={<UserGroupIcon />} 
                                colorClass="text-orange-400"
                                glowClass="bg-orange-500"
                                onClick={() => { onCreateCommunity && onCreateCommunity(); setIsCreateMenuOpen(false); }}
                            />
                            <CreateMenuCard 
                                label="Meme" 
                                desc="Construct high-impact visual reactions." 
                                icon={<MemeIcon />} 
                                colorClass="text-amber-400"
                                glowClass="bg-amber-500"
                                onClick={() => { onCreateMeme(); setIsCreateMenuOpen(false); }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkshopPage;
