
import React, { useState, useRef } from 'react';
import { World, MapPin, WorldLoreCategory } from '../types';

const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;

interface AtlasSectionProps {
    worldData: World;
    setWorldData: React.Dispatch<React.SetStateAction<World>>;
}

const AtlasSection: React.FC<AtlasSectionProps> = ({ worldData, setWorldData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [selectedPinId, setSelectedPinId] = useState<number | null>(null);
    const [newPinCoords, setNewPinCoords] = useState<{x: number, y: number} | null>(null);

    // Temp state for the form
    const [pinForm, setPinForm] = useState<{label: string, linkType: 'channel' | 'lore', linkId: number}>({
        label: '', linkType: 'channel', linkId: 0
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setWorldData(prev => ({ ...prev, mapImageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMapClick = (e: React.MouseEvent) => {
        if (!worldData.mapImageUrl || !mapContainerRef.current) return;
        
        // If we are editing a pin, clicking off it should probably deselect unless we implement drag later
        // For now, clicking empty space starts creation
        const rect = mapContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setNewPinCoords({ x, y });
        setSelectedPinId(null); // Deselect existing
        setPinForm({ label: 'New Location', linkType: 'channel', linkId: worldData.locations[0]?.channels[0]?.id || 0 });
    };

    const handlePinClick = (e: React.MouseEvent, pin: MapPin) => {
        e.stopPropagation();
        setNewPinCoords(null);
        setSelectedPinId(pin.id);
        setPinForm({ label: pin.label || '', linkType: pin.linkType, linkId: pin.linkId });
    };

    const savePin = () => {
        if (newPinCoords) {
            // Create new
            const newPin: MapPin = {
                id: Date.now(),
                x: newPinCoords.x,
                y: newPinCoords.y,
                label: pinForm.label,
                linkType: pinForm.linkType,
                linkId: Number(pinForm.linkId)
            };
            setWorldData(prev => ({ ...prev, mapPins: [...(prev.mapPins || []), newPin] }));
            setNewPinCoords(null);
        } else if (selectedPinId) {
            // Update existing
            setWorldData(prev => ({
                ...prev,
                mapPins: (prev.mapPins || []).map(p => p.id === selectedPinId ? { ...p, label: pinForm.label, linkType: pinForm.linkType, linkId: Number(pinForm.linkId) } : p)
            }));
            setSelectedPinId(null);
        }
    };

    const deletePin = () => {
        if (selectedPinId) {
            setWorldData(prev => ({
                ...prev,
                mapPins: (prev.mapPins || []).filter(p => p.id !== selectedPinId)
            }));
            setSelectedPinId(null);
        }
        setNewPinCoords(null);
    };

    const availableChannels = worldData.locations.flatMap(cat => cat.channels);
    const availableLore = worldData.lorebook;

    return (
        <div className="h-full flex flex-col md:flex-row overflow-hidden">
            {/* Map Area */}
            <div className="flex-grow bg-gray-900 relative flex items-center justify-center overflow-hidden p-4">
                {worldData.mapImageUrl ? (
                    <div 
                        ref={mapContainerRef}
                        onClick={handleMapClick}
                        className="relative max-w-full max-h-full shadow-2xl cursor-crosshair"
                    >
                        <img src={worldData.mapImageUrl} alt="World Map" className="max-w-full max-h-full object-contain rounded-lg" />
                        
                        {/* Existing Pins */}
                        {(worldData.mapPins || []).map(pin => (
                            <button
                                key={pin.id}
                                onClick={(e) => handlePinClick(e, pin)}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 ${selectedPinId === pin.id ? 'text-yellow-400 scale-125' : 'text-red-500'}`}
                                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                            >
                                <MapPinIcon />
                            </button>
                        ))}

                        {/* New Pin Preview */}
                        {newPinCoords && (
                            <div 
                                className="absolute -translate-x-1/2 -translate-y-1/2 text-cyan-400 animate-bounce"
                                style={{ left: `${newPinCoords.x}%`, top: `${newPinCoords.y}%` }}
                            >
                                <MapPinIcon />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-gray-500">
                        <p className="mb-4">No map uploaded yet.</p>
                        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-md hover:bg-cyan-500/30">
                            Upload Map Image
                        </button>
                    </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>

            {/* Sidebar Editor */}
            <div className="w-full md:w-80 bg-gray-900 border-l border-violet-500/30 p-4 flex flex-col gap-4 overflow-y-auto">
                <h3 className="text-lg font-bold text-cyan-400 border-b border-violet-500/30 pb-2">Atlas Config</h3>
                
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <h4 className="font-bold text-white mb-2">Map Image</h4>
                    <div 
                        onClick={() => fileInputRef.current?.click()} 
                        className="aspect-video bg-black/40 rounded border-2 border-dashed border-gray-600 flex items-center justify-center cursor-pointer hover:border-cyan-500 hover:text-cyan-400 text-gray-500 transition-colors"
                    >
                        {worldData.mapImageUrl ? <img src={worldData.mapImageUrl} className="w-full h-full object-cover opacity-50" /> : <PhotoIcon />}
                    </div>
                </div>

                {(newPinCoords || selectedPinId) ? (
                    <div className="bg-gray-800/50 p-4 rounded-lg border border-cyan-500/50 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-white">{newPinCoords ? 'New Pin' : 'Edit Pin'}</h4>
                            {selectedPinId && <button onClick={deletePin} className="text-red-400 hover:text-white"><TrashIcon /></button>}
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Label</label>
                                <input 
                                    type="text" 
                                    value={pinForm.label} 
                                    onChange={(e) => setPinForm(prev => ({...prev, label: e.target.value}))}
                                    className="w-full bg-black/40 border border-gray-600 rounded p-2 text-white text-sm" 
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Link To</label>
                                <div className="flex gap-2 mb-2">
                                    <button 
                                        onClick={() => setPinForm(prev => ({...prev, linkType: 'channel'}))}
                                        className={`flex-1 py-1 text-xs rounded ${pinForm.linkType === 'channel' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                                    >Channel</button>
                                    <button 
                                        onClick={() => setPinForm(prev => ({...prev, linkType: 'lore'}))}
                                        className={`flex-1 py-1 text-xs rounded ${pinForm.linkType === 'lore' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                                    >Lore</button>
                                </div>
                                
                                <select 
                                    value={pinForm.linkId} 
                                    onChange={(e) => setPinForm(prev => ({...prev, linkId: Number(e.target.value)}))}
                                    className="w-full bg-black/40 border border-gray-600 rounded p-2 text-white text-sm"
                                >
                                    <option value={0}>Select Target...</option>
                                    {pinForm.linkType === 'channel' ? (
                                        availableChannels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                                    ) : (
                                        availableLore.map(l => <option key={l.id} value={l.id}>{l.name}</option>)
                                    )}
                                </select>
                            </div>

                            <button onClick={savePin} className="w-full py-2 bg-cyan-600 text-white font-bold rounded hover:bg-cyan-500 mt-2">
                                {newPinCoords ? 'Place Pin' : 'Update Pin'}
                            </button>
                            <button onClick={() => { setNewPinCoords(null); setSelectedPinId(null); }} className="w-full py-1 text-xs text-gray-400 hover:text-white">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-sm text-gray-500 italic text-center p-4">
                        Click on the map to add a new location pin.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AtlasSection;