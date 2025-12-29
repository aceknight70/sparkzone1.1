
import React, { useState, useMemo } from 'react';
import { Notification, User } from '../types';
import UserAvatar from '../components/UserAvatar';

// --- Icons ---
const SparkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const ChatBubbleLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-400"><path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" /></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-400"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /><path d="M13.5 3a.75.75 0 01.75.75V5.25h1.5a.75.75 0 010 1.5H14.25v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5V3.75a.75.75 0 01.75-.75z" /></svg>;
const SwordIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500"><path fillRule="evenodd" d="M10.835 5.707a.75.75 0 00-1.17-1.025l-3.912 4.471-1.29-1.29a.75.75 0 00-1.061 1.06l2.675 2.676-.53.53a.75.75 0 000 1.061l.75.75a.75.75 0 001.06 0l.53-.53 2.676 2.675a.75.75 0 001.06-1.06l-1.29-1.29 4.472-3.912a.75.75 0 00.025-1.12zM14.896 8.232a.75.75 0 00-1.06 1.06l2.675 2.676-.53.53a.75.75 0 000 1.061l.75.75a.75.75 0 001.06 0l.53-.53 2.676 2.675a.75.75 0 001.06-1.06l-1.29-1.29 4.472-3.912a.75.75 0 00-1.12-.025l-3.912 4.471-1.29-1.29a.75.75 0 00-1.061 0z" clipRule="evenodd" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 0013.484 0 .75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 16.03A.75.75 0 018.8 15.5h2.4a.75.75 0 01.75.75 1.5 1.5 0 01-3 0z" clipRule="evenodd" /></svg>;
const InformationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-cyan-400"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-violet-400"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" /></svg>;

interface NotificationsPageProps {
    notifications: Notification[];
    onMarkAsRead: (id: number) => void;
    onMarkAllAsRead: () => void;
    allUsers: User[];
}

