
import React, { useState } from 'react';
import { World, WorldRole, WorldPermission } from '../types';
import ContentRatingSelector from './ContentRatingSelector';

// --- Icons ---
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.28l1.383 1.382 1.966-1.966a.75.75 0 111.06 1.06l-1.965 1.967 1.382 1.382h.28a.75.75 0 010 1.5h-.28l-1.382 1.382 1.966 1.966a.75.75 0 01-1.06 1.061l-1.967-1.967-1.383 1.383v.28a.75.75 0 01-1.5 0v-.28l-1.382-1.383-1.966 1.967a.75.75 0 01-1.061-1.06l1.967-1.967-1.382-1.382h-.28a.75.75 0 010-1.5h.28l1.383-1.382-1.967-1.966a.75.75 0 111.06-1.06l1.966 1.966 1.383-1.382V2.75A.75.75 0 0110 2zM10 6.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;
const ExclamationTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const DiceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M14.5 3.5a.5.5 0 01.5.5v12a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5v-12a.5.5 0 01.5-.5h9zM10 6a1 1 0 100-2 1 1 0 000 2zm-3 3a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2zm-3 3a1 1 0 100-2 1 1 0 000 2z" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8 7a5 5 0 113.61 4.804l-1.903 1.903A1 1 0 019 14H8v1a1 1 0 01-1 1H6v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 01.293-.707L5.293 10.293A4.983 4.983 0 018 7zm2-1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const AdjustmentsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 3.75a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM4.25 17a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 17a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM9 10a.75.75 0 01-.75.75h-5.5a.75.75 0 010-1.5h5.5A.75.75 0 019 10zM17.25 10.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM14 10a2 2 0 10-4 0 2 2 0 004 0zM10 16.25a2 2 0 10-4 0 2 2 0 004 0z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;

interface WorldSettingsSectionProps {
    worldData: World;
    setWorldData: React.Dispatch<React.SetStateAction<World>>;
}

type SettingsTab = 'general' | 'roles' | 'mechanics' | 'safety' | 'danger';

