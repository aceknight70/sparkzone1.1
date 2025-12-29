
import React, { useState, useEffect } from 'react';
import { World, WorldLocation, UserCreation, User } from '../types';
import GroupChatView from '../components/GroupChatView';
import WorldSidebar from '../components/WorldSidebar';
import WorldMapView from '../components/WorldMapView';
import WorldTimelineView from '../components/WorldTimelineView';

interface WorldPageProps {
    world: World;
    onExit: () => void;
    onSendGroupMessage: (worldId: number, locationId: number, text: string, character?: UserCreation, imageUrl?: string) => void;
    onDeleteGroupMessage?: (worldId: number, locationId: number, messageId: number) => void;
    userCreations: UserCreation[];
    onStartConversation: (userId: number) => void;
    currentUser: User;
    onSaveMeme?: (meme: { name: string, imageUrl: string }) => void;
    onPlayMusic?: (url: string | null) => void;
    onJoinWorld?: (worldId: number) => void;
    onSendInvite?: (userId: number, message?: string) => void;
    allUsers?: User[];
    onOpenSettings?: () => void; // Changed from onEditWorld for clarity
}

const WorldPage: React.FC<WorldPageProps> = ({ 
    world, 
    onExit, 
    onSendGroupMessage, 
    onDeleteGroupMessage, 
    userCreations, 
    onStartConversation, 
    currentUser, 
    onSaveMeme, 
    onPlayMusic, 
    onJoinWorld, 
    onSendInvite, 
    allUsers,
    onOpenSettings 
}) => {
    // Determine a safe initial channel
    const getSafeInitialLocation = () => {
        if (world.locations && world.locations.length > 0 && world.locations[0].channels.length > 0) {
            return world.locations[0].channels[0].id;
        }
        return null;
    };

    const [activeLocationId, setActiveLocationId] = useState<number | null>(getSafeInitialLocation());
    const [viewMode, setViewMode] = useState<'chat' | 'map' | 'timeline'>('chat');
    const [isMobileContentOpen, setIsMobileContentOpen] = useState(false);

    const isMember = world.members?.some(m => m.id === currentUser.id) ?? false;
    const isCreator = world.authorId === currentUser.id;

    // Resolve the active location object securely
    const activeLocation = activeLocationId != null
        ? world.locations.flatMap(cat => cat.channels).find(chan => chan.id === activeLocationId)
        : null;

    // --- Handlers ---

    const handleSelectLocation = (location: WorldLocation) => {
        setActiveLocationId(location.id);
        setViewMode('chat');
        setIsMobileContentOpen(true);
        
        if (onPlayMusic && location.themeSongUrl) {
            onPlayMusic(location.themeSongUrl);
        }
    };
    
    const handleShowAtlas = () => {
        setViewMode('map');
        setIsMobileContentOpen(true);
    };

    const handleShowTimeline = () => {
        setViewMode('timeline');
        setIsMobileContentOpen(true);
    };

    const handleMobileBack = () => {
        setIsMobileContentOpen(false);
    };
    
    // Safety check: If the active channel is deleted or world changes, reset to safe default
    useEffect(() => {
        if (activeLocationId !== null) {
            const locationExists = world.locations.some(cat => cat.channels.some(chan => chan.id === activeLocationId));
            if (!locationExists) {
                setActiveLocationId(getSafeInitialLocation());
                setIsMobileContentOpen(false);
            }
        } else {
             setActiveLocationId(getSafeInitialLocation());
        }
    }, [world]); // Dependency on world ensures we react to deletions/updates
    
    // Play initial music on load if a channel is active
    useEffect(() => {
        if (activeLocation && activeLocation.themeSongUrl && onPlayMusic) {
            onPlayMusic(activeLocation.themeSongUrl);
        }
    }, []); 

    return (
        <div className="fixed inset-0 z-[60] flex h-full w-full bg-slate-950 text-gray-100 font-sans overflow-hidden">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 ease-in-out">
                {activeLocation?.imageUrl && (
                    <>
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl"
                            style={{ backgroundImage: `url(${activeLocation.imageUrl})` }}
                        ></div>
                        <div className="absolute inset-0 bg-slate-950/80"></div>
                    </>
                )}
            </div>

            {/* Main Layout Container */}
            <div className="relative z-10 flex w-full h-full max-w-[1920px] mx-auto md:p-0">
                
                {/* Sidebar (Desktop: Visible, Mobile: Slide-over) */}
                <div className={`
                    absolute md:relative inset-y-0 left-0 z-20 w-full md:w-80 lg:w-96 flex flex-col transition-transform duration-300 ease-in-out bg-slate-900 md:bg-transparent border-r border-white/5
                    ${isMobileContentOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
                `}>
                    <WorldSidebar
                        world={world}
                        activeLocationId={activeLocationId ?? -1}
                        onSelectLocation={handleSelectLocation}
                        onExit={onExit}
                        onStartConversation={onStartConversation}
                        currentUser={currentUser}
                        onShowAtlas={handleShowAtlas}
                        onShowTimeline={handleShowTimeline}
                        onJoinWorld={onJoinWorld}
                        onSendInvite={onSendInvite}
                        allUsers={allUsers}
                        onSettings={isCreator || isMember ? onOpenSettings : undefined}
                    />
                </div>

                {/* Main Content Area */}
                <div className={`
                    absolute md:relative inset-0 md:inset-auto z-30 flex-1 flex flex-col min-w-0 transition-transform duration-300 ease-in-out
                    ${isMobileContentOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                    bg-slate-900 md:bg-transparent
                `}>
                    {/* View Router */}
                    {viewMode === 'map' ? (
                        <div className="h-full relative flex flex-col animate-fadeIn bg-slate-950">
                            <div className="md:hidden absolute top-4 left-4 z-50">
                                <button onClick={handleMobileBack} className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/10 font-bold text-sm">← Back</button>
                            </div>
                            <WorldMapView world={world} onSelectLocation={handleSelectLocation} />
                        </div>
                    ) : viewMode === 'timeline' ? (
                        <div className="h-full relative flex flex-col animate-fadeIn bg-slate-950">
                            <div className="md:hidden absolute top-4 left-4 z-50">
                                <button onClick={handleMobileBack} className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/10 font-bold text-sm">← Back</button>
                            </div>
                            <WorldTimelineView world={world} />
                        </div>
                    ) : activeLocation ? (
                        <GroupChatView 
                            key={activeLocation.id} 
                            location={activeLocation} 
                            world={world}
                            onBack={handleMobileBack}
                            onSendMessage={onSendGroupMessage}
                            onDeleteMessage={onDeleteGroupMessage}
                            userCreations={userCreations}
                            onSaveMeme={onSaveMeme}
                        />
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-gray-500 h-full relative z-10 p-8 text-center animate-fadeIn">
                            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Channel Selected</h3>
                            <p className="max-w-md text-slate-400">Open the sidebar to join a conversation.</p>
                            <button onClick={handleMobileBack} className="mt-8 md:hidden px-6 py-3 bg-white text-black rounded-full font-bold shadow-lg">Open Channels</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Join Button Overlay (if not member) */}
            {!isMember && onJoinWorld && (
                <div className="fixed bottom-8 left-0 right-0 z-[70] flex justify-center pointer-events-none">
                    <button 
                        onClick={() => onJoinWorld(world.id)}
                        className="pointer-events-auto bg-white text-black font-black text-lg py-3 px-8 rounded-full shadow-2xl transform hover:scale-105 transition-all flex items-center gap-3 border border-gray-200"
                    >
                        <span>Join {world.name}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default WorldPage;
