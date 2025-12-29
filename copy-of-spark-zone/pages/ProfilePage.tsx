
import React, { useState, useMemo } from 'react';
import UserAvatar from '../components/UserAvatar';
import CreationCard from '../components/CreationCard';
import CommunityCard from '../components/CommunityCard';
import ContentRatingSelector from '../components/ContentRatingSelector';
import { UserCreation, User, Community, Notification } from '../types';
import { mockNotifications } from '../mockData';

// --- Icons ---
const GearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 0013.484 0 .75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 16.03A.75.75 0 018.8 15.5h2.4a.75.75 0 01.75.75 1.5 1.5 0 01-3 0z" clipRule="evenodd" /></svg>;
const WalletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M2.5 4.5A2.5 2.5 0 015 2h10a2.5 2.5 0 012.5 2.5v2.5a.75.75 0 01-1.5 0v-2.5a1 1 0 00-1-1H5a1 1 0 00-1 1v11a1 1 0 001 1h5a.75.75 0 010 1.5H5a2.5 2.5 0 01-2.5-2.5V4.5z" /><path d="M18.98 12.02a.75.75 0 01.75-.75h.001a1.5 1.5 0 011.5 1.5v.001a.75.75 0 01-1.5 0v-.001a.75.75 0 00-.75-.75h-.001a.75.75 0 01-.75.75zm-1.72-1.72a.75.75 0 00-.75.75v5.44l-1.97-1.97a.75.75 0 10-1.06 1.06l3.25 3.25a.75.75 0 001.06 0l3.25-3.25a.75.75 0 10-1.06-1.06l-1.97 1.97V11.25a.75.75 0 00-.75-.75z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const FlagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 3.5c0-.266.102-.523.284-.716A.994.994 0 014 2.5h8.75c.426 0 .827.257.975.625l.875 2.187 1.925-.77a.75.75 0 01.89.334l.5 1.25a.75.75 0 01-.22.882l-2.153 1.615c.013.129.02.26.02.392 0 2.761-2.686 5-6 5s-6-2.239-6-5c0-.133.007-.264.02-.393L.505 6.013a.75.75 0 01-.22-.882l.5-1.25a.75.75 0 01.89-.334l1.925.77L4.5 2.125z" clipRule="evenodd" /><path d="M3 15.5v3.75a.75.75 0 001.5 0V15.5H3z" /></svg>;
const GameIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.2a2.25 2.25 0 001.428-1.97V5.125A2.25 2.25 0 0111.688 2.9l1.84 1.84a2.25 2.25 0 01.65 1.65V18a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 18v-3.15z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" /><path fillRule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clipRule="evenodd" /></svg>;

interface ProfilePageProps {
    currentUser: User;
    userCreations: UserCreation[];
    allCommunities: Community[];
    onSelectCommunity: (communityId: number) => void;
    onUpdateProfile: (updatedData: Partial<User>) => void;
    onEditProfile: () => void;
    onEnterSparkClash: () => void;
    onOpenShop: () => void;
    allUsers: User[];
}

type ProfileView = 'profile' | 'wallet' | 'notifications' | 'friends' | 'feedback' | 'settings';

