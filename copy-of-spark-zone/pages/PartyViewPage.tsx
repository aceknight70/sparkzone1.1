
import React, { useRef, useEffect, useState } from 'react';
import { Party, PartyMessage, DiceRoll, PartyMember, UserCreation, User, Character, Token, TokenCondition } from '../types';
import { currentUser, characters as allCharacters } from '../mockData';
import UserAvatar from '../components/UserAvatar';
import CharacterSelectorModal from '../components/CharacterSelectorModal';
import MemePicker from '../components/MemePicker';
import MemeCreationPage from './MemeCreationPage';
import ShareButton from '../components/ShareButton';
import InviteModal from '../components/InviteModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { GoogleGenAI, Modality } from '@google/genai';

// --- ICONS ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PaperAirplaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>;
const DiceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M14.5 3.5a.5.5 0 01.5.5v12a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5v-12a.5.5 0 01.5-.5h9zM10 6a1 1 0 100-2 1 1 0 000 2zm-3 3a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2zm-3 3a1 1 0 100-2 1 1 0 000 2z" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const MicrophoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" /><path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" /></svg>;
const StopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 animate-pulse text-yellow-400"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const FaceSmileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z" clipRule="evenodd" /></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>;
const SignalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3-3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3-3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3-3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" /></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;

