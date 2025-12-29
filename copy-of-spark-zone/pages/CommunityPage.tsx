
import React, { useState } from 'react';
import { Community, User, Post, UserCreation } from '../types';
import UserAvatar from '../components/UserAvatar';
import PostCard from '../components/PostCard';
import CreationCard from '../components/CreationCard';
import ShareButton from '../components/ShareButton';
import InviteModal from '../components/InviteModal';

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.28l1.383 1.382 1.966-1.966a.75.75 0 111.06 1.06l-1.965 1.967 1.382 1.382h.28a.75.75 0 010 1.5h-.28l-1.382 1.382 1.966 1.966a.75.75 0 01-1.06 1.061l-1.967-1.967-1.383-1.383v.28a.75.75 0 01-1.5 0v-.28l-1.382-1.383-1.966 1.967a.75.75 0 01-1.061-1.06l1.967-1.967-1.382-1.382h-.28a.75.75 0 010-1.5h.28l1.383-1.382-1.967-1.966a.75.75 0 111.06-1.06l1.966 1.966 1.383-1.382V2.75A.75.75 0 0110 2zM10 6.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5z" clipRule="evenodd" /></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" /></svg>;

interface CommunityPageProps {
    community: Community;
    onExit: () => void;
    currentUser: User;
    onJoin: () => void;
    onLeave: () => void;
    onSparkPost: (postId: number) => void;
    onCommentPost: (postId: number) => void;
    allUsers: User[];
    onSendInvite?: (userId: number, message?: string) => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ 
    community, 
    onExit, 
    currentUser, 
    onJoin, 
    onLeave,
    onSparkPost, 
    onCommentPost,
    allUsers,
    onSendInvite
}) => {
    const [activeTab, setActiveTab] = useState<'feed' | 'showcase' | 'members'>('feed');
    const [showInviteModal, setShowInviteModal] = useState(false);
    
    const isMember = community.members.some(m => m.userId === currentUser.id);
    const role = community.members.find(m => m.userId === currentUser.id)?.role;

    return (
        <div className="h-full w-full bg-black overflow-y-auto animate-fadeIn pb-safe">
            {/* Hero Header */}
            <div className="relative h-64 md:h-80">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${community.bannerUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                
                {/* Navbar Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
                    <button onClick={onExit} className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors">
                        <ArrowLeftIcon />
                    </button>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setShowInviteModal(true)}
                            className="p-2 bg-black/50 backdrop-blur-md rounded-full text-gray-200 hover:text-white hover:bg-black/70 transition-colors"
                            title="Invite Friends"
                        >
                            <TicketIcon />
                        </button>
                        <ShareButton 
                            title={`Join ${community.name}`} 
                            text={`Check out the ${community.name} community on Spark Zone!`}
                            className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
                            iconOnly
                            showLabel={false}
                        />
                    </div>
                </div>

                {/* Community Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end gap-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-black overflow-hidden shadow-2xl flex-shrink-0 bg-gray-800">
                        <img src={community.imageUrl} alt={community.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-grow mb-2">
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
                            {community.name}
                        </h1>
                        <p className="text-gray-300 mt-2 max-w-2xl text-sm md:text-base font-medium drop-shadow-md">
                            {community.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {community.tag}
                            </span>
                            <span className="bg-gray-800/60 text-gray-300 border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                Lvl {community.level}
                            </span>
                            {community.tags.map(tag => (
                                <span key={tag} className="bg-gray-800/60 text-gray-400 border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex-shrink-0 mb-2">
                        {isMember ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-green-400 bg-green-900/30 px-3 py-1.5 rounded-lg border border-green-500/30 flex items-center gap-2">
                                    <ShieldCheckIcon /> {role}
                                </span>
                                <button 
                                    onClick={onLeave}
                                    className="px-4 py-2 bg-gray-800 text-gray-400 text-sm font-bold rounded-lg border border-gray-700 hover:bg-red-900/30 hover:text-red-400 hover:border-red-500/50 transition-colors"
                                >
                                    Leave
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={onJoin}
                                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg uppercase tracking-wide rounded-full shadow-lg shadow-cyan-500/30 transform hover:-translate-y-1 transition-all"
                            >
                                Join Clan
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="sticky top-0 bg-black/80 backdrop-blur-md z-20 border-b border-white/10">
                <div className="flex justify-center md:justify-start px-4">
                    {['feed', 'showcase', 'members'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${
                                activeTab === tab 
                                    ? 'border-cyan-500 text-cyan-400' 
                                    : 'border-transparent text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {activeTab === 'feed' && (
                    <div className="space-y-6">
                        {community.feed.length > 0 ? (
                            community.feed.map(post => (
                                <PostCard 
                                    key={post.id} 
                                    post={post} 
                                    currentUser={currentUser}
                                    onSpark={onSparkPost}
                                    onComment={onCommentPost}
                                    onStartConversation={() => {}} 
                                />
                            ))
                        ) : (
                            <div className="text-center py-20 text-gray-500 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
                                <p>No posts yet. Be the first to post!</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'showcase' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {community.showcase.map(creation => (
                            <CreationCard key={creation.id} creation={creation} />
                        ))}
                        {community.showcase.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-500 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
                                <p>The showcase is empty.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {community.members.map((member, idx) => {
                            const user = allUsers.find(u => u.id === member.userId);
                            if (!user) return null;
                            return (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-white/5 hover:bg-gray-800 transition-colors">
                                    <UserAvatar src={user.avatarUrl} size="12" />
                                    <div>
                                        <h3 className="font-bold text-white">{user.name}</h3>
                                        <p className="text-xs text-cyan-400 uppercase font-bold tracking-wider">{member.role}</p>
                                        <p className="text-xs text-gray-500">Joined {member.joinedAt}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <InviteModal 
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                targetName={community.name}
                targetType="Community"
                inviteLink={`https://sparkzone.app/community/${community.id}`}
                onSendInvite={onSendInvite || (() => {})}
                users={allUsers || []}
                currentUser={currentUser}
            />
        </div>
    );
};

export default CommunityPage;
