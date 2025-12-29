
import React, { useState, useRef, useEffect } from 'react';
import { Character, AgeRating, ContentWarning, SparkElement, SparkCardType } from '../types';
import LightningBoltIcon from '../components/icons/LightningBoltIcon';
import CharacterAiGeneratorModal from '../components/CharacterAiGeneratorModal';
import ContentRatingSelector from '../components/ContentRatingSelector';
import { GoogleGenAI, Modality, Type } from '@google/genai';
import UserAvatar from '../components/UserAvatar';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-500"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const RectangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" /></svg>;
const MicrophoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" /><path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" /></svg>;
const SparkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902.848.137 1.705.248 2.57.331v3.443a.75.75 0 001.28.53l3.58-3.579a.78.78 0 01.527-.224 41.202 41.202 0 005.183-.5c1.437-.232 2.43-1.49 2.43-2.903V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zm0 7a1 1 0 100-2 1 1 0 000 2zM8 8a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const PaperAirplaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>;

// --- Helper Components ---

type KeyValue = { key: string; value: string };

const FormInput: React.FC<{ id: string; label: string; placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = 
({ id, label, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input type="text" id={id} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
    </div>
);

const FormTextarea: React.FC<{ id: string; label: string; placeholder?: string; value: string; rows?: number; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; extraAction?: React.ReactNode }> =
({ id, label, placeholder, value, rows=3, onChange, extraAction }) => (
    <div className="relative">
        <div className="flex justify-between items-center mb-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-300">{label}</label>
            {extraAction}
        </div>
        <textarea id={id} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
    </div>
);

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; rightContent?: React.ReactNode; }> = ({ title, children, isOpen, onToggle, rightContent }) => (
    <div className="border-b border-violet-500/30 last:border-b-0">
        <div 
            onClick={onToggle} 
            className="w-full flex justify-between items-center p-4 text-left hover:bg-violet-500/10 transition-colors cursor-pointer select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        >
            <h3 className="text-xl font-bold text-cyan-400">{title}</h3>
            <div className="flex items-center gap-4">
                {rightContent}
                <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </div>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[5000px]' : 'max-h-0'}`}>
            <div className="p-6 bg-black/20 space-y-6">
                {children}
            </div>
        </div>
    </div>
);

// --- MIRROR TEST COMPONENT ---
const MirrorTest: React.FC<{ character: Partial<Character> }> = ({ character }) => {
    const [messages, setMessages] = useState<{sender: 'user' | 'char', text: string}[]>([
        { sender: 'char', text: `(System) Mirror Test initialized. I am ready to embody ${character.name || 'this character'}.` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            // Build the dynamic persona prompt based on current form state
            const systemPrompt = `You are roleplaying as ${character.name}, also known as ${character.epithet}.
            Your core archetypes are: ${character.archetypeTags?.join(', ')}.
            Your personality description is: "${character.personality?.description}".
            Your specific traits are: ${character.personality?.traits?.map(t => `${t.name} (${t.value}%)`).join(', ')}.
            Your quirks are: ${character.personality?.quirks?.join(', ')}.
            
            Respond to the user in character. Keep it concise (under 2 sentences) for a chat preview.`;

            const chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction: systemPrompt }
            });

            // We are not maintaining full history in the API call for this simple test to save tokens/complexity, 
            // but we could. For now, a single turn or simple history is enough for a "mirror check".
            const response = await chat.sendMessage({ message: userMsg });
            
            if (response.text) {
                setMessages(prev => [...prev, { sender: 'char', text: response.text }]);
            }
        } catch (e) {
            console.error("Mirror Test Error", e);
            setMessages(prev => [...prev, { sender: 'char', text: "(System) Connection error. My spark flickered." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-black/60 rounded-xl border border-cyan-500/30 overflow-hidden flex flex-col h-96">
            <div className="bg-cyan-900/20 p-3 border-b border-cyan-500/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Mirror Test Protocol</span>
                </div>
                <button onClick={() => setMessages([])} className="text-xs text-gray-500 hover:text-white">Reset</button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        {m.sender === 'char' && <UserAvatar src={character.imageUrl} size="8" />}
                        <div className={`p-3 rounded-lg text-sm max-w-[80%] ${m.sender === 'user' ? 'bg-gray-700 text-white' : 'bg-cyan-900/40 text-cyan-100 border border-cyan-500/20'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <UserAvatar src={character.imageUrl} size="8" />
                        <div className="p-3 rounded-lg bg-cyan-900/40 border border-cyan-500/20 flex gap-1 items-center">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-gray-900/80 border-t border-cyan-500/30 flex gap-2">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={`Say something to ${character.name || 'them'}...`}
                    className="flex-grow bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                />
                <button onClick={handleSend} disabled={isLoading} className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg disabled:opacity-50">
                    <PaperAirplaneIcon />
                </button>
            </div>
        </div>
    );
};


const defaultCharacter: Partial<Character> = {
    type: 'Character',
    name: '',
    epithet: '',
    tagline: '',
    archetypeTags: [],
    imageUrl: 'https://images.unsplash.com/photo-1518584346522-3e3203b45e5a?q=80&w=800&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    appearance: '',
    physicalDetails: {},
    personality: {
        description: '',
        traits: [
            { name: 'Alignment', value: 50, labels: ['Lawful', 'Chaotic'] },
            { name: 'Social', value: 50, labels: ['Introvert', 'Extrovert'] },
            { name: 'Morality', value: 50, labels: ['Selfish', 'Altruistic'] },
            { name: 'Combat', value: 50, labels: ['Merciful', 'Ruthless'] },
        ],
        quirks: []
    },
    backstory: '',
    abilities: [],
    gallery: { images: [] },
    contentMetadata: { ageRating: 'Everyone', warnings: [] },
    voiceConfig: { voiceId: 'Kore', pitch: 1.0, style: 'Neutral' },
    clashConfig: undefined
};

const commonArchetypes = [
    'Hero', 'Villain', 'Anti-Hero', 'Rogue', 'Mage', 'Warrior', 'Healer', 
    'Support', 'Tank', 'Leader', 'Sidekick', 'Mentor', 'Chosen One', 
    'Rebel', 'Explorer', 'Scientist', 'Detective', 'Diplomat', 
    'Trickster', 'Guardian', 'Merchant', 'Mercenary', 'Pirate', 
    'Ninja', 'Samurai', 'Knight', 'Paladin', 'Bard', 'Druid', 
    'Monk', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard', 'Artificer',
    'Cyberpunk', 'Steampunk', 'Sci-Fi', 'Fantasy', 'Horror', 'Noir'
];

interface CharacterCreationPageProps {
    characterToEdit?: Character;
    onExit: () => void;
    onSave: (characterData: Omit<Character, 'id' | 'status'> | Character) => void;
}

const CharacterCreationPage: React.FC<CharacterCreationPageProps> = ({ characterToEdit, onExit, onSave }) => {
    const isEditing = !!characterToEdit;
    const [character, setCharacter] = useState<Partial<Character>>(
        characterToEdit ? { ...defaultCharacter, ...characterToEdit } : defaultCharacter
    );
    const [physicalDetails, setPhysicalDetails] = useState<KeyValue[]>(
        characterToEdit ? Object.entries(characterToEdit.physicalDetails || {}).map(([key, value]) => ({ key, value })) : []
    );
    const [openSections, setOpenSections] = useState<string[]>(['spark']);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isWritingBackstory, setIsWritingBackstory] = useState(false);
    const [isGeneratingStats, setIsGeneratingStats] = useState(false);
    
    // Mirror Test Modal State
    const [isMirrorTestOpen, setIsMirrorTestOpen] = useState(false);
    
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    // --- Tag Inputs ---
    const [currentArchetypeTag, setCurrentArchetypeTag] = useState('');
    const [currentQuirk, setCurrentQuirk] = useState('');
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    
    const filteredArchetypes = currentArchetypeTag 
        ? commonArchetypes.filter(t => 
            t.toLowerCase().includes(currentArchetypeTag.toLowerCase()) && 
            !(character.archetypeTags || []).includes(t)
          )
        : [];

    // --- Generic Handlers ---
    const handleNestedChange = <T,>(section: keyof Character, field: keyof T, value: any) => {
        setCharacter(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as object),
                [field]: value,
            }
        }));
    };
    
    const handleTraitChange = (index: number, newValue: number) => {
        const newTraits = [...(character.personality?.traits || [])];
        if (newTraits[index]) {
            newTraits[index] = { ...newTraits[index], value: newValue };
            handleNestedChange('personality', 'traits', newTraits);
        }
    };
    
    // --- Section Toggling ---
    const toggleSection = (sectionName: string) => {
        setOpenSections(prev => 
            prev.includes(sectionName)
                ? prev.filter(s => s !== sectionName)
                : [...prev, sectionName]
        );
    };

    // --- Tag Handlers ---
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, tagType: 'archetypeTags' | 'quirks') => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = (e.target as HTMLInputElement).value.trim();
            if (tagType === 'archetypeTags') {
                if (value && !(character.archetypeTags || []).includes(value)) {
                    setCharacter(p => ({ ...p, archetypeTags: [...(p.archetypeTags || []), value] }));
                }
                setCurrentArchetypeTag('');
                setShowTagSuggestions(false);
            } else if (tagType === 'quirks') {
                 if (value && !(character.personality?.quirks || []).includes(value)) {
                    handleNestedChange('personality', 'quirks', [...(character.personality?.quirks || []), value]);
                 }
                 setCurrentQuirk('');
            }
        }
    };

    const addTag = (tag: string) => {
        setCharacter(p => ({ ...p, archetypeTags: [...(p.archetypeTags || []), tag] }));
        setCurrentArchetypeTag('');
        setShowTagSuggestions(false);
    };

    const removeTag = (tagToRemove: string, tagType: 'archetypeTags' | 'quirks') => {
         if (tagType === 'archetypeTags') {
            setCharacter(p => ({...p, archetypeTags: (p.archetypeTags || []).filter(tag => tag !== tagToRemove)}));
         } else if (tagType === 'quirks') {
            handleNestedChange('personality', 'quirks', (character.personality?.quirks || []).filter(q => q !== tagToRemove));
         }
    };

    // --- Image Handlers ---
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, target: 'gallery' | 'avatar' | 'banner' = 'gallery') => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        
        if (target === 'gallery') {
            Array.from(files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        handleNestedChange('gallery', 'images', [...(character.gallery?.images || []), reader.result]);
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    if (target === 'avatar') {
                        setCharacter(prev => ({ ...prev, imageUrl: reader.result as string }));
                    } else if (target === 'banner') {
                        setCharacter(prev => ({ ...prev, bannerUrl: reader.result as string }));
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- AI Image Gen ---
    const handleGeneratePortrait = async () => {
        if (!character.name) {
            alert("Please name your character first.");
            return;
        }
        setIsGeneratingImage(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `A portrait of a character named ${character.name}, ${character.epithet}. 
            Description: ${character.appearance || 'A fantasy character'}. 
            Archetype: ${character.archetypeTags?.join(', ')}.
            High quality, detailed, digital art style.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });

            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                    handleNestedChange('gallery', 'images', [...(character.gallery?.images || []), imageUrl]);
                    if (character.imageUrl?.includes('unsplash')) {
                        setCharacter(prev => ({...prev, imageUrl}));
                    }
                    break;
                }
            }
        } catch (e) {
            console.error("Image Gen Failed", e);
            alert("Failed to generate image.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleAutoWriteBackstory = async () => {
        if (!character.name || !character.archetypeTags || character.archetypeTags.length === 0) {
            alert("Please add a name and some archetype tags first.");
            return;
        }
        setIsWritingBackstory(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Write a compelling backstory (approx 200 words) for a character named ${character.name}, known as ${character.epithet}.
            Archetypes: ${character.archetypeTags.join(', ')}.
            Traits: ${character.personality?.description || 'N/A'}.
            
            Focus on their origin, a key conflict, and their current motivation.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            if (response.text) {
                setCharacter(prev => ({ ...prev, backstory: response.text }));
            }
        } catch (e) {
            console.error("Backstory Gen Failed", e);
            alert("The bard is taking a break. (AI Error)");
        } finally {
            setIsWritingBackstory(false);
        }
    };

    const handleGenerateStats = async () => {
        if (!character.name) return alert("Character name required.");
        setIsGeneratingStats(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Generate RPG card stats for a character named ${character.name}, ${character.epithet}.
            Archetypes: ${character.archetypeTags?.join(', ')}.
            Description: ${character.personality?.description}.
            
            Return JSON with fields:
            - element (Solar, Lunar, Terra, Void, Neutral, Stellar)
            - class (Attack, Defense, Utility, Ultimate)
            - hp (20-50)
            - atk (1-10)
            - def (0-5)
            - specialAbility: { name, description }`;

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    element: { type: Type.STRING, enum: ['Solar', 'Lunar', 'Terra', 'Void', 'Neutral', 'Stellar'] },
                    class: { type: Type.STRING, enum: ['Attack', 'Defense', 'Utility', 'Ultimate'] },
                    hp: { type: Type.NUMBER },
                    atk: { type: Type.NUMBER },
                    def: { type: Type.NUMBER },
                    specialAbility: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING }
                        },
                        required: ['name', 'description']
                    }
                },
                required: ['element', 'class', 'hp', 'atk', 'def', 'specialAbility']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                }
            });

            const stats = JSON.parse(response.text);
            setCharacter(prev => ({ ...prev, clashConfig: stats }));

        } catch (e) {
            console.error("Stats Gen Failed", e);
            alert("Calculation failed.");
        } finally {
            setIsGeneratingStats(false);
        }
    };

    const handleSave = () => {
        if (!character.name) {
            alert("Character name is required.");
            toggleSection('spark');
            return;
        }
        
        const finalCharacterData = {
            ...character,
            physicalDetails: physicalDetails.reduce((acc, { key, value }) => {
                if (key) acc[key] = value;
                return acc;
            }, {} as { [key: string]: string }),
        };

        onSave(finalCharacterData as Character);
    };

    const handleAiGenerate = (data: { name: string; epithet: string; tagline: string; archetypeTags: string[] }) => {
        setCharacter(prev => ({...prev, ...data}));
    };

    const contentForAnalysis = `${character.backstory || ''} ${character.personality?.description || ''} ${character.tagline || ''}`;

    return (
        <div className="min-h-screen container mx-auto px-0 md:px-4 py-8 animate-fadeIn h-full overflow-y-auto pb-20 md:pb-4">
             <div className="flex items-center justify-between mb-6 px-4">
                <div className="flex items-center">
                    <button onClick={onExit} className="p-2 mr-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Back to workshop">
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-3xl font-bold text-white">{isEditing ? 'Character Workshop' : 'Create New Character'}</h1>
                </div>
                <button 
                    onClick={() => setIsMirrorTestOpen(!isMirrorTestOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold rounded-full shadow-lg hover:shadow-cyan-500/30 transition-all border border-white/20"
                >
                    <ChatBubbleIcon />
                    <span className="hidden md:inline">Test Drive</span>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* --- Main Form --- */}
                <div className="flex-1 bg-gray-900/50 border border-violet-500/30 rounded-lg overflow-hidden mb-16 lg:mb-0">
                    
                    {/* --- VISUAL IDENTITY --- */}
                    <div className="relative group">
                        <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />
                        <div 
                            onClick={() => bannerInputRef.current?.click()}
                            className="h-48 w-full bg-gray-800 bg-cover bg-center relative cursor-pointer group/banner" 
                            style={{ backgroundImage: `url(${character.bannerUrl || character.imageUrl})` }}
                        >
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/banner:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm flex items-center gap-2">
                                    <PhotoIcon className="w-4 h-4"/> Change Banner
                                </span>
                            </div>
                        </div>
                        
                        <div className="absolute -bottom-16 left-6 flex items-end">
                            <div className="relative group/avatar">
                                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
                                <div 
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden cursor-pointer relative"
                                >
                                    <img src={character.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                                        <PhotoIcon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="ml-4 mb-4 space-y-1">
                                <button 
                                    onClick={() => setIsAiModalOpen(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider rounded-full border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
                                >
                                    <LightningBoltIcon className="w-3 h-3" /> Generate Profile
                                </button>
                                {character.name && (
                                    <button 
                                        onClick={handleGeneratePortrait}
                                        disabled={isGeneratingImage}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider rounded-full border border-violet-500/30 hover:bg-violet-500/30 transition-colors disabled:opacity-50"
                                    >
                                        {isGeneratingImage ? 'Painting...' : 'Generate Portrait'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 px-6 pb-6 space-y-6">
                        
                        {/* --- NAME & IDENTITY --- */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormInput id="name" label="Character Name" placeholder="e.g., Kaelen" value={character.name || ''} onChange={(e) => setCharacter(p => ({...p, name: e.target.value}))} />
                            <FormInput id="epithet" label="Epithet (Title)" placeholder="e.g., the Shadow Rogue" value={character.epithet || ''} onChange={(e) => setCharacter(p => ({...p, epithet: e.target.value}))} />
                        </div>
                        <FormTextarea id="tagline" label="Tagline / Catchphrase" placeholder="e.g., Trust is a currency I don't spend." value={character.tagline || ''} rows={2} onChange={(e) => setCharacter(p => ({...p, tagline: e.target.value}))} />

                        {/* --- ACCORDION SECTIONS --- */}
                        <div className="space-y-1 border-t border-violet-500/30 pt-4">
                            
                            {/* 1. THE SPARK (Archetypes & Personality) */}
                            <AccordionItem title="The Spark" isOpen={openSections.includes('spark')} onToggle={() => toggleSection('spark')} rightContent={<LightningBoltIcon className="w-5 h-5 text-yellow-400"/>}>
                                <div className="space-y-6">
                                    {/* Soul Compass / Sliders */}
                                    <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                                        <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">Soul Compass</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            {character.personality?.traits.map((trait, index) => (
                                                <div key={index}>
                                                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-1">
                                                        <span>{trait.labels[0]}</span>
                                                        <span className="text-white">{trait.name}</span>
                                                        <span>{trait.labels[1]}</span>
                                                    </div>
                                                    <input 
                                                        type="range" 
                                                        min="0" max="100" 
                                                        value={trait.value} 
                                                        onChange={(e) => handleTraitChange(index, Number(e.target.value))}
                                                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Archetype Tags</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {character.archetypeTags?.map(tag => (
                                                <span key={tag} className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full border border-cyan-500/30">
                                                    {tag}
                                                    <button onClick={() => removeTag(tag, 'archetypeTags')} className="text-cyan-200 hover:text-white"><XMarkIcon /></button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                value={currentArchetypeTag} 
                                                onChange={(e) => { setCurrentArchetypeTag(e.target.value); setShowTagSuggestions(true); }} 
                                                onKeyDown={(e) => handleTagKeyDown(e, 'archetypeTags')}
                                                onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                                                placeholder="e.g., Hero, Rogue, Sci-Fi" 
                                                className="w-full bg-gray-800 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                                            />
                                            {showTagSuggestions && filteredArchetypes.length > 0 && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                                                    {filteredArchetypes.map(tag => (
                                                        <button key={tag} onClick={() => addTag(tag)} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <FormTextarea id="personalityDesc" label="Personality Description" placeholder="Describe their demeanor, fears, and motivations..." value={character.personality?.description || ''} rows={4} onChange={(e) => handleNestedChange('personality', 'description', e.target.value)} />
                                </div>
                            </AccordionItem>

                            {/* 2. BLUEPRINT (Physical & Backstory) */}
                            <AccordionItem title="Blueprint" isOpen={openSections.includes('blueprint')} onToggle={() => toggleSection('blueprint')} rightContent={<UserIcon />}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormInput id="age" label="Age" placeholder="e.g., 28" value={physicalDetails.find(p => p.key === 'Age')?.value || ''} onChange={(e) => {
                                        const newDetails = [...physicalDetails];
                                        const idx = newDetails.findIndex(p => p.key === 'Age');
                                        if (idx >= 0) newDetails[idx].value = e.target.value;
                                        else newDetails.push({ key: 'Age', value: e.target.value });
                                        setPhysicalDetails(newDetails);
                                    }} />
                                    <FormInput id="height" label="Height" placeholder="e.g., 6'1" value={physicalDetails.find(p => p.key === 'Height')?.value || ''} onChange={(e) => {
                                        const newDetails = [...physicalDetails];
                                        const idx = newDetails.findIndex(p => p.key === 'Height');
                                        if (idx >= 0) newDetails[idx].value = e.target.value;
                                        else newDetails.push({ key: 'Height', value: e.target.value });
                                        setPhysicalDetails(newDetails);
                                    }} />
                                </div>
                                <FormTextarea id="appearance" label="Full Description" placeholder="Paint a picture with words. Describe their physical traits, clothing style, aura, and distinctive features..." value={character.appearance || ''} rows={8} onChange={(e) => setCharacter(p => ({...p, appearance: e.target.value}))} />
                                
                                <FormTextarea 
                                    id="backstory" 
                                    label="Backstory" 
                                    placeholder="Where do they come from? What is their history?" 
                                    value={character.backstory || ''} 
                                    rows={6} 
                                    onChange={(e) => setCharacter(p => ({...p, backstory: e.target.value}))}
                                    extraAction={
                                        <button 
                                            onClick={handleAutoWriteBackstory}
                                            disabled={isWritingBackstory}
                                            className="text-xs flex items-center gap-1 text-cyan-400 hover:text-white disabled:opacity-50"
                                        >
                                            <LightningBoltIcon className={`w-3 h-3 ${isWritingBackstory ? 'animate-pulse' : ''}`}/>
                                            {isWritingBackstory ? 'Writing...' : 'Auto-Weave'}
                                        </button>
                                    }
                                />
                            </AccordionItem>

                            {/* 3. SONIC IDENTITY (Voice) */}
                            <AccordionItem title="Sonic Identity" isOpen={openSections.includes('voice')} onToggle={() => toggleSection('voice')} rightContent={<MicrophoneIcon />}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Voice Model</label>
                                        <select 
                                            value={character.voiceConfig?.voiceId || 'Kore'} 
                                            onChange={(e) => handleNestedChange('voiceConfig', 'voiceId', e.target.value)}
                                            className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        >
                                            <option value="Kore">Kore - Balanced</option>
                                            <option value="Fenrir">Fenrir - Deep</option>
                                            <option value="Puck">Puck - Energetic</option>
                                            <option value="Charon">Charon - Gravelly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Pitch Adjustment: {character.voiceConfig?.pitch || 1.0}</label>
                                        <input 
                                            type="range" 
                                            min="0.5" 
                                            max="2.0" 
                                            step="0.1"
                                            value={character.voiceConfig?.pitch || 1.0}
                                            onChange={(e) => handleNestedChange('voiceConfig', 'pitch', parseFloat(e.target.value))}
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>Deep</span>
                                            <span>Normal</span>
                                            <span>High</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-800/40 rounded-lg flex items-center justify-between border border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-0.5 items-end h-4">
                                            {[1,2,3,4,3,5,2,1].map((h, i) => (
                                                <div key={i} className="w-1 bg-cyan-500/50 rounded-t" style={{height: `${h*4}px`}}></div>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-300 italic">"Greetings, traveler."</span>
                                    </div>
                                    <button className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                                        Test
                                    </button>
                                </div>
                            </AccordionItem>

                            {/* 4. SPARK CLASH (Combat) */}
                            <AccordionItem title="Combat Matrix" isOpen={openSections.includes('clash')} onToggle={() => toggleSection('clash')} rightContent={<SparkIcon />}>
                                {character.clashConfig ? (
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <SparkIcon />
                                        </div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-lg font-bold text-white">{character.name}</h4>
                                                <p className="text-xs text-cyan-400 uppercase tracking-widest">{character.clashConfig.element} {character.clashConfig.class}</p>
                                            </div>
                                            <div className="text-2xl font-black text-yellow-500">{character.clashConfig.hp} HP</div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                            <div className="bg-black/30 p-2 rounded border border-white/5">
                                                <span className="text-gray-400 block text-xs uppercase">Attack</span>
                                                <span className="text-white font-bold">{character.clashConfig.atk}</span>
                                            </div>
                                            <div className="bg-black/30 p-2 rounded border border-white/5">
                                                <span className="text-gray-400 block text-xs uppercase">Defense</span>
                                                <span className="text-white font-bold">{character.clashConfig.def}</span>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 p-3 rounded border-l-2 border-cyan-500">
                                            <p className="text-xs font-bold text-cyan-300 uppercase mb-1">{character.clashConfig.specialAbility.name}</p>
                                            <p className="text-xs text-gray-300">{character.clashConfig.specialAbility.description}</p>
                                        </div>

                                        <button 
                                            onClick={handleGenerateStats}
                                            disabled={isGeneratingStats}
                                            className="w-full mt-4 py-2 text-xs text-gray-400 hover:text-white border border-dashed border-gray-600 hover:border-gray-400 rounded transition-colors"
                                        >
                                            {isGeneratingStats ? 'Recalculating...' : 'Regenerate Stats'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-black/20 rounded-lg border border-dashed border-gray-700">
                                        <p className="text-gray-400 mb-4">No combat data found.</p>
                                        <button 
                                            onClick={handleGenerateStats}
                                            disabled={isGeneratingStats}
                                            className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold rounded-full shadow-lg flex items-center gap-2 mx-auto disabled:opacity-50"
                                        >
                                            <LightningBoltIcon className={`w-4 h-4 ${isGeneratingStats ? 'animate-pulse' : ''}`} />
                                            {isGeneratingStats ? 'Calculating...' : 'Generate Card'}
                                        </button>
                                    </div>
                                )}
                            </AccordionItem>

                            {/* 5. ABILITIES */}
                            <AccordionItem title="Abilities" isOpen={openSections.includes('abilities')} onToggle={() => toggleSection('abilities')} rightContent={<RectangleIcon />}>
                                {character.abilities?.map((ability, index) => (
                                    <div key={index} className="bg-gray-800/50 p-3 rounded-md border border-gray-700 space-y-2 relative group">
                                        <button onClick={() => {
                                            const newAbilities = character.abilities?.filter((_, i) => i !== index);
                                            setCharacter(p => ({...p, abilities: newAbilities}));
                                        }} className="absolute top-2 right-2 text-gray-500 hover:text-red-400"><XMarkIcon /></button>
                                        <input 
                                            type="text" 
                                            value={ability.name} 
                                            onChange={(e) => {
                                                const newAbilities = [...(character.abilities || [])];
                                                newAbilities[index].name = e.target.value;
                                                setCharacter(p => ({...p, abilities: newAbilities}));
                                            }}
                                            placeholder="Ability Name" 
                                            className="w-full bg-transparent text-white font-bold border-b border-gray-600 focus:border-cyan-500 outline-none pb-1" 
                                        />
                                        <textarea 
                                            value={ability.description} 
                                            onChange={(e) => {
                                                const newAbilities = [...(character.abilities || [])];
                                                newAbilities[index].description = e.target.value;
                                                setCharacter(p => ({...p, abilities: newAbilities}));
                                            }}
                                            placeholder="Description..." 
                                            rows={2} 
                                            className="w-full bg-transparent text-sm text-gray-300 resize-none focus:outline-none" 
                                        />
                                    </div>
                                ))}
                                <button 
                                    onClick={() => setCharacter(p => ({...p, abilities: [...(p.abilities || []), { name: '', description: '' }] }))}
                                    className="w-full py-2 border-2 border-dashed border-gray-700 text-gray-400 rounded-md hover:border-cyan-500 hover:text-cyan-400 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    <PlusIcon /> Add Ability
                                </button>
                            </AccordionItem>

                            {/* 6. DEFENSE SYSTEM */}
                            <AccordionItem title="Defense System" isOpen={openSections.includes('defense')} onToggle={() => toggleSection('defense')} rightContent={<span className="text-xs text-gray-500 uppercase tracking-wider">Safety</span>}>
                                <ContentRatingSelector 
                                    rating={character.contentMetadata?.ageRating || 'Everyone'} 
                                    setRating={(r) => handleNestedChange('contentMetadata', 'ageRating', r)}
                                    warnings={character.contentMetadata?.warnings || []}
                                    setWarnings={(w) => handleNestedChange('contentMetadata', 'warnings', w)}
                                    contentToAnalyze={contentForAnalysis}
                                />
                            </AccordionItem>
                        </div>
                    </div>
                    
                    {/* Footer Actions */}
                    <div className="p-4 border-t border-violet-500/30 flex justify-end gap-4 bg-gray-900/80 backdrop-blur-sm sticky bottom-0 z-10">
                        <button onClick={onExit} className="px-6 py-2 text-gray-400 font-bold hover:text-white transition-colors">Cancel</button>
                        <button 
                            onClick={handleSave} 
                            className="px-8 py-2 bg-cyan-500 text-white font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-0.5 transition-all"
                        >
                            Save Character
                        </button>
                    </div>
                </div>

                {/* --- Live Mirror Test (Desktop Side / Mobile Modal) --- */}
                <div className={`
                    lg:w-80 flex-shrink-0 
                    ${isMirrorTestOpen ? 'fixed inset-0 z-50 p-4 bg-black/80 flex items-center justify-center lg:relative lg:inset-auto lg:bg-transparent lg:p-0 lg:flex lg:items-start lg:justify-start lg:block' : 'hidden lg:block'}
                `}>
                    <div className="w-full max-w-md lg:max-w-none">
                        <div className="lg:hidden flex justify-end mb-2">
                            <button onClick={() => setIsMirrorTestOpen(false)} className="text-white p-2 bg-gray-800 rounded-full"><XMarkIcon /></button>
                        </div>
                        <MirrorTest character={character} />
                        <p className="text-xs text-gray-500 mt-2 text-center hidden lg:block">Use this to test your character's voice as you build them.</p>
                    </div>
                </div>
            </div>

            <CharacterAiGeneratorModal 
                isOpen={isAiModalOpen} 
                onClose={() => setIsAiModalOpen(false)} 
                onGenerate={handleAiGenerate} 
            />
        </div>
    );
};

export default CharacterCreationPage;
