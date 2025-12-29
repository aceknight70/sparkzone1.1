
import React, { useState, useRef, useEffect } from 'react';
import { World, User, WorldRole, WorldLocation, WorldLoreEntry, WorldLoreCategory, WorldPermission } from '../types';
import UserAvatar from '../components/UserAvatar';
import { GoogleGenAI, Modality } from '@google/genai';
import LightningBoltIcon from '../components/icons/LightningBoltIcon';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>;
const InformationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836c-.149.598.013 1.146.467 1.373.454.226.963.02 1.112-.578l.708-2.836c.311-1.243-1.244-2.583-2.614-1.897l-.709.354c-.573.287-1.146.013-1.373-.454s-.02-.963.578-1.112l.708-.354zM12 7.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" clipRule="evenodd" /></svg>;
const WrenchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 6.75a.75.75 0 01.75.75V18a.75.75 0 01-1.5 0V7.5a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01.75-.75H18a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122z" /></svg>;
const KeyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-3.75 5.25a3.75 3.75 0 117.5 0v3h-7.5v-3z" clipRule="evenodd" /></svg>;
const NoSymbolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S2.25 17.385 2.25 12zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 10-1.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>;
const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const ModeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10.744 2.185a.75.75 0 00-1.488 0l-1.124 5.623-5.623 1.124a.75.75 0 000 1.488l5.623 1.124 1.124 5.623a.75.75 0 001.488 0l1.124-5.623 5.623-1.124a.75.75 0 000-1.488l-5.623-1.124-1.124-5.623zM17.25 14.25a.75.75 0 00-1.5 0v3.75a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5h-2.25v-3.75z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>;
const ExclamationTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;

interface WorldSettingsPageProps {
    world: World;
    onExit: () => void;
    onOpenManage: () => void;
    onUpdate: (updates: Partial<World>) => void;
}

type ViewState = 'main' | 'information' | 'manage' | 'lore' | 'groups' | 'members' | 'roles' | 'blocklist' | 'media' | 'mode';

const SettingsItem: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void; colorClass?: string }> = ({ icon, label, onClick, colorClass = "text-gray-400" }) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 bg-gray-900/40 hover:bg-gray-800 transition-colors border-b border-white/5 last:border-0 group active:bg-gray-700"
    >
        <div className="flex items-center gap-4">
            <div className={`p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors ${colorClass}`}>{icon}</div>
            <span className="font-medium text-white text-base">{label}</span>
        </div>
        <ChevronRightIcon />
    </button>
);

