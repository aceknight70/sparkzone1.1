
import React, { useRef } from 'react';
import { World, WorldWorkshopSection } from '../types';
import LorebookSection from './LorebookSection';
import ChannelsSection from './ChannelsSection';
import WorldSettingsSection from './WorldSettingsSection';
import AtlasSection from './AtlasSection';
import ChronicleSection from './ChronicleSection';
import LandingSection from './LandingSection';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-500"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;


// --- Helper Form Components ---
const FormInput: React.FC<{ id: string; name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ id, name, label, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input type="text" id={id} name={name} value={value} onChange={onChange} className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
    </div>
);

const FormTextarea: React.FC<{ id: string; name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ id, name, label, value, onChange, rows = 4 }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <textarea id={id} name={name} value={value} onChange={onChange} rows={rows} className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" />
    </div>
);

const ImageUploadPlaceholder: React.FC<{ label: string; currentImageUrl: string; onImageUpload: (base64Image: string) => void; }> = ({ label, currentImageUrl, onImageUpload }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePlaceholderClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    onImageUpload(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/gif"
            />
            <div 
                onClick={handlePlaceholderClick}
                className="aspect-video rounded-lg border-2 border-dashed border-violet-500/50 bg-cover bg-center transition-colors cursor-pointer group relative overflow-hidden"
                style={{ backgroundImage: `url(${currentImageUrl})` }}
            >
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4">
                    <PhotoIcon />
                    <p className="mt-2 text-sm text-gray-400">Click to upload</p>
                    <p className="text-xs text-gray-500">16:9 recommended</p>
                </div>
            </div>
        </div>
    );
};

// --- Section Components ---

const BlueprintSection: React.FC<{ worldData: World; setWorldData: React.Dispatch<React.SetStateAction<World>> }> = ({ worldData, setWorldData }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setWorldData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (field: 'imageUrl' | 'bannerUrl', base64Image: string) => {
        setWorldData(prev => ({ ...prev, [field]: base64Image }));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = (e.target as HTMLInputElement).value.trim();
            if (newTag && !worldData.genreTags.includes(newTag)) {
                setWorldData(prev => ({ ...prev, genreTags: [...prev.genreTags, newTag] }));
            }
            (e.target as HTMLInputElement).value = '';
        }
    };

    const removeTag = (tagToRemove: string) => {
        setWorldData(prev => ({...prev, genreTags: prev.genreTags.filter(tag => tag !== tagToRemove)}));
    };

    return (
        <div className="p-4 md:p-8">
            <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6 max-w-3xl mx-auto">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 border-b border-violet-500/30 pb-2">Visual Identity</h3>
                <div className="space-y-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        <ImageUploadPlaceholder 
                            label="Cover Image" 
                            currentImageUrl={worldData.imageUrl} 
                            onImageUpload={(img) => handleImageUpload('imageUrl', img)}
                        />
                        <ImageUploadPlaceholder 
                            label="Banner Image" 
                            currentImageUrl={worldData.bannerUrl} 
                            onImageUpload={(img) => handleImageUpload('bannerUrl', img)}
                        />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-cyan-400 mb-4 border-b border-violet-500/30 pb-2">Core Concept</h3>
                <div className="space-y-6">
                    <FormInput id="name" name="name" label="World Name" value={worldData.name} onChange={handleInputChange} />
                    <FormInput id="tagline" name="tagline" label="Tagline" value={worldData.tagline} onChange={handleInputChange} />
                    <FormTextarea id="synopsis" name="synopsis" label="Synopsis" value={worldData.synopsis} onChange={handleInputChange} />
                    <div>
                        <label htmlFor="genreTags" className="block text-sm font-medium text-gray-300 mb-2">Genre Tags</label>
                         <div className="flex flex-wrap gap-2 mb-2">
                            {worldData.genreTags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="text-cyan-200 hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M2.22 2.22a.75.75 0 011.06 0L8 7.94l4.72-4.72a.75.75 0 111.06 1.06L9.06 8l4.72 4.72a.75.75 0 11-1.06 1.06L8 9.06l-4.72 4.72a.75.75 0 01-1.06-1.06L6.94 8 2.22 3.28a.75.75 0 010-1.06z" /></svg>
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input type="text" id="genreTags" onKeyDown={handleTagKeyDown} placeholder="Type a tag and press space..." className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Editor View Component ---

interface WorldEditorViewProps {
    activeSection: WorldWorkshopSection;
    worldData: World;
    setWorldData: React.Dispatch<React.SetStateAction<World>>;
    onBack?: () => void;
    onSave: () => void;
}

const WorldEditorView: React.FC<WorldEditorViewProps> = ({ activeSection, worldData, setWorldData, onBack, onSave }) => {
    
    const sectionTitles: Record<WorldWorkshopSection, string> = {
        landing: 'Entrance & Introduction',
        blueprint: 'Blueprint',
        lorebook: 'Lorebook',
        channels: 'Channels & Roles',
        settings: 'Settings',
        atlas: 'Interactive Atlas',
        chronicle: 'The Chronicle',
    };
    
    const renderSection = () => {
        switch (activeSection) {
            case 'landing':
                return <LandingSection worldData={worldData} setWorldData={setWorldData} />;
            case 'blueprint':
                return <BlueprintSection worldData={worldData} setWorldData={setWorldData} />;
            case 'lorebook':
                return <LorebookSection worldData={worldData} setWorldData={setWorldData} />;
            case 'channels':
                return <ChannelsSection worldData={worldData} setWorldData={setWorldData} />;
            case 'settings':
                return <WorldSettingsSection worldData={worldData} setWorldData={setWorldData} />;
            case 'atlas':
                return <AtlasSection worldData={worldData} setWorldData={setWorldData} />;
            case 'chronicle':
                return <ChronicleSection worldData={worldData} setWorldData={setWorldData} />;
            default:
                return null;
        }
    };
    
    return (
        <main className="flex-1 flex flex-col min-w-0 h-full bg-black/20">
            <header className="p-3 border-b border-violet-500/30 flex-shrink-0 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-grow min-w-0">
                    {onBack && (
                         <button onClick={onBack} className="flex items-center gap-1.5 text-white bg-gray-800/60 px-3 py-1.5 rounded-full hover:bg-gray-700/80 transition-colors">
                            <ArrowLeftIcon />
                            <span className="text-sm font-medium md:hidden">Back</span>
                        </button>
                    )}
                    <h2 className="text-xl font-bold text-white truncate">{sectionTitles[activeSection]}</h2>
                </div>
                <button onClick={onSave} className="px-5 py-2 bg-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out">
                    Save World
                </button>
            </header>

            <div className="flex-1 overflow-y-auto">
                {renderSection()}
            </div>
        </main>
    );
};

export default WorldEditorView;
