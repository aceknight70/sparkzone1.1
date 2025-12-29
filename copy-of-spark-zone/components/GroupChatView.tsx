
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { currentUser } from '../mockData';
import { WorldLocation, World, UserCreation } from '../types';
import GroupMessageBubble from './GroupMessageBubble';
import UserAvatar from './UserAvatar';
import CharacterSelectorModal from './CharacterSelectorModal';
import MemePicker from './MemePicker';
import MemeCreationPage from '../pages/MemeCreationPage';
import ConfirmationModal from './ConfirmationModal';
import { GoogleGenAI, Modality } from '@google/genai';

// --- Icons ---
const PaperAirplaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;
const FaceSmileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const MicrophoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" /><path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" /></svg>;
const StopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></svg>;
const CloudArrowUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-cyan-400 animate-bounce"><path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 animate-pulse text-yellow-400"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>;

interface GroupChatViewProps {
    location: WorldLocation;
    world: World;
    onBack?: () => void;
    onSendMessage: (worldId: number, locationId: number, text: string, character?: UserCreation, imageUrl?: string, audioUrl?: string) => void;
    onDeleteMessage?: (worldId: number, locationId: number, messageId: number) => void;
    userCreations: UserCreation[];
    onSaveMeme?: (meme: { name: string, imageUrl: string }) => void;
}

