
import React, { useState, useRef } from 'react';
import { Story, Chapter, LoreEntry, UserCreation, User } from '../types';
import { allUsers, characters as allCharacters } from '../mockData';
import UserAvatar from './UserAvatar';
import CharacterSelectorModal from './CharacterSelectorModal';
import { GoogleGenAI, Modality } from '@google/genai';
import LightningBoltIcon from './icons/LightningBoltIcon';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const ChapterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const CastIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const LoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V2.75z" /><path fillRule="evenodd" d="M3.25 3A2.25 2.25 0 001 5.25v9.5A2.25 2.25 0 003.25 17h13.5A2.25 2.25 0 0019 14.75v-9.5A2.25 2.25 0 0016.75 3H3.25zM2.5 5.25c0-.414.336-.75.75-.75h13.5c.414 0 .75.336.75.75v9.5c0 .414-.336.75-.75.75H3.25c-.414 0-.75-.336-.75-.75v-9.5z" clipRule="evenodd" /></svg>;
const GearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;

// --- Sub-components for Tabs ---

const ChapterList: React.FC<{ 
    chapters: Chapter[], 
    activeChapterId: number | null, 
    onSelectChapter: (chapter: Chapter) => void,
    onStatusChange: (id: number, status: 'Draft' | 'Published') => void
}> = ({ chapters, activeChapterId, onSelectChapter, onStatusChange }) => (
    <nav className="flex-grow overflow-y-auto p-3 space-y-2">
        {chapters.map((chapter, index) => (
            <div 
                key={chapter.id} 
                onClick={() => onSelectChapter(chapter)}
                className={`relative group p-3 rounded-xl border-2 transition-all cursor-pointer shadow-sm
                    ${activeChapterId === chapter.id 
                        ? 'bg-cyan-900/20 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                        : 'bg-gray-800/40 border-transparent hover:bg-gray-800 hover:border-gray-600'
                    }`}
            >
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Chapter {index + 1}
                    </span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onStatusChange(chapter.id, chapter.status === 'Draft' ? 'Published' : 'Draft'); }}
                        className={`w-2 h-2 rounded-full ${chapter.status === 'Published' ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]' : 'bg-yellow-500'}`}
                        title={`Status: ${chapter.status}`}
                    />
                </div>
                <h3 className={`font-bold truncate ${activeChapterId === chapter.id ? 'text-white' : 'text-gray-300'}`}>
                    {chapter.title}
                </h3>
            </div>
        ))}
    </nav>
);

