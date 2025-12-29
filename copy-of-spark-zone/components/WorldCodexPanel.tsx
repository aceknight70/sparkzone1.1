


import React from 'react';
// FIX: Imported WorldLoreEntry to use in type casting.
import { World, WorldLoreEntry, User } from '../types';
import UserAvatar from './UserAvatar';

const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2c-4.418 0-8 3.134-8 7 0 2.444 1.206 4.634 3.09 5.982.257.185.334.502.213.766l-1.06 1.768a.75.75 0 001.28.766l1.23-2.05a.75.75 0 01.62-.358 10.42 10.42 0 002.83 0 .75.75 0 01.62.358l1.23 2.05a.75.75 0 001.28-.766l-1.06-1.768a.75.75 0 01.213-.766A7.96 7.96 0 0018 9c0-3.866-3.582-7-8-7z" clipRule="evenodd" /></svg>;

type CodexTab = 'Lore' | 'Inhabitants';

interface WorldCodexPanelProps {
    world: World;
    activeTab: CodexTab;
    onStartConversation: (userId: number) => void;
    currentUser: User;
}

const WorldCodexPanel: React.FC<WorldCodexPanelProps> = ({ world, activeTab, onStartConversation, currentUser }) => {
    
    const loreByCategory = world.lorebook.reduce((acc, entry) => {
        const key = entry.category;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(entry);
        return acc;
    }, {} as Record<string, typeof world.lorebook>);

    return (
        <div className="overflow-y-auto p-4">
            {activeTab === 'Lore' && (
                <div className="space-y-6 animate-fadeIn">
                    <div>
                        <h3 className="font-bold text-lg text-cyan-400 mb-1">Synopsis</h3>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{world.synopsis}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-cyan-400 mb-1">Rules</h3>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{world.rules}</p>
                    </div>
                     <div className="pt-4 mt-4 border-t border-violet-500/20">
                        <h3 className="font-bold text-xl text-cyan-400 mb-4">Lorebook</h3>
                        {Object.entries(loreByCategory).map(([category, entries]) => (
                            <div key={category} className="mb-4">
                                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-2">{category}</h4>
                                <div className="space-y-1">
                                    {/* FIX: Cast `entries` to `WorldLoreEntry[]` to resolve `Property 'map' does not exist on type 'unknown'` error. */}
                                    {(entries as WorldLoreEntry[]).map(entry => (
                                        <details key={entry.id} className="bg-gray-800/40 p-2 rounded-md cursor-pointer">
                                            <summary className="font-semibold text-white">{entry.name}</summary>
                                            <p className="text-sm text-gray-300 pt-2 mt-2 border-t border-violet-500/20 whitespace-pre-wrap">{entry.description}</p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activeTab === 'Inhabitants' && (
                <div className="space-y-3 animate-fadeIn">
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-2">Creator</h3>
                         {world.members.filter(m => m.role === 'Creator').map(member => (
                            <div key={member.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <UserAvatar src={member.avatarUrl} size="8" />
                                    <span className="font-semibold text-white">{member.name}</span>
                                </div>
                                {member.id !== currentUser.id && (
                                    <button onClick={() => onStartConversation(member.id)} className="p-1.5 rounded-full text-gray-400 hover:bg-violet-500/20 hover:text-cyan-400 transition-colors" aria-label={`Message ${member.name}`}>
                                        <MessageIcon />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                     <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-2">Members ({world.members.filter(m => m.role !== 'Creator').length})</h3>
                         {world.members.filter(m => m.role !== 'Creator').map(member => (
                            <div key={member.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <UserAvatar src={member.avatarUrl} size="8" />
                                    <span className="text-gray-300">{member.name}</span>
                                </div>
                                 {member.id !== currentUser.id && (
                                    <button onClick={() => onStartConversation(member.id)} className="p-1.5 rounded-full text-gray-400 hover:bg-violet-500/20 hover:text-cyan-400 transition-colors" aria-label={`Message ${member.name}`}>
                                        <MessageIcon />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorldCodexPanel;
