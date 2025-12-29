
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Story, CodexItem, Character, LoreEntry, User } from '../types';
import { characters as allCharacters, allUsers } from '../mockData';
import UserAvatar from '../components/UserAvatar';
import ShareButton from '../components/ShareButton';

// --- ICONS ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;

// --- INTERACTIVE CODEX COMPONENTS ---

const Tooltip: React.FC<{ content: React.ReactNode; children: React.ReactNode }> = ({ content, children }) => {
  return (
    <span className="relative group inline-block cursor-pointer">
      <span className="text-cyan-400 font-semibold underline decoration-dotted decoration-cyan-400/50 underline-offset-2">
          {children}
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 border border-violet-500/50 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        {content}
      </div>
    </span>
  );
};

const CodexTooltipContent: React.FC<{ item: CodexItem, onViewCharacter?: (id: number) => void }> = ({ item, onViewCharacter }) => {
    if (item.type === 'character') {
        const char = item.data;
        return (
            <button 
                onClick={(e) => { e.stopPropagation(); onViewCharacter?.(char.id); }}
                className="flex items-center gap-3 text-left w-full hover:bg-violet-500/10 p-1 rounded-md"
            >
                <UserAvatar src={char.imageUrl} size="12" />
                <div>
                    <p className="font-bold text-white">{char.name}</p>
                    <p className="text-xs text-cyan-300">{char.epithet}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{char.tagline}</p>
                </div>
            </button>
        );
    }
    if (item.type === 'lore') {
        const lore = item.data;
        return (
            <div>
                <p className="font-bold text-white">{lore.name}</p>
                <p className="text-xs text-cyan-300 mb-1">{lore.category}</p>
                <p className="text-xs text-gray-400 line-clamp-3">{lore.description}</p>
            </div>
        )
    }
    return null;
}

const InteractiveText: React.FC<{ text: string; codex: Map<string, CodexItem>, onViewCharacter?: (id: number) => void }> = ({ text, codex, onViewCharacter }) => {
    const parts = useMemo(() => {
        if (!codex.size) return [text];
        const regex = new RegExp(`\\b(${Array.from(codex.keys()).join('|')})\\b`, 'gi');
        return text.split(regex);
    }, [text, codex]);

    return (
        <>
            {parts.map((part, index) => {
                const codexItem = codex.get(part.toLowerCase());
                if (codexItem) {
                    return (
                        <Tooltip key={index} content={<CodexTooltipContent item={codexItem} onViewCharacter={onViewCharacter}/>}>
                            {part}
                        </Tooltip>
                    );
                }
                return <React.Fragment key={index}>{part}</React.Fragment>;
            })}
        </>
    );
};

// --- MAIN READER PAGE ---

interface StoryReaderPageProps {
    story: Story;
    onExit: () => void;
    onViewCharacter: (characterId: number) => void;
    onStartConversation: (userId: number) => void;
    currentUser: User;
}

