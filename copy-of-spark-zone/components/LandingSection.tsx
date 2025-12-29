
import React, { useState } from 'react';
import { World } from '../types';
import { GoogleGenAI } from '@google/genai';
import LightningBoltIcon from './icons/LightningBoltIcon';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;

interface LandingSectionProps {
    worldData: World;
    setWorldData: React.Dispatch<React.SetStateAction<World>>;
}

const LandingSection: React.FC<LandingSectionProps> = ({ worldData, setWorldData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setWorldData(prev => ({ ...prev, [name]: value }));
    };

    const generateIntro = async () => {
        if (!worldData.synopsis) return;
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Write a captivating and immersive introduction for a role-playing world.
            World Name: ${worldData.name}
            Synopsis: ${worldData.synopsis}
            Tone: Epic, welcoming, and intriguing.
            Format: Plain text, about 2 paragraphs.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            if (response.text) {
                setWorldData(prev => ({ ...prev, introduction: response.text }));
            }
        } catch (e) {
            console.error("AI Intro Gen Failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    const addQuestion = () => {
        if (newQuestion.trim()) {
            setWorldData(prev => ({ 
                ...prev, 
                joinQuestions: [...(prev.joinQuestions || []), newQuestion.trim()] 
            }));
            setNewQuestion('');
        }
    };

    const removeQuestion = (index: number) => {
        setWorldData(prev => ({
            ...prev,
            joinQuestions: (prev.joinQuestions || []).filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="h-full flex flex-col md:flex-row overflow-hidden">
            {/* Editor Panel */}
            <div className="w-full md:w-1/2 p-4 md:p-8 overflow-y-auto space-y-8">
                
                {/* Introduction Section */}
                <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">The Hook</h3>
                        <button 
                            onClick={generateIntro}
                            disabled={isLoading || !worldData.synopsis}
                            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-semibold rounded-full border border-cyan-500/50 hover:bg-cyan-500/40 disabled:opacity-50"
                        >
                            <LightningBoltIcon className="w-4 h-4" />
                            {isLoading ? 'Writing...' : 'AI Assist'}
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Introduction Text</label>
                            <textarea 
                                name="introduction"
                                value={worldData.introduction || ''}
                                onChange={handleInputChange}
                                rows={8}
                                placeholder="Write a compelling introduction that greets new travelers..."
                                className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">World Rules</label>
                            <textarea 
                                name="rules"
                                value={worldData.rules || ''}
                                onChange={handleInputChange}
                                rows={5}
                                placeholder="1. Be respectful..."
                                className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Entry Protocol Section */}
                <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Entry Protocol</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Join Policy</label>
                            <select 
                                name="joinPolicy"
                                value={worldData.joinPolicy || 'Open'} 
                                onChange={handleInputChange}
                                className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="Open">Open (Instant Join)</option>
                                <option value="Approval">Approval Required</option>
                                <option value="Invite">Invite Only</option>
                            </select>
                        </div>

                        {worldData.joinPolicy === 'Approval' && (
                            <div className="animate-fadeIn">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Application Questions</label>
                                <div className="space-y-2 mb-3">
                                    {(worldData.joinQuestions || []).map((q, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-black/30 p-2 rounded border border-gray-700">
                                            <span className="text-sm text-gray-200 flex-grow">{q}</span>
                                            <button onClick={() => removeQuestion(i)} className="text-gray-500 hover:text-red-400">
                                                <XMarkIcon />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={newQuestion}
                                        onChange={(e) => setNewQuestion(e.target.value)}
                                        placeholder="e.g. What is your roleplay style?"
                                        className="flex-grow bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white text-sm"
                                        onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
                                    />
                                    <button onClick={addQuestion} className="bg-violet-600 hover:bg-violet-500 text-white rounded-md px-3 py-2">
                                        <PlusIcon />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Preview Panel */}
            <div className="hidden md:flex w-1/2 bg-black/40 p-8 items-center justify-center border-l border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
                
                <div className="w-full max-w-md bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                    <div className="h-40 bg-cover bg-center relative" style={{ backgroundImage: `url(${worldData.bannerUrl})` }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                            <div className="text-xs font-bold bg-cyan-600 px-2 py-0.5 rounded-full inline-block mb-1 shadow-sm">
                                {worldData.joinPolicy === 'Open' ? 'OPEN TO ALL' : 'APPLICATION REQUIRED'}
                            </div>
                            <h2 className="text-2xl font-bold leading-tight">{worldData.name}</h2>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Introduction</h4>
                            <p className="text-sm text-gray-300 leading-relaxed line-clamp-6">
                                {worldData.introduction || worldData.synopsis || "No introduction written yet."}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rules</h4>
                            <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                                {worldData.rules ? worldData.rules.split('\n').slice(0,3).map((rule, i) => (
                                    <li key={i}>{rule}</li>
                                )) : <li>Be respectful</li>}
                            </ul>
                        </div>

                        <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg shadow-lg mt-4">
                            {worldData.joinPolicy === 'Approval' ? 'Apply to Join' : 'Join World'}
                        </button>
                    </div>
                </div>
                
                <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs text-gray-400 border border-white/10 backdrop-blur-md">
                    Preview Mode
                </div>
            </div>
        </div>
    );
};

export default LandingSection;
