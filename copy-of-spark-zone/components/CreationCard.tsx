
import React from 'react';
// FIX: Imported UserCreation type from ../types as it is not exported from mockData.
import { UserCreation } from '../types';

const CreationCard: React.FC<{ creation: UserCreation }> = ({ creation }) => {
    const typeColorMap: Record<UserCreation['type'], string> = {
        Character: 'bg-cyan-500/80',
        World: 'bg-violet-500/80',
        Story: 'bg-emerald-500/80',
        'AI Character': 'bg-rose-500/80',
        Meme: 'bg-amber-500/80',
        'RP Card': 'bg-indigo-500/80',
        Community: 'bg-orange-500/80',
    };
    
    const color = typeColorMap[creation.type] || 'bg-gray-500/80';

    return (
        <div className="aspect-[3/4] rounded-lg overflow-hidden relative group border border-violet-500/30 cursor-pointer">
            <img src={creation.imageUrl} alt={creation.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-3 text-white w-full">
                <span className={`text-xs font-bold px-2 py-1 rounded-full mb-1 inline-block ${color}`}>
                    {creation.type}
                </span>
                <h3 className="font-bold truncate">{creation.name}</h3>
            </div>
        </div>
    );
};

export default CreationCard;