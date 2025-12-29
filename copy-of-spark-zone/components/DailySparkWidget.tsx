
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import LightningBoltIcon from './icons/LightningBoltIcon';

const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.313.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" /></svg>;
const PencilSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;

const fallbackPrompts = [
    "A cyberpunk courier discovers a package that ticks like a heart.",
    "The magic in the world is fading, but you just found a new source.",
    "You are a bartender at a tavern where time travelers meet.",
    "A dragon wakes up in a modern subway station.",
    "Your reflection just winked at you, but you didn't wink back.",
    "The stars have started disappearing one by one.",
    "You find a door in your apartment that wasn't there yesterday."
];

interface DailySparkWidgetProps {
    onPost: (prompt: string) => void;
    onStory: (prompt: string) => void;
}

const DailySparkWidget: React.FC<DailySparkWidgetProps> = ({ onPost, onStory }) => {
    const [prompt, setPrompt] = useState(fallbackPrompts[0]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Randomize initial prompt
        setPrompt(fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)]);
    }, []);

    const generateNewPrompt = async () => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: "Generate a single, creative, one-sentence writing prompt for a sci-fi or fantasy story. Do not use quotes.",
            });
            if (response.text) {
                setPrompt(response.text.trim());
            }
        } catch (e) {
            console.error("Failed to generate prompt", e);
            // Fallback to local random
            setPrompt(fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg border border-yellow-500/30 group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/40 via-purple-900/40 to-cyan-900/40 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
            
            <div className="relative p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                        <LightningBoltIcon className="w-5 h-5 text-yellow-400 animate-pulse" />
                        <h3 className="text-sm font-bold text-yellow-100 uppercase tracking-widest">Daily Spark</h3>
                    </div>
                    <p className={`text-lg md:text-xl font-medium text-white transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                        {prompt}
                    </p>
                </div>

                <div className="flex flex-shrink-0 gap-2 w-full md:w-auto">
                    <button 
                        onClick={generateNewPrompt}
                        disabled={isLoading}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                        title="New Prompt"
                    >
                        <RefreshIcon />
                    </button>
                    <button 
                        onClick={() => onPost(prompt)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                        <PencilSquareIcon /> Post
                    </button>
                    <button 
                        onClick={() => onStory(prompt)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                        <BookOpenIcon /> Story
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailySparkWidget;
