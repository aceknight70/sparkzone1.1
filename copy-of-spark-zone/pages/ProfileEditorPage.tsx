
import React, { useState, useRef } from 'react';
import { User } from '../types';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-400"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;

interface ProfileEditorPageProps {
    currentUser: User;
    onSave: (updatedData: Partial<User>) => void;
    onExit: () => void;
    mode?: 'edit' | 'create';
}

const ProfileEditorPage: React.FC<ProfileEditorPageProps> = ({ currentUser, onSave, onExit, mode = 'edit' }) => {
    const [formData, setFormData] = useState<Partial<User>>(currentUser);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageUpload = (field: 'avatarUrl' | 'bannerUrl', file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setFormData(prev => ({ ...prev, [field]: reader.result }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) handleImageUpload('avatarUrl', e.target.files[0]);
    };
    
    const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) handleImageUpload('bannerUrl', e.target.files[0]);
    };

    const isCreating = mode === 'create';

    return (
        <div className="min-h-screen container mx-auto px-4 py-8 animate-fadeIn overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    {!isCreating && (
                        <button onClick={onExit} className="p-2 mr-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Back to profile">
                            <ArrowLeftIcon />
                        </button>
                    )}
                    <h1 className="text-3xl font-bold text-white">
                        {isCreating ? 'Identity Registration' : 'Edit Profile'}
                    </h1>
                </div>
                {isCreating && (
                    <button onClick={onExit} className="text-sm text-gray-500 hover:text-white">
                        Skip for now
                    </button>
                )}
            </div>

            <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6 max-w-2xl mx-auto space-y-6">
                
                {isCreating && (
                    <div className="text-center mb-6">
                        <p className="text-gray-300">Welcome, Traveler. Before you enter the Spark Zone, tell us who you are.</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Banner Image</label>
                    <input type="file" ref={bannerInputRef} onChange={handleBannerFileChange} className="hidden" accept="image/*" />
                    <div onClick={() => bannerInputRef.current?.click()} className="group relative aspect-[3/1] w-full rounded-lg border-2 border-dashed border-violet-500/50 bg-gray-800/40 hover:border-violet-400 transition-colors cursor-pointer bg-cover bg-center" style={{ backgroundImage: `url(${formData.bannerUrl})` }}>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <PhotoIcon />
                        </div>
                        {!formData.bannerUrl && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-gray-500 text-sm">Upload Banner</span>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Avatar</label>
                    <input type="file" ref={avatarInputRef} onChange={handleAvatarFileChange} className="hidden" accept="image/*" />
                    <div className="flex items-center gap-4">
                        <div onClick={() => avatarInputRef.current?.click()} className="group relative w-24 h-24 rounded-full cursor-pointer bg-cover bg-center bg-gray-800" style={{ backgroundImage: `url(${formData.avatarUrl})` }}>
                            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <PhotoIcon className="w-8 h-8" />
                            </div>
                        </div>
                        <button onClick={() => avatarInputRef.current?.click()} className="text-sm font-semibold text-cyan-400 hover:underline">Change Avatar</button>
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Your Display Name" />
                </div>

                {/* Personal Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="pronouns" className="block text-sm font-medium text-gray-300 mb-2">Pronouns</label>
                        <input type="text" id="pronouns" name="pronouns" value={formData.pronouns || ''} onChange={handleInputChange} placeholder="e.g. they/them" className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                        <input type="text" id="gender" name="gender" value={formData.gender || ''} onChange={handleInputChange} placeholder="Optional" className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                        <input type="text" id="age" name="age" value={formData.age || ''} onChange={handleInputChange} placeholder="Optional" className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <div>
                        <label htmlFor="nationality" className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                        <input type="text" id="nationality" name="nationality" value={formData.nationality || ''} onChange={handleInputChange} placeholder="e.g. Earth" className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                </div>

                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                    <textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleInputChange} rows={4} className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" placeholder="Tell us about yourself..." />
                </div>
            </div>

            <div className="mt-8 pt-6 text-center">
                <button onClick={() => onSave(formData)} className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out text-lg">
                    {isCreating ? 'Enter Spark Zone' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default ProfileEditorPage;