const ChatHistoryModal: React.FC<{ isOpen: boolean; onClose: () => void; messages: PartyMessage[] }> = ({ isOpen, onClose, messages }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="w-full max-w-2xl bg-gray-900 border border-violet-500/30 rounded-xl shadow-2xl flex flex-col max-h-[85vh] h-full" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gray-800/50 rounded-t-xl shrink-0">
                    <h3 className="font-bold text-white flex items-center gap-2 text-lg"><ClockIcon /> Session Log</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"><XMarkIcon /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0a0a0a]">
                    {messages.map((msg, index) => (
                        <div key={msg.id} className="group">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className={`font-bold text-sm ${msg.character ? 'text-cyan-400' : 'text-gray-300'}`}>
                                    {msg.character?.name || msg.sender.name}
                                </span>
                                <span className="text-[10px] text-gray-600 font-mono">{msg.timestamp}</span>
                            </div>
                            <div className="pl-4 border-l-2 border-white/5 group-hover:border-white/10 transition-colors">
                                {msg.text && <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
                                {msg.imageUrl && (
                                    <div className="mt-2 mb-1 max-w-sm rounded-lg overflow-hidden border border-white/10">
                                        <img src={msg.imageUrl} alt="attachment" className="w-full h-auto" />
                                    </div>
                                )}
                                {msg.roll && (
                                    <div className="mt-1 inline-block bg-gray-800/50 border border-gray-700 rounded px-2 py-1">
                                        <span className="text-xs text-gray-400 font-mono uppercase mr-2">{msg.roll.command}</span>
                                        <span className="text-sm font-bold text-yellow-500">{msg.roll.total}</span>
                                        <span className="text-[10px] text-gray-500 ml-2">[{msg.roll.rolls.join(', ')}]</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                            <ClockIcon />
                            <p className="mt-2 text-sm">No history recorded.</p>
                        </div>
                    )}
                </div>
                <div className="p-3 border-t border-white/10 bg-gray-800/50 rounded-b-xl flex justify-end shrink-0">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold rounded-lg transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};

interface PartyViewPageProps {
    party: Party;
    onExit: () => void;
    onSendMessage: (partyId: number, text: string, character?: UserCreation, imageUrl?: string) => void;
    onDeleteMessage?: (partyId: number, messageId: number) => void;
    userCreations: UserCreation[];
    onStartConversation: (userId: number) => void;
    currentUser: User;
    onSaveMeme?: (meme: { name: string, imageUrl: string }) => void;
    onSendInvite?: (userId: number, message?: string) => void;
    allUsers?: User[];
}

const PartyViewPage: React.FC<PartyViewPageProps> = ({ party, onExit, onSendMessage, onDeleteMessage, userCreations, onStartConversation, currentUser, onSaveMeme, onSendInvite, allUsers }) => {
    const [message, setMessage] = useState('');
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectedVoiceId, setSelectedVoiceId] = useState<number>(currentUser.id);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedMeme, setSelectedMeme] = useState<string | null>(null);
    const [localPartyState, setLocalPartyState] = useState(party);
    const [showMemePicker, setShowMemePicker] = useState(false);
    const [isCreatingMeme, setIsCreatingMeme] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);

    useEffect(() => { setLocalPartyState(party); }, [party]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [party.chat]);

    const userCharacters = userCreations.filter(c => c.type === 'Character' || c.type === 'AI Character') as UserCreation[];
    const selectedVoice = selectedVoiceId === currentUser.id ? { ...currentUser, name: 'You', epithet: 'Yourself', imageUrl: currentUser.avatarUrl } : userCharacters.find(c => c.id === selectedVoiceId);

    const handleSendMessage = () => {
        if (!message.trim() && !selectedMeme) return;
        const character = selectedVoiceId === currentUser.id ? undefined : userCharacters.find(c => c.id === selectedVoiceId);
        onSendMessage(party.id, message, character, selectedMeme || undefined);
        setMessage('');
        setSelectedMeme(null);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setSelectedMeme(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMemeCreated = (meme: { name: string, imageUrl: string }) => {
        if (onSaveMeme) {
            onSaveMeme(meme);
            setSelectedMeme(meme.imageUrl);
        }
        setIsCreatingMeme(false);
    };

    const confirmDelete = (msgId: number) => {
        setDeletingMessageId(msgId);
    };

    const executeDelete = () => {
        if (deletingMessageId && onDeleteMessage) {
            onDeleteMessage(party.id, deletingMessageId);
            setDeletingMessageId(null);
        }
    };

    // Render logic for different stage modes (simplified placeholder for brevity)
    const renderStage = () => {
        const mode = localPartyState.stage.mode;
        if (mode === 'tabletop') {
            return (
                <div className="flex-grow bg-gray-800/50 flex items-center justify-center relative overflow-hidden">
                    {localPartyState.stage.tabletop?.mapUrl ? (
                        <img src={localPartyState.stage.tabletop.mapUrl} className="max-w-full max-h-full object-contain" />
                    ) : (
                        <div className="text-gray-500">No map loaded</div>
                    )}
                    {/* Token rendering logic would go here */}
                </div>
            );
        }
        if (mode === 'theatre') {
             return (
                <div className="flex-grow bg-black flex items-center justify-center">
                    <div className="text-gray-500">Theatre Mode Active</div>
                </div>
            );
        }
        return (
            <div className="flex-grow bg-black/40 flex items-center justify-center">
                <div className="text-gray-500">Social Mode</div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[60] flex flex-col bg-[#050505] text-white font-sans overflow-hidden">
            {/* Header */}
            <header className="p-3 border-b border-white/10 flex items-center justify-between bg-gray-900/90 backdrop-blur-md z-20">
                <div className="flex items-center gap-3">
                    <button onClick={onExit} className="p-2 -ml-2 rounded-full text-gray-400 hover:text-white transition-colors">
                        <ArrowLeftIcon />
                    </button>
                    <div>
                        <h2 className="font-bold text-sm md:text-base">{party.name}</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span>{party.members.length} Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowHistory(true)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 transition-colors" title="History">
                        <ClockIcon />
                    </button>
                    <button onClick={() => setShowInviteModal(true)} className="p-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white transition-colors" title="Invite">
                        <TicketIcon />
                    </button>
                </div>
            </header>

            {/* Main Content Split */}
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
                {/* Stage Area */}
                <div className="flex-grow relative flex flex-col md:border-r border-white/10">
                    {renderStage()}
                </div>

                {/* Chat Sidebar */}
                <div className="w-full md:w-80 lg:w-96 flex flex-col bg-[#0a0a0a] border-t md:border-t-0 md:border-l border-white/10 h-1/2 md:h-full z-10 shadow-2xl">
                    <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {party.chat.map(msg => (
                            <div key={msg.id} className="group">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className={`font-bold text-sm ${msg.character ? 'text-cyan-400' : 'text-gray-300'}`}>
                                        {msg.character?.name || msg.sender.name}
                                    </span>
                                    <span className="text-[10px] text-gray-600">{msg.timestamp}</span>
                                    {msg.sender.id === currentUser.id && onDeleteMessage && (
                                        <button onClick={() => confirmDelete(msg.id)} className="ml-auto text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <TrashIcon />
                                        </button>
                                    )}
                                </div>
                                <div className="pl-3 border-l-2 border-white/10 text-sm text-gray-300 whitespace-pre-wrap">
                                    {msg.text}
                                    {msg.imageUrl && (
                                        <div className="mt-2 rounded overflow-hidden">
                                            <img src={msg.imageUrl} alt="attachment" className="max-w-full h-auto" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-3 bg-gray-900 border-t border-white/10">
                        {selectedMeme && (
                            <div className="mb-2 relative inline-block">
                                <img src={selectedMeme} className="h-16 rounded border border-cyan-500" alt="Selected" />
                                <button onClick={() => setSelectedMeme(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5 text-white"><XMarkIcon /></button>
                            </div>
                        )}
                        <div className="flex items-end gap-2 bg-black/40 border border-white/10 rounded-xl p-2 focus-within:border-cyan-500/50 transition-colors">
                            <button onClick={() => setIsSelectorOpen(true)} className="flex-shrink-0">
                                <UserAvatar src={selectedVoice?.imageUrl} size="8" />
                            </button>
                            <textarea 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                                placeholder={`Speak as ${selectedVoice?.name}...`}
                                className="flex-grow bg-transparent text-white text-sm outline-none resize-none max-h-24 py-1"
                                rows={1}
                            />
                            <div className="flex gap-1">
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10">
                                    <PhotoIcon />
                                </button>
                                <button onClick={() => setShowMemePicker(!showMemePicker)} className="p-1.5 text-gray-400 hover:text-yellow-400 rounded hover:bg-white/10">
                                    <FaceSmileIcon />
                                </button>
                                <button onClick={handleSendMessage} disabled={!message.trim() && !selectedMeme} className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                    <PaperAirplaneIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CharacterSelectorModal 
                isOpen={isSelectorOpen} 
                onClose={() => setIsSelectorOpen(false)} 
                characters={userCharacters} 
                currentUser={currentUser} 
                selectedId={selectedVoiceId} 
                onSelect={(id) => { setSelectedVoiceId(id); setIsSelectorOpen(false); }} 
            />
            
            {showMemePicker && (
                <MemePicker 
                    userCreations={userCreations} 
                    onSelect={(url) => { setSelectedMeme(url); setShowMemePicker(false); }} 
                    onClose={() => setShowMemePicker(false)}
                    onCreateNew={() => { setShowMemePicker(false); setIsCreatingMeme(true); }}
                />
            )}

            {isCreatingMeme && (
                <div className="fixed inset-0 z-[80] bg-black flex items-center justify-center">
                    <MemeCreationPage onExit={() => setIsCreatingMeme(false)} onSave={handleMemeCreated} />
                </div>
            )}

            <ChatHistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} messages={party.chat} />
            
            <InviteModal 
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                targetName={party.name}
                targetType="Party"
                inviteLink={`https://sparkzone.app/party/${party.id}`}
                onSendInvite={onSendInvite || (() => {})}
                users={allUsers || []}
                currentUser={currentUser}
            />

            <ConfirmationModal 
                isOpen={deletingMessageId !== null}
                onClose={() => setDeletingMessageId(null)}
                onConfirm={executeDelete}
                title="Delete Message"
                message="Are you sure you want to remove this message?"
                confirmLabel="Delete"
                isDanger
            />
        </div>
    );
};

export default PartyViewPage;
