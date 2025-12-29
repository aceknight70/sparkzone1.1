
import React, { useState, useEffect } from 'react';
import { Page, User, UserCreation, Post, Notification, Conversation, World, Story, Party, Community, Character, MemeTemplate, Message, MessageType, Comment } from '../types';
import { initialUserCreations, posts as initialPosts, communities as initialCommunities, parties as initialParties, stories as initialStories, worlds as initialWorlds, conversations as initialConversations, allUsers, mockNotifications, characters as allCharacters, comments as initialComments } from '../mockData';
import NavBar from '../components/NavBar';
import HomePage from './HomePage';
import ExplorePage from './ExplorePage';
import WorkshopPage from './WorkshopPage';
import PartyPage from './PartyPage';
import MessengerPage from './MessengerPage';
import ProfilePage from './ProfilePage';
import NotificationsPage from './NotificationsPage';

// Overlays / Full Page Views
import ProfileEditorPage from './ProfileEditorPage';
import SparkClashPage from './SparkClashPage';
import ShopView from '../components/ShopView';
import CharacterCreationPage from './CharacterCreationPage';
import WorldCreationPage from './WorldCreationPage';
import StoryCreationPage from './StoryCreationPage';
import PartyWorkshopPage from './PartyWorkshopPage';
import StoryWorkshopPage from './StoryWorkshopPage';
import WorldWorkshop from './WorldWorkshop';
import CharacterPage from './CharacterPage';
import StoryReaderPage from './StoryReaderPage';
import WorldPage from './WorldPage';
import PartyViewPage from './PartyViewPage';
import CommunityCreationPage from './CommunityCreationPage';
import CommunityPage from './CommunityPage';
import CommunityWorkshopPage from './CommunityWorkshopPage';
import SkynetModal from '../components/SkynetModal';
import SonicJukebox from '../components/SonicJukebox';
import MemeCreationPage from './MemeCreationPage';
import CommentModal from '../components/CommentModal';
import WorldSettingsPage from './WorldSettingsPage';

interface MainAppProps {
    initialCurrentUser: User;
}

interface OverlayState {
    type: string;
    id?: number | string;
    data?: any;
}

