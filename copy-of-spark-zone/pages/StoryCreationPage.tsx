
import React, { useState, useRef } from 'react';
import { Story, AgeRating, ContentWarning, UserCreation, User, StoryCharacter } from '../types';
import ContentRatingSelector from '../components/ContentRatingSelector';
import { GoogleGenAI, Modality } from '@google/genai';
import LightningBoltIcon from '../components/icons/LightningBoltIcon';
import UserAvatar from '../components/UserAvatar';
import CharacterSelectorModal from '../components/CharacterSelectorModal';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-500"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const SwatchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 00-3.471 2.987 10.04 10.04 0 014.815 4.815 18.748 18.748 0 002.987-3.472l3.386-5.079A1.902 1.902 0 0020.599 1.5zm-8.3 14.025a18.76 18.76 0 001.885.955 6.502 6.502 0 00-3.76 1.777l-.922.921a4.857 4.857 0 00-.883 2.627 3.238 3.238 0 00.913 2.296.75.75 0 001.205-.623c.1-.84.445-1.628.986-2.262L14.73 18.2a18.76 18.76 0 00-2.43 1.325zM12 9.015a11.53 11.53 0 01-3.327-.292 2.234 2.234 0 00-1.922 2.824 13.567 13.567 0 002.392 3.864 13.57 13.57 0 003.863 2.392 2.234 2.234 0 002.824-1.922A11.532 11.532 0 0112 9.015z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const MagicWandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 1c3.866 0 7 1.79 7 4s-3.134 4-7 4-7-1.79-7-4 3.134-4 7-4zm5.694 8.13c.464-.264.91-.583 1.306-.952V10c0 2.21-3.134 4-7 4s-7-1.79-7-4V8.178c.396.37.842.688 1.306.953C5.838 10.006 7.854 10.5 10 10.5s4.162-.494 5.694-1.37z" clipRule="evenodd" /><path d="M5.5 4C6.328 4 7 4.672 7 5.5S6.328 7 5.5 7 4 6.328 4 5.5 4.672 4 5.5 4zM10 4c.828 0 1.5.672 1.5 1.5S10.828 7 10 7s-1.5-.672-1.5-1.5S9.172 4 10 4zM14.5 4c.828 0 1.5.672 1.5 1.5S15.328 7 14.5 7 13 6.328 13 5.5 13.672 4 14.5 4z" /></svg>;

interface StoryCreationPageProps {
    onExit: () => void;
    onCreate: (newStory: Omit<Story, 'id' | 'status' | 'chapters'>) => void;
    userCreations: UserCreation[];
    currentUser: User;
    initialData?: { synopsis?: string };
}

const FormInput: React.FC<{ id: string; label: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; extraAction?: React.ReactNode }> = 
({ id, label, placeholder, value, onChange, extraAction }) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-300">{label}</label>
            {extraAction}
        </div>
        <input
            type="text"
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
    </div>
);

const FormTextarea: React.FC<{ id: string; label: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; extraAction?: React.ReactNode }> =
({ id, label, placeholder, value, onChange, extraAction }) => (
    <div className="relative">
        <div className="flex justify-between items-center mb-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-300">{label}</label>
            {extraAction}
        </div>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
        />
    </div>
);


