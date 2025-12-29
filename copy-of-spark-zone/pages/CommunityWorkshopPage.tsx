
import React, { useState } from 'react';
import { Community, User, CommunityRole } from '../types';
import UserAvatar from '../components/UserAvatar';

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const AdjustmentsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 3.75a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM4.25 17a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 17a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM9 10a.75.75 0 01-.75.75h-5.5a.75.75 0 010-1.5h5.5A.75.75 0 019 10zM17.25 10.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM14 10a2 2 0 10-4 0 2 2 0 004 0zM10 16.25a2 2 0 10-4 0 2 2 0 004 0z" /></svg>;

interface CommunityWorkshopPageProps {
    community: Community;
    onExit: () => void;
    onSave: (updated: Community) => void;
    allUsers: User[];
}

type Tab = 'overview' | 'members' | 'settings';

const CommunityWorkshopPage: React.FC<CommunityWorkshopPageProps> = ({ community, onExit, onSave, allUsers }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [formData, setFormData] = useState<Community>(community);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    const handleRoleChange = (userId: number, newRole: CommunityRole) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.map(m => m.userId === userId ? { ...m, role: newRole } : m)
        }));
    };

    const handleKick = (userId: number) => {
        if (confirm("Are you sure you want to remove this member?")) {
            setFormData(prev => ({
                ...prev,
                members: prev.members.filter(m => m.userId !== userId)
            }));
        }
    };

    const membersList = formData.members.map(m => {
        const user = allUsers.find(u => u.id === m.userId);
        return { ...m, user };
    }).filter(m => m.user);

    return (
        <div className="fixed inset-0 z-[60] h-full w-full bg-black flex flex-col md:flex-row font-sans pb-safe">
            {/* Sidebar */}
            <aside className="w-full md:w-80 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-r border-violet-500/30 flex flex-col">
                <header className="p-4 border-b border-violet-500/30 flex justify-between items-center">
                    <div className="flex items-center gap-2 min-w-0">
                        <button onClick={onExit} className="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white" title="Back">
                            <ArrowLeftIcon />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-white truncate">{formData.name}</h1>
                            <p className="text-sm text-gray-400">Manage Community</p>
                        </div>
                    </div>
                </header>
                
                <nav className="p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('overview')} 
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-violet-500/20 text-white' : 'text-gray-400 hover:bg-gray-800/60'}`}
                    >
                        <AdjustmentsIcon />
                        <span className="font-semibold">Overview</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('members')} 
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${activeTab === 'members' ? 'bg-violet-500/20 text-white' : 'text-gray-400 hover:bg-gray-800/60'}`}
                    >
                        <UsersIcon />
                        <span className="font-semibold">Members</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('settings')} 
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-violet-500/20 text-white' : 'text-gray-400 hover:bg-gray-800/60'}`}
                    >
                        <CogIcon />
                        <span className="font-semibold">Settings</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-grow bg-black/20 overflow-y-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                                <h2 className="text-xl font-bold text-cyan-400 mb-6">Community Details</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Community Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Clan Tag</label>
                                        <input type="text" name="tag" value={formData.tag} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white resize-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'members' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-cyan-400">Roster Management</h2>
                                <span className="text-sm text-gray-400">{membersList.length} Members</span>
                            </div>
                            
                            <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg overflow-hidden">
                                {membersList.map(member => (
                                    <div key={member.userId} className="p-4 border-b border-gray-800 last:border-0 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar src={member.user?.avatarUrl} size="10" />
                                            <div>
                                                <p className="font-bold text-white">{member.user?.name}</p>
                                                <p className="text-xs text-gray-500">Joined {member.joinedAt}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <select 
                                                value={member.role} 
                                                onChange={(e) => handleRoleChange(member.userId, e.target.value as CommunityRole)}
                                                className="bg-gray-800 text-xs text-white border border-gray-600 rounded px-2 py-1 outline-none"
                                            >
                                                <option value="Leader">Leader</option>
                                                <option value="Officer">Officer</option>
                                                <option value="Member">Member</option>
                                            </select>
                                            {member.role !== 'Leader' && (
                                                <button onClick={() => handleKick(member.userId)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 border border-red-900 rounded bg-red-900/20 hover:bg-red-900/40">
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                                <h2 className="text-xl font-bold text-cyan-400 mb-4">Discovery Settings</h2>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">Public Listing</p>
                                        <p className="text-sm text-gray-400">Allow this community to appear in Explore.</p>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={formData.isPublic} 
                                        onChange={(e) => setFormData(prev => ({...prev, isPublic: e.target.checked}))}
                                        className="h-5 w-5 rounded bg-gray-800 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-6">
                                <h2 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h2>
                                <button className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-500 transition-colors text-sm">
                                    Disband Community
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button onClick={handleSave} className="px-6 py-2 bg-cyan-500 text-white font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-all">
                            Save Changes
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CommunityWorkshopPage;