const StoryReaderPage: React.FC<StoryReaderPageProps> = ({ story, onExit, onViewCharacter, onStartConversation, currentUser }) => {
    const publishedChapters = story.chapters.filter(c => c.status === 'Published');
    const author = allUsers.find(u => u.id === story.authorId);
    const isOwnStory = story.authorId === currentUser.id;
    
    // Background State
    const [currentBackground, setCurrentBackground] = useState<string>(story.imageUrl);
    
    // Codex Setup
    const codex = useMemo(() => {
        const map = new Map<string, CodexItem>();
        story.cast.forEach(castMember => {
            const character = allCharacters.find(c => c.id === castMember.characterId);
            if (character) {
                map.set(character.name.toLowerCase(), { type: 'character', data: character });
            }
        });
        story.lorebook.forEach(loreItem => {
            map.set(loreItem.name.toLowerCase(), { type: 'lore', data: loreItem });
        });
        return map;
    }, [story]);

    // Intersection Observer for Background Swapping
    useEffect(() => {
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bgUrl = entry.target.getAttribute('data-bg');
                    if (bgUrl && bgUrl !== currentBackground) {
                        setCurrentBackground(bgUrl);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.6 // Trigger when 60% of paragraph is visible
        });

        const blocks = document.querySelectorAll('.story-block');
        blocks.forEach(block => observer.observe(block));

        return () => observer.disconnect();
    }, [publishedChapters, currentBackground]);
    
    return (
        <div className="min-h-screen animate-fadeIn bg-black transition-colors duration-300 relative overflow-x-hidden">
            
            {/* Dynamic Background Layer */}
            <div 
                className="fixed inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out opacity-40 transform scale-105 pointer-events-none"
                style={{ backgroundImage: `url(${currentBackground})` }}
            ></div>
            <div className="fixed inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>
            
            <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-black/60 backdrop-blur-md border-b border-white/5">
                <button onClick={onExit} className="flex items-center gap-1.5 text-white bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
                    <ArrowLeftIcon />
                    <span className="text-sm font-medium">Exit</span>
                </button>
                <div className="text-center min-w-0">
                    <h1 className="text-xl font-bold text-white truncate shadow-black drop-shadow-md">{story.name}</h1>
                </div>
                <div className="w-20 flex justify-end">
                    <ShareButton 
                        title={`Read ${story.name}`}
                        text={`Read "${story.name}" on Spark Zone! ${story.synopsis}`}
                        iconOnly
                        className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10"
                    />
                </div>
            </header>
            
            <main className="container mx-auto max-w-2xl px-4 py-8 md:py-16 relative z-10">
                <div className="mb-24 text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] tracking-tight">{story.name}</h1>
                     <div className="flex items-center justify-center gap-4 mt-6">
                        <p className="text-lg text-gray-300 font-medium">
                            By {author ? author.name : 'Unknown Author'}
                        </p>
                        {!isOwnStory && author && (
                            <button onClick={() => onStartConversation(story.authorId)} className="px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/50 rounded-full hover:bg-cyan-500/20 transition-colors uppercase tracking-wider">
                                Message
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-32">
                    {publishedChapters.map(chapter => (
                        <article key={chapter.id}>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-serif font-bold text-cyan-100 mb-2 drop-shadow-lg">{chapter.title}</h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"></div>
                            </div>
                            
                            <div className="space-y-8 text-lg md:text-xl text-gray-100 leading-loose drop-shadow-md font-serif">
                                {chapter.content.split('\n\n').filter(p => p.trim().length > 0).map((paragraph, index) => {
                                    // Check if this paragraph has a visual assigned
                                    const visual = chapter.visuals?.find(v => v.paragraphIndex === index);
                                    const bgUrl = visual ? visual.imageUrl : (index === 0 && chapter.visuals?.length === 0 ? story.imageUrl : undefined); 

                                    return (
                                        <div 
                                            key={index} 
                                            className="story-block p-4 md:p-6 rounded-xl transition-all duration-500 hover:bg-black/40"
                                            data-bg={bgUrl} // Attribute for Observer
                                        >
                                            <InteractiveText text={paragraph} codex={codex} onViewCharacter={onViewCharacter} />
                                        </div>
                                    );
                                })}
                            </div>
                        </article>
                    ))}

                    {publishedChapters.length === 0 && (
                        <div className="text-center py-20 text-gray-400 bg-black/50 rounded-xl backdrop-blur-sm border border-white/5">
                            <p className="text-xl font-light">The story hasn't begun yet.</p>
                            <p className="text-sm mt-2 opacity-70">Check back later for the first chapter.</p>
                        </div>
                    )}
                </div>
                
                <div className="mt-32 text-center text-gray-500 text-sm pb-10">
                    <p>End of current content</p>
                    <div className="w-2 h-2 bg-gray-700 rounded-full mx-auto mt-4"></div>
                </div>
            </main>
        </div>
    );
};

export default StoryReaderPage;
