
import React, { useState } from 'react';
import { Story, Chapter, UserCreation, User, LoreEntry } from '../types';
import StoryOutlineSidebar from '../components/StoryOutlineSidebar';
import StoryEditorView from '../components/StoryEditorView';
import { currentUser, initialUserCreations } from '../mockData';

interface StoryWorkshopPageProps {
    story: Story;
    onExit: () => void;
    onSave: (story: Story) => void;
}

const EmptyEditorView: React.FC<{ onAddChapter: () => void }> = ({ onAddChapter }) => (
    <div className="flex-grow flex flex-col items-center justify-center text-gray-400 h-full bg-black/40 backdrop-blur-sm rounded-xl border border-white/5 m-4">
        <div className="text-6xl mb-4 opacity-50">📖</div>
        <p className="text-xl font-bold text-white mb-2">The Blank Page Awaits</p>
        <p className="text-sm mb-6 max-w-xs text-center">Select a chapter from the outline or begin a new journey.</p>
        <button 
            onClick={onAddChapter} 
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-full shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] hover:scale-105 transition-all"
        >
            Create Chapter 1
        </button>
    </div>
);

const StoryWorkshopPage: React.FC<StoryWorkshopPageProps> = ({ story: initialStory, onExit, onSave }) => {
    const [story, setStory] = useState<Story>(initialStory);
    const [activeChapterId, setActiveChapterId] = useState<number | null>(story.chapters[0]?.id ?? null);
    const [isEditorVisible, setIsEditorVisible] = useState(false); // Mobile toggle

    const activeChapter = story.chapters.find(c => c.id === activeChapterId);

    // --- Story Level Handlers ---

    const handleStoryUpdate = (updates: Partial<Story>) => {
        setStory(prev => ({ ...prev, ...updates }));
    };

    const handleAddCastMember = (characterId: number) => {
        if (story.cast.some(c => c.characterId === characterId)) return;
        const newCastMember = { characterId, role: 'Supporting Character' };
        setStory(prev => ({ ...prev, cast: [...prev.cast, newCastMember] }));
    };

    const handleRemoveCastMember = (characterId: number) => {
        setStory(prev => ({ ...prev, cast: prev.cast.filter(c => c.characterId !== characterId) }));
    };

    const handleUpdateCastRole = (characterId: number, newRole: string) => {
        setStory(prev => ({
            ...prev,
            cast: prev.cast.map(c => c.characterId === characterId ? { ...c, role: newRole } : c)
        }));
    };

    // --- Lore Handlers ---
    const handleAddLore = (entry: Omit<LoreEntry, 'id'>) => {
        const newEntry: LoreEntry = { ...entry, id: Date.now() };
        setStory(prev => ({ ...prev, lorebook: [...prev.lorebook, newEntry] }));
    };

    const handleDeleteLore = (id: number) => {
        setStory(prev => ({ ...prev, lorebook: prev.lorebook.filter(l => l.id !== id) }));
    };

    // --- Chapter Level Handlers ---

    const handleSelectChapter = (chapter: Chapter) => {
        setActiveChapterId(chapter.id);
        setIsEditorVisible(true);
    };

    const handleChapterUpdate = (field: 'title' | 'content', value: string) => {
        setStory(prevStory => ({
            ...prevStory,
            chapters: prevStory.chapters.map(chapter =>
                chapter.id === activeChapterId ? { ...chapter, [field]: value } : chapter
            ),
        }));
    };

    const handleChapterStatusChange = (chapterId: number, newStatus: 'Draft' | 'Published') => {
        setStory(prev => ({
            ...prev,
            chapters: prev.chapters.map(c => 
                c.id === chapterId ? { ...c, status: newStatus } : c
            )
        }));
    };

    const addChapter = () => {
        const newChapter: Chapter = {
            id: Date.now(),
            title: `Chapter ${story.chapters.length + 1}`,
            content: '',
            status: 'Draft',
        };
        setStory(prev => ({ ...prev, chapters: [...prev.chapters, newChapter] }));
        setActiveChapterId(newChapter.id);
        setIsEditorVisible(true);
    };
    
    const handleSaveAndExit = () => {
        onSave(story);
        // Optional: onExit() called by parent or manual exit
    };

    const userCharacters = initialUserCreations.filter(c => c.type === 'Character' || c.type === 'AI Character');

    return (
        <div className="fixed inset-0 z-[60] flex h-full w-full bg-[#050505] font-sans overflow-hidden">
            {/* Ambient Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-30 blur-xl scale-110 pointer-events-none transition-all duration-1000"
                style={{ backgroundImage: `url(${story.imageUrl})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90 pointer-events-none"></div>

            {/* Mobile View */}
            <div className="md:hidden w-full h-full relative z-10">
                {isEditorVisible && activeChapter ? (
                    <StoryEditorView
                        chapter={activeChapter}
                        cast={story.cast}
                        lorebook={story.lorebook}
                        onChapterUpdate={handleChapterUpdate}
                        onBack={() => setIsEditorVisible(false)}
                        onSave={handleSaveAndExit}
                        storyBannerUrl={story.imageUrl}
                    />
                ) : (
                    <StoryOutlineSidebar
                        story={story}
                        activeChapterId={activeChapterId}
                        onSelectChapter={handleSelectChapter}
                        onAddChapter={addChapter}
                        onExit={onExit}
                        onChapterStatusChange={handleChapterStatusChange}
                        onStoryUpdate={handleStoryUpdate}
                        onAddCastMember={handleAddCastMember}
                        onRemoveCastMember={handleRemoveCastMember}
                        onUpdateCastRole={handleUpdateCastRole}
                        onAddLore={handleAddLore}
                        onDeleteLore={handleDeleteLore}
                        userCreations={userCharacters}
                        currentUser={currentUser}
                    />
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex flex-1 min-w-0 h-full relative z-10">
                <StoryOutlineSidebar
                    story={story}
                    activeChapterId={activeChapterId}
                    onSelectChapter={handleSelectChapter}
                    onAddChapter={addChapter}
                    onExit={onExit}
                    onChapterStatusChange={handleChapterStatusChange}
                    onStoryUpdate={handleStoryUpdate}
                    onAddCastMember={handleAddCastMember}
                    onRemoveCastMember={handleRemoveCastMember}
                    onUpdateCastRole={handleUpdateCastRole}
                    onAddLore={handleAddLore}
                    onDeleteLore={handleDeleteLore}
                    userCreations={userCharacters}
                    currentUser={currentUser}
                />
                
                {activeChapter ? (
                    <StoryEditorView
                        chapter={activeChapter}
                        cast={story.cast}
                        lorebook={story.lorebook}
                        onChapterUpdate={handleChapterUpdate}
                        onSave={handleSaveAndExit}
                        storyBannerUrl={story.imageUrl}
                    />
                ) : (
                    <EmptyEditorView onAddChapter={addChapter} />
                )}
            </div>
        </div>
    );
};

export default StoryWorkshopPage;
