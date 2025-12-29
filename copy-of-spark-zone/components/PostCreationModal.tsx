
import React, { useState, useRef, useEffect } from 'react';
import { UserCreation } from '../types';
import { currentUser } from '../mockData';
import UserAvatar from './UserAvatar';
import CharacterSelectorModal from './CharacterSelectorModal';

const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;

interface PostCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreatePost: (content: string, character?: UserCreation, media?: { type: 'image' | 'video', url: string }) => void;
    userCreations: UserCreation[];
    initialContent?: string;
}

const PostCreationModal: React.FC<PostCreationModalProps> = ({ isOpen, onClose, onCreatePost, userCreations, initialContent = '' }) => {
    const [content, setContent] = useState(initialContent);
    const [selectedVoiceId, setSelectedVoiceId] = useState<number>(currentUser.id);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [media, setMedia] = useState<{ type: 'image' | 'video', url: string } | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setContent(initialContent);
        }
    }, [isOpen, initialContent]);

    if (!isOpen) return null;

    const userCharacters = userCreations.filter(c => c.type === 'Character' || c.type === 'AI Character') as UserCreation[];
    const selectedVoice = selectedVoiceId === currentUser.id
        ? { ...currentUser, name: 'You', epithet: 'Yourself', imageUrl: currentUser.avatarUrl }
        : userCharacters.find(c => c.id === selectedVoiceId);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const type = file.type.startsWith('video/') ? 'video' : 'image';
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setMedia({ type, url: reader.result });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        if (!content.trim() && !media) return;
        const character = selectedVoiceId === currentUser.id ? undefined : userCharacters.find(c => c.id === selectedVoiceId);
        onCreatePost(content, character, media || undefined);
        setContent('');
        setMedia(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg bg-gray-900 border border-violet-500/50 rounded-lg shadow-xl flex flex-col">
                <div className="p-4 border-b border-violet-500/30 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-cyan-400">Create Post</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
                </div>
                
                <div className="p-4">
                    <div className="flex items-start gap-3 mb-4">
                        <button onClick={() => setIsSelectorOpen(true)} className="flex-shrink-0">
                             <UserAvatar src={selectedVoice?.imageUrl} size="10" className="ring-2 ring-transparent hover:ring-cyan-400 transition-all" />
                        </button>
                        <div className="flex-grow">
                            <textarea
                                className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none text-lg"
                                rows={3}
                                placeholder={`What's on your mind, ${selectedVoice?.name}?`}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                    </div>

                    {media && (
                        <div className="relative mb-4 rounded-lg overflow-hidden border border-violet-500/30 bg-black">
                            <button 
                                onClick={() => setMedia(null)}
                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors z-10"
                            >
                                <XMarkIcon />
                            </button>
                            {media.type === 'video' ? (
                                <video src={media.url} controls className="w-full max-h-64 object-contain mx-auto" />
                            ) : (
                                <img src={media.url} alt="Upload preview" className="w-full max-h-64 object-contain mx-auto" />
                            )}
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-violet-500/20">
                        <div className="flex gap-2">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept="image/*,video/*" 
                            />
                            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-colors" title="Add Photo/Video">
                                <PhotoIcon />
                            </button>
                        </div>
                        <button 
                            onClick={handleSubmit}
                            disabled={!content.trim() && !media}
                            className="px-6 py-2 bg-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
            
            {isSelectorOpen && (
                 <CharacterSelectorModal
                    isOpen={isSelectorOpen}
                    onClose={() => setIsSelectorOpen(false)}
                    characters={userCharacters}
                    currentUser={currentUser}
                    selectedId={selectedVoiceId}
                    onSelect={(id) => {
                        setSelectedVoiceId(id);
                        setIsSelectorOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default PostCreationModal;
