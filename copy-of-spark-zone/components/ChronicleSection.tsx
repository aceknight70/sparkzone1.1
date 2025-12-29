
import React, { useState, useRef } from 'react';
import { World, TimelineEvent } from '../types';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;

interface ChronicleSectionProps {
    worldData: World;
    setWorldData: React.Dispatch<React.SetStateAction<World>>;
}

const ChronicleSection: React.FC<ChronicleSectionProps> = ({ worldData, setWorldData }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newEvent, setNewEvent] = useState<Omit<TimelineEvent, 'id'>>({ title: '', dateLabel: '', description: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddEvent = () => {
        if (!newEvent.title || !newEvent.dateLabel) return;
        const event: TimelineEvent = { ...newEvent, id: Date.now() };
        setWorldData(prev => ({
            ...prev,
            timeline: [...(prev.timeline || []), event]
        }));
        setNewEvent({ title: '', dateLabel: '', description: '' });
        setIsAdding(false);
    };

    const handleDeleteEvent = (id: number) => {
        setWorldData(prev => ({
            ...prev,
            timeline: (prev.timeline || []).filter(e => e.id !== id)
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewEvent(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-cyan-400">The Chronicle</h2>
                    <p className="text-sm text-gray-400">Document the history and key events of your world.</p>
                </div>
                {!isAdding && (
                    <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-semibold rounded-full hover:bg-cyan-500/30 transition-colors text-sm">
                        <PlusIcon /> Add Event
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-4 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">Date Label</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Year 2050, The Awakening" 
                                value={newEvent.dateLabel} 
                                onChange={e => setNewEvent({...newEvent, dateLabel: e.target.value})}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">Event Title</label>
                            <input 
                                type="text" 
                                placeholder="e.g. The Fall of the King" 
                                value={newEvent.title} 
                                onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                                className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm focus:border-cyan-500 outline-none"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">Description</label>
                        <textarea 
                            placeholder="What happened?" 
                            value={newEvent.description} 
                            onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                            rows={3}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm focus:border-cyan-500 outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">Event Image (Optional)</label>
                        <div className="flex items-center gap-4">
                            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 hover:text-white">
                                <PhotoIcon /> Upload
                            </button>
                            {newEvent.imageUrl && <span className="text-xs text-green-400">Image Attached</span>}
                            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-sm text-gray-400 hover:text-white">Cancel</button>
                        <button onClick={handleAddEvent} className="px-4 py-1.5 bg-cyan-600 text-white text-sm font-bold rounded hover:bg-cyan-500">Save Event</button>
                    </div>
                </div>
            )}

            <div className="relative border-l-2 border-violet-500/30 ml-4 space-y-8 pb-4">
                {(worldData.timeline || []).map((event, index) => (
                    <div key={event.id} className="relative pl-8 group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gray-900 border-2 border-cyan-500 group-hover:bg-cyan-500 transition-colors"></div>
                        
                        <div className="bg-gray-800/40 border border-white/5 rounded-lg p-4 hover:bg-gray-800/60 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">{event.dateLabel}</span>
                                    <h3 className="text-lg font-bold text-white">{event.title}</h3>
                                </div>
                                <button onClick={() => handleDeleteEvent(event.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TrashIcon />
                                </button>
                            </div>
                            
                            <p className="text-sm text-gray-300 leading-relaxed">{event.description}</p>
                            
                            {event.imageUrl && (
                                <div className="mt-3 rounded-lg overflow-hidden border border-white/10 max-h-48">
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {(worldData.timeline || []).length === 0 && !isAdding && (
                    <div className="pl-8 text-gray-500 text-sm italic">No events recorded in the chronicles yet.</div>
                )}
            </div>
        </div>
    );
};

export default ChronicleSection;
