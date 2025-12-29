
import React, { useRef, useEffect, useState } from 'react';
import { Notification, User, NotificationType } from '../types';
import UserAvatar from './UserAvatar';

// --- Icons ---
const SparkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const ChatBubbleLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-400"><path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" /></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-400"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /><path d="M13.5 3a.75.75 0 01.75.75V5.25h1.5a.75.75 0 010 1.5H14.25v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5V3.75a.75.75 0 01.75-.75z" /></svg>;
const SwordIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-red-500"><path fillRule="evenodd" d="M10.835 5.707a.75.75 0 00-1.17-1.025l-3.912 4.471-1.29-1.29a.75.75 0 00-1.061 1.06l2.675 2.676-.53.53a.75.75 0 000 1.061l.75.75a.75.75 0 001.06 0l.53-.53 2.676 2.675a.75.75 0 001.06-1.06l-1.29-1.29 4.472-3.912a.75.75 0 00.025-1.12zM14.896 8.232a.75.75 0 00-1.06 1.06l2.675 2.676-.53.53a.75.75 0 000 1.061l.75.75a.75.75 0 001.06 0l.53-.53 2.676 2.675a.75.75 0 001.06-1.06l-1.29-1.29 4.472-3.912a.75.75 0 00-1.12-.025l-3.912 4.471-1.29-1.29a.75.75 0 00-1.061 0z" clipRule="evenodd" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 0013.484 0 .75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 16.03A.75.75 0 018.8 15.5h2.4a.75.75 0 01.75.75 1.5 1.5 0 01-3 0z" clipRule="evenodd" /></svg>;
const InformationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-cyan-400"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>;

interface NotificationDropdownProps {
    notifications: Notification[];
    onMarkAsRead: (id: number) => void;
    onClose: () => void;
    users: User[];
}

type Tab = 'All' | 'Social' | 'Alerts';

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications, onMarkAsRead, onClose, users }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<Tab>('All');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Social') return ['spark', 'comment', 'follow'].includes(n.type);
        if (activeTab === 'Alerts') return ['system', 'clash_challenge'].includes(n.type);
        return true;
    });

    return (
        <div ref={dropdownRef} className="absolute top-full right-0 mt-3 w-80 md:w-96 bg-gray-900/95 backdrop-blur-md border border-violet-500/30 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn origin-top-right">
            {/* Header */}
            <div className="bg-black/40 border-b border-white/5">
                <div className="flex justify-between items-center p-3">
                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                    <div className="flex gap-2 text-xs">
                        <button onClick={() => notifications.forEach(n => !n.read && onMarkAsRead(n.id))} className="text-cyan-400 hover:text-cyan-300 transition-colors">
                            Mark all read
                        </button>
                    </div>
                </div>
                {/* Tabs */}
                <div className="flex px-2">
                    {['All', 'Social', 'Alerts'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as Tab)}
                            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${activeTab === tab ? 'border-cyan-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {filteredNotifications.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {filteredNotifications.map(notif => (
                            <NotificationItem 
                                key={notif.id} 
                                notification={notif} 
                                user={users.find(u => u.id === notif.actorId)} 
                                onMarkRead={() => onMarkAsRead(notif.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                            <BellIcon />
                        </div>
                        <p className="text-sm">All caught up!</p>
                        <p className="text-xs opacity-50 mt-1">No new notifications in {activeTab}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const NotificationItem: React.FC<{ notification: Notification; user?: User; onMarkRead: () => void }> = ({ notification, user, onMarkRead }) => {
    const isUnread = !notification.read;
    
    // Inline Action Handlers (Mock)
    const handleAction = (e: React.MouseEvent, action: string) => {
        e.stopPropagation();
        alert(`${action} triggered!`);
        onMarkRead();
    };

    const BaseItem = ({ icon, children, actions }: { icon: React.ReactNode, children?: React.ReactNode, actions?: React.ReactNode }) => (
        <div 
            onClick={onMarkRead}
            className={`relative p-3 transition-colors hover:bg-white/5 cursor-pointer flex gap-3 ${isUnread ? 'bg-cyan-900/10' : ''}`}
        >
            {isUnread && <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-cyan-500 rounded-r"></div>}
            
            <div className="relative flex-shrink-0">
                {user ? <UserAvatar src={user.avatarUrl} size="10" /> : <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center"><InformationCircleIcon /></div>}
                <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full border border-gray-800 p-0.5">
                    {icon}
                </div>
            </div>

            <div className="flex-grow min-w-0">
                <div className="text-sm text-gray-300 leading-snug">
                    {children}
                </div>
                <p className="text-[10px] text-gray-500 mt-1 font-mono">{notification.timestamp}</p>
                {actions && <div className="mt-2 flex gap-2">{actions}</div>}
            </div>
        </div>
    );

    switch (notification.type) {
        case 'clash_challenge':
            return (
                <BaseItem 
                    icon={<div className="p-1 bg-red-900 rounded-full text-red-400"><SwordIcon /></div>}
                    actions={
                        <>
                            <button onClick={(e) => handleAction(e, 'Accepted')} className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded shadow-lg shadow-red-900/20">Accept</button>
                            <button onClick={(e) => handleAction(e, 'Declined')} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-bold rounded">Decline</button>
                        </>
                    }
                >
                    <span className="font-bold text-white">{user?.name}</span> challenged you to a <span className="text-red-400 font-bold">Spark Clash!</span>
                    {notification.data?.powerLevel && <div className="text-xs text-red-300 mt-0.5">Battle Power: {notification.data.powerLevel}</div>}
                </BaseItem>
            );
        
        case 'spark':
            return (
                <BaseItem 
                    icon={<div className="p-1 bg-yellow-900 rounded-full text-yellow-400"><SparkIcon /></div>}
                >
                    <div className="flex justify-between items-start gap-2">
                        <span><span className="font-bold text-white">{user?.name}</span> sparked your creation.</span>
                        {notification.data?.thumbnailUrl && (
                            <img src={notification.data.thumbnailUrl} className="w-8 h-8 rounded object-cover border border-white/10" alt="Content" />
                        )}
                    </div>
                </BaseItem>
            );

        case 'comment':
            return (
                <BaseItem 
                    icon={<div className="p-1 bg-blue-900 rounded-full text-blue-400"><ChatBubbleLeftIcon /></div>}
                    actions={
                        <button onClick={(e) => handleAction(e, 'Reply')} className="text-xs text-blue-400 hover:text-blue-300 font-medium">Reply</button>
                    }
                >
                    <span className="font-bold text-white">{user?.name}</span> commented:
                    <div className="text-gray-400 italic mt-0.5 line-clamp-1">"{notification.data?.previewText || '...'}"</div>
                </BaseItem>
            );

        case 'follow':
            return (
                <BaseItem 
                    icon={<div className="p-1 bg-green-900 rounded-full text-green-400"><UserPlusIcon /></div>}
                    actions={
                        <button onClick={(e) => handleAction(e, 'Followed Back')} className="px-3 py-1 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/40 text-xs font-bold rounded">Follow Back</button>
                    }
                >
                    <span className="font-bold text-white">{user?.name}</span> started following you.
                </BaseItem>
            );

        case 'system':
        default:
            return (
                <BaseItem 
                    icon={<div className="p-1 bg-gray-700 rounded-full text-gray-400"><InformationCircleIcon /></div>}
                >
                    <span className={notification.type === 'system' ? 'text-cyan-200' : 'text-gray-300'}>{notification.message}</span>
                </BaseItem>
            );
    }
};

export default NotificationDropdown;