const MainApp: React.FC<MainAppProps> = ({ initialCurrentUser }) => {
    const [currentUser, setCurrentUser] = useState<User>(initialCurrentUser);
    const [activePage, setActivePage] = useState<Page>(Page.Home);
    const [overlay, setOverlay] = useState<OverlayState | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    
    // Data State
    const [userCreations, setUserCreations] = useState<UserCreation[]>(initialUserCreations);
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [allComments, setAllComments] = useState<Comment[]>(initialComments);
    const [communities, setCommunities] = useState<Community[]>(initialCommunities);
    const [parties, setParties] = useState<Party[]>(initialParties);
    const [stories, setStories] = useState<Story[]>(initialStories);
    const [worlds, setWorlds] = useState<World[]>(initialWorlds);
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [users, setUsers] = useState<User[]>(allUsers);

    // Global UI State
    const [currentMusic, setCurrentMusic] = useState<string | null>(null);
    const [skynetWarning, setSkynetWarning] = useState<{type: string, count: number} | null>(null);

    // --- Handlers ---

    const handleUpdateProfile = (updates: Partial<User>) => {
        setCurrentUser(prev => ({ ...prev, ...updates }));
    };

    const handleOverlay = (state: OverlayState | null) => {
        setOverlay(state);
    };

    const handleCreatePost = (content: string, character?: UserCreation, media?: { type: 'image' | 'video', url: string }) => {
        const newPost: Post = {
            id: Date.now(),
            author: currentUser,
            character,
            content,
            timestamp: 'Just now',
            sparks: 0,
            sparkedBy: [],
            comments: 0,
            media
        };
        setPosts([newPost, ...posts]);
    };

    const handleSparkPost = (postId: number) => {
        setPosts(prevPosts => prevPosts.map(post => {
            if (post.id === postId) {
                const isSparked = post.sparkedBy.includes(currentUser.id);
                return {
                    ...post,
                    sparks: isSparked ? post.sparks - 1 : post.sparks + 1,
                    sparkedBy: isSparked 
                        ? post.sparkedBy.filter(id => id !== currentUser.id)
                        : [...post.sparkedBy, currentUser.id]
                };
            }
            return post;
        }));
    };

    const handleOpenComments = (postId: number) => {
        setOverlay({ type: 'comments', id: postId });
    };

    const handleSubmitComment = (postId: number, content: string, character?: UserCreation) => {
        const newComment: Comment = {
            id: Date.now(),
            postId,
            author: currentUser,
            character,
            content,
            timestamp: 'Just now',
            sparks: 0,
            sparkedBy: []
        };
        
        setAllComments(prev => [...prev, newComment]);
        
        // Update post comment count
        setPosts(prev => prev.map(p => 
            p.id === postId ? { ...p, comments: p.comments + 1 } : p
        ));
    };

    const handleSparkComment = (commentId: number) => {
        setAllComments(prev => prev.map(c => {
            if (c.id === commentId) {
                const isSparked = c.sparkedBy.includes(currentUser.id);
                return {
                    ...c,
                    sparks: isSparked ? c.sparks - 1 : c.sparks + 1,
                    sparkedBy: isSparked
                        ? c.sparkedBy.filter(id => id !== currentUser.id)
                        : [...c.sparkedBy, currentUser.id]
                };
            }
            return c;
        }));
    };

    const handleStartConversation = (userId: number) => {
        const existing = conversations.find(c => c.participant.id === userId);
        if (existing) {
            setActivePage(Page.Messenger);
            return existing.id;
        }
        const user = users.find(u => u.id === userId);
        if (user) {
            const newConvo: Conversation = {
                id: Date.now(),
                participant: user,
                messages: [],
                unreadCount: 0
            };
            setConversations([newConvo, ...conversations]);
            setActivePage(Page.Messenger);
            return newConvo.id;
        }
        return 0;
    };

    const handleCreateMeme = (memeData: { name: string; imageUrl: string }) => {
        const newMeme: UserCreation = {
            id: Date.now(),
            type: 'Meme',
            name: memeData.name,
            imageUrl: memeData.imageUrl,
            status: 'Active',
            authorId: currentUser.id
        };
        setUserCreations(prev => [...prev, newMeme]);
        setOverlay(null);
    };

    // --- Chat Handlers ---

    const handleSendMessage = (conversationId: number, text: string, character?: UserCreation, imageUrl?: string, audioUrl?: string, type?: MessageType, metadata?: any) => {
        setConversations(prev => prev.map(c => {
            if (c.id === conversationId) {
                return {
                    ...c,
                    messages: [...c.messages, {
                        id: Date.now(),
                        text,
                        senderId: currentUser.id,
                        timestamp: 'Just now',
                        character,
                        imageUrl,
                        audioUrl,
                        type,
                        metadata
                    }]
                };
            }
            return c;
        }));
    };

    const handleSendPartyMessage = (partyId: number, text: string, character?: UserCreation, imageUrl?: string, audioUrl?: string) => {
        setParties(prev => prev.map(p => {
            if (p.id === partyId) {
                return {
                    ...p,
                    chat: [...p.chat, {
                        id: Date.now(),
                        text,
                        timestamp: 'Just now',
                        sender: currentUser,
                        character,
                        imageUrl,
                        audioUrl
                    }]
                };
            }
            return p;
        }));
    };

    const handleSendWorldMessage = (worldId: number, locationId: number, text: string, character?: UserCreation, imageUrl?: string) => {
        setWorlds(prev => prev.map(w => {
            if (w.id === worldId) {
                return {
                    ...w,
                    locations: w.locations.map(cat => ({
                        ...cat,
                        channels: cat.channels.map(chan => {
                            if (chan.id === locationId) {
                                return {
                                    ...chan,
                                    messages: [...chan.messages, {
                                        id: Date.now(),
                                        text,
                                        timestamp: 'Just now',
                                        sender: { id: currentUser.id, name: currentUser.name, avatarUrl: currentUser.avatarUrl, role: 'Member' },
                                        character,
                                        imageUrl
                                    }]
                                };
                            }
                            return chan;
                        })
                    }))
                };
            }
            return w;
        }));
    };

    const renderOverlay = () => {
        if (!overlay) return null;
        switch (overlay.type) {
            case 'comments': {
                const post = posts.find(p => p.id === overlay.id) || communities.flatMap(c => c.feed).find(p => p.id === overlay.id);
                if (!post) return null;
                const postComments = allComments.filter(c => c.postId === post.id);
                return (
                    <CommentModal 
                        post={post}
                        comments={postComments}
                        currentUser={currentUser}
                        userCreations={userCreations}
                        allUsers={users}
                        onClose={() => setOverlay(null)}
                        onCreateComment={handleSubmitComment}
                        onSparkComment={handleSparkComment}
                    />
                );
            }
            case 'profile-edit':
                return <ProfileEditorPage currentUser={currentUser} onSave={(u) => { handleUpdateProfile(u); setOverlay(null); }} onExit={() => setOverlay(null)} />;
            case 'spark-clash':
                return <SparkClashPage currentUser={currentUser} onExit={() => setOverlay(null)} userCreations={userCreations} onUpdateUser={handleUpdateProfile} />;
            case 'shop':
                return <ShopView currentUser={currentUser} onClose={() => setOverlay(null)} onPurchase={(item) => alert(`Purchased ${item.name}`)} />;
            case 'character-create':
                return <CharacterCreationPage onExit={() => setOverlay(null)} onSave={(char) => { setUserCreations([...userCreations, { ...char, id: Date.now(), status: 'Active', authorId: currentUser.id } as UserCreation]); setOverlay(null); }} />;
            case 'character-edit': {
                const char = userCreations.find(c => c.id === overlay.id) as Character;
                return char ? <CharacterCreationPage characterToEdit={char} onExit={() => setOverlay(null)} onSave={(updated) => { setUserCreations(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } as UserCreation : c)); setOverlay(null); }} /> : null;
            }
            case 'character-view': {
                const char = userCreations.find(c => c.id === overlay.id) as Character || (allCharacters.find(c => c.id === overlay.id) as Character);
                return char ? <CharacterPage character={char} onExit={() => setOverlay(null)} onViewCharacter={(id) => handleOverlay({type: 'character-view', id})} onEdit={() => handleOverlay({type: 'character-edit', id: char.id})} onStartConversation={handleStartConversation} currentUser={currentUser} /> : null;
            }
            case 'world-create':
                return <WorldCreationPage onExit={() => setOverlay(null)} onCreate={(w) => { const newWorld = { ...w, id: Date.now(), authorId: currentUser.id, lorebook: [], members: [{id: currentUser.id, name: currentUser.name, role: 'Creator'}], locations: [], roles: [] } as World; setWorlds([...worlds, newWorld]); setUserCreations([...userCreations, { ...newWorld, type: 'World', status: 'Active', imageUrl: newWorld.imageUrl || '' }]); setOverlay(null); }} />;
            case 'world-edit': {
                const world = worlds.find(w => w.id === overlay.id);
                return world ? <WorldWorkshop world={world} onExit={() => setOverlay(null)} onSave={(updated) => { setWorlds(prev => prev.map(w => w.id === updated.id ? updated : w)); setOverlay(null); }} /> : null;
            }
            case 'world-settings': {
                const world = worlds.find(w => w.id === overlay.id);
                return world ? (
                    <WorldSettingsPage 
                        world={world} 
                        onExit={() => setOverlay(null)} 
                        onOpenManage={() => handleOverlay({type: 'world-edit', id: world.id})} 
                        onUpdate={(updated) => setWorlds(prev => prev.map(w => w.id === world.id ? { ...w, ...updated } : w))}
                    />
                ) : null;
            }
            case 'world-view': {
                const world = worlds.find(w => w.id === overlay.id);
                return world ? <WorldPage world={world} onExit={() => setOverlay(null)} onSendGroupMessage={handleSendWorldMessage} userCreations={userCreations} onStartConversation={handleStartConversation} currentUser={currentUser} onJoinWorld={(id) => alert(`Joined world ${id}`)} onPlayMusic={setCurrentMusic} onOpenSettings={() => handleOverlay({type: 'world-settings', id: world.id})} /> : null;
            }
            case 'story-create':
                return <StoryCreationPage 
                    onExit={() => setOverlay(null)} 
                    onCreate={(s) => { 
                        const newStory = { ...s, id: Date.now(), authorId: currentUser.id, status: 'Draft', chapters: [] } as Story; 
                        setStories([...stories, newStory]); 
                        setUserCreations([...userCreations, { ...newStory, type: 'Story', status: 'Draft', imageUrl: newStory.imageUrl || '' }]); 
                        setOverlay(null); 
                    }} 
                    userCreations={userCreations}
                    currentUser={currentUser}
                    initialData={overlay.data}
                />;
            case 'story-edit': {
                const story = stories.find(s => s.id === overlay.id);
                return story ? <StoryWorkshopPage story={story} onExit={() => setOverlay(null)} onSave={(updated) => { setStories(prev => prev.map(s => s.id === updated.id ? updated : s)); setOverlay(null); }} /> : null;
            }
            case 'story-view': {
                const story = stories.find(s => s.id === overlay.id);
                return story ? <StoryReaderPage story={story} onExit={() => setOverlay(null)} onViewCharacter={(id) => handleOverlay({type: 'character-view', id})} onStartConversation={handleStartConversation} currentUser={currentUser} /> : null;
            }
            case 'party-create':
                return <PartyWorkshopPage onExit={() => setOverlay(null)} onSave={(p) => { setParties([...parties, p]); setUserCreations([...userCreations, { ...p, type: 'RP Card', status: 'Active', imageUrl: p.imageUrl || '' }]); setOverlay(null); }} />;
            case 'party-edit': {
                const party = parties.find(p => p.id === overlay.id);
                return party ? <PartyWorkshopPage party={party} onExit={() => setOverlay(null)} onSave={(updated) => { setParties(prev => prev.map(p => p.id === updated.id ? updated : p)); setOverlay(null); }} /> : null;
            }
            case 'party-view': {
                const party = parties.find(p => p.id === overlay.id);
                return party ? <PartyViewPage party={party} onExit={() => setOverlay(null)} onSendMessage={handleSendPartyMessage} userCreations={userCreations} onStartConversation={handleStartConversation} currentUser={currentUser} /> : null;
            }
            case 'community': {
                const community = communities.find(c => c.id === overlay.id);
                return community ? <CommunityPage community={community} onExit={() => setOverlay(null)} currentUser={currentUser} onJoin={() => {}} onLeave={() => {}} onSparkPost={handleSparkPost} onCommentPost={handleOpenComments} allUsers={users} /> : null;
            }
            case 'community-create':
                return <CommunityCreationPage onExit={() => setOverlay(null)} onCreate={(c) => { const newComm = { ...c, id: Date.now(), leaderId: currentUser.id, members: [{userId: currentUser.id, role: 'Leader', joinedAt: new Date().toISOString().split('T')[0]}], showcase: [], feed: [], level: 1, xp: 0 } as Community; setCommunities([...communities, newComm]); setUserCreations([...userCreations, { ...newComm, type: 'Community', status: 'Active', imageUrl: newComm.imageUrl || '' }]); setOverlay(null); }} />;
            case 'meme-create':
                return <MemeCreationPage onExit={() => setOverlay(null)} onSave={handleCreateMeme} />;
            default: return null;
        }
    };

    const renderContent = () => {
        switch (activePage) {
            case Page.Home:
                return <HomePage posts={posts} onCreatePost={handleCreatePost} onSparkPost={handleSparkPost} onCommentPost={handleOpenComments} userCreations={userCreations} currentUser={currentUser} onStartConversation={handleStartConversation} onSelectWorld={(id) => handleOverlay({type: 'world-view', id})} onViewStory={(id) => handleOverlay({type: 'story-view', id})} onStartStoryWithPrompt={(p) => handleOverlay({type: 'story-create', data: {synopsis: p}})} onSelectParty={(id) => handleOverlay({type: 'party-view', id})} />;
            case Page.Explore:
                return <ExplorePage onSelectWorld={(id) => handleOverlay({type: 'world-view', id})} onViewStory={(id) => handleOverlay({type: 'story-view', id})} onSelectParty={(id) => handleOverlay({type: 'party-view', id})} onStartConversation={handleStartConversation} currentUser={currentUser} communities={communities} worlds={worlds} stories={stories} parties={parties} characters={userCreations.filter(c => c.type === 'Character' || c.type === 'AI Character') as any} onSelectCommunity={(id) => handleOverlay({type: 'community', id})} />;
            case Page.Workshop:
                return <WorkshopPage userCreations={userCreations} onCreateCharacter={() => handleOverlay({type: 'character-create'})} onEditCharacter={(id) => handleOverlay({type: 'character-edit', id})} onViewCharacter={(id) => handleOverlay({type: 'character-view', id})} onCreateWorld={() => handleOverlay({type: 'world-create'})} onEditWorld={(id) => handleOverlay({type: 'world-edit', id})} onCreateStory={() => handleOverlay({type: 'story-create'})} onEditStory={(id) => handleOverlay({type: 'story-edit', id})} onViewStory={(id) => handleOverlay({type: 'story-view', id})} onCreateParty={() => handleOverlay({type: 'party-create'})} onEditParty={(id) => handleOverlay({type: 'party-edit', id})} onCreateMeme={() => handleOverlay({type: 'meme-create'})} onCreateCommunity={() => handleOverlay({type: 'community-create'})} onEditCommunity={(id) => handleOverlay({type: 'community-edit', id})} />;
            case Page.Party:
                return <PartyPage parties={parties} currentUser={currentUser} onSelectParty={(id) => handleOverlay({ type: 'party-view', id })} onCreateParty={() => handleOverlay({ type: 'party-create' })} onEditParty={(id) => handleOverlay({ type: 'party-edit', id })} />;
            case Page.Messenger:
                return <MessengerPage conversations={conversations} onSendMessage={handleSendMessage} onCreateConversation={handleStartConversation} userCreations={userCreations} allUsers={users} initialConversationId={null} onClearInitialConversation={() => {}} />;
            case Page.Profile:
                return <ProfilePage currentUser={currentUser} userCreations={userCreations.filter(c => c.authorId === currentUser.id)} allCommunities={communities} onSelectCommunity={(id) => handleOverlay({ type: 'community', id })} onUpdateProfile={handleUpdateProfile} onEditProfile={() => handleOverlay({ type: 'profile-edit' })} onEnterSparkClash={() => handleOverlay({ type: 'spark-clash' })} onOpenShop={() => handleOverlay({ type: 'shop' })} allUsers={users} />;
            case Page.Notifications:
                return <NotificationsPage notifications={notifications} onMarkAsRead={() => {}} onMarkAllAsRead={() => {}} allUsers={users} />;
            default:
                return <HomePage posts={posts} onCreatePost={handleCreatePost} onSparkPost={handleSparkPost} onCommentPost={handleOpenComments} userCreations={userCreations} currentUser={currentUser} onStartConversation={handleStartConversation} onSelectWorld={(id) => handleOverlay({type: 'world-view', id})} onViewStory={(id) => handleOverlay({type: 'story-view', id})} />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#050505] text-white font-sans overflow-hidden">
            {renderOverlay()}
            <div className="flex-grow overflow-hidden flex flex-col">
                <NavBar activePage={activePage} setActivePage={setActivePage} notifications={notifications} />
                <div className="flex-grow overflow-hidden relative">
                    {renderContent()}
                </div>
            </div>
            <SonicJukebox musicUrl={currentMusic} onClear={() => setCurrentMusic(null)} />
            <SkynetModal isOpen={!!skynetWarning} onClose={() => setSkynetWarning(null)} violationType={skynetWarning?.type || ''} warningCount={skynetWarning?.count || 0} />
        </div>
    );
};

export default MainApp;
