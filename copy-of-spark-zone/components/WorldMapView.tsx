
import React, { useState } from 'react';
import { World, MapPin, WorldLocation, WorldLoreEntry } from '../types';

const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;

interface WorldMapViewProps {
    world: World;
    onSelectLocation: (location: WorldLocation) => void;
}

const WorldMapView: React.FC<WorldMapViewProps> = ({ world, onSelectLocation }) => {
    const [selectedLore, setSelectedLore] = useState<WorldLoreEntry | null>(null);

    const handlePinClick = (pin: MapPin) => {
        if (pin.linkType === 'channel') {
            const channel = world.locations.flatMap(cat => cat.channels).find(c => c.id === pin.linkId);
            if (channel) {
                onSelectLocation(channel);
            }
        } else if (pin.linkType === 'lore') {
            const lore = world.lorebook.find(l => l.id === pin.linkId);
            if (lore) {
                setSelectedLore(lore);
            }
        }
    };

    if (!world.mapImageUrl) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black text-gray-500">
                <p>This world does not have a map yet.</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
            {/* Map Container */}
            <div className="relative max-w-full max-h-full shadow-2xl">
                <img src={world.mapImageUrl} alt="Interactive Map" className="max-w-full max-h-full object-contain pointer-events-none" />
                
                {(world.mapPins || []).map(pin => (
                    <div
                        key={pin.id}
                        className="absolute -translate-x-1/2 -translate-y-full cursor-pointer group z-10"
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                        onClick={() => handlePinClick(pin)}
                    >
                        <div className="text-red-500 drop-shadow-lg transform transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-1">
                            <MapPinIcon />
                        </div>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="bg-black/80 backdrop-blur-md border border-violet-500/30 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-xl font-bold">
                                {pin.label}
                                <span className="ml-2 text-[10px] text-cyan-400 uppercase tracking-wider">{pin.linkType}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lore Modal Overlay */}
            {selectedLore && (
                <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedLore(null)}>
                    <div className="bg-gray-900 border-2 border-violet-500/50 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-gray-900/95 border-b border-violet-500/30 p-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedLore.name}</h3>
                                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{selectedLore.category}</span>
                            </div>
                            <button onClick={() => setSelectedLore(null)} className="text-gray-400 hover:text-white">
                                <XMarkIcon />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedLore.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorldMapView;