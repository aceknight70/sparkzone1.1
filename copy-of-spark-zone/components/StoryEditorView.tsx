
import React, { useMemo, useRef, useState } from 'react';
import { Chapter, StoryCharacter, Character, LoreEntry, ChapterVisual } from '../types';
import { characters as allCharacters } from '../mockData';
import UserAvatar from './UserAvatar';
import { GoogleGenAI, Modality } from '@google/genai';
import LightningBoltIcon from './icons/LightningBoltIcon';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const BoldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.25 5.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5zm0 4a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5zm0 4a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5zM12.5 5a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0v-8.5a.75.75 0 01.75-.75z" clipRule="evenodd" transform="skewX(-15)" /></svg>;
const ItalicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7 4.75A.75.75 0 017.75 4h5.5a.75.75 0 010 1.5h-1.37l-2.023 8.5H12a.75.75 0 010 1.5H6.25a.75.75 0 010-1.5h1.37l2.023-8.5H8a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const SidebarRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm14.25 1.5a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5a.75.75 0 01.75-.75zM12 7.5a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 0112 7.5zM7.5 7.5a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-400"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>;

interface StoryEditorViewProps {
    chapter: Chapter;
    cast: StoryCharacter[];
    lorebook: LoreEntry[];
    onChapterUpdate: (field: 'title' | 'content' | 'visuals', value: any) => void;
    onBack?: () => void;
    onSave: () => void;
    storyBannerUrl?: string;
}