const GroupChatView: React.FC<GroupChatViewProps> = ({ location, world, onBack, onSendMessage, onDeleteMessage, userCreations, onSaveMeme }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [messageText, setMessageText] = useState('');
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectedVoiceId, setSelectedVoiceId] = useState<number>(currentUser.id);
    const [isImagining, setIsImagining] = useState(false);

    const [showMemePicker, setShowMemePicker] = useState(false);
    const [selectedMeme, setSelectedMeme] = useState<string | null>(null);
    const [isCreatingMeme, setIsCreatingMeme] = useState(false);

    const [isDragging, setIsDragging] = useState(false);

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerIntervalRef = useRef<number | null>(null);

    // Deletion State
    const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);

    const userCharacters = userCreations.filter(c => c.type === 'Character' || c.type === 'AI Character') as UserCreation[];
    
    const selectedVoice = selectedVoiceId === currentUser.id
        ? { ...currentUser, name: 'You', epithet: 'Yourself', imageUrl: currentUser.avatarUrl }
        : userCharacters.find(c => c.id === selectedVoiceId);

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
        }
    }

    useLayoutEffect(() => { scrollToBottom('auto'); }, [location.id]);
    useEffect(() => { scrollToBottom('smooth'); }, [location.messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
        }
    }, [messageText]);

    const handleSend = () => {
        if (!messageText.trim() && !selectedMeme) return;

        if (messageText.trim().startsWith('/imagine ')) {
            handleAiImagine(messageText.trim().substring(9));
            setMessageText('');
            return;
        }

        const character = selectedVoiceId === currentUser.id ? undefined : userCharacters.find(c => c.id === selectedVoiceId);
        onSendMessage(world.id, location.id, messageText, character, selectedMeme || undefined);
        setMessageText('');
        setSelectedMeme(null);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleAiImagine = async (prompt: string) => {
        if (!prompt) return;
        setIsImagining(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: `Generate a fantasy roleplay scene: ${prompt}` }] },
                config: { responseModalities: [Modality.IMAGE] },
            });

            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                    const character = selectedVoiceId === currentUser.id ? undefined : userCharacters.find(c => c.id === selectedVoiceId);
                    onSendMessage(world.id, location.id, `Imagined: ${prompt}`, character, imageUrl);
                    break;
                }
            }
        } catch (e) {
            console.error("AI Generation failed", e);
            alert("Failed to generate image. Please try again.");
        } finally {
            setIsImagining(false);
        }
    };

    const handleMemeCreated = (meme: { name: string, imageUrl: string }) => {
        if (onSaveMeme) {
            onSaveMeme(meme);
            setSelectedMeme(meme.imageUrl);
        }
        setIsCreatingMeme(false);
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => { if (typeof reader.result === 'string') setSelectedMeme(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => { if (typeof reader.result === 'string') setSelectedMeme(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: BlobPart[] = [];
            mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(blob);
                const character = selectedVoiceId === currentUser.id ? undefined : userCharacters.find(c => c.id === selectedVoiceId);
                onSendMessage(world.id, location.id, '', character, undefined, audioUrl);
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            timerIntervalRef.current = window.setInterval(() => setRecordingTime(prev => prev + 1), 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const confirmDelete = (msgId: number) => {
        setDeletingMessageId(msgId);
    };

    const executeDelete = () => {
        if (deletingMessageId && onDeleteMessage) {
            onDeleteMessage(world.id, location.id, deletingMessageId);
            setDeletingMessageId(null);
        }
    };

    return (
        <main 
            className="flex-1 flex flex-col h-full min-w-0 bg-transparent overflow-hidden relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {isDragging && (
                <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-slate-700 border-dashed m-4 rounded-2xl">
                    <CloudArrowUpIcon />
                    <h2 className="text-2xl font-bold text-white mt-4">Drop to Upload</h2>
                </div>
            )}

            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-white/5 flex-shrink-0 bg-slate-900 z-20 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                    {onBack && (
                        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full transition-colors active:bg-white/5" aria-label="Go back">
                            <ArrowLeftIcon />
                        </button>
                    )}
                    <div className="min-w-0">
                        <h2 className="font-bold text-white truncate text-base flex items-center gap-2">
                            <span className="text-slate-500 font-mono">#</span> {location.name}
                        </h2>
                        {location.description && <p className="text-xs text-slate-400 truncate">{location.description}</p>}
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="relative flex-grow overflow-y-auto px-4 py-4 flex flex-col gap-3 z-10 scroll-smooth custom-scrollbar pb-24">
                <div className="flex-grow min-h-[20px]"></div>
                {location.messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-60">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                            <span className="text-2xl">✨</span>
                        </div>
                        <p className="text-slate-300 font-bold text-sm">Quiet Channel</p>
                        <p className="text-slate-500 text-xs mt-1">Start the conversation.</p>
                    </div>
                )}
                {location.messages.map(message => (
                    <GroupMessageBubble 
                        key={message.id} 
                        message={message} 
                        onDelete={onDeleteMessage ? () => confirmDelete(message.id) : undefined}
                    />
                ))}
                {isImagining && (
                    <div className="flex justify-center p-4">
                        <div className="bg-slate-800 rounded-full px-4 py-2 flex items-center gap-2 text-slate-300 text-xs font-bold animate-pulse">
                            <SparklesIcon />
                            <span>Visualizing...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-2 w-full" />
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-30 bg-slate-900 border-t border-white/5 pt-3">
                {selectedMeme && (
                    <div className="mb-2 ml-1 relative inline-block animate-fadeInUp">
                        <div className="relative rounded-lg overflow-hidden border border-slate-700 max-w-[120px] bg-black">
                            <img src={selectedMeme} alt="Preview" className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity" />
                            <button onClick={() => setSelectedMeme(null)} className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-red-500 transition-colors">
                                <XMarkIcon />
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex items-end gap-2 bg-slate-800 rounded-2xl p-1.5 shadow-sm relative transition-all focus-within:ring-1 focus-within:ring-slate-600">
                    <button onClick={() => setIsSelectorOpen(true)} className="flex-shrink-0 mb-0.5 ml-0.5 rounded-full p-0.5 group relative" title={`Speaking as ${selectedVoice?.name}`}>
                        <UserAvatar src={selectedVoice?.imageUrl} size="8" />
                        {selectedVoiceId !== currentUser.id && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-slate-800 flex items-center justify-center"><span className="sr-only">RP</span></div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-white"><ChevronDownIcon /></div>
                    </button>
                    
                    {isRecording ? (
                        <div className="flex-grow flex items-center justify-between px-3 bg-red-900/20 rounded-xl h-[42px] animate-pulse border border-red-500/20">
                            <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-sm">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                {formatTime(recordingTime)}
                            </div>
                            <button onClick={stopRecording} className="text-red-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"><StopIcon /></button>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col justify-center">
                            <textarea 
                                ref={textareaRef}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                placeholder={messageText.startsWith('/') ? "Enter command..." : `Message #${location.name}`}
                                className="w-full bg-transparent text-gray-200 text-sm focus:outline-none resize-none max-h-[120px] overflow-y-auto py-2.5 px-2 leading-relaxed placeholder-slate-500 font-medium"
                                rows={1}
                            />
                        </div>
                    )}
                    
                    <div className="flex items-center gap-1 pb-0.5 pr-0.5">
                        <div className="relative flex items-center">
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                            {!messageText && (
                                <>
                                    <button onClick={() => fileInputRef.current?.click()} className="p-2 transition-colors rounded-full text-slate-400 hover:text-white hover:bg-slate-700" title="Upload Image"><PhotoIcon /></button>
                                    <button onClick={() => setShowMemePicker(!showMemePicker)} className={`p-2 rounded-full transition-colors ${showMemePicker ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`} title="Stickers & Memes"><FaceSmileIcon /></button>
                                </>
                            )}
                        </div>
                        {messageText.trim() || selectedMeme ? (
                            <button onClick={handleSend} className="p-2 text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all flex items-center justify-center">
                                {messageText.startsWith('/imagine') ? <SparklesIcon /> : <PaperAirplaneIcon />}
                            </button>
                        ) : (
                            !isRecording && (
                                <button onClick={startRecording} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors self-center" title="Record Voice Note"><MicrophoneIcon /></button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {isSelectorOpen && (
                <CharacterSelectorModal
                    isOpen={isSelectorOpen}
                    onClose={() => setIsSelectorOpen(false)}
                    characters={userCharacters}
                    currentUser={currentUser}
                    selectedId={selectedVoiceId}
                    onSelect={(id) => { setSelectedVoiceId(id); setIsSelectorOpen(false); }}
                />
            )}

            {isCreatingMeme && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                    <div className="w-full h-full md:h-[85vh] md:w-[90vw] md:max-w-6xl md:rounded-2xl overflow-hidden relative bg-[#050505] border border-white/10 shadow-2xl">
                        <MemeCreationPage onExit={() => setIsCreatingMeme(false)} onSave={handleMemeCreated} />
                    </div>
                </div>
            )}
            
            {showMemePicker && (
                <MemePicker 
                    userCreations={userCreations} 
                    onSelect={(url) => { setSelectedMeme(url); setShowMemePicker(false); }} 
                    onClose={() => setShowMemePicker(false)}
                    onCreateNew={() => { setShowMemePicker(false); setIsCreatingMeme(true); }}
                />
            )}

            {/* Deletion Confirmation Modal */}
            <ConfirmationModal 
                isOpen={deletingMessageId !== null}
                onClose={() => setDeletingMessageId(null)}
                onConfirm={executeDelete}
                title="Delete Message?"
                message="Are you sure you want to delete this message? This action cannot be undone."
                confirmLabel="Delete"
                isDanger={true}
            />
        </main>
    );
};

export default GroupChatView;