const StoryCreationPage: React.FC<StoryCreationPageProps> = ({ onExit, onCreate, userCreations, currentUser, initialData }) => {
    const [title, setTitle] = useState('');
    const [synopsis, setSynopsis] = useState(initialData?.synopsis || '');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [ageRating, setAgeRating] = useState<AgeRating>('Everyone');
    const [warnings, setWarnings] = useState<ContentWarning[]>([]);
    const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop');
    
    const [tone, setTone] = useState('Epic');
    const [selectedCast, setSelectedCast] = useState<number[]>([]);
    const [isCastSelectorOpen, setIsCastSelectorOpen] = useState(false);
    
    const [isGeneratingCover, setIsGeneratingCover] = useState(false);
    const [isBrainstorming, setIsBrainstorming] = useState(false);
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
    const [generatedHooks, setGeneratedHooks] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const userCharacters = userCreations.filter(c => c.type === 'Character' || c.type === 'AI Character');

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = currentTag.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setCurrentTag('');
        }
    };
    
    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleCreate = () => {
        if (!title) {
            alert("Story title is required.");
            return;
        }
        
        const initialCast: StoryCharacter[] = selectedCast.map(id => ({
            characterId: id,
            role: 'Protagonist' 
        }));

        onCreate({
            type: 'Story',
            name: title,
            synopsis,
            genreTags: tags,
            mainCharacterIds: selectedCast, 
            imageUrl: coverUrl,
            cast: initialCast,
            lorebook: [],
            contentMetadata: {
                ageRating,
                warnings
            }
        });
    };

    const handleBrainstorm = async () => {
        if (!tags.length && !title) return alert("Add a title or genre tags to brainstorm.");
        setIsBrainstorming(true);
        setGeneratedHooks([]);
        
        try {
             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
             const prompt = `Generate 3 intriguing, short plot hooks (1-2 sentences each) for a ${tags.join(', ')} story titled "${title || 'Untitled'}". 
             Tone: ${tone}.
             Format: Just the hooks, separated by newlines.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            if (response.text) {
                const hooks = response.text.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^[\d-.*]+ /, ''));
                setGeneratedHooks(hooks.slice(0, 3));
            }
        } catch (e) {
            console.error("Brainstorm failed", e);
        } finally {
            setIsBrainstorming(false);
        }
    };

    const handleGenerateTitle = async () => {
        if (!synopsis) return alert("Please enter a synopsis first.");
        setIsGeneratingTitle(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Generate a creative and catchy title for a story with this synopsis: "${synopsis}". 
            Genre: ${tags.join(', ')}. 
            Tone: ${tone}.
            Return ONLY the title.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            if (response.text) {
                setTitle(response.text.trim().replace(/^"|"$/g, ''));
            }
        } catch (e) {
            console.error("Title gen failed", e);
        } finally {
            setIsGeneratingTitle(false);
        }
    };

    const handleGenerateCover = async () => {
        if (!title) {
            alert("Please enter a title first.");
            return;
        }
        setIsGeneratingCover(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Book cover art for a story titled "${title}". 
            Genre: ${tags.join(', ')}. 
            Tone: ${tone}.
            Synopsis: ${synopsis || 'A mysterious adventure'}. 
            Cinematic, atmospheric, digital art, no text.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });

            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                    setCoverUrl(imageUrl);
                    break;
                }
            }
        } catch (e) {
            console.error("Cover Gen Failed", e);
            alert("Failed to generate cover.");
        } finally {
            setIsGeneratingCover(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setCoverUrl(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleCharacter = (id: number) => {
        setSelectedCast(prev => prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]);
    };

    return (
        <div className="fixed inset-0 z-[60] bg-[#050505] overflow-y-auto">
            <div className="min-h-screen container mx-auto px-4 py-8 animate-fadeIn pb-20">
                 <div className="flex items-center mb-6">
                    <button onClick={onExit} className="p-2 mr-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Back to workshop">
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-3xl font-bold text-white">Forge a New Saga</h1>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* --- Left Column: Story Details --- */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6 relative overflow-hidden">
                            <h2 className="text-xl font-bold text-cyan-400 mb-6 border-b border-violet-500/30 pb-4">The Foundation</h2>
                            
                            <div className="space-y-6">
                                <FormInput 
                                    id="story-title" 
                                    label="Story Title" 
                                    placeholder="The Serpent's Heir" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    extraAction={
                                        <button 
                                            onClick={handleGenerateTitle}
                                            disabled={isGeneratingTitle || !synopsis}
                                            className="text-xs flex items-center gap-1 text-cyan-400 hover:text-white disabled:opacity-50 transition-colors"
                                            title="Generate title from synopsis"
                                        >
                                            <MagicWandIcon />
                                            {isGeneratingTitle ? 'Generating...' : 'Suggest Title'}
                                        </button>
                                    }
                                />
                                
                                <div>
                                    <label htmlFor="story-tags" className="block text-sm font-medium text-gray-300 mb-2">Genre Tags</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {tags.map(tag => (
                                            <span key={tag} className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full border border-cyan-500/30">
                                                {tag}
                                                <button onClick={() => removeTag(tag)} className="text-cyan-200 hover:text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M2.22 2.22a.75.75 0 011.06 0L8 7.94l4.72-4.72a.75.75 0 111.06 1.06L9.06 8l4.72 4.72a.75.75 0 11-1.06 1.06L8 9.06l-4.72 4.72a.75.75 0 01-1.06-1.06L6.94 8 2.22 3.28a.75.75 0 010-1.06z" /></svg>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        id="story-tags"
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        placeholder="e.g., Fantasy, Mystery, Cyberpunk"
                                        className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>

                                <FormTextarea 
                                    id="story-synopsis" 
                                    label="Synopsis / Premise" 
                                    placeholder="A short summary of the conflict." 
                                    value={synopsis} 
                                    onChange={(e) => setSynopsis(e.target.value)}
                                    extraAction={
                                        <button 
                                            onClick={handleBrainstorm}
                                            disabled={isBrainstorming}
                                            className="text-xs flex items-center gap-1 text-yellow-400 hover:text-yellow-300 disabled:opacity-50 transition-colors"
                                        >
                                            <SparklesIcon />
                                            {isBrainstorming ? 'Thinking...' : 'Brainstorm'}
                                        </button>
                                    }
                                />

                                {/* Generated Hooks */}
                                {generatedHooks.length > 0 && (
                                    <div className="space-y-2 mt-2 animate-fadeIn">
                                        <p className="text-xs text-gray-400 font-bold uppercase">AI Suggestions:</p>
                                        {generatedHooks.map((hook, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setSynopsis(hook)}
                                                className="w-full text-left p-3 rounded-md bg-white/5 hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-colors border border-transparent hover:border-violet-500/30"
                                            >
                                                {hook}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cast Selection */}
                        <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4 border-b border-violet-500/30 pb-4">
                                <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                                    <UserGroupIcon /> The Cast
                                </h2>
                                <button onClick={() => setIsCastSelectorOpen(true)} className="flex items-center gap-1 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-full transition-colors">
                                    <PlusIcon /> Add Character
                                </button>
                            </div>
                            
                            {selectedCast.length > 0 ? (
                                <div className="flex flex-wrap gap-4">
                                    {selectedCast.map(id => {
                                        const char = userCharacters.find(c => c.id === id);
                                        if (!char) return null;
                                        return (
                                            <div key={id} className="relative group">
                                                <div className="w-16 h-16 rounded-full border-2 border-violet-500 overflow-hidden">
                                                    <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                                                </div>
                                                <button 
                                                    onClick={() => toggleCharacter(id)}
                                                    className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <TrashIcon />
                                                </button>
                                                <p className="text-xs text-center mt-1 text-gray-300 w-16 truncate">{char.name}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
                                    <p>No protagonists selected.</p>
                                    <button onClick={() => setIsCastSelectorOpen(true)} className="text-cyan-400 hover:underline text-sm mt-1">Select from your characters</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Right Column: Visuals & Settings --- */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Visuals Card */}
                        <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                             <h2 className="text-lg font-bold text-white mb-4">Visuals & Tone</h2>
                             
                             <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                    <SwatchIcon /> Atmosphere
                                </label>
                                <select 
                                    value={tone} 
                                    onChange={(e) => setTone(e.target.value)}
                                    className="w-full bg-black/40 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-cyan-500"
                                >
                                    {['Epic', 'Dark', 'Whimsical', 'Gritty', 'Romantic', 'Horror', 'Cyberpunk', 'Mystery'].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                             </div>

                             <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Art</label>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                <div className="relative group rounded-lg overflow-hidden border-2 border-gray-700 hover:border-violet-500 transition-colors aspect-[2/3] bg-black/40">
                                    <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <button 
                                            onClick={handleGenerateCover}
                                            disabled={isGeneratingCover}
                                            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-full flex items-center gap-2 disabled:opacity-50"
                                        >
                                            <LightningBoltIcon className={`w-3 h-3 ${isGeneratingCover ? 'animate-pulse' : ''}`} />
                                            {isGeneratingCover ? 'Painting...' : 'Generate AI'}
                                        </button>
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full flex items-center gap-2 border border-white/20"
                                        >
                                            <PhotoIcon className="w-3 h-3" />
                                            Upload
                                        </button>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <ContentRatingSelector 
                            rating={ageRating} 
                            setRating={setAgeRating} 
                            warnings={warnings} 
                            setWarnings={setWarnings} 
                            contentToAnalyze={synopsis}
                        />
                        
                        <button 
                            onClick={handleCreate}
                            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all"
                        >
                            Initialize Story
                        </button>
                    </div>
                </div>

                {/* Character Selector Modal */}
                <CharacterSelectorModal 
                    isOpen={isCastSelectorOpen}
                    onClose={() => setIsCastSelectorOpen(false)}
                    characters={userCharacters}
                    currentUser={currentUser}
                    selectedIds={selectedCast} 
                    onSelect={toggleCharacter}
                />
            </div>
        </div>
    );
};

export default StoryCreationPage;
