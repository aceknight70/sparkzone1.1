
import React, { useRef, useState } from 'react';
import { Party, Token } from '../types';
import { PartyWorkshopSection } from '../pages/PartyWorkshopPage';
import UserAvatar from './UserAvatar';
import ContentRatingSelector from './ContentRatingSelector';
import CharacterSelectorModal from './CharacterSelectorModal';
import { currentUser, characters as allCharacters } from '../mockData';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 01.75.75v8.25a.75.75 0 01-1.5 0V9.75a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>;
const FilmIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M19.5 6h-15v12h15V6zM3 6a1.5 1.5 0 011.5-1.5h15A1.5 1.5 0 0121 6v12a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 18V6z" /><path d="M5.25 7.5h1.5v1.5h-1.5v-1.5zM8.25 7.5h1.5v1.5h-1.5v-1.5zM11.25 7.5h1.5v1.5h-1.5v-1.5zM14.25 7.5h1.5v1.5h-1.5v-1.5zM17.25 7.5h1.5v1.5h-1.5v-1.5zM5.25 15h1.5v1.5h-1.5V15zM8.25 15h1.5v1.5h-1.5V15zM11.25 15h1.5v1.5h-1.5V15zM14.25 15h1.5v1.5h-1.5V15zM17.25 15h1.5v1.5h-1.5V15z" /></svg>;
const VideoCameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;

// --- Helper Form Components ---
const FormInput: React.FC<{ id: string; name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ id, name, label, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input type="text" id={id} name={name} value={value} onChange={onChange} className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
    </div>
);
const FormTextarea: React.FC<{ id: string; name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ id, name, label, value, onChange, rows = 3 }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <textarea id={id} name={name} value={value} onChange={onChange} rows={rows} className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" />
    </div>
);

// --- Section Components ---
const BlueprintSection: React.FC<{ partyData: Party; setPartyData: React.Dispatch<React.SetStateAction<Party>> }> = ({ partyData, setPartyData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentTag, setCurrentTag] = useState('');
    const [currentRole, setCurrentRole] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPartyData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setPartyData(prev => ({...prev, imageUrl: reader.result as string}));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = currentTag.trim();
            if (newTag && !(partyData.genreTags || []).includes(newTag)) {
                setPartyData(prev => ({ ...prev, genreTags: [...(prev.genreTags || []), newTag] }));
            }
            setCurrentTag('');
        }
    };
    
    const removeTag = (tagToRemove: string) => {
        setPartyData(prev => ({...prev, genreTags: (prev.genreTags || []).filter(tag => tag !== tagToRemove)}));
    };
    
    const handleRoleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newRole = currentRole.trim();
            if (newRole && !(partyData.castingCall || []).includes(newRole)) {
                setPartyData(prev => ({ ...prev, castingCall: [...(prev.castingCall || []), newRole] }));
            }
            setCurrentRole('');
        }
    };

    const removeRole = (roleToRemove: string) => {
        setPartyData(prev => ({ ...prev, castingCall: (prev.castingCall || []).filter(role => role !== roleToRemove) }));
    };

    return (
        <div className="space-y-6 p-4 md:p-8">
            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-violet-500/30 pb-2">Basic Info</h2>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <div onClick={() => fileInputRef.current?.click()} className="mt-2 flex justify-center rounded-lg border border-dashed border-violet-500/50 px-6 py-10 bg-gray-800/40 hover:border-violet-400 transition-colors cursor-pointer bg-cover bg-center" style={{backgroundImage: `url(${partyData.imageUrl})`}}>
                    {!partyData.imageUrl && <div className="text-center"><PhotoIcon /><div className="mt-4 flex text-sm text-gray-400"><p className="pl-1">Upload a file</p></div></div>}
                </div>
            </div>
            <FormInput id="name" name="name" label="Party Name / RP Title" value={partyData.name} onChange={handleInputChange} />
            <FormTextarea id="description" name="description" label="Description" value={partyData.description} onChange={handleInputChange} />
             <div className="flex items-center justify-between bg-gray-800/60 p-3 rounded-md">
                <label htmlFor="isPublic" className="text-sm font-medium text-gray-300">Publicly discoverable</label>
                <input type="checkbox" id="isPublic" checked={partyData.isPublic} onChange={(e) => setPartyData(prev => ({...prev, isPublic: e.target.checked}))} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-600" />
            </div>

            <h3 className="text-lg font-bold text-white mt-6">RP Details</h3>
            <div>
                <label htmlFor="rpFormat" className="block text-sm font-medium text-gray-300 mb-2">RP Format</label>
                <select id="rpFormat" name="rpFormat" value={partyData.rpFormat || 'Group'} onChange={handleInputChange} className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value="Group">Group RP</option>
                    <option value="1x1">1x1</option>
                    <option value="Open">Open World</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Genre Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {(partyData.genreTags || []).map(tag => (
                        <span key={tag} className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">
                            {tag}
                            <button onClick={() => removeTag(tag)} className="text-cyan-200 hover:text-white"><XMarkIcon /></button>
                        </span>
                    ))}
                </div>
                <input type="text" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Add tag..." className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Casting Call (Open Roles)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {(partyData.castingCall || []).map(role => (
                        <span key={role} className="flex items-center gap-1 bg-violet-500/20 text-violet-300 text-xs font-medium px-2.5 py-1 rounded-full">
                            {role}
                            <button onClick={() => removeRole(role)} className="text-violet-200 hover:text-white"><XMarkIcon /></button>
                        </span>
                    ))}
                </div>
                <input type="text" value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} onKeyDown={handleRoleKeyDown} placeholder="Add role..." className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white" />
            </div>

            <div className="pt-4 border-t border-violet-500/30">
                <ContentRatingSelector 
                    rating={partyData.contentMetadata?.ageRating || 'Everyone'}
                    setRating={(r) => setPartyData(p => ({...p, contentMetadata: {...(p.contentMetadata || { warnings: [] }), ageRating: r }}))}
                    warnings={partyData.contentMetadata?.warnings || []}
                    setWarnings={(w) => setPartyData(p => ({...p, contentMetadata: {...(p.contentMetadata || { ageRating: 'Everyone' }), warnings: w }}))}
                />
            </div>
        </div>
    );
};

