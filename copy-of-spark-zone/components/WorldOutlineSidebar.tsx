
import React from 'react';
import { World, WorldWorkshopSection } from '../types';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const BlueprintIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5zM15.5 5.25v1.64l-3.328 3.328a.75.75 0 11-1.06-1.06l3.328-3.328H15.5zM4.5 10.25a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM4.5 13.25a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z" /><path d="M8.61 5.25a.75.75 0 00-1.06 0l-3.328 3.328a.75.75 0 101.06 1.06L8.61 6.31a.75.75 0 000-1.06z" /></svg>;
const LoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V2.75z" /><path fillRule="evenodd" d="M3.25 3A2.25 2.25 0 001 5.25v9.5A2.25 2.25 0 003.25 17h13.5A2.25 2.25 0 0019 14.75v-9.5A2.25 2.25 0 0016.75 3H3.25zM2.5 5.25c0-.414.336-.75.75-.75h13.5c.414 0 .75.336.75.75v9.5c0 .414-.336.75-.75.75H3.25c-.414 0-.75-.336-.75-.75v-9.5z" clipRule="evenodd" /></svg>;
const ChannelsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.05 3.547a.75.75 0 00-1.06 1.06L5.636 6.25H3.75a.75.75 0 000 1.5h1.259l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.94l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.259a.75.75 0 000-1.5H9.364l1.33-3.99a.75.75 0 10-1.42-.472L8.004 6.25H6.06l-1.01-3.033zM12.95 3.547a.75.75 0 00-1.06 1.06L13.536 6.25H11.75a.75.75 0 000 1.5h1.259l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.94l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.259a.75.75 0 000-1.5H17.364l1.33-3.99a.75.75 0 10-1.42-.472L16.004 6.25H14.06l-1.11-3.333z" clipRule="evenodd" /></svg>;
const GearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const GlobeAltIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-11-4.69v.447a3.5 3.5 0 001.025 2.475L8.293 10 8 10.293a1 1 0 000 1.414l1.06 1.06a1.5 1.5 0 01.44 1.061v.363a1 1 0 00.553.894l.276.139a1 1 0 001.342-.448l1.06-1.06a1.5 1.5 0 01.883-.422l.805-.161a3 3 0 002.08-2.08l.161-.805a1.5 1.5 0 01.422-.883l.883-.883z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;

const SidebarButton: React.FC<{ section: WorldWorkshopSection; activeSection: WorldWorkshopSection; onSelect: (s: WorldWorkshopSection) => void; icon: React.ReactNode; label: string }> = ({ section, activeSection, onSelect, icon, label }) => {
    const isActive = section === activeSection;
    return (
        <button onClick={() => onSelect(section)} className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${isActive ? 'bg-violet-500/20 text-white' : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'}`}>
            <div className="w-5 h-5">{icon}</div>
            <span className="font-semibold">{label}</span>
        </button>
    );
};

interface WorldOutlineSidebarProps {
    world: World;
    activeSection: WorldWorkshopSection;
    onSelectSection: (section: WorldWorkshopSection) => void;
    onExit: () => void;
}

const WorldOutlineSidebar: React.FC<WorldOutlineSidebarProps> = ({ world, activeSection, onSelectSection, onExit }) => {
    return (
        <aside className="w-full md:w-80 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-r border-violet-500/30 flex flex-col h-full">
            <header className="p-4 border-b border-violet-500/30 flex justify-between items-center flex-shrink-0">
                 <div className="flex items-center gap-2 min-w-0">
                    <button onClick={onExit} className="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white" title="Exit Workshop">
                        <ArrowLeftIcon />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white truncate">{world.name}</h1>
                        <p className="text-sm text-gray-400">World Workshop</p>
                    </div>
                </div>
            </header>
            
            <nav className="p-4 space-y-2 flex-grow overflow-y-auto">
                <SidebarButton section="landing" activeSection={activeSection} onSelect={onSelectSection} icon={<HomeIcon />} label="Entrance & Intro" />
                <SidebarButton section="blueprint" activeSection={activeSection} onSelect={onSelectSection} icon={<BlueprintIcon />} label="Blueprint" />
                <SidebarButton section="lorebook" activeSection={activeSection} onSelect={onSelectSection} icon={<LoreIcon />} label="Lorebook" />
                <SidebarButton section="channels" activeSection={activeSection} onSelect={onSelectSection} icon={<ChannelsIcon />} label="Channels & Roles" />
                <SidebarButton section="atlas" activeSection={activeSection} onSelect={onSelectSection} icon={<GlobeAltIcon />} label="Atlas" />
                <SidebarButton section="chronicle" activeSection={activeSection} onSelect={onSelectSection} icon={<ClockIcon />} label="Chronicle" />
                <SidebarButton section="settings" activeSection={activeSection} onSelect={onSelectSection} icon={<GearIcon />} label="Settings" />
            </nav>
        </aside>
    );
};

export default WorldOutlineSidebar;
