
import React, { useRef, useEffect } from 'react';
import { UserCreation } from '../types';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;

interface MemePickerProps {
    userCreations: UserCreation[];
    onSelect: (imageUrl: string) => void;
    onClose: () => void;
    onCreateNew: () => void;
}

const MemePicker: React.FC<MemePickerProps> = ({ userCreations, onSelect, onClose, onCreateNew }) => {
    const pickerRef = useRef<HTMLDivElement>(null);
    const memes = userCreations.filter(c => c.type === 'Meme');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4">
            <div ref={pickerRef} className="w-full max-w-lg bg-gray-900 border border-violet-500/50 rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-scaleIn">
                {/* Header */}
                <div className="p-4 border-b border-violet-500/30 flex justify-between items-center bg-gray-900/95 backdrop-blur-md z-10">
                    <div>
                        <h3 className="text-lg font-bold text-cyan-400">Meme Stash</h3>
                        <p className="text-xs text-gray-400">Select a reaction</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={onCreateNew} 
                            className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-3 py-1.5 rounded-full transition-all shadow-lg shadow-cyan-500/20 transform hover:-translate-y-0.5"
                        >
                            <PlusIcon /> Create
                        </button>
                        <button 
                            onClick={onClose} 
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                        >
                            <XMarkIcon />
                        </button>
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-4 overflow-y-auto custom-scrollbar bg-black/20">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {/* Create New Tile (Optional shortcut inside grid) */}
                        <button 
                            onClick={onCreateNew}
                            className="aspect-square rounded-xl border-2 border-dashed border-gray-700 hover:border-cyan-500 flex flex-col items-center justify-center text-gray-500 hover:text-cyan-400 transition-all gap-2 group bg-white/5 hover:bg-white/10"
                        >
                            <div className="p-2 rounded-full bg-gray-800 group-hover:bg-cyan-500/20 transition-colors">
                                <PlusIcon />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">New</span>
                        </button>

                        {/* Meme Tiles */}
                        {memes.map(meme => (
                            <button 
                                key={meme.id} 
                                onClick={() => onSelect(meme.imageUrl)}
                                className="aspect-square rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-400 relative group transition-all transform hover:scale-105 shadow-md bg-black"
                            >
                                <img src={meme.imageUrl} alt={meme.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                    <span className="text-xs text-white font-bold uppercase tracking-wider bg-cyan-600/90 px-2 py-1 rounded shadow-lg">Send</span>
                                </div>
                            </button>
                        ))}
                    </div>
                    
                    {memes.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p>Your stash is empty.</p>
                            <p className="text-sm">Create memes to use them here!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemePicker;
