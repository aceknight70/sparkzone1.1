
import React, { useState } from 'react';
import { World, AgeRating, ContentWarning } from '../types';
import ContentRatingSelector from '../components/ContentRatingSelector';

// Icons
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-500"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;

interface WorldCreationPageProps {
    onExit: () => void;
    onCreate: (newWorld: Omit<World, 'id' | 'author' | 'bannerUrl' | 'lorebook' | 'rules' | 'members' | 'locations'>) => void;
}

const WorldCreationPage: React.FC<WorldCreationPageProps> = ({ onExit, onCreate }) => {
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [ageRating, setAgeRating] = useState<AgeRating>('Everyone');
    const [warnings, setWarnings] = useState<ContentWarning[]>([]);

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = currentTag.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleCreate = () => {
        if (!name) {
            alert("World name is required.");
            return;
        }
        onCreate({
            name,
            tagline,
            synopsis,
            genreTags: tags,
            authorId: 0, // Handled by MainApp
            imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', // Placeholder
            contentMetadata: {
                ageRating,
                warnings
            }
        });
    };

    return (
        <div className="min-h-screen container mx-auto px-4 py-8 animate-fadeIn">
            <div className="flex items-center mb-6">
                <button onClick={onExit} className="p-2 mr-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Back to workshop">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-3xl font-bold text-white">Create a New World</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="md:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-cyan-400 mb-4 border-b border-violet-500/30 pb-2">World Blueprint</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-violet-500/50 px-6 py-10 bg-gray-800/40 hover:border-violet-400 transition-colors cursor-pointer">
                                    <div className="text-center">
                                        <PhotoIcon />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                                            <p className="pl-1">Upload a file or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-500">PNG, JPG up to 10MB</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="world-name" className="block text-sm font-medium text-gray-300 mb-2">World Name</label>
                                <input
                                    type="text"
                                    id="world-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Aethelgard"
                                    className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="world-tagline" className="block text-sm font-medium text-gray-300 mb-2">Tagline</label>
                                <input
                                    type="text"
                                    id="world-tagline"
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                    placeholder="A short, catchy description."
                                    className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="world-synopsis" className="block text-sm font-medium text-gray-300 mb-2">Synopsis</label>
                                <textarea
                                    id="world-synopsis"
                                    value={synopsis}
                                    onChange={(e) => setSynopsis(e.target.value)}
                                    placeholder="Describe the core conflict and setting of your world."
                                    rows={4}
                                    className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="world-tags" className="block text-sm font-medium text-gray-300 mb-2">Genre Tags</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {tags.map(tag => (
                                        <span key={tag} className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="text-cyan-200 hover:text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M2.22 2.22a.75.75 0 011.06 0L8 7.94l4.72-4.72a.75.75 0 111.06 1.06L9.06 8l4.72 4.72a.75.75 0 11-1.06 1.06L8 9.06l-4.72 4.72a.75.75 0 01-1.06-1.06L6.94 8 2.22 3.28a.75.75 0 010-1.06z" /></svg>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    id="world-tags"
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder="e.g., Cyberpunk Fantasy Noir"
                                    className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                                <p className="text-xs text-gray-500 mt-2">Press Space, Enter, or Comma to add a tag.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                    {/* Defense System Card */}
                    <ContentRatingSelector 
                        rating={ageRating} 
                        setRating={setAgeRating} 
                        warnings={warnings} 
                        setWarnings={setWarnings} 
                        contentToAnalyze={synopsis}
                    />

                    <button 
                        onClick={handleCreate}
                        className="w-full px-6 py-4 bg-cyan-500 text-white font-bold text-lg rounded-lg shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
                    >
                        Initialize World
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorldCreationPage;
