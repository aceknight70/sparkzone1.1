
import React from 'react';
import { Party } from '../types';
import { PartyWorkshopSection } from '../pages/PartyWorkshopPage';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const BlueprintIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5zM15.5 5.25v1.64l-3.328 3.328a.75.75 0 11-1.06-1.06l3.328-3.328H15.5zM4.5 10.25a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM4.5 13.25a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z" /><path d="M8.61 5.25a.75.75 0 00-1.06 0l-3.328 3.328a.75.75 0 101.06 1.06L8.61 6.31a.75.75 0 000-1.06z" /></svg>;
const StageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 3.75A.75.75 0 013.75 3h12.5a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V3.75zM12.5 7.5a.75.75 0 000-1.5H11a.75.75 0 000 1.5h1.5zm-3.5-1.5a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5a.75.75 0 01.75-.75zM9 10.5a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5H9z" clipRule="evenodd" /></svg>;
const MembersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;


const SidebarButton: React.FC<{ section: PartyWorkshopSection; activeSection: PartyWorkshopSection; onSelect: (s: PartyWorkshopSection) => void; icon: React.ReactNode; label: string }> = ({ section, activeSection, onSelect, icon, label }) => {
    const isActive = section === activeSection;
    return (
        <button onClick={() => onSelect(section)} className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${isActive ? 'bg-violet-500/20 text-white' : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'}`}>
            <div className="w-5 h-5">{icon}</div>
            <span className="font-semibold">{label}</span>
        </button>
    );
};

interface PartyOutlineSidebarProps {
    party: Party;
    activeSection: PartyWorkshopSection;
    onSelectSection: (section: PartyWorkshopSection) => void;
    onExit: () => void;
}

const PartyOutlineSidebar: React.FC<PartyOutlineSidebarProps> = ({ party, activeSection, onSelectSection, onExit }) => {
    return (
        <aside className="w-full md:w-80 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-r border-violet-500/30 flex flex-col h-full">
            <header className="p-4 border-b border-violet-500/30 flex justify-between items-center flex-shrink-0">
                 <div className="flex items-center gap-2 min-w-0">
                    <button onClick={onExit} className="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white" title="Exit Workshop">
                        <ArrowLeftIcon />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white truncate">{party.name || 'New Party'}</h1>
                        <p className="text-sm text-gray-400">Party Workshop</p>
                    </div>
                </div>
            </header>
            
            <nav className="p-4 space-y-2 flex-grow overflow-y-auto">
                <SidebarButton section="blueprint" activeSection={activeSection} onSelect={onSelectSection} icon={<BlueprintIcon />} label="Blueprint" />
                <SidebarButton section="stage" activeSection={activeSection} onSelect={onSelectSection} icon={<StageIcon />} label="Stage Setup" />
                <SidebarButton section="members" activeSection={activeSection} onSelect={onSelectSection} icon={<MembersIcon />} label="Members" />
            </nav>
        </aside>
    );
};

export default PartyOutlineSidebar;