const WorldSettingsSection: React.FC<WorldSettingsSectionProps> = ({ worldData, setWorldData }) => {
    const [currentBannedWord, setCurrentBannedWord] = useState('');
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    
    // Role State
    const [selectedRole, setSelectedRole] = useState<WorldRole | null>(worldData.roles?.[0] || null);

    // --- Handlers ---
    const handleVisibilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setWorldData(prev => ({ ...prev, visibility: e.target.value as 'Public' | 'Private' }));
    };

    const handleJoinPolicyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setWorldData(prev => ({ ...prev, joinPolicy: e.target.value as 'Open' | 'Approval' | 'Invite' }));
    };

    const handleBannedWordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newWord = currentBannedWord.trim();
            if (newWord && !(worldData.bannedWords || []).includes(newWord)) {
                setWorldData(prev => ({ ...prev, bannedWords: [...(prev.bannedWords || []), newWord] }));
            }
            setCurrentBannedWord('');
        }
    };

    const removeBannedWord = (wordToRemove: string) => {
        setWorldData(prev => ({ ...prev, bannedWords: (prev.bannedWords || []).filter(w => w !== wordToRemove) }));
    };

    const handleDeleteWorld = () => {
        if (window.confirm("Are you sure you want to delete this world? This action cannot be undone.")) {
            alert("World deleted (Simulation)");
        }
    };
    
    // --- Role Handlers ---
    const handleAddRole = () => {
        const newRole: WorldRole = {
            id: Date.now(),
            name: 'New Role',
            color: '#9ca3af',
            permissions: []
        };
        setWorldData(prev => ({ ...prev, roles: [...(prev.roles || []), newRole] }));
        setSelectedRole(newRole);
    };

    const handleDeleteRole = (roleId: number) => {
        if ((worldData.roles || []).length <= 1) {
            alert("You must have at least one role.");
            return;
        }
        setWorldData(prev => ({ ...prev, roles: (prev.roles || []).filter(r => r.id !== roleId) }));
        if (selectedRole?.id === roleId) {
            setSelectedRole((worldData.roles || []).find(r => r.id !== roleId) || null);
        }
    };

    const updateRole = (roleId: number, updates: Partial<WorldRole>) => {
        setWorldData(prev => {
            const newRoles = (prev.roles || []).map(r => r.id === roleId ? { ...r, ...updates } : r);
            // Ensure only one default role
            if (updates.isDefault) {
                return { ...prev, roles: newRoles.map(r => r.id === roleId ? r : { ...r, isDefault: false }) };
            }
            return { ...prev, roles: newRoles };
        });
        if (selectedRole?.id === roleId) {
            setSelectedRole(prev => prev ? ({ ...prev, ...updates }) : null);
        }
    };

    const togglePermission = (roleId: number, permission: WorldPermission) => {
        const role = (worldData.roles || []).find(r => r.id === roleId);
        if (!role) return;
        
        const hasPerm = role.permissions.includes(permission);
        const newPerms = hasPerm 
            ? role.permissions.filter(p => p !== permission)
            : [...role.permissions, permission];
            
        updateRole(roleId, { permissions: newPerms });
    };

    // --- Tabs Navigation ---
    const TabButton: React.FC<{ id: SettingsTab; label: string; icon: React.ReactNode }> = ({ id, label, icon }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === id ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}
        >
            {icon} {label}
        </button>
    );

    const contentForAnalysis = `${worldData.introduction || ''} ${worldData.synopsis || ''}`;

    return (
        <div className="p-4 md:p-8 h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-cyan-400">World Administration</h2>
                <p className="text-sm text-gray-400">Configure settings, mechanics, and access controls.</p>
            </div>

            {/* Tabs Header */}
            <div className="flex border-b border-violet-500/30 mb-6 overflow-x-auto scrollbar-hide">
                <TabButton id="general" label="General" icon={<AdjustmentsIcon />} />
                <TabButton id="roles" label="Roles" icon={<UsersIcon />} />
                <TabButton id="mechanics" label="Mechanics" icon={<DiceIcon />} />
                <TabButton id="safety" label="Safety & Access" icon={<ShieldCheckIcon />} />
                <TabButton id="danger" label="Danger Zone" icon={<ExclamationTriangleIcon />} />
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto space-y-8 pb-12">
                
                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Status & Activity</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {['Active', 'Recruiting', 'Hiatus'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setWorldData(prev => ({ ...prev, statusLabel: status as any }))}
                                        className={`p-3 rounded-lg border text-center transition-all ${worldData.statusLabel === status ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-bold' : 'border-gray-700 bg-gray-800/40 text-gray-400 hover:bg-gray-800'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Onboarding</h3>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Welcome Message</label>
                            <textarea 
                                value={worldData.welcomeMessage || ''}
                                onChange={(e) => setWorldData(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                                placeholder="Enter a message to be sent to new members automatically..."
                                rows={3}
                                className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">This message will be sent by the system when a user joins.</p>
                        </div>
                    </div>
                )}

                {/* ROLES TAB */}
                {activeTab === 'roles' && (
                    <div className="grid md:grid-cols-3 gap-6 h-full animate-fadeIn">
                        {/* Role List Sidebar */}
                        <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-4 flex flex-col h-[600px]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white">All Roles</h3>
                                <button onClick={handleAddRole} className="p-1 text-cyan-400 hover:text-white transition-colors" title="Add Role">
                                    <PlusIcon />
                                </button>
                            </div>
                            <div className="space-y-2 overflow-y-auto flex-grow">
                                {(worldData.roles || []).map(role => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all border ${selectedRole?.id === role.id ? 'bg-gray-800 border-cyan-500' : 'bg-gray-800/40 border-transparent hover:bg-gray-800'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }}></div>
                                            <span className="font-medium text-gray-200">{role.name}</span>
                                        </div>
                                        {role.isDefault && <span className="text-xs text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded">Default</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Role Editor */}
                        <div className="md:col-span-2 bg-gray-900/50 border border-violet-500/30 rounded-lg p-6 h-[600px] overflow-y-auto">
                            {selectedRole ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold text-white">Edit Role: <span style={{ color: selectedRole.color }}>{selectedRole.name}</span></h3>
                                        <button onClick={() => handleDeleteRole(selectedRole.id)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                                            <TrashIcon /> Delete
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Role Name</label>
                                        <input 
                                            type="text" 
                                            value={selectedRole.name} 
                                            onChange={(e) => updateRole(selectedRole.id, { name: e.target.value })}
                                            className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Role Color</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#a78bfa', '#f472b6', '#9ca3af'].map(color => (
                                                <button 
                                                    key={color}
                                                    onClick={() => updateRole(selectedRole.id, { color })}
                                                    className={`w-8 h-8 rounded-full border-2 ${selectedRole.color === color ? 'border-white' : 'border-transparent'}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="defaultRole" 
                                            checked={selectedRole.isDefault || false}
                                            onChange={(e) => updateRole(selectedRole.id, { isDefault: e.target.checked })}
                                            className="rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-700"
                                        />
                                        <label htmlFor="defaultRole" className="text-sm text-gray-300">Set as Default Role (assigned to new members)</label>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Permissions</h4>
                                        <div className="space-y-2">
                                            {[
                                                { id: 'manage_channels', label: 'Manage Channels', desc: 'Create, edit, and delete channels' },
                                                { id: 'manage_lore', label: 'Manage Lorebook', desc: 'Add and edit lore entries' },
                                                { id: 'moderate_chat', label: 'Moderate Chat', desc: 'Delete messages and manage discussions' },
                                                { id: 'invite_members', label: 'Invite Members', desc: 'Create invite links' },
                                                { id: 'manage_roles', label: 'Manage Roles', desc: 'Create and assign roles (Admin)' },
                                            ].map(perm => {
                                                const isChecked = selectedRole.permissions.includes(perm.id as WorldPermission);
                                                return (
                                                    <div 
                                                        key={perm.id} 
                                                        className={`flex items-start gap-3 p-3 rounded-md border transition-all cursor-pointer ${isChecked ? 'bg-cyan-900/20 border-cyan-500/50' : 'bg-gray-800/40 border-transparent hover:bg-gray-800/60'}`} 
                                                        onClick={() => togglePermission(selectedRole.id, perm.id as WorldPermission)}
                                                    >
                                                        <div className={`mt-1 w-5 h-5 rounded flex items-center justify-center border ${isChecked ? 'bg-cyan-500 border-cyan-500' : 'bg-gray-700 border-gray-600'}`}>
                                                            {isChecked && <svg className="w-3.5 h-3.5 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-semibold ${isChecked ? 'text-cyan-300' : 'text-gray-200'}`}>{perm.label}</p>
                                                            <p className="text-xs text-gray-500">{perm.desc}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    Select a role to edit permissions.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* MECHANICS TAB */}
                {activeTab === 'mechanics' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <DiceIcon /> Dice System
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300 font-medium">Enable Dice Rolling</span>
                                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                        <input 
                                            type="checkbox" 
                                            checked={worldData.systemSettings?.enableDice ?? true}
                                            onChange={(e) => setWorldData(prev => ({...prev, systemSettings: { ...prev.systemSettings, enableDice: e.target.checked } as any }))}
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                            style={{ right: worldData.systemSettings?.enableDice !== false ? '0' : 'auto', left: worldData.systemSettings?.enableDice !== false ? 'auto' : '0' }}
                                        />
                                        <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${worldData.systemSettings?.enableDice !== false ? 'bg-cyan-500' : 'bg-gray-700'}`}></label>
                                    </div>
                                </div>

                                {worldData.systemSettings?.enableDice !== false && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Primary System</label>
                                            <select 
                                                value={worldData.systemSettings?.diceSystem || 'd20'}
                                                onChange={(e) => setWorldData(prev => ({...prev, systemSettings: { ...prev.systemSettings, diceSystem: e.target.value } as any }))}
                                                className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                            >
                                                <option value="d20">D20 Standard (DnD style)</option>
                                                <option value="d6-pool">D6 Dice Pool</option>
                                                <option value="percentile">Percentile (d100)</option>
                                                <option value="custom">Freeform / Custom</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-violet-500/20 pt-4">
                                            <div>
                                                <span className="text-gray-300 font-medium block">Highlight Criticals</span>
                                                <span className="text-xs text-gray-500">Show special effects for Nat 20s / Nat 1s</span>
                                            </div>
                                            <input 
                                                type="checkbox" 
                                                checked={worldData.systemSettings?.highlightCriticals ?? true}
                                                onChange={(e) => setWorldData(prev => ({...prev, systemSettings: { ...prev.systemSettings, highlightCriticals: e.target.checked } as any }))}
                                                className="h-5 w-5 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-700"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* SAFETY & ACCESS TAB */}
                {activeTab === 'safety' && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Access Control */}
                        <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                <KeyIcon /> Access Control
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
                                    <select 
                                        value={worldData.visibility || 'Public'} 
                                        onChange={handleVisibilityChange}
                                        className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="Public">Public (Discoverable)</option>
                                        <option value="Private">Private (Hidden)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Join Policy</label>
                                    <select 
                                        value={worldData.joinPolicy || 'Open'} 
                                        onChange={handleJoinPolicyChange}
                                        className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="Open">Open to All</option>
                                        <option value="Approval">Approval Required</option>
                                        <option value="Invite">Invite Only</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Content Rating */}
                        <ContentRatingSelector 
                            title="Safety Classification"
                            rating={worldData.contentMetadata?.ageRating || 'Everyone'}
                            setRating={(r) => setWorldData(p => ({
                                ...p, 
                                contentMetadata: { 
                                    ...(p.contentMetadata || { warnings: [] }), 
                                    ageRating: r 
                                }
                            }))}
                            warnings={worldData.contentMetadata?.warnings || []}
                            setWarnings={(w) => setWorldData(p => ({
                                ...p, 
                                contentMetadata: { 
                                    ...(p.contentMetadata || { ageRating: 'Everyone' }), 
                                    warnings: w 
                                }
                            }))}
                            contentToAnalyze={contentForAnalysis}
                        />

                        {/* Moderation */}
                        <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                Moderation Protocol
                            </h3>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Banned Words List</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {(worldData.bannedWords || []).map(word => (
                                    <span key={word} className="flex items-center gap-1 bg-red-500/20 text-red-300 text-xs font-medium px-2.5 py-1 rounded-full border border-red-500/30">
                                        {word}
                                        <button onClick={() => removeBannedWord(word)} className="text-red-200 hover:text-white"><XMarkIcon /></button>
                                    </span>
                                ))}
                            </div>
                            <input 
                                type="text" 
                                value={currentBannedWord} 
                                onChange={(e) => setCurrentBannedWord(e.target.value)} 
                                onKeyDown={handleBannedWordKeyDown} 
                                placeholder="Type word and press Enter..." 
                                className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                            />
                        </div>
                    </div>
                )}

                {/* DANGER ZONE TAB */}
                {activeTab === 'danger' && (
                    <div className="animate-fadeIn border border-red-500/50 rounded-lg p-6 bg-red-900/10">
                        <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-4">
                            <ExclamationTriangleIcon /> Danger Zone
                        </h3>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="text-gray-300 font-medium">Archive World</p>
                                <p className="text-xs text-gray-500">Make the world read-only. No new posts or messages allowed.</p>
                            </div>
                            <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors text-sm font-semibold whitespace-nowrap">
                                Archive World
                            </button>
                        </div>
                        <div className="border-t border-red-500/20 my-4"></div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <p className="text-red-400 font-medium">Delete World</p>
                                <p className="text-xs text-gray-500">Permanently delete this world and all its data. This cannot be undone.</p>
                            </div>
                            <button onClick={handleDeleteWorld} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-semibold whitespace-nowrap flex items-center gap-2">
                                <TrashIcon /> Delete World
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorldSettingsSection;
