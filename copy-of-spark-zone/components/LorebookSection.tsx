import React, { useState, useMemo } from 'react';
import { World, WorldLoreEntry, WorldLoreCategory } from '../types';
import { GoogleGenAI } from '@google/genai';
import LightningBoltIcon from './icons/LightningBoltIcon';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;

const loreCategories: WorldLoreCategory[] = ['Location', 'Faction', 'Item', 'Character', 'Event', 'Concept'];

const LoreEntryEditor: React.FC<{
    entry: Omit<WorldLoreEntry, 'id'>;
    setEntry: React.Dispatch<React.SetStateAction<Omit<WorldLoreEntry, 'id'>>>;
    onSave: () => void;
    onCancel: () => void;
    world: World;
}> = ({ entry, setEntry, onSave, onCancel, world }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const generateDescription = async () => {
        if (!entry.name) {
            setError("Please enter a name for the lore entry first.");
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `You are a creative world-building assistant.
            For the world named "${world.name}", a ${world.genreTags.join(', ')} world with the synopsis: "${world.synopsis}".
            Generate a detailed, engaging, and creative lore description for a new entry.
            
            Category: ${entry.category}
            Name: ${entry.name}
            
            Write the description now:`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt
            });
            setEntry(prev => ({ ...prev, description: response.text }));
        } catch (err) {
            console.error("AI generation failed:", err);
            setError("Failed to generate description. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg border border-violet-500/30 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Entry Name (e.g., The Onyx Hand)" value={entry.name} onChange={(e) => setEntry(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-gray-800 border border-violet-500/30 rounded-md py-2 px-3 text-white" />
                <select value={entry.category} onChange={(e) => setEntry(prev => ({ ...prev, category: e.target.value as WorldLoreCategory }))} className="w-full bg-gray-800 border border-violet-500/30 rounded-md py-2 px-3 text-white">
                    {loreCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div className="relative">
                <textarea placeholder="Describe your lore entry..." value={entry.description} onChange={(e) => setEntry(prev => ({ ...prev, description: e.target.value }))} rows={6} className="w-full bg-gray-800 border border-violet-500/30 rounded-md py-2 px-3 text-white resize-none" />
                <button 
                    onClick={generateDescription}
                    disabled={isLoading}
                    className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-full border border-cyan-500/50 hover:bg-cyan-500/40 disabled:opacity-50 disabled:cursor-wait"
                >
                    <LightningBoltIcon className="w-4 h-4" />
                    {isLoading ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex justify-end gap-2">
                <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-700">Cancel</button>
                <button onClick={onSave} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-400">Save Entry</button>
            </div>
        </div>
    );
};

interface LorebookSectionProps {
    worldData: World;
    setWorldData: React.Dispatch<React.SetStateAction<World>>;
}

const LorebookSection: React.FC<LorebookSectionProps> = ({ worldData, setWorldData }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newEntry, setNewEntry] = useState<Omit<WorldLoreEntry, 'id'>>({ name: '', description: '', category: 'Concept' });

    const loreByCategory = useMemo(() => {
        return worldData.lorebook.reduce((acc, entry) => {
            if (!acc[entry.category]) acc[entry.category] = [];
            acc[entry.category].push(entry);
            return acc;
        }, {} as Record<WorldLoreCategory, WorldLoreEntry[]>);
    }, [worldData.lorebook]);
    
    const handleSaveNew = () => {
        const entryToAdd: WorldLoreEntry = { ...newEntry, id: Date.now() };
        setWorldData(prev => ({...prev, lorebook: [...prev.lorebook, entryToAdd]}));
        setNewEntry({ name: '', description: '', category: 'Concept' });
        setIsAdding(false);
    };
    
    const handleUpdate = () => {
        if (editingId === null) return;
        setWorldData(prev => ({
            ...prev,
            lorebook: prev.lorebook.map(entry => entry.id === editingId ? { ...newEntry, id: editingId } : entry)
        }));
        setEditingId(null);
        setNewEntry({ name: '', description: '', category: 'Concept' });
    }

    const handleEditClick = (entry: WorldLoreEntry) => {
        setEditingId(entry.id);
        setNewEntry(entry);
        setIsAdding(false);
    }

    const handleDelete = (id: number) => {
        setWorldData(prev => ({
            ...prev,
            lorebook: prev.lorebook.filter(entry => entry.id !== id)
        }));
    }

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setNewEntry({ name: '', description: '', category: 'Concept' });
    }
    
    return (
        <div className="space-y-6 p-4 md:p-8">
            <div className="flex justify-between items-center">
                 <div>
                    <h2 className="text-xl font-bold text-cyan-400">The Codex</h2>
                    <p className="text-sm text-gray-400">Flesh out the details that make your world unique.</p>
                </div>
                {!isAdding && editingId === null && (
                     <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-semibold rounded-full hover:bg-cyan-500/30 transition-colors text-sm">
                        <PlusIcon />
                        New Entry
                    </button>
                )}
            </div>

            {(isAdding || editingId !== null) && (
                <LoreEntryEditor 
                    entry={newEntry}
                    setEntry={setNewEntry}
                    onSave={editingId !== null ? handleUpdate : handleSaveNew}
                    onCancel={handleCancel}
                    world={worldData}
                />
            )}

            <div className="space-y-4">
                {loreCategories.map(category => (
                    loreByCategory[category] && (
                        <div key={category}>
                            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-2">{category}</h3>
                            <div className="space-y-2">
                                {loreByCategory[category].map(entry => (
                                    <details key={entry.id} className="bg-gray-800/60 p-3 rounded-lg border border-transparent hover:border-violet-500/30 transition-colors" open={editingId === entry.id}>
                                        <summary className="flex justify-between items-center cursor-pointer">
                                            <span className="font-semibold text-white">{entry.name}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={(e) => { e.preventDefault(); handleEditClick(entry); }} className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-violet-500/20"><EditIcon /></button>
                                                <button onClick={(e) => { e.preventDefault(); handleDelete(entry.id); }} className="p-1 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-500/20"><TrashIcon /></button>
                                            </div>
                                        </summary>
                                        <p className="text-sm text-gray-300 pt-3 mt-3 border-t border-violet-500/20 whitespace-pre-wrap">{entry.description}</p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )
                ))}
                {worldData.lorebook.length === 0 && !isAdding && (
                     <div className="text-center py-12 text-gray-500">
                        <p>Your lorebook is empty.</p>
                        <p className="text-sm">Click "New Entry" to start building your world's codex.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LorebookSection;