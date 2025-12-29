
import React, { useState, useEffect, useMemo } from 'react';
import { Conversation, UserCreation, User, MessageType } from '../types';
import ConversationListItem from '../components/ConversationListItem';
import ChatView from '../components/ChatView';
import NewConversationModal from '../components/NewConversationModal';
import UserAvatar from '../components/UserAvatar';

const PencilSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>;
const SignalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 text-cyan-900"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;

interface MessengerPageProps {
    conversations: Conversation[];
    onSendMessage: (conversationId: number, text: string, character?: UserCreation, imageUrl?: string, audioUrl?: string, type?: MessageType, metadata?: any) => void;
    onDeleteMessage?: (conversationId: number, messageId: number) => void;
    onCreateConversation: (participantId: number) => number;
    userCreations: UserCreation[];
    allUsers: User[];
    initialConversationId: number | null;
    onClearInitialConversation: () => void;
    onSaveMeme?: (meme: { name: string, imageUrl: string }) => void;
}

const MessengerPage: React.FC<MessengerPageProps> = ({ conversations, onSendMessage, onDeleteMessage, onCreateConversation, userCreations, allUsers, initialConversationId, onClearInitialConversation, onSaveMeme }) => {
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(initialConversationId);
    const [isNewConvoModalOpen, setIsNewConvoModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    useEffect(() => {
        if (initialConversationId) {
            setSelectedConversationId(initialConversationId);
            onClearInitialConversation();
        }
    }, [initialConversationId, onClearInitialConversation]);

    // Select first conversation on desktop if none selected
    useEffect(() => {
        if (!selectedConversationId && conversations.length > 0 && window.innerWidth >= 768) {
            setSelectedConversationId(conversations[0].id);
        }
    }, []);

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    // Existing Chats matching search
    const filteredConversations = useMemo(() => {
        return conversations.filter(c => 
            c.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [conversations, searchQuery]);

    // New Users matching search (not in existing chats)
    const newConnections = useMemo(() => {
        if (!searchQuery) return [];
        const existingIds = conversations.map(c => c.participant.id);
        return allUsers.filter(u => 
            !existingIds.includes(u.id) && 
            u.id !== 100 && // Exclude self
            u.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allUsers, conversations, searchQuery]);

    const handleStartConversation = (participantId: number) => {
        const convoId = onCreateConversation(participantId);
        if (convoId) {
            setSelectedConversationId(convoId);
            setIsNewConvoModalOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <div className="flex h-full w-full bg-black bg-gradient-to-tr from-black via-[#010619] to-blue-900/10 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 transition-all overflow-hidden">
            {/* Sidebar Conversation List */}
            <aside className={`
                w-full md:w-80 lg:w-96 flex-shrink-0 bg-gray-900/80 backdrop-blur-md border-r border-violet-500/30 
                flex flex-col h-full z-20
                ${selectedConversationId ? 'hidden md:flex' : 'flex'}
            `}>
                <div className="p-4 border-b border-violet-500/30 flex flex-col gap-4 bg-gray-900/50">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-bold text-cyan-400 tracking-wide uppercase flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                            Comms Link
                        </h1>
                        <button 
                            onClick={() => setIsNewConvoModalOpen(true)} 
                            className="p-2 rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shadow-lg hover:shadow-cyan-500/20" 
                            aria-label="New message"
                        >
                            <PencilSquareIcon />
                        </button>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search frequency..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/40 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        />
                        <div className="absolute left-3 top-2.5 text-gray-500">
                            <SearchIcon />
                        </div>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    {filteredConversations.length > 0 && (
                        <div className="py-2">
                            {searchQuery && <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Active Channels</h3>}
                            {filteredConversations.map(convo => (
                                <ConversationListItem 
                                    key={convo.id}
                                    conversation={convo}
                                    isSelected={selectedConversationId === convo.id}
                                    onClick={() => setSelectedConversationId(convo.id)}
                                />
                            ))}
                        </div>
                    )}

                    {newConnections.length > 0 && (
                        <div className="py-2">
                            <h3 className="px-4 text-xs font-bold text-cyan-500 uppercase tracking-wider mb-2">Global Search</h3>
                            {newConnections.map(user => (
                                <button 
                                    key={user.id}
                                    onClick={() => handleStartConversation(user.id)}
                                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 border-l-[3px] border-l-transparent transition-colors"
                                >
                                    <UserAvatar src={user.avatarUrl} size="10" />
                                    <div>
                                        <p className="font-bold text-white text-sm">{user.name}</p>
                                        <p className="text-xs text-cyan-400">Start new chat</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {filteredConversations.length === 0 && newConnections.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            {searchQuery ? "No channels found." : "No active signals."}
                        </div>
                    )}
                </div>
            </aside>
            
            {/* Main Chat View */}
            <main className={`flex-grow flex flex-col h-full min-w-0 bg-black/40 relative ${!selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
                {selectedConversation ? (
                    <ChatView 
                        conversation={selectedConversation} 
                        onBack={() => setSelectedConversationId(null)}
                        onSendMessage={onSendMessage}
                        onDeleteMessage={onDeleteMessage}
                        userCreations={userCreations}
                        onSaveMeme={onSaveMeme}
                    />
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-500 p-8 text-center select-none">
                        <div className="mb-6 opacity-30 animate-pulse">
                            <SignalIcon />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-300 tracking-wider mb-2">SECURE CHANNEL STANDBY</h2>
                        <p className="max-w-sm text-sm">Select a frequency from the list to establish a connection or broadcast a new signal.</p>
                    </div>
                )}
            </main>

            {isNewConvoModalOpen && (
                <NewConversationModal
                    isOpen={isNewConvoModalOpen}
                    onClose={() => setIsNewConvoModalOpen(false)}
                    conversations={conversations}
                    onStartConversation={handleStartConversation}
                    allUsers={allUsers}
                />
            )}
        </div>
    );
};

export default MessengerPage;