type Tab = 'All' | 'Social' | 'Alerts';

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, onMarkAsRead, onMarkAllAsRead, allUsers }) => {
    const [activeTab, setActiveTab] = useState<Tab>('All');

    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => {
            if (activeTab === 'All') return true;
            if (activeTab === 'Social') return ['spark', 'comment', 'follow'].includes(n.type);
            if (activeTab === 'Alerts') return ['system', 'clash_challenge', 'invite'].includes(n.type);
            return true;
        });
    }, [notifications, activeTab]);

    return (
        <div className="container mx-auto px-4 py-8 animate-fadeIn h-full overflow-y-auto pb-20 md:pb-4 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Notification Center</h1>
                    <p className="text-gray-400">Stay updated with your latest sparks, challenges, and messages.</p>
                </div>
                <button 
                    onClick={onMarkAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors border border-white/5 shadow-sm"
                >
                    <CheckIcon />
                    <span className="text-sm font-semibold">Mark all as read</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
                {['All', 'Social', 'Alerts'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as Tab)}
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab 
                                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' 
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content List */}
            <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notif => (
                        <NotificationCard 
                            key={notif.id} 
                            notification={notif} 
                            user={allUsers.find(u => u.id === notif.actorId)} 
                            onMarkRead={() => onMarkAsRead(notif.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-900/30 rounded-2xl border border-white/5 border-dashed">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <BellIcon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-300">All caught up!</h3>
                        <p className="text-gray-500 mt-2">No new notifications in {activeTab}.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const NotificationCard: React.FC<{ notification: Notification; user?: User; onMarkRead: () => void }> = ({ notification, user, onMarkRead }) => {
    const isUnread = !notification.read;
    
    const handleAction = (e: React.MouseEvent, action: string) => {
        e.stopPropagation();
        alert(`${action} triggered!`);
        onMarkRead();
    };

    const Container = ({ children }: { children?: React.ReactNode }) => (
        <div 
            onClick={onMarkRead}
            className={`relative p-5 rounded-xl border transition-all duration-200 flex flex-col md:flex-row gap-4 items-start md:items-center cursor-pointer group
                ${isUnread 
                    ? 'bg-gray-900/90 border-cyan-500/30 shadow-[inset_4px_0_0_0_#06b6d4]' 
                    : 'bg-gray-900/40 border-white/5 hover:border-white/10 hover:bg-gray-800/40'
                }`}
        >
            {children}
        </div>
    );

    switch (notification.type) {
        case 'invite':
            return (
                <Container>
                    <div className="flex-shrink-0">
                        <div className="relative">
                            {user ? <UserAvatar src={user.avatarUrl} size="16" className="border-2 border-violet-500/50" /> : <div className="w-16 h-16 bg-gray-800 rounded-full"></div>}
                            <div className="absolute -bottom-2 -right-2 bg-violet-600 rounded-full p-1.5 border-4 border-gray-900 text-white shadow-lg">
                                <TicketIcon />
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-lg">{user?.name}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-xs text-gray-400 font-mono">{notification.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">
                            Invited you to the <span className="font-bold text-violet-400">{notification.data?.targetType || 'World'}</span>:
                        </p>
                        <div className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-violet-500 mb-3">
                            <p className="text-white font-bold text-lg">{notification.data?.targetName}</p>
                            <p className="text-xs text-gray-400">Tap 'Join' to accept invitation.</p>
                        </div>
                        
                        <div className="flex gap-3 mt-2">
                            <button onClick={(e) => handleAction(e, 'Joined')} className="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg shadow-violet-900/20 transition-transform hover:-translate-y-0.5">
                                Join Now
                            </button>
                            <button onClick={(e) => handleAction(e, 'Declined')} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-lg border border-gray-700">
                                Decline
                            </button>
                        </div>
                    </div>
                </Container>
            );

        case 'clash_challenge':
            return (
                <Container>
                    <div className="flex-shrink-0">
                        <div className="relative">
                            {user ? <UserAvatar src={user.avatarUrl} size="16" className="border-2 border-red-500/50" /> : <div className="w-16 h-16 bg-gray-800 rounded-full"></div>}
                            <div className="absolute -bottom-2 -right-2 bg-red-600 rounded-full p-1.5 border-4 border-gray-900 text-white shadow-lg">
                                <SwordIcon />
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-lg">{user?.name}</span>
                            <span className="text-gray-500">•</span>
                            <span className="text-xs text-gray-400 font-mono">{notification.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">Challenged you to a <span className="font-black text-red-400 italic">SPARK CLASH</span> duel!</p>
                        
                        {notification.data?.powerLevel && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-900/20 border border-red-500/30 rounded-full text-xs font-bold text-red-300 mb-2">
                                <span>⚡ Enemy Power:</span>
                                <span className="font-mono text-white">{notification.data.powerLevel}</span>
                            </div>
                        )}
                        
                        <div className="flex gap-3 mt-2">
                            <button onClick={(e) => handleAction(e, 'Accepted')} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg shadow-red-900/20 transition-transform hover:-translate-y-0.5">
                                Accept Challenge
                            </button>
                            <button onClick={(e) => handleAction(e, 'Declined')} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold rounded-lg border border-gray-700">
                                Decline
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:block text-5xl font-black italic text-red-900/20 pointer-events-none select-none">
                        VS
                    </div>
                </Container>
            );
        
        case 'spark':
            return (
                <Container>
                    <div className="flex-shrink-0">
                        <div className="relative">
                            {user ? <UserAvatar src={user.avatarUrl} size="12" /> : <div className="w-12 h-12 bg-gray-800 rounded-full"></div>}
                            <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 text-yellow-400 border-2 border-gray-900">
                                <SparkIcon />
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow min-w-0">
                        <p className="text-gray-300">
                            <span className="font-bold text-white">{user?.name}</span> sparked your creation.
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{notification.timestamp}</p>
                    </div>
                    {notification.data?.thumbnailUrl && (
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                            <img src={notification.data.thumbnailUrl} className="w-full h-full object-cover" alt="Content" />
                        </div>
                    )}
                </Container>
            );

        case 'comment':
            return (
                <Container>
                    <div className="flex-shrink-0">
                        <div className="relative">
                            {user ? <UserAvatar src={user.avatarUrl} size="12" /> : <div className="w-12 h-12 bg-gray-800 rounded-full"></div>}
                            <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 text-blue-400 border-2 border-gray-900">
                                <ChatBubbleLeftIcon />
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white">{user?.name}</span>
                            <span className="text-xs text-gray-500">{notification.timestamp}</span>
                        </div>
                        <div className="bg-gray-800/50 p-3 rounded-lg border-l-2 border-blue-500/50 mb-3">
                            <p className="text-gray-300 text-sm italic line-clamp-2">"{notification.data?.previewText || '...'}"</p>
                        </div>
                        <button onClick={(e) => handleAction(e, 'Reply')} className="text-sm font-semibold text-blue-400 hover:text-blue-300">
                            Reply
                        </button>
                    </div>
                </Container>
            );

        case 'follow':
            return (
                <Container>
                    <div className="flex-shrink-0">
                        <div className="relative">
                            {user ? <UserAvatar src={user.avatarUrl} size="12" /> : <div className="w-12 h-12 bg-gray-800 rounded-full"></div>}
                            <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 text-green-400 border-2 border-gray-900">
                                <UserPlusIcon />
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-gray-300">
                                <span className="font-bold text-white">{user?.name}</span> started following you.
                            </p>
                            <p className="text-xs text-gray-500 mt-1 font-mono">{notification.timestamp}</p>
                        </div>
                        <button onClick={(e) => handleAction(e, 'Followed Back')} className="px-4 py-1.5 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/40 text-sm font-bold rounded-lg transition-colors">
                            Follow Back
                        </button>
                    </div>
                </Container>
            );

        case 'system':
        default:
            return (
                <Container>
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 border border-white/5">
                            <InformationCircleIcon />
                        </div>
                    </div>
                    <div className="flex-grow">
                        <p className={notification.type === 'system' ? 'text-cyan-200 font-medium' : 'text-gray-300'}>
                            {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{notification.timestamp}</p>
                    </div>
                </Container>
            );
    }
};

export default NotificationsPage;