const StageSetupSection: React.FC<{ partyData: Party; setPartyData: React.Dispatch<React.SetStateAction<Party>> }> = ({ partyData, setPartyData }) => {
    const [isCharSelectorOpen, setIsCharSelectorOpen] = useState(false);

    const setMode = (mode: 'social' | 'tabletop' | 'theatre' | 'live') => {
        setPartyData(prev => ({
            ...prev,
            stage: { ...prev.stage, mode }
        }));
    };

    const handleMapUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setPartyData(prev => ({
                        ...prev,
                        stage: { 
                            ...prev.stage, 
                            tabletop: { 
                                ...prev.stage.tabletop!, 
                                mapUrl: reader.result as string 
                            } 
                        }
                    }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const addToken = (charId: number) => {
        // Check if token already exists for this character
        const exists = partyData.stage.tabletop?.tokens.some(t => t.characterId === charId);
        
        if (!exists) {
            const newToken: Token = {
                instanceId: `t-${Date.now()}`,
                characterId: charId,
                x: 10, y: 10, // Start at 10, 10
                size: 1,
                currentHp: 20, maxHp: 20,
                conditions: []
            };

            setPartyData(prev => ({
                ...prev,
                stage: {
                    ...prev.stage,
                    tabletop: {
                        ...prev.stage.tabletop!,
                        tokens: [...(prev.stage.tabletop?.tokens || []), newToken]
                    }
                }
            }));
        }
        setIsCharSelectorOpen(false);
    };

    const removeToken = (charId: number) => {
        setPartyData(prev => ({
            ...prev,
            stage: {
                ...prev.stage,
                tabletop: {
                    ...prev.stage.tabletop!,
                    tokens: (prev.stage.tabletop?.tokens || []).filter(t => t.characterId !== charId)
                }
            }
        }));
    };

    const modes = [
        { id: 'social', label: 'Social / Moodboard', icon: <PhotoIcon />, desc: 'Share images and vibes' },
        { id: 'tabletop', label: 'Tabletop VTT', icon: <MapIcon />, desc: 'Grid map, tokens, dice' },
        { id: 'theatre', label: 'Theatre', icon: <FilmIcon />, desc: 'Watch video together' },
        { id: 'live', label: 'Live Stream', icon: <VideoCameraIcon />, desc: 'Broadcast camera/mic' },
    ];

    const tokens = partyData.stage.tabletop?.tokens || [];

    return (
        <div className="space-y-6 p-4 md:p-8">
            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-violet-500/30 pb-2">Stage Configuration</h2>
            
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Select Stage Mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {modes.map(mode => {
                        const isActive = partyData.stage.mode === mode.id;
                        return (
                            <button
                                key={mode.id}
                                onClick={() => setMode(mode.id as any)}
                                className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                                    isActive 
                                        ? 'bg-cyan-900/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                                        : 'bg-gray-800/40 border-transparent hover:bg-gray-800 hover:border-gray-600'
                                }`}
                            >
                                <div className={`p-3 rounded-lg ${isActive ? 'bg-cyan-500 text-black' : 'bg-gray-700 text-gray-400 group-hover:text-white group-hover:bg-gray-600'}`}>
                                    {mode.icon}
                                </div>
                                <div>
                                    <div className={`font-bold ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{mode.label}</div>
                                    <div className="text-xs text-gray-500 group-hover:text-gray-400">{mode.desc}</div>
                                </div>
                                {isActive && (
                                    <div className="absolute top-3 right-3 text-cyan-400 animate-fadeIn">
                                        <CheckCircleIcon />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {partyData.stage.mode === 'tabletop' && (
                <div className="bg-gray-800/40 p-6 rounded-xl border border-violet-500/20 animate-fadeIn space-y-6">
                    <div>
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <MapIcon /> Tabletop Settings
                        </h3>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Map Image</label>
                        <div className="flex flex-col gap-4">
                            <input type="file" onChange={handleMapUpload} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"/>
                            {partyData.stage.tabletop?.mapUrl ? (
                                <div className="relative rounded-lg overflow-hidden border border-gray-600">
                                    <img src={partyData.stage.tabletop.mapUrl} alt="Map Preview" className="w-full max-h-64 object-cover" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 text-center">Current Map</div>
                                </div>
                            ) : (
                                <div className="h-32 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center text-gray-500">
                                    No map uploaded
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-300">Initial Tokens</label>
                            <button onClick={() => setIsCharSelectorOpen(true)} className="text-xs text-cyan-400 hover:text-white flex items-center gap-1">
                                <PlusIcon /> Add Character
                            </button>
                        </div>
                        <div className="space-y-2">
                            {tokens.map(token => {
                                const char = allCharacters.find(c => c.id === token.characterId);
                                if (!char) return null;
                                return (
                                <div key={token.instanceId} className="flex items-center justify-between bg-black/30 p-2 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <UserAvatar src={char.imageUrl} size="8" />
                                        <span className="text-sm font-semibold text-white">{char.name}</span>
                                    </div>
                                    <button onClick={() => removeToken(char.id)} className="text-gray-500 hover:text-red-400">
                                        <XMarkIcon />
                                    </button>
                                </div>
                            )})}
                            {tokens.length === 0 && <p className="text-xs text-gray-500 italic">No tokens added yet.</p>}
                        </div>
                    </div>
                </div>
            )}

            {partyData.stage.mode === 'theatre' && (
                <div className="bg-gray-800/40 p-6 rounded-xl border border-violet-500/20 animate-fadeIn">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <FilmIcon /> Theatre Settings
                    </h3>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Video URL (YouTube/MP4)</label>
                    <input 
                        type="text" 
                        value={partyData.stage.theatre?.videoUrl || ''} 
                        onChange={(e) => setPartyData(prev => ({...prev, stage: {...prev.stage, theatre: { ...prev.stage.theatre!, videoUrl: e.target.value }}}))}
                        placeholder="https://..."
                        className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
            )}

            {isCharSelectorOpen && (
                <CharacterSelectorModal 
                    isOpen={isCharSelectorOpen}
                    onClose={() => setIsCharSelectorOpen(false)}
                    onSelect={addToken}
                    characters={allCharacters}
                    currentUser={currentUser}
                    selectedId={-1}
                />
            )}
        </div>
    );
};

const MembersSection: React.FC<{ partyData: Party }> = ({ partyData }) => {
    return (
        <div className="space-y-6 p-4 md:p-8">
            <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-violet-500/30 pb-2">Party Members</h2>
            <div className="space-y-2">
                {partyData.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between bg-gray-800/40 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            <UserAvatar src={member.avatarUrl} size="10" />
                            <div>
                                <p className="font-bold text-white">{member.name}</p>
                                <p className="text-xs text-gray-400">{member.isHost ? 'Host' : 'Member'}</p>
                            </div>
                        </div>
                        {/* Future: Add Kick/Ban buttons here */}
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Main Editor View ---

interface PartyEditorViewProps {
    partyData: Party;
    setPartyData: React.Dispatch<React.SetStateAction<Party>>;
    activeSection: PartyWorkshopSection;
    onBack?: () => void;
    onSave: () => void;
}

const PartyEditorView: React.FC<PartyEditorViewProps> = ({ partyData, setPartyData, activeSection, onBack, onSave }) => {
    
    const renderSection = () => {
        switch (activeSection) {
            case 'blueprint': return <BlueprintSection partyData={partyData} setPartyData={setPartyData} />;
            case 'stage': return <StageSetupSection partyData={partyData} setPartyData={setPartyData} />;
            case 'members': return <MembersSection partyData={partyData} />;
            default: return null;
        }
    };

    const sectionTitles: Record<PartyWorkshopSection, string> = {
        blueprint: 'Blueprint',
        stage: 'Stage Setup',
        members: 'Members',
    };

    return (
        <main className="flex-1 flex flex-col min-w-0 h-full bg-black/20">
            <header className="p-3 border-b border-violet-500/30 flex-shrink-0 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-grow min-w-0">
                    {onBack && (
                         <button onClick={onBack} className="flex items-center gap-1.5 text-white bg-gray-800/60 px-3 py-1.5 rounded-full hover:bg-gray-700/80 transition-colors">
                            <ArrowLeftIcon />
                            <span className="text-sm font-medium md:hidden">Back</span>
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-white truncate">{sectionTitles[activeSection]}</h2>
                </div>
                <button onClick={onSave} className="px-5 py-2 bg-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out">
                    Save Party
                </button>
            </header>

            <div className="flex-1 overflow-y-auto">
                {renderSection()}
            </div>
        </main>
    );
};

export default PartyEditorView;
