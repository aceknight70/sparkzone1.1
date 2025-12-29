
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import LightningBoltIcon from './icons/LightningBoltIcon';

interface GeneratedData {
    name: string;
    epithet: string;
    tagline: string;
    archetypeTags: string[];
}

interface CharacterAiGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (data: GeneratedData) => void;
}

const CharacterAiGeneratorModal: React.FC<CharacterAiGeneratorModalProps> = ({ isOpen, onClose, onGenerate }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const fullPrompt = `Generate a character profile for a fantasy role-playing app based on this core idea: "${prompt}". Provide a name, an epithet (a short title), a one-liner/tagline, and a few archetype tags.`;

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The character's name." },
                    epithet: { type: Type.STRING, description: "A short, descriptive title for the character, like 'the Shadow Rogue'." },
                    tagline: { type: Type.STRING, description: "A catchy one-liner that summarizes the character's personality or role." },
                    archetypeTags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "A list of 3-4 short tags describing the character's archetype, e.g., 'Rogue', 'Anti-Hero', 'Fantasy'."
                    }
                },
                required: ['name', 'epithet', 'tagline', 'archetypeTags']
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                }
            });

            const generatedData = JSON.parse(response.text);
            onGenerate(generatedData);
            onClose();

        } catch (err) {
            console.error("AI Generation Error:", err);
            setError("Sorry, something went wrong. Please check your prompt and try again.");
        } finally {
            setIsLoading(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div ref={modalRef} className="w-full max-w-lg bg-gray-900 border border-violet-500/50 rounded-lg shadow-xl flex flex-col">
                <div className="p-4 border-b border-violet-500/30">
                    <h2 className="text-xl font-bold text-cyan-400">Generate with AI</h2>
                    <p className="text-sm text-gray-400">Describe your character idea, and let AI create the spark.</p>
                </div>
                <div className="p-4 space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A grumpy dwarf blacksmith with a secret heart of gold"
                        rows={4}
                        className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    />
                     {error && <p className="text-sm text-red-400">{error}</p>}
                </div>
                <div className="p-4 flex justify-end gap-2 border-t border-violet-500/30">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-700">Cancel</button>
                    <button 
                        onClick={handleGenerate} 
                        disabled={isLoading || !prompt.trim()}
                        className="px-4 py-2 flex items-center gap-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-wait"
                    >
                         <LightningBoltIcon className="w-4 h-4" />
                         {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharacterAiGeneratorModal;