const StoryEditorView: React.FC<StoryEditorViewProps> = ({ chapter, cast, lorebook, onChapterUpdate, onBack, onSave, storyBannerUrl }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showContextDrawer, setShowContextDrawer] = useState(false);
    const [contextTab, setContextTab] = useState<'cast' | 'lore'>('cast');
    const [editorMode, setEditorMode] = useState<'text' | 'visuals'>('text');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [aiMode, setAiMode] = useState<'menu' | 'brainstorm' | null>(null);
    const [brainstormSuggestions, setBrainstormSuggestions] = useState<string[]>([]);
    
    // For Visuals Mode
    const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);

    const paragraphs = useMemo(() => {
        return chapter.content.split('\n\n').filter(p => p.trim().length > 0);
    }, [chapter.content]);

    const { wordCount, charCount } = useMemo(() => {
        const content = chapter.content || '';
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        return {
            wordCount: content.trim() === '' ? 0 : words,
            charCount: content.length,
        };
    }, [chapter.content]);

    const handleSave = () => {
        setIsSaving(true);
        onSave();
        setTimeout(() => setIsSaving(false), 1000);
    };

    const applyMarkdown = (format: 'bold' | 'italic') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const markers = format === 'bold' ? '**' : '*';
        const newText = `${textarea.value.substring(0, start)}${markers}${selectedText}${markers}${textarea.value.substring(end)}`;

        onChapterUpdate('content', newText);

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + markers.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos + selectedText.length);
        }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            applyMarkdown('bold');
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
            e.preventDefault();
            applyMarkdown('italic');
        }
    };

    const insertText = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = `${textarea.value.substring(0, start)}${text}${textarea.value.substring(end)}`;
        onChapterUpdate('content', newText);
        
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    };

    // --- AI HANDLERS ---

    const handleAiAction = async (action: 'continue' | 'describe' | 'brainstorm') => {
        setAiMode(null);
        setIsAiLoading(true);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
            const textarea = textareaRef.current;
            const fullText = chapter.content;
            
            if (action === 'continue') {
                const context = fullText.slice(-2000);
                const prompt = `You are a co-author. Continue the story naturally from here. Maintain the tone. Write ~100 words.\n\nContext:\n"${context}"`;
                const response = await model.generateContent(prompt);
                const continuedText = response.response.text();
                
                if (continuedText) {
                    const separator = fullText.endsWith(' ') || fullText.endsWith('\n') ? '' : ' ';
                    insertText(`${separator}${continuedText}`);
                }
            } 
            else if (action === 'describe') {
                if (!textarea || textarea.selectionStart === textarea.selectionEnd) {
                    alert("Select some text (e.g., 'a spooky forest') to describe it.");
                    setIsAiLoading(false);
                    return;
                }
                const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                const prompt = `Write a vivid, sensory-rich paragraph describing "${selectedText}" fitting for this story.`;
                const response = await model.generateContent(prompt);
                const description = response.response.text();
                if (description) {
                    insertText(` ${description} `);
                }
            }
            else if (action === 'brainstorm') {
                const context = fullText.slice(-2000);
                const prompt = `Based on the story so far, suggest 3 interesting plot twists or "what happens next" ideas. Keep them concise.\n\nStory Context:\n"${context}"`;
                const response = await model.generateContent(prompt);
                const text = response.response.text();
                // Simple parse assuming list format
                const suggestions = text.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^[\d-.*]+ /, ''));
                setBrainstormSuggestions(suggestions);
                setAiMode('brainstorm');
            }

        } catch (e) {
            console.error("AI Action failed", e);
            alert("The muse is silent. (AI Generation failed)");
        } finally {
            setIsAiLoading(false);
        }
    };

    const generateSceneBackground = async (index: number, text: string) => {
        setGeneratingIndex(index);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Generate a cinematic background image for a visual novel scene described as: "${text.slice(0, 500)}...". 
            Style: Detailed, atmospheric, no text.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });

            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                    const newVisuals = [...(chapter.visuals || [])];
                    // Remove existing visual for this paragraph if exists
                    const existingIdx = newVisuals.findIndex(v => v.paragraphIndex === index);
                    if (existingIdx !== -1) newVisuals.splice(existingIdx, 1);
                    
                    newVisuals.push({ paragraphIndex: index, imageUrl, description: text.slice(0, 50) });
                    onChapterUpdate('visuals', newVisuals);
                    break;
                }
            }
        } catch (e) {
            console.error("BG Gen failed", e);
            alert("Failed to generate scene.");
        } finally {
            setGeneratingIndex(null);
        }
    };

    const handleVisualUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                const newVisuals = [...(chapter.visuals || [])];
                const existingIdx = newVisuals.findIndex(v => v.paragraphIndex === index);
                if (existingIdx !== -1) newVisuals.splice(existingIdx, 1);
                
                newVisuals.push({ paragraphIndex: index, imageUrl });
                onChapterUpdate('visuals', newVisuals);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- RENDERERS ---

    const castMembers = cast.map(c => ({
        ...c,
        character: allCharacters.find(char => char.id === c.characterId)
    })).filter(c => c.character);

    return (
        <main className="flex-1 flex min-w-0 h-full relative overflow-hidden transition-all">
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col min-w-0 z-10 bg-black/40 backdrop-blur-sm m-2 md:m-4 rounded-xl border border-white/5 shadow-2xl overflow-hidden">
                
                {/* Command Bar */}
                <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-4 min-w-0 flex-grow">
                        {onBack && (
                            <button onClick={onBack} className="p-2 -ml-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors md:hidden">
                                <ArrowLeftIcon />
                            </button>
                        )}
                        <input
                            type="text"
                            value={chapter.title}
                            onChange={(e) => onChapterUpdate('title', e.target.value)}
                            placeholder="Untitled Chapter"
                            className="bg-transparent text-xl md:text-2xl font-bold text-white focus:outline-none placeholder-gray-600 truncate w-full font-serif"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 ml-4">
                        {/* Editor Mode Toggle */}
                        <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                            <button 
                                onClick={() => setEditorMode('text')} 
                                className={`p-1.5 rounded transition-colors ${editorMode === 'text' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                title="Text Editor"
                            >
                                <DocumentTextIcon />
                            </button>
                            <button 
                                onClick={() => setEditorMode('visuals')} 
                                className={`p-1.5 rounded transition-colors ${editorMode === 'visuals' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                title="Visuals & Scenes"
                            >
                                <PhotoIcon />
                            </button>
                        </div>

                        {/* Formatting Group (Only in Text Mode) */}
                        {editorMode === 'text' && (
                            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
                                <button onClick={() => applyMarkdown('bold')} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Bold (Ctrl+B)">
                                    <BoldIcon />
                                </button>
                                <button onClick={() => applyMarkdown('italic')} className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Italic (Ctrl+I)">
                                    <ItalicIcon />
                                </button>
                            </div>
                        )}

                        {/* AI Toolbar */}
                        {editorMode === 'text' && (
                            <div className="relative group">
                                <button 
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(167,139,250,0.1)]
                                        ${isAiLoading 
                                            ? 'bg-violet-900/50 text-violet-300 cursor-wait' 
                                            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                                        }`}
                                >
                                    <LightningBoltIcon className={`w-4 h-4 ${isAiLoading ? 'animate-pulse' : ''}`} />
                                    <span className="hidden md:inline">{isAiLoading ? 'Writing...' : 'AI Tools'}</span>
                                </button>
                                
                                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-violet-500/30 rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-50">
                                    <button onClick={() => handleAiAction('continue')} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-violet-600 hover:text-white transition-colors">
                                        <span className="font-bold">Continue</span> <span className="text-xs opacity-70 block">Write next paragraph</span>
                                    </button>
                                    <button onClick={() => handleAiAction('describe')} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-violet-600 hover:text-white transition-colors">
                                        <span className="font-bold">Describe</span> <span className="text-xs opacity-70 block">Expand selection</span>
                                    </button>
                                    <button onClick={() => handleAiAction('brainstorm')} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-violet-600 hover:text-white transition-colors">
                                        <span className="font-bold">Brainstorm</span> <span className="text-xs opacity-70 block">Get plot ideas</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="w-px h-6 bg-white/10 hidden md:block"></div>

                        {/* Context Toggle */}
                        <button 
                            onClick={() => setShowContextDrawer(!showContextDrawer)} 
                            className={`p-2 rounded-lg transition-colors ${showContextDrawer ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                            title="Story Context"
                        >
                            <SidebarRightIcon />
                        </button>

                        {/* Save */}
                        <button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="p-2 rounded-lg text-gray-400 hover:text-green-400 transition-colors"
                            title="Save"
                        >
                            {isSaving ? <span className="animate-spin block w-5 h-5 border-2 border-white/20 border-t-white rounded-full"></span> : <CheckIcon />}
                        </button>
                    </div>
                </header>

                {/* Editor Content Area */}
                <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-gradient-to-b from-gray-900/50 to-black/50">
                    {editorMode === 'text' ? (
                        <div className="max-w-3xl mx-auto py-8 px-6 md:py-12 md:px-12 min-h-full">
                            <textarea
                                ref={textareaRef}
                                value={chapter.content}
                                onChange={(e) => onChapterUpdate('content', e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="The story begins..."
                                className="w-full h-[calc(100vh-250px)] bg-transparent text-lg md:text-xl text-gray-200 focus:outline-none resize-none leading-relaxed font-serif placeholder-gray-700 selection:bg-cyan-500/30"
                                spellCheck={false}
                            />
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto py-8 px-6 space-y-8">
                            <h3 className="text-xl font-bold text-cyan-400 border-b border-white/10 pb-4">Scene Sequencer</h3>
                            <p className="text-sm text-gray-400">Assign backgrounds to paragraphs to create an immersive visual novel experience.</p>
                            
                            {paragraphs.map((para, idx) => {
                                const visual = chapter.visuals?.find(v => v.paragraphIndex === idx);
                                return (
                                    <div key={idx} className="flex flex-col md:flex-row gap-6 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all">
                                        <div className="flex-1 font-serif text-gray-300 leading-relaxed text-sm md:text-base">
                                            <span className="text-xs font-bold text-gray-500 block mb-2">Block {idx + 1}</span>
                                            {para}
                                        </div>
                                        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-2">
                                            <div className="aspect-video bg-black/50 rounded-lg border border-white/10 overflow-hidden relative group">
                                                {visual ? (
                                                    <img src={visual.imageUrl} className="w-full h-full object-cover" alt="Scene" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                                                        No Visual
                                                    </div>
                                                )}
                                                
                                                {/* Upload Overlay */}
                                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                                    <span className="text-white text-xs font-bold flex items-center gap-1"><PhotoIcon /> Upload</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleVisualUpload(e, idx)} />
                                                </label>
                                            </div>
                                            
                                            <button 
                                                onClick={() => generateSceneBackground(idx, para)}
                                                disabled={generatingIndex === idx}
                                                className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                            >
                                                <LightningBoltIcon className={`w-3 h-3 ${generatingIndex === idx ? 'animate-pulse' : ''}`} />
                                                {generatingIndex === idx ? 'Dreaming...' : 'Generate Scene'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {paragraphs.length === 0 && <p className="text-center text-gray-500 italic">Write some text in the Text Editor first to create scenes.</p>}
                        </div>
                    )}
                </div>

                {/* Footer Stats */}
                <footer className="px-6 py-2 bg-black/60 border-t border-white/5 flex justify-between text-xs text-gray-500 font-mono">
                    <div>{wordCount} words</div>
                    <div>{charCount} chars</div>
                </footer>
            </div>

            {/* Context Drawer (Right) */}
            <aside 
                className={`fixed md:absolute inset-y-0 right-0 w-80 bg-[#0a0a0a]/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 z-30 flex flex-col shadow-2xl
                    ${showContextDrawer ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="p-4 border-b border-white/10 flex flex-col bg-white/5 gap-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-200 text-sm uppercase tracking-wider">Story Context</h3>
                        <button onClick={() => setShowContextDrawer(false)} className="text-gray-500 hover:text-white md:hidden">Close</button>
                    </div>
                    {/* Tabs */}
                    <div className="flex p-1 bg-black/40 rounded-lg">
                        <button 
                            onClick={() => setContextTab('cast')}
                            className={`flex-1 py-1 text-xs font-bold rounded-md transition-colors ${contextTab === 'cast' ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            <span className="flex items-center justify-center gap-1"><UserGroupIcon /> Cast</span>
                        </button>
                        <button 
                            onClick={() => setContextTab('lore')}
                            className={`flex-1 py-1 text-xs font-bold rounded-md transition-colors ${contextTab === 'lore' ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            <span className="flex items-center justify-center gap-1"><BookOpenIcon /> Lore</span>
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {contextTab === 'cast' && (
                        <div className="space-y-3">
                            {castMembers.map(({ character }) => (
                                <div key={character!.id} className="bg-white/5 rounded-lg p-3 border border-white/5 group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <UserAvatar src={character!.imageUrl} size="10" />
                                        <div>
                                            <p className="font-bold text-white text-sm">{character!.name}</p>
                                            <p className="text-[10px] text-cyan-400 uppercase tracking-wider">{character!.epithet || 'Character'}</p>
                                        </div>
                                        <button 
                                            onClick={() => insertText(character!.name)} 
                                            className="ml-auto text-xs bg-white/10 hover:bg-cyan-600 text-gray-300 hover:text-white px-2 py-1 rounded transition-colors"
                                        >
                                            Insert
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2 italic">"{character!.tagline}"</p>
                                    {character!.archetypeTags && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {character!.archetypeTags.slice(0,3).map(tag => (
                                                <span key={tag} className="text-[9px] bg-black/40 text-gray-500 px-1.5 py-0.5 rounded border border-white/5">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {castMembers.length === 0 && <p className="text-xs text-gray-500 italic text-center py-4">No cast members added.</p>}
                        </div>
                    )}

                    {contextTab === 'lore' && (
                        <div className="space-y-3">
                            {lorebook.map((entry) => (
                                <details key={entry.id} className="bg-white/5 rounded-lg border border-white/5 group open:bg-white/10 transition-colors">
                                    <summary className="flex items-center justify-between p-3 cursor-pointer list-none">
                                        <div>
                                            <p className="font-bold text-gray-200 text-sm">{entry.name}</p>
                                            <p className="text-[10px] text-violet-400 uppercase tracking-wider">{entry.category}</p>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); insertText(entry.name); }} 
                                            className="text-xs bg-white/10 hover:bg-cyan-600 text-gray-300 hover:text-white px-2 py-1 rounded transition-colors z-10 relative"
                                        >
                                            Insert
                                        </button>
                                    </summary>
                                    <div className="px-3 pb-3 text-xs text-gray-400 border-t border-white/5 pt-2 mt-1">
                                        {entry.description}
                                    </div>
                                </details>
                            ))}
                            {lorebook.length === 0 && <p className="text-xs text-gray-500 italic text-center py-4">No lore entries added.</p>}
                        </div>
                    )}
                </div>
            </aside>

            {/* Brainstorm Modal */}
            {aiMode === 'brainstorm' && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-gray-900 border border-violet-500/50 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
                        <button onClick={() => setAiMode(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">Close</button>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <SparklesIcon className="text-yellow-400" /> Brainstorming
                        </h3>
                        <div className="space-y-3">
                            {brainstormSuggestions.map((idea, i) => (
                                <button 
                                    key={i}
                                    onClick={() => { insertText(`\n\n[Idea: ${idea}]\n`); setAiMode(null); }}
                                    className="w-full text-left p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-violet-900/20 hover:border-violet-500/50 transition-all group"
                                >
                                    <span className="font-bold text-cyan-400 mr-2">{i+1}.</span>
                                    <span className="text-gray-300 group-hover:text-white text-sm leading-relaxed">{idea}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay for mobile drawer */}
            {showContextDrawer && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setShowContextDrawer(false)}
                ></div>
            )}
        </main>
    );
};

export default StoryEditorView;
