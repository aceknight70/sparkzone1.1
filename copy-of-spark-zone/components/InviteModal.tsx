
import React, { useState } from 'react';
import { User } from '../types';
import UserAvatar from './UserAvatar';

const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" /><path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" /></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M7 3.5a1.5 1.5 0 011.5-1.5h7A1.5 1.5 0 0117 3.5v7a1.5 1.5 0 01-1.5 1.5h-1V11l1-1h1V3.5h-7v1l-1-1v-1z" /><path d="M3.5 7A1.5 1.5 0 015 5.5h7A1.5 1.5 0 0113.5 7v7a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013.5 13.5V7z" /></svg>;

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetName: string;
    targetType: 'World' | 'Party' | 'Community';
    inviteLink: string;
    onSendInvite: (userId: number, customMessage?: string) => void;
    users: User[];
    currentUser: User;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, targetName, targetType, inviteLink, onSendInvite, users, currentUser }) => {
    const [activeTab, setActiveTab] = useState<'link' | 'friends'>('link');
    const [copied, setCopied] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [invitedUserIds, setInvitedUserIds] = useState<number[]>([]);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            if (typeof window !== 'undefined' && !document.hasFocus()) {
                window.focus();
            }
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Clipboard API failed, using fallback", err);
            const textArea = document.createElement("textarea");
            textArea.value = inviteLink;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } else {
                    alert("Failed to copy link.");
                }
            } catch (fallbackErr) {
                console.error("Fallback copy failed", fallbackErr);
                alert("Failed to copy link manually.");
            }
            document.body.removeChild(textArea);
        }
    };

    const handleInvite = (userId: number) => {
        onSendInvite(userId, customMessage);
        setInvitedUserIds([...invitedUserIds, userId]);
    };

    const filteredUsers = users.filter(u => 
        u.id !== currentUser.id && 
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-gray-900 border border-violet-500/50 rounded-xl shadow-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gray-800/50">
                    <h3 className="font-bold text-white text-lg">Invite to {targetType}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon />
                    </button>
                </div>

                <div className="flex border-b border-white/10">
                    <button 
                        onClick={() => setActiveTab('link')} 
                        className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'link' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/5' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <LinkIcon /> Share Link
                    </button>
                    <button 
                        onClick={() => setActiveTab('friends')} 
                        className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${activeTab === 'friends' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/5' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        <UserPlusIcon /> Invite Friends
                    </button>
                </div>

                <div className="p-6 h-96 overflow-y-auto custom-scrollbar">
                    {activeTab === 'link' ? (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-2">
                                    <span className="text-3xl">🎫</span>
                                </div>
                                <h4 className="text-xl font-bold text-white">{targetName}</h4>
                                <p className="text-sm text-gray-400">Share this link to invite others to join.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Invite Link</label>
                                <div className="flex gap-2">
                                    <div className="flex-grow bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono truncate select-all">
                                        {inviteLink}
                                    </div>
                                    <button 
                                        onClick={handleCopy}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                                    >
                                        {copied ? <CheckIcon /> : <CopyIcon />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                            
                            <p className="text-xs text-gray-500 text-center">Anyone with this link can view and request to join.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <textarea
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    placeholder="Add a custom message (optional)..."
                                    className="w-full bg-gray-800/60 border border-violet-500/30 rounded-lg p-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-cyan-500 mb-4"
                                    rows={2}
                                />
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Search users..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-black/40 border border-white/20 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                {filteredUsers.map(user => {
                                    const isInvited = invitedUserIds.includes(user.id);
                                    return (
                                        <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar src={user.avatarUrl} size="10" />
                                                <div>
                                                    <p className="font-bold text-white text-sm">{user.name}</p>
                                                    <p className="text-xs text-gray-500">@{user.name.toLowerCase().replace(/\s/g, '')}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => !isInvited && handleInvite(user.id)}
                                                disabled={isInvited}
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                                    isInvited 
                                                        ? 'bg-green-500/20 text-green-400 cursor-default' 
                                                        : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black'
                                                }`}
                                            >
                                                {isInvited ? 'Sent' : 'Invite'}
                                            </button>
                                        </div>
                                    );
                                })}
                                {filteredUsers.length === 0 && (
                                    <p className="text-center text-gray-500 py-4 text-sm">No users found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InviteModal;
