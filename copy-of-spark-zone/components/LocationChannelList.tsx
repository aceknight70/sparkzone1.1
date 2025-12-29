
import React from 'react';
import { WorldLocation } from '../types';

const HashtagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.05 3.547a.75.75 0 00-1.06 1.06L5.636 6.25H3.75a.75.75 0 000 1.5h1.259l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.94l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.259a.75.75 0 000-1.5H9.364l1.33-3.99a.75.75 0 10-1.42-.472L8.004 6.25H6.06l-1.01-3.033zM12.95 3.547a.75.75 0 00-1.06 1.06L13.536 6.25H11.75a.75.75 0 000 1.5h1.259l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.94l-1.33 3.99a.75.75 0 101.42.472l1.33-3.99h1.259a.75.75 0 000-1.5H17.364l1.33-3.99a.75.75 0 10-1.42-.472L16.004 6.25H14.06l-1.11-3.333z" clipRule="evenodd" /></svg>;

interface LocationChannelListProps {
    locations: { category: string; channels: WorldLocation[] }[];
    activeLocationId: number;
    onSelectLocation: (location: WorldLocation) => void;
}

const LocationChannelList: React.FC<LocationChannelListProps> = ({ locations, activeLocationId, onSelectLocation }) => {
    return (
        <nav className="p-2 space-y-6">
            {locations.map((category, index) => (
                <div key={index}>
                    <h2 className="px-3 pb-2 text-xs font-bold tracking-widest text-gray-500 uppercase">{category.category}</h2>
                    <ul className="space-y-0.5">
                        {category.channels.map(channel => {
                            const isActive = activeLocationId === channel.id;
                            return (
                                <li key={channel.id}>
                                    <button 
                                        onClick={() => onSelectLocation(channel)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-all group relative overflow-hidden
                                            ${isActive ? 'bg-gradient-to-r from-violet-600/20 to-cyan-600/10 text-white shadow-[inset_2px_0_0_0_#22d3ee]' : 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-200'}`}
                                    >
                                        <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                            {channel.iconUrl ? (
                                                <img src={channel.iconUrl} alt="" className="w-5 h-5 rounded-sm object-cover shadow-sm" />
                                            ) : (
                                                <HashtagIcon />
                                            )}
                                        </div>
                                        <span className={`truncate text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{channel.name}</span>
                                        
                                        {/* Subtle glow effect for active channel */}
                                        {isActive && <div className="absolute inset-0 bg-cyan-400/5 pointer-events-none"></div>}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
};

export default LocationChannelList;
