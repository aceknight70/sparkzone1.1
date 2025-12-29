
import React, { useState, useRef } from 'react';
import { Community, AgeRating, ContentWarning } from '../types';
import ContentRatingSelector from '../components/ContentRatingSelector';

// Icons
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-500"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;

interface CommunityCreationPageProps {
    onExit: () => void;
    onCreate: (newCommunity: Omit<Community, 'id' | 'leaderId' | 'members' | 'showcase' | 'feed' | 'level' | 'xp'>) => void;
}

const CommunityCreationPage: React.FC<CommunityCreationPageProps> = ({ onExit, onCreate }) => {
    const [name, setName] = useState('');
    const [tag, setTag] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [ageRating, setAgeRating] = useState<AgeRating>('Everyone');
    const [warnings, setWarnings] = useState<ContentWarning[]>([]);
    const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop');
    const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop');

    const bannerInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'avatar') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    if (type === 'banner') setBannerUrl(reader.result);
                    else setAvatarUrl(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreate = () => {
        if (!name || !tag) {
            alert("Community Name and Tag are required.");
            return;
        }
        onCreate({
            type: 'Community',
            name,
            tag: tag.startsWith('[') ? tag : `[${tag}]`,
            description,
            tags,
            imageUrl: avatarUrl,
            bannerUrl,
            isPublic,
            status: 'Active',
            authorId: 0, // Managed by main app
            contentMetadata: { ageRating, warnings }
        });
    };

    return (
        <div className="min-h-screen container mx-auto px-4 py-8 animate-fadeIn overflow-y-auto">
            <div className="flex items-center mb-6">
                <button onClick={onExit} className="p-2 mr-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Back to workshop">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-3xl font-bold text-white">Establish a Community</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="md:col-span-2 space-y-6">
                    {/* Branding Card */}
                    <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
                        
                        {/* Banner Upload */}
                        <div className="relative h-48 rounded-lg bg-cover bg-center group cursor-pointer border-2 border-dashed border-gray-600 hover:border-cyan-500 transition-colors" style={{ backgroundImage: `url(${bannerUrl})` }} onClick={() => bannerInputRef.current?.click()}>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <div className="flex items-center gap-2 text-white font-bold bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                    <PhotoIcon /> Change Banner
                                </div>
                            </div>
                            <input type="file" ref={bannerInputRef} onChange={(e) => handleImageUpload(e, 'banner')} className="hidden" accept="image/*" />
                        </div>

                        {/* Avatar Upload */}
                        <div className="absolute top-40 left-8">
                            <div className="w-24 h-24 rounded-xl border-4 border-gray-900 bg-gray-800 overflow-hidden cursor-pointer group relative" onClick={() => avatarInputRef.current?.click()}>
                                <img src={avatarUrl} alt="Community Avatar" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <PhotoIcon />
                                </div>
                                <input type="file" ref={avatarInputRef} onChange={(e) => handleImageUpload(e, 'avatar')} className="hidden" accept="image/*" />
                            </div>
                        </div>

                        <div className="mt-16 space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Community Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., The Voidwalkers"
                                        className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Clan Tag</label>
                                    <input
                                        type="text"
                                        value={tag}
                                        onChange={(e) => setTag(e.target.value)}
                                        placeholder="e.g. [VOID]"
                                        maxLength={6}
                                        className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 uppercase"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Manifesto / Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What is this community about? What are your goals?"
                                    rows={4}
                                    className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Category Tags</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {tags.map(tag => (
                                        <span key={tag} className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="text-cyan-200 hover:text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    placeholder="e.g. Sci-Fi, Casual, Hardcore RP"
                                    className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                    {/* Settings Card */}
                    <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Settings</h3>
                        
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-white font-medium">Public Listing</p>
                                <p className="text-sm text-gray-400">Allow anyone to find this community.</p>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={isPublic} 
                                onChange={(e) => setIsPublic(e.target.checked)} 
                                className="w-5 h-5 rounded bg-gray-800 border-gray-600 text-cyan-500 focus:ring-cyan-500"
                            />
                        </div>

                        <ContentRatingSelector 
                            rating={ageRating} 
                            setRating={setAgeRating} 
                            warnings={warnings} 
                            setWarnings={setWarnings}
                            title="Community Rating"
                            contentToAnalyze={description}
                        />
                    </div>

                    <button 
                        onClick={handleCreate}
                        className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg rounded-lg shadow-lg shadow-cyan-500/30 hover:scale-[1.02] transition-all"
                    >
                        Found Community
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunityCreationPage;