const SubPageWrapper: React.FC<{ title: string; onBack: () => void; children: React.ReactNode; bgColor?: string }> = ({ title, onBack, children, bgColor = "bg-[#0a0a0a]" }) => (
    <div className={`fixed inset-0 z-[110] ${bgColor} flex flex-col font-sans animate-slideInRight overflow-hidden`}>
        <header className="p-4 flex items-center gap-4 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-20">
            <button onClick={onBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                <ArrowLeftIcon />
            </button>
            <h2 className="text-xl font-bold text-white">{title}</h2>
        </header>
        <div className="flex-grow overflow-y-auto custom-scrollbar">
            {children}
        </div>
    </div>
);

// --- Sub Views ---

const InformationView: React.FC<{ world: World; onUpdate: (updates: Partial<World>) => void; onBack: () => void }> = ({ world, onUpdate, onBack }) => {
    const [name, setName] = useState(world.name);
    const [tagline, setTagline] = useState(world.tagline || '');
    const [synopsis, setSynopsis] = useState(world.synopsis || '');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleSave = () => {
        onUpdate({ name, tagline, synopsis });
        onBack();
    };

    const handleAiRefine = async () => {
        if (!synopsis) return;
        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Rewrite this world synopsis to be more epic and engaging, keeping it under 100 words: "${synopsis}"`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            if (response.text) setSynopsis(response.text);
        } catch (e) {
            console.error(e);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <SubPageWrapper title="Information" onBack={onBack}>
            <div className="p-6 space-y-6">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900 border border-white/10 rounded-xl p-4 text-white font-bold text-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Tagline</label>
                    <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full bg-gray-900 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Synopsis</label>
                        <button onClick={handleAiRefine} disabled={isAiLoading || !synopsis} className="text-xs text-cyan-400 hover:text-white flex items-center gap-1">
                            <SparklesIcon className={isAiLoading ? 'animate-spin' : ''} /> {isAiLoading ? 'Refining...' : 'Enhance with AI'}
                        </button>
                    </div>
                    <textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} rows={6} className="w-full bg-gray-900 border border-white/10 rounded-xl p-4 text-white leading-relaxed focus:border-blue-500 outline-none resize-none" />
                </div>
                <button onClick={handleSave} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-colors">
                    Save Changes
                </button>
            </div>
        </SubPageWrapper>
    );
};

const WorldManageView: React.FC<{ world: World; onUpdate: (updates: Partial<World>) => void; onBack: () => void; onOpenWorkshop: () => void }> = ({ world, onUpdate, onBack, onOpenWorkshop }) => (
    <SubPageWrapper title="Manage" onBack={onBack}>
        <div className="p-4 space-y-6">
            <button onClick={onOpenWorkshop} className="w-full p-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-bold text-white shadow-lg hover:shadow-cyan-500/20 transition-all text-left flex justify-between items-center group">
                <span>Open World Workshop</span>
                <ChevronRightIcon />
            </button>
            
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/10 space-y-6">
                <div>
                    <h3 className="text-white font-bold mb-3">Status</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {['Active', 'Recruiting', 'Hiatus'].map(status => (
                            <button 
                                key={status}
                                onClick={() => onUpdate({ statusLabel: status as any })}
                                className={`py-2 rounded-lg text-sm font-bold border transition-colors ${world.statusLabel === status ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-gray-800 border-transparent text-gray-500 hover:text-gray-300'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                     <h3 className="text-white font-bold mb-3">Visibility</h3>
                     <div className="flex gap-2">
                        <button onClick={() => onUpdate({ visibility: 'Public' })} className={`flex-1 py-2 rounded-lg text-sm font-bold border ${world.visibility === 'Public' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-gray-800 border-transparent text-gray-500'}`}>Public</button>
                        <button onClick={() => onUpdate({ visibility: 'Private' })} className={`flex-1 py-2 rounded-lg text-sm font-bold border ${world.visibility === 'Private' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-gray-800 border-transparent text-gray-500'}`}>Private</button>
                     </div>
                </div>
            </div>

            <div className="bg-red-900/10 p-6 rounded-2xl border border-red-500/30">
                <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2"><ExclamationTriangleIcon /> Danger Zone</h3>
                <p className="text-red-400/70 text-sm mb-4">Deleting a world is permanent and cannot be undone.</p>
                <button onClick={() => { if(confirm("Are you sure? This action is irreversible.")) onBack(); }} className="w-full py-3 bg-red-600/20 hover:bg-red-600/40 text-red-500 font-bold rounded-lg border border-red-500/50 transition-colors">
                    Delete World
                </button>
            </div>
        </div>
    </SubPageWrapper>
);

const MediaView: React.FC<{ world: World; onUpdate: (updates: Partial<World>) => void; onBack: () => void }> = ({ world, onUpdate, onBack }) => {
    const bannerRef = useRef<HTMLInputElement>(null);
    const coverRef = useRef<HTMLInputElement>(null);
    const [isGenLoading, setIsGenLoading] = useState<string | null>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'bannerUrl' | 'imageUrl') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => onUpdate({ [field]: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async (field: 'bannerUrl' | 'imageUrl') => {
        setIsGenLoading(field);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Generate a ${field === 'bannerUrl' ? 'panoramic banner' : 'vertical cover'} image for a world named "${world.name}". Genre: ${world.genreTags.join(', ')}. Style: Cinematic, high detail digital art.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
                onUpdate({ [field]: `data:image/png;base64,${response.candidates[0].content.parts[0].inlineData.data}` });
            }
        } catch (e) { console.error(e); } finally { setIsGenLoading(null); }
    };

    return (
        <SubPageWrapper title="Media" onBack={onBack}>
            <div className="p-6 space-y-8">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Banner</label>
                        <button onClick={() => handleGenerate('bannerUrl')} disabled={!!isGenLoading} className="text-xs text-pink-400 font-bold flex items-center gap-1 hover:text-white disabled:opacity-50">
                            <SparklesIcon className={isGenLoading === 'bannerUrl' ? 'animate-spin' : ''} /> Generate
                        </button>
                    </div>
                    <div className="relative group rounded-xl overflow-hidden aspect-video bg-gray-900 border border-white/10 cursor-pointer" onClick={() => bannerRef.current?.click()}>
                        <img src={world.bannerUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-white font-bold flex items-center gap-2"><PhotoIcon /> Change Banner</span>
                        </div>
                        <input type="file" ref={bannerRef} onChange={(e) => handleUpload(e, 'bannerUrl')} className="hidden" accept="image/*" />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Cover</label>
                        <button onClick={() => handleGenerate('imageUrl')} disabled={!!isGenLoading} className="text-xs text-pink-400 font-bold flex items-center gap-1 hover:text-white disabled:opacity-50">
                            <SparklesIcon className={isGenLoading === 'imageUrl' ? 'animate-spin' : ''} /> Generate
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <div className="relative group rounded-xl overflow-hidden w-48 h-48 bg-gray-900 border border-white/10 cursor-pointer" onClick={() => coverRef.current?.click()}>
                            <img src={world.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white font-bold flex items-center gap-2"><PhotoIcon /> Change</span>
                            </div>
                            <input type="file" ref={coverRef} onChange={(e) => handleUpload(e, 'imageUrl')} className="hidden" accept="image/*" />
                        </div>
                    </div>
                </div>
            </div>
        </SubPageWrapper>
    );
};

const RolesView: React.FC<{ world: World; onBack: () => void }> = ({ world, onBack }) => {
    const [roles, setRoles] = useState(world.roles || []);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const selectedRole = roles.find(r => r.id === selectedRoleId);

    const updateRole = (updates: Partial<WorldRole>) => {
        if (!selectedRole) return;
        setRoles(prev => prev.map(r => r.id === selectedRole.id ? { ...r, ...updates } : r));
    };

    const addRole = () => {
        const newRole = { id: Date.now(), name: 'New Role', color: '#9ca3af', permissions: [] };
        setRoles([...roles, newRole]);
        setSelectedRoleId(newRole.id);
    };

    return (
        <SubPageWrapper title="Roles" onBack={onBack}>
            <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 p-4 bg-black/20 flex flex-col gap-2 overflow-y-auto">
                    {roles.map(role => (
                        <button key={role.id} onClick={() => setSelectedRoleId(role.id)} className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${selectedRole?.id === role.id ? 'bg-gray-800 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
                            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: role.color }}></div>
                            <span className="font-bold text-gray-200">{role.name}</span>
                        </button>
                    ))}
                    <button onClick={addRole} className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-gray-700 text-gray-500 hover:text-white hover:border-gray-500 transition-all font-bold text-sm mt-2">
                        <PlusIcon className="w-4 h-4" /> Create Role
                    </button>
                </div>
                
                <div className="flex-grow p-6 overflow-y-auto bg-gray-900/30">
                    {selectedRole ? (
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Role Name</label>
                                <input type="text" value={selectedRole.name} onChange={(e) => updateRole({ name: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-violet-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Color</label>
                                <div className="flex gap-2">
                                    {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#9ca3af'].map(c => (
                                        <button key={c} onClick={() => updateRole({ color: c })} className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${selectedRole.color === c ? 'border-white' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Permissions</label>
                                <div className="space-y-2">
                                    {['manage_channels', 'manage_lore', 'moderate_chat', 'invite_members', 'manage_roles'].map(perm => (
                                        <label key={perm} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg cursor-pointer hover:bg-black/40 transition-colors">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedRole.permissions.includes(perm as any)}
                                                onChange={(e) => {
                                                    const newPerms = e.target.checked 
                                                        ? [...selectedRole.permissions, perm]
                                                        : selectedRole.permissions.filter(p => p !== perm);
                                                    updateRole({ permissions: newPerms as any });
                                                }}
                                                className="w-5 h-5 rounded border-gray-600 text-violet-500 focus:ring-violet-500 bg-gray-800"
                                            />
                                            <span className="text-gray-300 font-medium capitalize">{perm.replace('_', ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => { setRoles(prev => prev.filter(r => r.id !== selectedRole.id)); setSelectedRoleId(null); }} className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-1 mt-8">
                                <TrashIcon /> Delete Role
                            </button>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500 text-sm">Select a role to edit settings.</div>
                    )}
                </div>
            </div>
        </SubPageWrapper>
    );
};

const MembersView: React.FC<{ world: World; onBack: () => void }> = ({ world, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // Mock user list enriched with world member data
    const members = world.members.map(m => ({ ...m, status: 'Online' })); // In real app, merge with user presence
    
    const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <SubPageWrapper title="Members" onBack={onBack}>
            <div className="flex flex-col h-full">
                <div className="p-4 border-b border-white/10 bg-gray-900/50 sticky top-0 z-10">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search members..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none"
                        />
                        <div className="absolute left-3 top-3.5 text-gray-500"><SearchIcon /></div>
                    </div>
                </div>
                
                <div className="flex-grow p-4 space-y-2 overflow-y-auto">
                    {filteredMembers.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-900/40 border border-white/5 rounded-xl hover:bg-gray-800/60 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <UserAvatar src={member.avatarUrl} size="12" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="text-white font-bold">{member.name}</p>
                                    <p className="text-xs text-gray-400">{member.role}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <select className="bg-black/40 border border-white/10 text-xs text-gray-300 rounded-lg px-2 py-1 outline-none">
                                    <option>{member.role}</option>
                                    <option>Admin</option>
                                    <option>Moderator</option>
                                </select>
                                <button className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg" title="Kick">
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SubPageWrapper>
    );
};

interface EnhancedLoreEntry extends WorldLoreEntry {
    imageUrl?: string;
    dateLabel?: string;
}

const LoreBoardsView: React.FC<{ world: World; onUpdate: (updates: Partial<World>) => void; onBack: () => void }> = ({ world, onUpdate, onBack }) => {
    const [entries, setEntries] = useState<EnhancedLoreEntry[]>(world.lorebook as EnhancedLoreEntry[] || []);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isEditing, setIsEditing] = useState(false);
    const [editingEntry, setEditingEntry] = useState<Partial<EnhancedLoreEntry>>({});
    const [isAiLoading, setIsAiLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = ['All', ...Array.from(new Set(entries.map(e => e.category)))];
    const filteredEntries = activeCategory === 'All' ? entries : entries.filter(e => e.category === activeCategory);

    const handleSaveEntry = () => {
        if (!editingEntry.name) return;
        const newEntry = { 
            id: editingEntry.id || Date.now(),
            name: editingEntry.name,
            category: editingEntry.category || 'Concept',
            description: editingEntry.description || '',
            imageUrl: editingEntry.imageUrl,
            dateLabel: editingEntry.dateLabel
        } as EnhancedLoreEntry;

        const newEntries = editingEntry.id 
            ? entries.map(e => e.id === editingEntry.id ? newEntry : e)
            : [...entries, newEntry];
        
        setEntries(newEntries);
        onUpdate({ lorebook: newEntries });
        setIsEditing(false);
        setEditingEntry({});
    };

    const handleDeleteEntry = (id: number) => {
        const newEntries = entries.filter(e => e.id !== id);
        setEntries(newEntries);
        onUpdate({ lorebook: newEntries });
        setIsEditing(false);
    };

    const handleCreateNew = () => {
        setEditingEntry({ category: 'Concept' });
        setIsEditing(true);
    };

    const handleEditClick = (entry: EnhancedLoreEntry) => {
        setEditingEntry(entry);
        setIsEditing(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingEntry(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAiExpand = async () => {
        if (!editingEntry.name) return;
        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Write a short description for "${editingEntry.name}" in world "${world.name}". Category: ${editingEntry.category}.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setEditingEntry(prev => ({ ...prev, description: response.text }));
        } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };

    const handleAiVisualize = async () => {
        if (!editingEntry.name) return;
        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Concept art for ${editingEntry.name} in ${world.genreTags.join(', ')} setting.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });
            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    setEditingEntry(prev => ({ ...prev, imageUrl: `data:image/png;base64,${part.inlineData.data}` }));
                    break;
                }
            }
        } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };

    return (
        <SubPageWrapper title="Lore Keeper" onBack={onBack}>
            <div className="flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold border ${activeCategory === cat ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50' : 'bg-gray-800 text-gray-400 border-transparent'}`}>{cat}</button>
                        ))}
                    </div>
                    <button onClick={handleCreateNew} className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"><PlusIcon /> New Entry</button>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-4 pb-20 custom-scrollbar">
                    {filteredEntries.map(entry => (
                        <div key={entry.id} onClick={() => handleEditClick(entry)} className="bg-gray-900 border border-white/10 rounded-2xl overflow-hidden cursor-pointer group hover:border-yellow-500/50 transition-all relative">
                            {entry.imageUrl && <div className="h-32 w-full bg-cover bg-center" style={{ backgroundImage: `url(${entry.imageUrl})` }}></div>}
                            <div className="p-5 relative">
                                <div className="flex justify-between items-start mb-2"><span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-900/20 px-2 py-0.5 rounded">{entry.category}</span></div>
                                <h3 className="text-xl font-bold text-white mb-2">{entry.name}</h3>
                                <p className="text-sm text-gray-400 line-clamp-3">{entry.description}</p>
                            </div>
                        </div>
                    ))}
                    {filteredEntries.length === 0 && <div className="text-center py-12 text-gray-500 italic">No lore entries found.</div>}
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex flex-col animate-fadeIn">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gray-900"><h3 className="font-bold text-white text-lg">{editingEntry.id ? 'Edit Entry' : 'New Entry'}</h3><button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white"><XMarkIcon /></button></div>
                    <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-gray-700 aspect-video flex items-center justify-center">
                            {editingEntry.imageUrl ? <img src={editingEntry.imageUrl} className="w-full h-full object-cover" /> : <div className="text-center text-gray-500"><PhotoIcon className="mx-auto mb-2 w-8 h-8" /><span className="text-xs font-bold uppercase">No Visual</span></div>}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/10 rounded-full text-white text-xs font-bold">Upload</button>
                                <button onClick={handleAiVisualize} disabled={isAiLoading || !editingEntry.name} className="px-4 py-2 bg-yellow-500/20 rounded-full text-yellow-300 text-xs font-bold flex items-center gap-1"><SparklesIcon /> Visualize</button>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        </div>
                        <div className="space-y-4">
                            <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name</label><input type="text" value={editingEntry.name || ''} onChange={(e) => setEditingEntry(p => ({...p, name: e.target.value}))} className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white" /></div>
                            <div className="flex gap-4"><div className="flex-1"><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label><select value={editingEntry.category || 'Concept'} onChange={(e) => setEditingEntry(p => ({...p, category: e.target.value}))} className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white">{['Location', 'Faction', 'Item', 'Character', 'Event', 'Concept'].map(c => <option key={c} value={c}>{c}</option>)}</select></div></div>
                            <div className="relative"><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label><textarea value={editingEntry.description || ''} onChange={(e) => setEditingEntry(p => ({...p, description: e.target.value}))} rows={6} className="w-full bg-gray-800 border border-white/10 rounded-lg p-3 text-white" /><button onClick={handleAiExpand} disabled={isAiLoading || !editingEntry.name} className="absolute bottom-3 right-3 text-xs flex items-center gap-1 text-yellow-400 bg-black/40 px-2 py-1 rounded"><SparklesIcon /> {isAiLoading ? 'Writing...' : 'Expand'}</button></div>
                        </div>
                        {editingEntry.id && <button onClick={() => handleDeleteEntry(editingEntry.id as number)} className="w-full py-3 text-red-500 font-bold text-sm border border-red-900/30 bg-red-900/10 rounded-lg">Delete Entry</button>}
                    </div>
                    <div className="p-4 border-t border-white/10 bg-gray-900"><button onClick={handleSaveEntry} className="w-full py-3 bg-yellow-600 text-black font-bold rounded-xl shadow-lg">Save Lore Entry</button></div>
                </div>
            )}
        </SubPageWrapper>
    );
};

const GroupsView: React.FC<{ world: World; onUpdate: (updates: Partial<World>) => void; onBack: () => void }> = ({ world, onUpdate, onBack }) => {
    // REFACTORED: Removed useEffect to prevent infinite update loop. 
    // State is initialized from props but updates are manual.
    const [categories, setCategories] = useState(world.locations || []);
    const [editingChannel, setEditingChannel] = useState<{catIndex: number, chanIndex: number} | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editorOpen, setEditorOpen] = useState(false);
    const [tempChannel, setTempChannel] = useState<Partial<WorldLocation>>({});
    const [aiLoading, setAiLoading] = useState(false);

    // Helper to sync state and props
    const updateLocations = (newCategories: typeof categories) => {
        setCategories(newCategories);
        onUpdate({ locations: newCategories });
    };

    const addCategory = () => {
        if (!newCategoryName.trim()) return;
        const newCategories = [...categories, { category: newCategoryName.trim().toUpperCase(), channels: [] }];
        updateLocations(newCategories);
        setNewCategoryName('');
    };

    const deleteCategory = (index: number) => {
        if (confirm("Delete this category and all its channels?")) {
            const newCategories = categories.filter((_, i) => i !== index);
            updateLocations(newCategories);
        }
    };

    const openChannelEditor = (catIndex: number, chanIndex: number | null) => {
        if (chanIndex !== null) {
            setEditingChannel({ catIndex, chanIndex });
            setTempChannel({ ...categories[catIndex].channels[chanIndex] });
        } else {
            setEditingChannel({ catIndex, chanIndex: -1 });
            setTempChannel({ id: Date.now(), name: '', description: '', messages: [] });
        }
        setEditorOpen(true);
    };

    const saveChannel = () => {
        if (!editingChannel || !tempChannel.name) return;
        const newCategories = [...categories];
        const { catIndex, chanIndex } = editingChannel;

        if (chanIndex === -1) {
            newCategories[catIndex].channels.push(tempChannel as WorldLocation);
        } else {
            newCategories[catIndex].channels[chanIndex] = { ...newCategories[catIndex].channels[chanIndex], ...tempChannel } as WorldLocation;
        }

        updateLocations(newCategories);
        setEditorOpen(false);
        setTempChannel({});
    };

    const deleteChannel = (catIndex: number, chanIndex: number) => {
        if (confirm("Delete this channel?")) {
            const newCategories = [...categories];
            newCategories[catIndex].channels.splice(chanIndex, 1);
            updateLocations(newCategories);
        }
    };

    const handleAiGenerate = async () => {
        if (!editingChannel) return;
        setAiLoading(true);
        try {
            const catName = categories[editingChannel.catIndex].category;
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Suggest a creative channel name and description for a roleplay location.
            World Name: ${world.name}
            Category: ${catName}
            Tone: ${world.genreTags.join(', ')}
            Output JSON format: { "name": "string", "description": "string" }`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            
            const data = JSON.parse(response.text);
            setTempChannel(prev => ({ ...prev, name: data.name, description: data.description }));
        } catch (e) { console.error("AI Gen Failed", e); } finally { setAiLoading(false); }
    };

    return (
        <SubPageWrapper title="Channel Architect" onBack={onBack}>
            <div className="p-4 space-y-8 relative min-h-full">
                <div className="space-y-6">
                    {categories.map((cat, catIndex) => (
                        <div key={catIndex} className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden shadow-lg">
                            <div className="p-3 bg-white/5 flex justify-between items-center border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <FolderIcon />
                                    <span className="font-bold text-sm text-gray-300 uppercase tracking-widest">{cat.category}</span>
                                </div>
                                <button onClick={() => deleteCategory(catIndex)} className="text-gray-600 hover:text-red-400 p-1"><TrashIcon /></button>
                            </div>
                            <div className="p-2 space-y-1">
                                {cat.channels.map((chan, chanIndex) => (
                                    <div key={chan.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 group transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-500 text-lg">#</span>
                                            <div>
                                                <p className="font-bold text-gray-200 text-sm">{chan.name}</p>
                                                {chan.description && <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{chan.description}</p>}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openChannelEditor(catIndex, chanIndex)} className="p-1.5 text-gray-400 hover:text-white bg-gray-800 rounded-md"><EditIcon /></button>
                                            <button onClick={() => deleteChannel(catIndex, chanIndex)} className="p-1.5 text-gray-400 hover:text-red-400 bg-gray-800 rounded-md"><TrashIcon /></button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => openChannelEditor(catIndex, null)} className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-cyan-500/70 hover:text-cyan-400 border-2 border-dashed border-cyan-500/20 hover:border-cyan-500/40 rounded-lg transition-all mt-2">
                                    <PlusIcon /> Add Channel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-900 p-4 rounded-xl border border-white/5 sticky bottom-0 shadow-2xl">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">New Category</label>
                    <div className="flex gap-2">
                        <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g. WAR ROOM" className="flex-grow bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-cyan-500 outline-none" onKeyDown={(e) => e.key === 'Enter' && addCategory()} />
                        <button onClick={addCategory} className="bg-white text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-200">Create</button>
                    </div>
                </div>

                {editorOpen && (
                    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
                        <div className="w-full max-w-md bg-[#101012] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                            <div className="p-4 bg-cyan-900/10 border-b border-cyan-500/20 flex justify-between items-center">
                                <h3 className="font-bold text-cyan-400 uppercase tracking-wider text-sm">{editingChannel?.chanIndex === -1 ? 'Construct Channel' : 'Edit Channel'}</h3>
                                <button onClick={() => setEditorOpen(false)} className="text-gray-500 hover:text-white"><XMarkIcon /></button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Designation (Name)</label>
                                    <div className="flex gap-2">
                                        <span className="py-2.5 px-3 bg-gray-800 rounded-l-lg text-gray-500 font-bold border border-r-0 border-gray-700">#</span>
                                        <input type="text" value={tempChannel.name || ''} onChange={(e) => setTempChannel(p => ({...p, name: e.target.value}))} className="flex-grow bg-black/40 border border-gray-700 rounded-r-lg px-3 py-2 text-white focus:border-cyan-500 outline-none" placeholder="general-chat" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Purpose (Description)</label>
                                        <button onClick={handleAiGenerate} disabled={aiLoading} className="text-[10px] font-bold text-cyan-400 flex items-center gap-1 hover:text-cyan-300 disabled:opacity-50">
                                            <LightningBoltIcon className={`w-3 h-3 ${aiLoading ? 'animate-pulse' : ''}`} /> {aiLoading ? 'Thinking...' : 'Auto-Generate'}
                                        </button>
                                    </div>
                                    <textarea value={tempChannel.description || ''} onChange={(e) => setTempChannel(p => ({...p, description: e.target.value}))} rows={3} className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white text-sm focus:border-cyan-500 outline-none resize-none" placeholder="What happens in this channel?" />
                                </div>
                            </div>
                            <div className="p-4 border-t border-white/5 bg-gray-900 flex justify-end gap-3">
                                <button onClick={() => setEditorOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white">Cancel</button>
                                <button onClick={saveChannel} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-cyan-500/20">Confirm</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SubPageWrapper>
    );
};

const BlockListView: React.FC<{ world: World; onBack: () => void }> = ({ onBack }) => {
    const [search, setSearch] = useState('');
    return (
        <SubPageWrapper title="Block List" onBack={onBack}>
            <div className="p-4 space-y-4">
                <input type="text" placeholder="Search user to block..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-gray-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-red-500" />
                <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded-xl">
                    <NoSymbolIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No blocked users.</p>
                </div>
            </div>
        </SubPageWrapper>
    );
};

const ModeView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <SubPageWrapper title="Mode" onBack={onBack}>
        <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6 space-y-4">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 animate-pulse border-2 border-yellow-500/50">
                <WrenchIcon />
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Under Maintenance</h3>
            <p className="text-gray-400 max-w-xs">The mode configuration matrix is currently being upgraded. Check back later for advanced roleplay settings.</p>
        </div>
    </SubPageWrapper>
);

// --- Main Settings Component ---

const WorldSettingsPage: React.FC<WorldSettingsPageProps> = ({ world: initialWorld, onExit, onOpenManage, onUpdate }) => {
    const [view, setView] = useState<ViewState>('main');
    const [world, setWorld] = useState<World>(initialWorld);

    // Ensure local state updates when props change
    useEffect(() => {
        setWorld(initialWorld);
    }, [initialWorld]);

    const handleUpdateWorld = (updates: Partial<World>) => {
        const updated = { ...world, ...updates };
        setWorld(updated);
        if (onUpdate) {
             onUpdate(updates);
        }
    };
    
    // Routing Logic
    if (view === 'information') return <InformationView world={world} onUpdate={handleUpdateWorld} onBack={() => setView('main')} />;
    if (view === 'manage') return <WorldManageView world={world} onUpdate={handleUpdateWorld} onBack={() => setView('main')} onOpenWorkshop={onOpenManage} />;
    if (view === 'media') return <MediaView world={world} onUpdate={handleUpdateWorld} onBack={() => setView('main')} />; 
    if (view === 'roles') return <RolesView world={world} onBack={() => setView('main')} />;
    if (view === 'groups') return <GroupsView world={world} onUpdate={handleUpdateWorld} onBack={() => setView('main')} />;
    if (view === 'blocklist') return <BlockListView world={world} onBack={() => setView('main')} />;
    if (view === 'mode') return <ModeView onBack={() => setView('main')} />;
    if (view === 'lore') return <LoreBoardsView world={world} onUpdate={handleUpdateWorld} onBack={() => setView('main')} />; 
    if (view === 'members') return <MembersView world={world} onBack={() => setView('main')} />;
    
    return (
        <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col font-sans animate-slideInRight overflow-hidden">
            <div className="relative flex-shrink-0">
                <div className="h-44 overflow-hidden relative">
                    <img src={world.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]"></div>
                    <button onClick={onExit} className="absolute top-4 left-4 p-2.5 bg-black/40 backdrop-blur-xl rounded-full text-white hover:bg-black/60 transition-all border border-white/10 shadow-lg z-20">
                        <ArrowLeftIcon />
                    </button>
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                    <div className="w-24 h-24 rounded-3xl border-4 border-[#050505] shadow-2xl overflow-hidden bg-gray-800 relative group">
                        <img src={world.imageUrl} alt={world.name} className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            <div className="pt-12 pb-6 px-6 text-center flex-shrink-0">
                <h1 className="text-2xl font-black text-white tracking-tight italic uppercase">{world.name}</h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="bg-gray-800/80 border border-white/5 px-2 py-0.5 rounded text-[10px] font-bold text-gray-400 uppercase tracking-wide">{world.contentMetadata?.ageRating || 'Everyone'}</span>
                    <span className="text-gray-600 text-[10px]">•</span>
                    <span className="text-xs font-medium text-cyan-400 uppercase tracking-widest">{world.genreTags[0] || 'Roleplay'}</span>
                    {world.statusLabel && (
                        <>
                            <span className="text-gray-600 text-[10px]">•</span>
                            <span className={`text-xs font-bold uppercase tracking-widest ${world.statusLabel === 'Active' ? 'text-green-400' : 'text-gray-400'}`}>{world.statusLabel}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto px-4 pb-20 space-y-8 custom-scrollbar">
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-2">Application</h3>
                    <div className="bg-gray-900/60 rounded-2xl overflow-hidden border border-white/5 shadow-sm backdrop-blur-sm">
                         <SettingsItem icon={<InformationCircleIcon />} label="Information" colorClass="text-blue-400" onClick={() => setView('information')} />
                        <SettingsItem icon={<WrenchIcon />} label="World Manage" colorClass="text-orange-400" onClick={() => setView('manage')} />
                         <SettingsItem icon={<PhotoIcon />} label="Media" colorClass="text-pink-400" onClick={() => setView('media')} />
                         <SettingsItem icon={<ModeIcon />} label="Mode" colorClass="text-green-400" onClick={() => setView('mode')} />
                    </div>
                </div>
                 <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-2">Management</h3>
                    <div className="bg-gray-900/60 rounded-2xl overflow-hidden border border-white/5 shadow-sm backdrop-blur-sm">
                        <SettingsItem icon={<DocumentTextIcon />} label="Lore Boards" colorClass="text-yellow-400" onClick={() => setView('lore')} />
                        <SettingsItem icon={<ChatBubbleIcon />} label="Channel Architect" colorClass="text-cyan-400" onClick={() => setView('groups')} />
                    </div>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-2">Community</h3>
                    <div className="bg-gray-900/60 rounded-2xl overflow-hidden border border-white/5 shadow-sm backdrop-blur-sm">
                        <SettingsItem icon={<UsersIcon />} label="Members" colorClass="text-indigo-400" onClick={() => setView('members')} />
                        <SettingsItem icon={<KeyIcon />} label="Roles" colorClass="text-violet-400" onClick={() => setView('roles')} />
                        <SettingsItem icon={<NoSymbolIcon />} label="Block List" colorClass="text-red-400" onClick={() => setView('blocklist')} />
                    </div>
                </div>
                <div className="pb-8 text-center">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Spark Zone v1.3.1</p>
                </div>
            </div>
        </div>
    );
};

export default WorldSettingsPage;
