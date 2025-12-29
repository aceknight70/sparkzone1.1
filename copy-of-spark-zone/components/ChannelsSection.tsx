
import React, { useState, useRef } from 'react';
import { World, WorldLocation } from '../types';
import { GoogleGenAI, Modality } from '@google/genai';
import LightningBoltIcon from './icons/LightningBoltIcon';

// --- ICONS ---
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const MusicalNoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017c0-.428.267-.815.668-.964l10.5-3a.75.75 0 01.936.598z" clipRule="evenodd" /></svg>;

const ChannelEditor: React.FC<{
    channel: Partial<WorldLocation>;
    setChannel: React.Dispatch<React.SetStateAction<Partial<WorldLocation>>>;
    onSave: () => void;
    onCancel: () => void;
    world: World;
}> = ({ channel, setChannel, onSave, onCancel, world }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const backgroundFileRef = useRef<HTMLInputElement>(null);
    const iconFileRef = useRef<HTMLInputElement>(null);

    const generateImage = async (type: 'background' | 'icon') => {
        if (!channel.name) {
            setError("Please enter a name for the channel first.");
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            let prompt = '';
            
            if (type === 'background') {
                prompt = `Generate a background image for a role-playing scene.
                World Name: "${world.name}"
                World Genre: ${world.genreTags.join(', ')}.
                Channel Name: ${channel.name}.
                Channel Description: ${channel.description || 'A location in the world.'}.
                Atmospheric, detailed, cinematic landscape, no text.`;
            } else {
                prompt = `Generate a square icon or emblem for a location.
                World Genre: ${world.genreTags.join(', ')}.
                Channel Name: ${channel.name}.
                Symbolic, game icon style, high contrast, no text.`;
            }

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            
            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                    if (type === 'background') {
                        setChannel(prev => ({ ...prev, imageUrl }));
                    } else {
                        setChannel(prev => ({ ...prev, iconUrl: imageUrl }));
                    }
                    break;
                }
            }
        } catch (err) {
            console.error("AI generation failed:", err);
            setError("Failed to generate image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'icon') => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    if (type === 'background') {
                        setChannel(prev => ({ ...prev, imageUrl: reader.result as string }));
                    } else {
                        setChannel(prev => ({ ...prev, iconUrl: reader.result as string }));
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg border border-violet-500/30 space-y-4 my-2">
            <input type="text" placeholder="Channel Name" value={channel.name || ''} onChange={(e) => setChannel(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-gray-800 border border-violet-500/30 rounded-md py-2 px-3 text-white" />
            <textarea placeholder="Channel Description" value={channel.description || ''} onChange={(e) => setChannel(prev => ({ ...prev, description: e.target.value }))} rows={2} className="w-full bg-gray-800 border border-violet-500/30 rounded-md py-2 px-3 text-white resize-none" />
            
            <div className="relative">
                <label className="block text-xs font-medium text-gray-400 mb-1">Theme Song URL (YouTube/Audio)</label>
                <div className="flex items-center gap-2 bg-gray-800 border border-violet-500/30 rounded-md px-3 py-2">
                    <MusicalNoteIcon className="text-cyan-400 w-5 h-5 flex-shrink-0" />
                    <input 
                        type="text" 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        value={channel.themeSongUrl || ''} 
                        onChange={(e) => setChannel(prev => ({ ...prev, themeSongUrl: e.target.value }))} 
                        className="w-full bg-transparent text-white text-sm focus:outline-none" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Icon Upload/Generate */}
                <div className="col-span-1">
                    <label className="block text-xs font-medium text-gray-400 mb-2">Channel Icon</label>
                    <div className="aspect-square w-full rounded-md bg-gray-800 border border-violet-500/30 bg-cover bg-center relative group overflow-hidden" style={{ backgroundImage: channel.iconUrl ? `url(${channel.iconUrl})` : 'none' }}>
                        <input type="file" ref={iconFileRef} onChange={(e) => handleFileUpload(e, 'icon')} className="hidden" accept="image/*" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity p-2 gap-2">
                            <button onClick={() => iconFileRef.current?.click()} className="p-2 bg-white/10 rounded-full hover:bg-white/20" title="Upload">
                                <PhotoIcon />
                            </button>
                            <button onClick={() => generateImage('icon')} className="p-2 bg-cyan-500/20 text-cyan-300 rounded-full hover:bg-cyan-500/40" title="Generate AI Icon">
                                <LightningBoltIcon className="w-5 h-5" />
                            </button>
                        </div>
                        {!channel.iconUrl && <div className="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none">Icon</div>}
                    </div>
                </div>

                {/* Background Upload/Generate */}
                <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-2">Channel Background</label>
                    <div className="aspect-video w-full rounded-md bg-gray-800 border border-violet-500/30 bg-cover bg-center relative group overflow-hidden" style={{ backgroundImage: channel.imageUrl ? `url(${channel.imageUrl})` : 'none' }}>
                        <input type="file" ref={backgroundFileRef} onChange={(e) => handleFileUpload(e, 'background')} className="hidden" accept="image/*" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity p-2 gap-2">
                            <button onClick={() => backgroundFileRef.current?.click()} className="px-3 py-1.5 bg-white/10 rounded-md hover:bg-white/20 flex items-center gap-2 text-xs">
                                <PhotoIcon /> Upload
                            </button>
                            <button onClick={() => generateImage('background')} className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 rounded-md hover:bg-cyan-500/40 flex items-center gap-2 text-xs">
                                <LightningBoltIcon className="w-4 h-4" /> Generate AI Background
                            </button>
                        </div>
                        {!channel.imageUrl && <div className="absolute inset-0 flex items-center justify-center text-gray-600 pointer-events-none">Background</div>}
                    </div>
                </div>
            </div>

             {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex justify-end gap-2">
                <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-700">Cancel</button>
                <button onClick={onSave} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-400">Save Channel</button>
            </div>
        </div>
    );
};

interface ChannelsSectionProps {
    worldData: World;
    setWorldData: React.Dispatch<React.SetStateAction<World>>;
}

const ChannelsSection: React.FC<ChannelsSectionProps> = ({ worldData, setWorldData }) => {
    const [editingChannel, setEditingChannel] = useState<Partial<WorldLocation> | null>(null);
    const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleEditClick = (channel: WorldLocation, catIndex: number) => {
        setEditingChannel(channel);
        setEditingCategoryIndex(catIndex);
    };

    const handleSaveChannel = () => {
        if (!editingChannel || editingCategoryIndex === null) return;
        setWorldData(prev => {
            const newLocations = [...prev.locations];
            if (editingChannel.id) { // Editing existing
                const channels = newLocations[editingCategoryIndex].channels;
                const channelIndex = channels.findIndex(c => c.id === editingChannel.id);
                channels[channelIndex] = editingChannel as WorldLocation;
            } else { // Adding new
                newLocations[editingCategoryIndex].channels.push({
                    ...editingChannel,
                    id: Date.now(),
                    messages: []
                } as WorldLocation);
            }
            return { ...prev, locations: newLocations };
        });
        setEditingChannel(null);
        setEditingCategoryIndex(null);
    };

    const handleDeleteChannel = (channelId: number, catIndex: number) => {
        setWorldData(prev => {
            const newLocations = [...prev.locations];
            newLocations[catIndex].channels = newLocations[catIndex].channels.filter(c => c.id !== channelId);
            return { ...prev, locations: newLocations };
        });
    };
    
    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        setWorldData(prev => ({
            ...prev,
            locations: [...prev.locations, { category: newCategoryName.trim().toUpperCase(), channels: [] }]
        }));
        setNewCategoryName('');
    }

    return (
        <div className="space-y-6 p-4 md:p-8">
            <div>
                <h2 className="text-xl font-bold text-cyan-400">Channel Management</h2>
                <p className="text-sm text-gray-400">Organize your world into role-playing spaces.</p>
            </div>

            {worldData.locations.map((loc, catIndex) => (
                <div key={catIndex}>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-2">{loc.category}</h3>
                    <div className="space-y-2">
                        {loc.channels.map(channel => (
                            <div key={channel.id} className="bg-gray-800/60 p-3 rounded-lg flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    {channel.iconUrl ? (
                                        <img src={channel.iconUrl} alt="" className="w-10 h-10 rounded-md object-cover border border-gray-600" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 font-bold">#</div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-white">{channel.name}</p>
                                        <p className="text-xs text-gray-400 truncate max-w-xs">{channel.description}</p>
                                        {channel.themeSongUrl && <span className="text-[10px] text-cyan-400 flex items-center gap-1"><MusicalNoteIcon className="w-3 h-3" /> Music Set</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => handleEditClick(channel, catIndex)} className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-violet-500/20"><EditIcon /></button>
                                    <button onClick={() => handleDeleteChannel(channel.id, catIndex)} className="p-1 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/20"><TrashIcon /></button>
                                </div>
                            </div>
                        ))}
                        {editingCategoryIndex === catIndex && editingChannel && <ChannelEditor channel={editingChannel} setChannel={setEditingChannel} onSave={handleSaveChannel} onCancel={() => {setEditingChannel(null); setEditingCategoryIndex(null);}} world={worldData} />}
                        <button onClick={() => { setEditingCategoryIndex(catIndex); setEditingChannel({}); }} className="w-full text-left text-sm flex items-center gap-2 p-2 rounded-md text-cyan-400 hover:bg-cyan-500/10">
                            <PlusIcon /> Add Channel
                        </button>
                    </div>
                </div>
            ))}
            
            <div className="pt-4 border-t border-violet-500/30">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-2">New Category</h3>
                 <div className="flex gap-2">
                    <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g., THE CAPITAL CITY" className="flex-grow bg-gray-800 border border-violet-500/30 rounded-md py-2 px-3 text-white" />
                    <button onClick={handleAddCategory} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-400">Add</button>
                </div>
            </div>

        </div>
    );
};

export default ChannelsSection;