const CastList: React.FC<{
    cast: { characterId: number; role: string }[],
    coAuthorIds?: number[],
    onAdd: (id: number) => void,
    onRemove: (id: number) => void,
    onUpdateRole: (id: number, role: string) => void,
    userCreations: UserCreation[],
    currentUser: User
}> = ({ cast = [], coAuthorIds, onAdd, onRemove, onUpdateRole, userCreations, currentUser }) => {
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    const castDetails = (cast || []).map(c => {
        const char = allCharacters.find(char => char.id === c.characterId) || userCreations.find(uc => uc.id === c.characterId);
        return { ...c, character: char };
    }).filter(c => c.character);

    return (
        <div className="p-4 space-y-6">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400">Cast Members</h3>
                    <button onClick={() => setIsSelectorOpen(true)} className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors">
                        <PlusIcon />
                    </button>
                </div>
                
                <div className="space-y-3">
                    {castDetails.map(({ character, role, characterId }) => (
                        <div key={characterId} className="bg-gray-800/40 p-3 rounded-xl border border-white/5 group hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <UserAvatar src={character?.imageUrl} size="10" />
                                    <div>
                                        <p className="font-bold text-white text-sm">{character?.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">{character?.type === 'Character' ? 'OC' : 'NPC'}</p>
                                    </div>
                                </div>
                                <button onClick={() => onRemove(characterId)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrashIcon />
                                </button>
                            </div>
                            <input 
                                type="text" 
                                value={role} 
                                onChange={(e) => onUpdateRole(characterId, e.target.value)}
                                className="w-full bg-black/20 border border-transparent hover:border-gray-700 rounded px-2 py-1 text-xs text-cyan-300 focus:border-cyan-500 focus:outline-none transition-colors"
                                placeholder="Role (e.g. Protagonist)"
                            />
                        </div>
                    ))}
                    {castDetails.length === 0 && (
                        <p className="text-xs text-gray-500 text-center py-8 italic">No cast members added yet.</p>
                    )}
                </div>
            </div>

            <CharacterSelectorModal 
                isOpen={isSelectorOpen} 
                onClose={() => setIsSelectorOpen(false)} 
                onSelect={(id) => { onAdd(id); setIsSelectorOpen(false); }}
                characters={userCreations}
                currentUser={currentUser}
                selectedId={-1}
            />
        </div>
    );
};

const Lorebook: React.FC<{
    lorebook: LoreEntry[],
    customCategories?: string[],
    onAdd: (entry: Omit<LoreEntry, 'id'>) => void,
    onDelete: (id: number) => void
}> = ({ lorebook = [], customCategories = [], onAdd, onDelete }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newEntry, setNewEntry] = useState<Omit<LoreEntry, 'id'>>({ name: '', category: 'History', description: '', imageUrl: '', tags: [] });
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [currentTag, setCurrentTag] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const defaultCategories = ['History', 'Concept', 'Location', 'Item', 'Element', 'Faction', 'Creature', 'Phenomenon'];
    const allCategories = Array.from(new Set([...defaultCategories, ...customCategories]));

    const loreByCategory = (lorebook || []).reduce((acc, entry) => {
        const key = entry.category;
        if (!acc[key]) acc[key] = [];
        acc[key].push(entry);
        return acc;
    }, {} as Record<string, LoreEntry[]>);

    const handleSave = () => {
        if (!newEntry.name.trim()) return;
        onAdd(newEntry);
        setNewEntry({ name: '', category: 'History', description: '', imageUrl: '', tags: [] });
        setIsCreating(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewEntry(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const generateLoreContent = async (type: 'text' | 'image') => {
        if (!newEntry.name) return alert("Please enter a name first.");
        setIsAiGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            if (type === 'text') {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Write a short, engaging lore description for a "${newEntry.category}" named "${newEntry.name}". Keep it under 100 words.`
                });
                setNewEntry(prev => ({ ...prev, description: response.response.text() }));
            } else {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: { parts: [{ text: `Digital art of a ${newEntry.category} called ${newEntry.name}. ${newEntry.description || 'Fantasy style, high quality.'}` }] },
                    config: { responseModalities: [Modality.IMAGE] },
                });
                
                for (const part of response.candidates?.[0]?.content?.parts || []) {
                    if (part.inlineData) {
                        setNewEntry(prev => ({ ...prev, imageUrl: `data:image/png;base64,${part.inlineData.data}` }));
                        break;
                    }
                }
            }
        } catch (e) {
            console.error(e);
            alert("AI generation failed.");
        } finally {
            setIsAiGenerating(false);
        }
    };

    const addTag = () => {
        if (currentTag && !newEntry.tags?.includes(currentTag)) {
            setNewEntry(prev => ({ ...prev, tags: [...(prev.tags || []), currentTag] }));
            setCurrentTag('');
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400">Lorebook</h3>
                <button onClick={() => setIsCreating(!isCreating)} className="p-1 rounded-full bg-violet-500/20 text-violet-400 hover:bg-violet-500 hover:text-white transition-colors">
                    <PlusIcon />
                </button>
            </div>

            {isCreating && (
                <div className="bg-gray-800/80 border border-violet-500/30 p-4 rounded-xl space-y-4 animate-fadeIn shadow-lg relative z-10">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Entry Name" 
                            value={newEntry.name}
                            onChange={e => setNewEntry({...newEntry, name: e.target.value})}
                            className="flex-grow bg-black/40 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                        />
                        <select
                            value={newEntry.category}
                            onChange={e => setNewEntry({...newEntry, category: e.target.value})}
                            className="bg-black/40 border border-gray-600 rounded-lg px-2 py-2 text-sm text-gray-300 focus:border-violet-500 focus:outline-none"
                        >
                            {allCategories.map(cat => <option value={cat} key={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div className="relative group">
                        <textarea 
                            placeholder="Description..." 
                            value={newEntry.description}
                            onChange={e => setNewEntry({...newEntry, description: e.target.value})}
                            rows={3}
                            className="w-full bg-black/40 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-violet-500 focus:outline-none resize-none"
                        />
                        <button 
                            onClick={() => generateLoreContent('text')}
                            disabled={isAiGenerating || !newEntry.name}
                            className="absolute top-2 right-2 p-1 text-violet-400 hover:text-white disabled:opacity-30"
                            title="Generate Description"
                        >
                            <LightningBoltIcon className={`w-4 h-4 ${isAiGenerating ? 'animate-pulse' : ''}`} />
                        </button>
                    </div>

                    <div className="flex items-start gap-4">
                        <div 
                            className="w-16 h-16 bg-black/40 rounded-lg border border-gray-600 flex items-center justify-center cursor-pointer hover:border-violet-500 overflow-hidden relative group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {newEntry.imageUrl ? (
                                <img src={newEntry.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <PhotoIcon className="text-gray-600" />
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-[8px] text-white font-bold">UPLOAD</span>
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        
                        <div className="flex-grow space-y-2">
                            <button 
                                onClick={() => generateLoreContent('image')}
                                disabled={isAiGenerating || !newEntry.name}
                                className="w-full flex items-center justify-center gap-2 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded text-xs text-violet-300 hover:bg-violet-500/20 transition-colors disabled:opacity-50"
                            >
                                <LightningBoltIcon className="w-3 h-3" /> Generate Image
                            </button>
                            <div className="flex items-center gap-2 bg-black/40 rounded border border-gray-600 px-2 py-1">
                                <input 
                                    type="text" 
                                    value={currentTag} 
                                    onChange={(e) => setCurrentTag(e.target.value)} 
                                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                    placeholder="Add tag..." 
                                    className="bg-transparent text-xs text-white w-full outline-none" 
                                />
                                <button onClick={addTag} className="text-gray-400 hover:text-white"><PlusIcon /></button>
                            </div>
                        </div>
                    </div>

                    {newEntry.tags && newEntry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {newEntry.tags.map(tag => (
                                <span key={tag} className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    {tag} <button onClick={() => setNewEntry(p => ({...p, tags: p.tags?.filter(t => t !== tag)}))} className="hover:text-white">×</button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                        <button onClick={() => setIsCreating(false)} className="text-xs text-gray-400 hover:text-white px-2">Cancel</button>
                        <button onClick={handleSave} className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-md hover:bg-violet-500 font-bold">Save Entry</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {Object.entries(loreByCategory).map(([category, entries]) => (
                    <div key={category}>
                        <h4 className="font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-2 pl-1">{category}</h4>
                        <div className="space-y-1">
                            {(entries as LoreEntry[]).map(entry => (
                                <div key={entry.id} className="group bg-gray-800/30 hover:bg-gray-800/60 p-2 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-white/5 flex gap-3">
                                    {entry.imageUrl && (
                                        <img src={entry.imageUrl} className="w-10 h-10 rounded object-cover border border-white/10 flex-shrink-0" />
                                    )}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start">
                                            <span className="font-semibold text-gray-200 text-sm truncate">{entry.name}</span>
                                            <button onClick={() => onDelete(entry.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{entry.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StorySettings: React.FC<{ story: Story, onUpdate: (updates: Partial<Story>) => void }> = ({ story, onUpdate }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentTag, setCurrentTag] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    onUpdate({ imageUrl: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = currentTag.trim();
            if (newTag && !(story.genreTags || []).includes(newTag)) {
                onUpdate({ genreTags: [...(story.genreTags || []), newTag] });
            }
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        onUpdate({ genreTags: (story.genreTags || []).filter(tag => tag !== tagToRemove) });
    };

    return (
        <div className="p-4 space-y-6">
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Story Banner</label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/40 hover:border-violet-500/50 hover:bg-gray-800/60 transition-all cursor-pointer bg-cover bg-center flex items-center justify-center group relative overflow-hidden"
                    style={{ backgroundImage: `url(${story.imageUrl})` }}
                >
                    {!story.imageUrl && (
                        <div className="text-center">
                            <PhotoIcon />
                            <span className="text-xs text-gray-400 mt-1 block">Upload</span>
                        </div>
                    )}
                    {story.imageUrl && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <PhotoIcon className="text-white w-8 h-8" />
                        </div>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Title</label>
                <input 
                    type="text" 
                    value={story.name} 
                    onChange={(e) => onUpdate({ name: e.target.value })} 
                    className="w-full bg-gray-800/60 border border-gray-700 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Synopsis</label>
                <textarea 
                    value={story.synopsis} 
                    onChange={(e) => onUpdate({ synopsis: e.target.value })} 
                    rows={4}
                    className="w-full bg-gray-800/60 border border-gray-700 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none" 
                />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {(story.genreTags as string[] || []).map(tag => (
                        <span key={tag} className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-cyan-500/30">
                            {tag}
                            <button onClick={() => removeTag(tag)} className="text-cyan-200 hover:text-white"><XMarkIcon /></button>
                        </span>
                    ))}
                </div>
                <input 
                    type="text" 
                    value={currentTag} 
                    onChange={(e) => setCurrentTag(e.target.value)} 
                    onKeyDown={handleTagKeyDown}
                    placeholder="Add tag..."
                    className="w-full bg-gray-800/60 border border-gray-700 rounded-md py-1.5 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                />
            </div>
        </div>
    );
};

// --- Main Sidebar Component ---

interface StoryOutlineSidebarProps {
    story: Story;
    activeChapterId: number | null;
    onSelectChapter: (chapter: Chapter) => void;
    onAddChapter: () => void;
    onExit: () => void;
    onChapterStatusChange: (chapterId: number, status: 'Draft' | 'Published') => void;
    onStoryUpdate: (updates: Partial<Story>) => void;
    onAddCastMember: (characterId: number) => void;
    onRemoveCastMember: (characterId: number) => void;
    onUpdateCastRole: (characterId: number, role: string) => void;
    onAddLore: (entry: Omit<LoreEntry, 'id'>) => void;
    onDeleteLore: (id: number) => void;
    userCreations: UserCreation[];
    currentUser: User;
}

const StoryOutlineSidebar: React.FC<StoryOutlineSidebarProps> = ({ 
    story, activeChapterId, onSelectChapter, onAddChapter, onExit, 
    onChapterStatusChange, onStoryUpdate, onAddCastMember, onRemoveCastMember, onUpdateCastRole,
    onAddLore, onDeleteLore, userCreations, currentUser
}) => {
    const [activeTab, setActiveTab] = useState<'chapters' | 'cast' | 'lorebook' | 'settings'>('chapters');

    const TabButton = ({ tab, icon, label }: { tab: string, icon: any, label: string }) => (
        <button 
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 transition-colors duration-200 relative group
                ${activeTab === tab ? 'text-cyan-400' : 'text-gray-500 hover:text-gray-300'}
            `}
        >
            <div className={`p-1.5 rounded-lg transition-colors ${activeTab === tab ? 'bg-cyan-500/10' : 'group-hover:bg-white/5'}`}>
                {icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            {activeTab === tab && <div className="absolute bottom-0 w-8 h-0.5 bg-cyan-400 rounded-full"></div>}
        </button>
    );

    return (
        <aside className="w-full md:w-80 flex-shrink-0 bg-gray-900/95 backdrop-blur-md border-r border-white/5 flex flex-col h-full shadow-2xl z-20">
            <header className="p-4 border-b border-white/5 flex justify-between items-center flex-shrink-0 bg-black/20">
                <div className="flex items-center gap-3 min-w-0">
                    <button onClick={onExit} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors shadow-sm" title="Exit Workshop">
                        <ArrowLeftIcon />
                    </button>
                    <div>
                        <h1 className="text-sm font-bold text-white truncate max-w-[150px]">{story.name}</h1>
                        <p className="text-xs text-gray-500">Story Workshop</p>
                    </div>
                </div>
                
                {activeTab === 'chapters' && (
                    <button 
                        onClick={onAddChapter}
                        className="p-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-105"
                        title="New Chapter"
                    >
                        <PlusIcon />
                    </button>
                )}
            </header>

            <div className="flex border-b border-white/5 flex-shrink-0 bg-black/20">
                <TabButton tab="chapters" icon={<ChapterIcon />} label="Chapters" />
                <TabButton tab="cast" icon={<CastIcon />} label="Cast" />
                <TabButton tab="lorebook" icon={<LoreIcon />} label="Lore" />
                <TabButton tab="settings" icon={<GearIcon />} label="Setup" />
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar bg-gradient-to-b from-gray-900/50 to-transparent">
                {activeTab === 'chapters' && (
                    <ChapterList 
                        chapters={story.chapters} 
                        activeChapterId={activeChapterId} 
                        onSelectChapter={onSelectChapter} 
                        onStatusChange={onChapterStatusChange}
                    />
                )}
                {activeTab === 'cast' && (
                    <CastList 
                        cast={story.cast || []} // Defensive: ensure cast is at least an empty array
                        coAuthorIds={story.coAuthorIds} 
                        onAdd={onAddCastMember} 
                        onRemove={onRemoveCastMember} 
                        onUpdateRole={onUpdateCastRole}
                        userCreations={userCreations}
                        currentUser={currentUser}
                    />
                )}
                {activeTab === 'lorebook' && (
                    <Lorebook 
                        lorebook={story.lorebook || []} // Defensive: ensure lorebook is at least an empty array
                        onAdd={onAddLore} 
                        onDelete={onDeleteLore} 
                    />
                )}
                {activeTab === 'settings' && (
                    <StorySettings 
                        story={story} 
                        onUpdate={onStoryUpdate} 
                    />
                )}
            </div>
        </aside>
    );
};

export default StoryOutlineSidebar;
