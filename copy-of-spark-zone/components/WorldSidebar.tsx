
import React, { useState } from 'react';
import { World, WorldLocation, User } from '../types';
import LocationChannelList from './LocationChannelList';
import WorldCodexPanel from './WorldCodexPanel';
import ShareButton from './ShareButton';
import InviteModal from './InviteModal';

const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const HashtagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.05 3.547a.75.75 0 00-1.06 1.06L5.636 6.25H3.75a.75.75 0 000 1.5h1.259l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.94l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.259a.75.75 0 000-1.5H9.364l1.33-3.99a.75.75 0 10-1.42-.472L8.004 6.25H6.06l-1.01-3.033zM12.95 3.547a.75.75 0 00-1.06 1.06L13.536 6.25H11.75a.75.75 0 000 1.5h1.259l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.94l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.259a.75.75 0 000-1.5H17.364l1.33-3.99a.75.75 0 10-1.42-.472L16.004 6.25H14.06l-1.11-3.333z" clipRule="evenodd" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const ArrowLeftOnRectangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12.75 1a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V3.31L6.72 8.53a.75.75 0 01-1.06-1.06l6.25-6.25H10.5a.75.75 0 010-1.5h3.75c.414 0 .75.336.75.75zM3.25 4.5a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM3.25 8a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75zM3.25 11.5a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75zM3.25 15a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const GlobeAltIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-11-4.69v.447a3.5 3.5 0 001.025 2.475L8.293 10 8 10.293a1 1 0 000 1.414l1.06 1.06a1.5 1.5 0 01.44 1.061v.363a1 1 0 00.553.894l.276.139a1 1 0 001.342-.448l1.06-1.06a1.5 1.5 0 01.883-.422l.805-.161a3 3 0 002.08-2.08l.161-.805a1.5 1.5 0 01.422-.883l.883-.883z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;

type SidebarTab = 'channels' | 'lore' | 'members' | 'map' | 'timeline';

interface TabButtonProps {
    icon: React.ReactElement;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-2 transition-all duration-200 relative group 
            ${isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}
        `}
    >
        <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
            {icon}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
        {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>}
    </button>
);

interface WorldSidebarProps {
    world: World;
    activeLocationId: number;
    onSelectLocation: (location: WorldLocation) => void;
    onExit: () => void;
    onStartConversation: (userId: number) => void;
    currentUser: User;
    onShowAtlas: () => void;
    onShowTimeline: () => void;
    onJoinWorld?: (worldId: number) => void;
    onSendInvite?: (userId: number, message?: string) => void;
    allUsers?: User[];
    onSettings?: () => void;
}

const WorldSidebar: React.FC<WorldSidebarProps> = ({ 
    world, activeLocationId, onSelectLocation, onExit, onStartConversation, 
    currentUser, onShowAtlas, onShowTimeline, onJoinWorld, onSendInvite, 
    allUsers, onSettings 
}) => {
    const [activeTab, setActiveTab] = useState<SidebarTab>('channels');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const isMember = world.members.some(m => m.id === currentUser.id);

    const handleTabClick = (tab: SidebarTab) => {
        setActiveTab(tab);
        if (tab === 'map') {
            onShowAtlas();
        } else if (tab === 'timeline') {
            onShowTimeline();
        }
    };

    return (
        <aside className="w-full h-full flex flex-col bg-slate-900 relative overflow-hidden">
            
            {/* World Header */}
            <div className="relative flex-shrink-0 z-10 bg-slate-800 border-b border-white/5">
                <div className="relative h-24 overflow-hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-50" 
                        style={{ backgroundImage: `url(${world.bannerUrl})` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    
                    {/* Controls Row */}
                    <div className="absolute top-2 right-2 flex gap-2">
                        {onSettings && (
                            <button onClick={onSettings} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10 shadow-sm">
                                <CogIcon />
                            </button>
                        )}
                        <button onClick={onExit} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10 shadow-sm">
                            <ArrowLeftOnRectangleIcon />
                        </button>
                    </div>
                </div>
                
                <div className="px-4 py-3 -mt-4 relative">
                    <h1 className="text-xl font-bold text-white truncate drop-shadow-md tracking-tight">{world.name}</h1>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-slate-400 truncate max-w-[65%]">{world.tagline || 'Roleplay World'}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setShowInviteModal(true)} className="p-1.5 bg-slate-700 rounded-md text-slate-300 hover:text-white transition-colors">
                                <TicketIcon />
                            </button>
                            <ShareButton 
                                title={`Join ${world.name}`} 
                                text={`Connect to the ${world.name} world.`}
                                className="p-1.5 bg-slate-700 rounded-md text-slate-300 hover:text-white transition-colors"
                                iconOnly
                                showLabel={false}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-shrink-0 border-b border-white/5 bg-slate-900">
                <TabButton icon={<HashtagIcon />} label="Chat" isActive={activeTab === 'channels'} onClick={() => handleTabClick('channels')} />
                <TabButton icon={<BookOpenIcon />} label="Lore" isActive={activeTab === 'lore'} onClick={() => handleTabClick('lore')} />
                <TabButton icon={<UsersIcon />} label="People" isActive={activeTab === 'members'} onClick={() => handleTabClick('members')} />
                <TabButton icon={<GlobeAltIcon />} label="Map" isActive={activeTab === 'map'} onClick={() => handleTabClick('map')} />
                <TabButton icon={<ClockIcon />} label="Log" isActive={activeTab === 'timeline'} onClick={() => handleTabClick('timeline')} />
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto custom-scrollbar bg-slate-900">
                {activeTab === 'channels' && (
                    <div className="py-2 animate-fadeIn">
                        <LocationChannelList
                            locations={world.locations}
                            activeLocationId={activeLocationId}
                            onSelectLocation={onSelectLocation}
                        />
                        {!isMember && onJoinWorld && (
                            <div className="p-4 mt-4">
                                <button 
                                    onClick={() => onJoinWorld(world.id)}
                                    className="w-full text-sm font-bold text-black bg-white hover:bg-gray-200 px-4 py-3 rounded-lg transition-all shadow-md uppercase tracking-wide"
                                >
                                    Join World
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {activeTab === 'lore' && (
                    <WorldCodexPanel world={world} activeTab="Lore" onStartConversation={onStartConversation} currentUser={currentUser} />
                )}
                {activeTab === 'members' && (
                    <WorldCodexPanel world={world} activeTab="Inhabitants" onStartConversation={onStartConversation} currentUser={currentUser} />
                )}
                {activeTab === 'map' && (
                    <div className="flex items-center justify-center h-full text-slate-500 p-6 text-center animate-fadeIn">
                        <div>
                            <GlobeAltIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Select a location from the map view.</p>
                        </div>
                    </div>
                )}
                {activeTab === 'timeline' && (
                    <div className="flex items-center justify-center h-full text-slate-500 p-6 text-center animate-fadeIn">
                        <div>
                            <ClockIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">View the timeline history.</p>
                        </div>
                    </div>
                )}
            </div>

            <InviteModal 
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                targetName={world.name}
                targetType="World"
                inviteLink={`https://sparkzone.app/world/${world.id}`}
                onSendInvite={onSendInvite || (() => {})}
                users={allUsers || []}
                currentUser={currentUser}
            />
        </aside>
    );
};

export default WorldSidebar;
