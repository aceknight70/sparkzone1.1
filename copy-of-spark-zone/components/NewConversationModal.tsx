

import React, { useRef, useEffect } from 'react';
import { User, Conversation } from '../types';
import { currentUser } from '../mockData';
import UserAvatar from './UserAvatar';

interface NewConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    conversations: Conversation[];
    onStartConversation: (participantId: number) => void;
    allUsers: User[];
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({ isOpen, onClose, conversations, onStartConversation, allUsers }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);


    const existingParticipantIds = conversations.map(c => c.participant.id);
    const availableUsers = allUsers.filter(user => 
        user.id !== currentUser.id && !existingParticipantIds.includes(user.id)
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div ref={modalRef} className="w-full max-w-md bg-gray-900 border border-violet-500/50 rounded-lg shadow-xl flex flex-col">
                <div className="p-4 border-b border-violet-500/30">
                    <h2 className="text-xl font-bold text-cyan-400">Start a new conversation</h2>
                </div>
                <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                    {availableUsers.length > 0 ? availableUsers.map(user => (
                        <button 
                            key={user.id} 
                            onClick={() => onStartConversation(user.id)}
                            className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-violet-500/10 text-left"
                        >
                            <UserAvatar src={user.avatarUrl} size="10" />
                            <span className="font-semibold text-white">{user.name}</span>
                        </button>
                    )) : (
                        <p className="text-center text-gray-500 py-4">No new users to message.</p>
                    )}
                </div>
                 <div className="p-4 flex justify-end gap-2 border-t border-violet-500/30">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-700">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default NewConversationModal;