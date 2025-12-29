
import React, { useState } from 'react';
import { AgeRating, ContentWarning } from '../types';
import { GoogleGenAI, Type } from '@google/genai';
import LightningBoltIcon from './icons/LightningBoltIcon';

const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.28l1.383 1.382 1.966-1.966a.75.75 0 111.06 1.06l-1.965 1.967 1.382 1.382h.28a.75.75 0 010 1.5h-.28l-1.382 1.382 1.966 1.966a.75.75 0 01-1.06 1.061l-1.967-1.967-1.382 1.383v.28a.75.75 0 01-1.5 0v-.28l-1.382-1.383-1.966 1.967a.75.75 0 01-1.061-1.06l1.967-1.967-1.382-1.382h-.28a.75.75 0 010-1.5h.28l1.383-1.382-1.967-1.966a.75.75 0 111.06-1.06l1.966 1.966 1.383-1.382V2.75A.75.75 0 0110 2zM10 6.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5z" clipRule="evenodd" /></svg>;

interface ContentRatingSelectorProps {
    rating: AgeRating;
    setRating: (r: AgeRating) => void;
    warnings: ContentWarning[];
    setWarnings: (w: ContentWarning[]) => void;
    title?: string;
    ratingLabel?: string;
    warningsLabel?: string;
    contentToAnalyze?: string; // New prop for content analysis
}

const ContentRatingSelector: React.FC<ContentRatingSelectorProps> = ({ 
    rating, 
    setRating, 
    warnings, 
    setWarnings, 
    title = "Defense System (Safety Settings)",
    ratingLabel = "Age Rating",
    warningsLabel = "Content Tags (Select all that apply)",
    contentToAnalyze
}) => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanMessage, setScanMessage] = useState('');
    
    const ratings: { value: AgeRating; label: string; color: string; desc: string }[] = [
        { value: 'Everyone', label: 'Everyone', color: 'bg-green-500', desc: 'Safe for all ages. No explicit content.' },
        { value: 'Teen', label: 'Teen', color: 'bg-yellow-500', desc: 'May contain mild violence, suggestive themes.' },
        { value: 'Mature', label: 'Mature', color: 'bg-red-500', desc: 'Intense violence, dark themes, or strong language.' },
    ];

    const availableWarnings: ContentWarning[] = [
        'Violence', 'Romance', 'Horror', 'Strong Language', 'Dark Themes', 'Politics', 'Substance Use'
    ];

    const toggleWarning = (w: ContentWarning) => {
        if (warnings.includes(w)) {
            setWarnings(warnings.filter(item => item !== w));
        } else {
            setWarnings([...warnings, w]);
        }
    };

    const handleAiScan = async () => {
        if (!contentToAnalyze || contentToAnalyze.length < 10) {
            setScanMessage("Not enough content to scan.");
            setTimeout(() => setScanMessage(''), 2000);
            return;
        }

        setIsScanning(true);
        setScanMessage('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Analyze the following text for content safety in a role-playing app context.
            Determine the appropriate Age Rating (Everyone, Teen, Mature).
            Identify any specific content warnings from this list: [Violence, Romance, Horror, Strong Language, Dark Themes, Politics, Substance Use].
            
            Text to analyze:
            "${contentToAnalyze.slice(0, 1500)}"
            
            Return JSON only: { "ageRating": "string", "warnings": ["string"] }`;

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    ageRating: { type: Type.STRING, enum: ['Everyone', 'Teen', 'Mature'] },
                    warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                }
            });

            const result = JSON.parse(response.text);
            
            if (result.ageRating) setRating(result.ageRating as AgeRating);
            if (result.warnings) {
                // Filter ensuring only valid warnings are added
                const validWarnings = result.warnings.filter((w: string) => availableWarnings.includes(w as ContentWarning));
                setWarnings(validWarnings as ContentWarning[]);
            }
            setScanMessage("Scan Complete!");
        } catch (e) {
            console.error("AI Scan Failed", e);
            setScanMessage("Scan failed.");
        } finally {
            setIsScanning(false);
            setTimeout(() => setScanMessage(''), 3000);
        }
    };

    return (
        <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4 border-b border-violet-500/30 pb-2">
                <div className="flex items-center gap-2">
                    <ShieldCheckIcon />
                    <h3 className="text-lg font-bold text-cyan-400">{title}</h3>
                </div>
                {contentToAnalyze && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-green-400 font-bold">{scanMessage}</span>
                        <button 
                            onClick={handleAiScan}
                            disabled={isScanning}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider rounded-full border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
                        >
                            <LightningBoltIcon className={`w-3 h-3 ${isScanning ? 'animate-pulse' : ''}`} />
                            {isScanning ? 'Scanning...' : 'Auto-Scan'}
                        </button>
                    </div>
                )}
            </div>

            {/* Rating Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">{ratingLabel}</label>
                <div className="grid grid-cols-3 gap-4">
                    {ratings.map((r) => (
                        <button
                            key={r.value}
                            onClick={() => setRating(r.value)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200 ${rating === r.value ? `border-${r.color.split('-')[1]}-400 bg-white/10 ring-2 ring-${r.color.split('-')[1]}-400` : 'border-gray-700 bg-gray-800/60 hover:bg-gray-800'}`}
                        >
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-black mb-2 ${r.color}`}>
                                {r.label}
                            </span>
                            <span className="text-xs text-center text-gray-400 leading-tight">{r.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Warnings Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">{warningsLabel}</label>
                <div className="flex flex-wrap gap-2">
                    {availableWarnings.map((w) => (
                        <button
                            key={w}
                            onClick={() => toggleWarning(w)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${warnings.includes(w) ? 'bg-rose-500/20 border-rose-500 text-rose-300' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                        >
                            {w}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContentRatingSelector;