const ProfilePage: React.FC<ProfilePageProps> = ({ 
    currentUser, 
    userCreations, 
    allCommunities, 
    onSelectCommunity, 
    onUpdateProfile,
    onEditProfile,
    onEnterSparkClash,
    onOpenShop,
    allUsers
}) => {
    const [activeView, setActiveView] = useState<ProfileView>('profile');
    const [creationFilter, setCreationFilter] = useState<'All' | 'Character' | 'World' | 'Story'>('All');
    const [friendSearchTerm, setFriendSearchTerm] = useState('');

    const joinedCommunities = allCommunities.filter(c => currentUser.communityIds?.includes(c.id));
    
    // --- Sub-Views ---

    const WalletView = () => (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-yellow-600 to-amber-700 rounded-xl p-6 shadow-lg border border-yellow-500/30 text-center">
                <h3 className="text-lg font-bold text-yellow-100 uppercase tracking-widest mb-1">Total Balance</h3>
                <div className="text-5xl font-black text-white flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-yellow-300"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>
                    {currentUser.sparkClashProfile?.sparks || 0}
                </div>
                <button onClick={onOpenShop} className="mt-4 px-6 py-2 bg-white text-amber-800 font-bold rounded-full hover:bg-yellow-100 transition-colors shadow-lg">
                    Add Funds
                </button>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg border border-violet-500/30 p-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Transaction History</h4>
                <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded border border-gray-700">
                        <div>
                            <p className="font-bold text-white">Daily Login Bonus</p>
                            <p className="text-xs text-gray-500">Today</p>
                        </div>
                        <span className="text-green-400 font-mono font-bold">+100</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/40 rounded border border-gray-700">
                        <div>
                            <p className="font-bold text-white">Card Pack (Common)</p>
                            <p className="text-xs text-gray-500">Yesterday</p>
                        </div>
                        <span className="text-red-400 font-mono font-bold">-50</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const NotificationsView = () => (
        <div className="max-w-2xl mx-auto animate-fadeIn">
            <h3 className="text-2xl font-bold text-white mb-6">Notifications</h3>
            <div className="bg-gray-900/50 rounded-lg border border-violet-500/30 divide-y divide-gray-800">
                {mockNotifications.map(n => (
                    <div key={n.id} className="p-4 flex gap-4 hover:bg-white/5 transition-colors">
                        <div className="w-2 h-2 mt-2 rounded-full bg-cyan-500 flex-shrink-0"></div>
                        <div>
                            <p className="text-white text-sm">{n.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{n.timestamp}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const FriendsView = () => {
        const following = allUsers.filter(u => currentUser.followingIds?.includes(u.id));
        
        // If searching, search global users. If not, show following.
        const usersToDisplay = friendSearchTerm 
            ? allUsers.filter(u => u.name.toLowerCase().includes(friendSearchTerm.toLowerCase()) && u.id !== currentUser.id)
            : following;

        const toggleFollow = (userId: number) => {
            const isFollowing = currentUser.followingIds?.includes(userId);
            let newFollowingIds = currentUser.followingIds || [];
            if (isFollowing) {
                newFollowingIds = newFollowingIds.filter(id => id !== userId);
            } else {
                newFollowingIds = [...newFollowingIds, userId];
            }
            onUpdateProfile({ followingIds: newFollowingIds });
        };

        return (
            <div className="max-w-2xl mx-auto animate-fadeIn">
                <h3 className="text-2xl font-bold text-white mb-6">Friends & Connections</h3>
                
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        placeholder="Search for new friends..." 
                        value={friendSearchTerm}
                        onChange={(e) => setFriendSearchTerm(e.target.value)}
                        className="w-full bg-gray-900 border border-violet-500/30 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <div className="absolute left-4 top-3.5 text-gray-400"><SearchIcon /></div>
                </div>

                <div className="bg-gray-900/50 rounded-lg border border-violet-500/30 divide-y divide-gray-800">
                    {usersToDisplay.length > 0 ? usersToDisplay.map(user => {
                        const isFollowing = currentUser.followingIds?.includes(user.id);
                        return (
                            <div key={user.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <UserAvatar src={user.avatarUrl} size="10" />
                                    <div>
                                        <p className="font-bold text-white">{user.name}</p>
                                        <p className="text-xs text-gray-400">@{user.name.toLowerCase().replace(/\s+/g, '_')}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => toggleFollow(user.id)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${isFollowing ? 'border-red-500/50 text-red-400 hover:bg-red-900/20' : 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/20'}`}
                                >
                                    {isFollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            </div>
                        );
                    }) : (
                        <div className="p-8 text-center text-gray-500">
                            {friendSearchTerm ? "No users found matching your search." : "You aren't following anyone yet."}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const FeedbackView = () => (
        <div className="max-w-xl mx-auto animate-fadeIn">
            <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-2">Send Feedback</h3>
                <p className="text-gray-400 text-sm mb-6">Found a bug? Have a feature request? Let the developers know directly.</p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Topic</label>
                        <select className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white outline-none focus:border-cyan-500">
                            <option>Feature Request</option>
                            <option>Bug Report</option>
                            <option>General Feedback</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message</label>
                        <textarea rows={5} className="w-full bg-black/40 border border-gray-700 rounded p-2 text-white outline-none focus:border-cyan-500 resize-none" placeholder="Type your message here..."></textarea>
                    </div>
                    <button className="w-full py-2 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-500 transition-colors">
                        Submit Feedback
                    </button>
                </div>
            </div>
        </div>
    );

    const SettingsView = () => (
        <div className="max-w-2xl mx-auto animate-fadeIn space-y-8">
            <h3 className="text-2xl font-bold text-white mb-6">Account Settings</h3>
            
            <ContentRatingSelector 
                title="Defense System (Content Filter)"
                ratingLabel="Max Allowed Age Rating"
                warningsLabel="Blocked Content Tags (Filter out posts with these tags)"
                rating={currentUser.safetySettings?.maxAgeRating || 'Mature'}
                setRating={(r) => onUpdateProfile({ safetySettings: { ...currentUser.safetySettings, maxAgeRating: r, blockedTags: currentUser.safetySettings?.blockedTags || [] } })}
                warnings={currentUser.safetySettings?.blockedTags || []}
                setWarnings={(w) => onUpdateProfile({ safetySettings: { ...currentUser.safetySettings, maxAgeRating: currentUser.safetySettings?.maxAgeRating || 'Mature', blockedTags: w } })}
            />

            <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h4 className="text-lg font-bold text-red-400">Log Out</h4>
                    <p className="text-sm text-gray-400">End your current session.</p>
                </div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors flex items-center gap-2"
                >
                    <LogoutIcon />
                    Logout
                </button>
            </div>
        </div>
    );

    const MainProfileView = () => {
        const filteredCreations = userCreations.filter(c => creationFilter === 'All' || c.type === creationFilter);
        return (
            <div className="animate-fadeIn">
                {/* Stats & Actions Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <button onClick={onEditProfile} className="bg-gray-800/60 p-4 rounded-xl border border-gray-700 hover:border-cyan-500 transition-colors flex flex-col items-center gap-2 group">
                        <PencilIcon />
                        <span className="text-xs font-bold text-gray-400 group-hover:text-cyan-400">Edit Profile</span>
                    </button>
                    <button onClick={onEnterSparkClash} className="bg-gray-800/60 p-4 rounded-xl border border-gray-700 hover:border-yellow-500 transition-colors flex flex-col items-center gap-2 group">
                        <GameIcon />
                        <span className="text-xs font-bold text-gray-400 group-hover:text-yellow-400">Spark Clash</span>
                    </button>
                    <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{userCreations.length}</span>
                        <span className="text-xs font-bold text-gray-500">Creations</span>
                    </div>
                    <div className="bg-gray-800/40 p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{currentUser.followingIds?.length || 0}</span>
                        <span className="text-xs font-bold text-gray-500">Following</span>
                    </div>
                </div>

                {/* Communities Section */}
                <div className="mb-10">
                    <h3 className="text-xl font-bold text-white mb-4">Communities</h3>
                    {joinedCommunities.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {joinedCommunities.map(c => (
                                <CommunityCard key={c.id} community={c} onClick={() => onSelectCommunity(c.id)} isMember />
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center border border-dashed border-gray-700 rounded-xl">
                            <p className="text-gray-500">Not a member of any communities yet.</p>
                        </div>
                    )}
                </div>

                {/* Creations Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Workshop Showcase</h3>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                            {['All', 'Character', 'World', 'Story'].map(f => (
                                <button 
                                    key={f} 
                                    onClick={() => setCreationFilter(f as any)} 
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${creationFilter === f ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredCreations.map(creation => (
                            <CreationCard key={creation.id} creation={creation} />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full w-full bg-black overflow-hidden flex flex-col">
            {/* Top Bar with Back Button when in sub-view */}
            {activeView !== 'profile' && (
                <div className="p-4 border-b border-white/10 flex items-center gap-2 flex-shrink-0 bg-black/50 backdrop-blur-md z-10">
                    <button onClick={() => setActiveView('profile')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                        <ArrowLeftIcon />
                    </button>
                    <span className="font-bold text-white uppercase tracking-wider text-sm">{activeView}</span>
                </div>
            )}

            {/* Profile Header (Only visible on main profile view) */}
            {activeView === 'profile' && (
                <div className="relative flex-shrink-0">
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${currentUser.bannerUrl || 'https://via.placeholder.com/1200x300'})` }}>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
                    </div>
                    <div className="absolute -bottom-16 left-6 flex items-end">
                        <UserAvatar src={currentUser.avatarUrl} size="32" className="border-4 border-black" />
                        <div className="mb-4 ml-4">
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                                {currentUser.name}
                                {currentUser.isPremium && <span className="text-yellow-400 text-lg" title="Premium Member">★</span>}
                            </h1>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-300 mt-1 mb-2">
                                {currentUser.pronouns && <span className="bg-gray-800 px-2 py-0.5 rounded text-xs border border-gray-700">{currentUser.pronouns}</span>}
                                {currentUser.age && <span>{currentUser.age} y/o</span>}
                                {currentUser.gender && <span>{currentUser.gender}</span>}
                                {currentUser.nationality && <span className="flex items-center gap-1">📍 {currentUser.nationality}</span>}
                            </div>
                            <p className="text-gray-400 max-w-md line-clamp-2">{currentUser.bio || "No bio set."}</p>
                        </div>
                    </div>
                    
                    {/* Floating Menu Button */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button onClick={() => setActiveView('wallet')} className="p-2 bg-black/60 rounded-full text-yellow-400 hover:bg-yellow-500 hover:text-black transition-colors" title="Wallet">
                            <WalletIcon />
                        </button>
                        <button onClick={() => setActiveView('friends')} className="p-2 bg-black/60 rounded-full text-green-400 hover:bg-green-500 hover:text-black transition-colors" title="Friends">
                            <UsersIcon />
                        </button>
                        <button onClick={() => setActiveView('notifications')} className="p-2 bg-black/60 rounded-full text-blue-400 hover:bg-blue-500 hover:text-black transition-colors" title="Notifications">
                            <BellIcon />
                        </button>
                        <button onClick={() => setActiveView('feedback')} className="p-2 bg-black/60 rounded-full text-gray-400 hover:bg-white hover:text-black transition-colors" title="Feedback">
                            <FlagIcon />
                        </button>
                        <button onClick={() => setActiveView('settings')} className="p-2 bg-black/60 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors" title="Settings">
                            <GearIcon />
                        </button>
                    </div>
                </div>
            )}

            {/* Scrollable Content Area */}
            <div className={`flex-grow overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 ${activeView === 'profile' ? 'mt-16' : ''}`}>
                {activeView === 'profile' && <MainProfileView />}
                {activeView === 'wallet' && <WalletView />}
                {activeView === 'notifications' && <NotificationsView />}
                {activeView === 'friends' && <FriendsView />}
                {activeView === 'feedback' && <FeedbackView />}
                {activeView === 'settings' && <SettingsView />}
            </div>
        </div>
    );
};

export default ProfilePage;
