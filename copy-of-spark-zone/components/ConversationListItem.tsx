
import React, { useMemo } from 'react';
import { Conversation } from '../types';
import UserAvatar from './UserAvatar';

interface ConversationListItemProps {
    conversation: Conversation;
    isSelected: boolean;
    onClick: () => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({ conversation, isSelected, onClick }) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const hasUnread = conversation.unreadCount && conversation.unreadCount > 0;
    
    // Mock random online status for visual flavor (seeded by ID to be consistent)
    const isOnline = useMemo(() => (conversation.participant.id % 3 !== 0), [conversation.participant.id]);

    return (
        <button 
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 text-left transition-all duration-200 border-l-[3px] border-b border-b-white/5 
                ${isSelected 
                    ? 'bg-gradient-to-r from-cyan-900/30 to-transparent border-l-cyan-400' 
                    : 'border-l-transparent hover:bg-white/5 hover:border-l-white/20'
                }`
            }
        >
            <div className="relative">
                <UserAvatar src={conversation.participant.avatarUrl} size="12" className={isSelected ? 'ring-2 ring-cyan-500/50' : ''} />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0f172a] ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            </div>
            
            <div className="flex-grow min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                    <p className={`text-sm font-bold truncate ${hasUnread ? 'text-white' : 'text-gray-200'}`}>
                        {conversation.participant.name}
                    </p>
                    {lastMessage && (
                        <span className="text-[10px] text-gray-500 font-mono">
                            {lastMessage.timestamp}
                        </span>
                    )}
                </div>
                
                <div className="flex justify-between items-center">
                    <p className={`text-xs truncate max-w-[85%] ${hasUnread ? 'text-gray-100 font-medium' : 'text-gray-500'}`}>
                        {lastMessage ? (
                            <>
                                {lastMessage.character && <span className="text-cyan-600 mr-1">{lastMessage.character.name}:</span>}
                                {lastMessage.text || (lastMessage.imageUrl ? '📷 Image' : lastMessage.audioUrl ? '🎤 Voice Note' : '')}
                            </>
                        ) : (
                            <span className="italic opacity-50">No messages yet</span>
                        )}
                    </p>
                    
                    {hasUnread && (
                        <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_5px_cyan]"></span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ConversationListItem;
