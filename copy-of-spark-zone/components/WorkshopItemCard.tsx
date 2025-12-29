
import React, { useState, useRef, useEffect } from 'react';
import { UserCreation } from '../types';
import UserAvatar from './UserAvatar';

const MoreOptionsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
    </svg>
);

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
    </svg>
);

interface WorkshopItemCardProps {
    creation: UserCreation;
    onEdit?: () => void;
    onView?: () => void;
    onDelete?: () => void;
}

const WorkshopItemCard: React.FC<WorkshopItemCardProps> = ({ creation, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const typeColorMap: Record<UserCreation['type'], string> = {
        Character: 'text-cyan-400 border-cyan-500/30 bg-cyan-900/20',
        World: 'text-violet-400 border-violet-500/30 bg-violet-900/20',
        Story: 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20',
        'AI Character': 'text-rose-400 border-rose-500/30 bg-rose-900/20',
        Meme: 'text-amber-400 border-amber-500/30 bg-amber-900/20',
        'RP Card': 'text-indigo-400 border-indigo-500/30 bg-indigo-900/20',
        Community: 'text-orange-400 border-orange-500/30 bg-orange-900/20',
    };

    const statusColorMap: Record<UserCreation['status'], string> = {
        Draft: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
        Published: 'bg-green-500/20 text-green-500 border-green-500/30',
        Active: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    };

    const typeStyle = typeColorMap[creation.type] || 'text-gray-400 border-gray-500/30 bg-gray-900/20';
    const statusStyle = statusColorMap[creation.status] || 'bg-gray-500/20 text-gray-500 border-gray-500/30';

    return (
        <div 
            className="group relative bg-[#0f0f11] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-violet-500/40 hover:shadow-2xl flex flex-col h-full"
        >
            {/* Header Visual - Reduced Aspect */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
                <img 
                    src={creation.imageUrl || 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=800&auto=format&fit=crop'} 
                    alt={creation.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-transparent to-transparent opacity-80"></div>
                
                {/* Status Badge - Compact */}
                <div className="absolute top-2 left-2">
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter border backdrop-blur-md ${statusStyle}`}>
                        {creation.status}
                    </span>
                </div>

                {/* More Options */}
                <div className="absolute top-2 right-2" ref={menuRef}>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                        className="p-1.5 bg-black/60 backdrop-blur-md text-white rounded-lg hover:bg-gray-700 transition-colors border border-white/10"
                    >
                        <MoreOptionsIcon />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-1 w-32 bg-[#16161a] border border-white/10 rounded-lg shadow-2xl z-50 animate-fadeInUp overflow-hidden">
                            <button onClick={() => { onDelete?.(); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] text-red-400 hover:bg-red-500/10 transition-colors">
                                Archive Item
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Content Area - Tighter Padding */}
            <div className="p-3 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest border ${typeStyle}`}>
                        {creation.type}
                    </span>
                </div>
                
                <h3 className="text-sm font-bold text-white mb-1 truncate group-hover:text-cyan-400 transition-colors">
                    {creation.name}
                </h3>
                
                <p className="text-[10px] text-gray-500 mb-3 line-clamp-1 leading-tight">
                    Laboratory Entry
                </p>
                
                {/* Action Button - Compact */}
                <div className="mt-auto">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-white/5 hover:bg-violet-600 border border-white/10 hover:border-violet-400 rounded-lg text-[10px] font-bold text-gray-300 hover:text-white transition-all duration-300"
                    >
                        <PencilIcon />
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkshopItemCard;
