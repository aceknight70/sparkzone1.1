
import React, { useState } from 'react';
import { DiscoverableItem, AgeRating } from '../types';
import ReportModal from './ReportModal';

const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2c-4.418 0-8 3.134-8 7 0 2.444 1.206 4.634 3.09 5.982.257.185.334.502.213.766l-1.06 1.768a.75.75 0 001.28.766l1.23-2.05a.75.75 0 01.62-.358 10.42 10.42 0 002.83 0 .75.75 0 01.62.358l1.23 2.05a.75.75 0 001.28-.766l-1.06-1.768a.75.75 0 01.213-.766A7.96 7.96 0 0018 9c0-3.866-3.582-7-8-7z" clipRule="evenodd" /></svg>;
const FlagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M3 3.5c0-.266.102-.523.284-.716A.994.994 0 014 2.5h8.75c.426 0 .827.257.975.625l.875 2.187 1.925-.77a.75.75 0 01.89.334l.5 1.25a.75.75 0 01-.22.882l-2.153 1.615c.013.129.02.26.02.392 0 2.761-2.686 5-6 5s-6-2.239-6-5c0-.133.007-.264.02-.393L.505 6.013a.75.75 0 01-.22-.882l.5-1.25a.75.75 0 01.89-.334l1.925.77L4.5 2.125z" clipRule="evenodd" /><path d="M3 15.5v3.75a.75.75 0 001.5 0V15.5H3z" /></svg>;

interface DiscoveryCardProps {
    item: DiscoverableItem;
    onClick?: () => void;
    onStartConversation: (userId: number) => void;
    currentUserId: number;
}

const AgeRatingBadge: React.FC<{ rating?: AgeRating }> = ({ rating }) => {
    if (!rating) return null;
    
    let color = 'bg-gray-600 text-white';
    let label = '?';

    switch(rating) {
        case 'Everyone':
            color = 'bg-green-500/90 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]';
            label = 'E';
            break;
        case 'Teen':
            color = 'bg-yellow-500/90 text-black shadow-[0_0_10px_rgba(234,179,8,0.3)]';
            label = 'T';
            break;
        case 'Mature':
            color = 'bg-red-600/90 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]';
            label = 'M';
            break;
    }

    return (
        <span className={`absolute top-3 left-3 w-6 h-6 flex items-center justify-center rounded-md text-xs font-black backdrop-blur-sm z-20 ${color}`} title={`Rated: ${rating}`}>
            {label}
        </span>
    );
};

const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ item, onClick, onStartConversation, currentUserId }) => {
    const [isReportOpen, setIsReportOpen] = useState(false);

    const typeColorMap: Record<DiscoverableItem['type'], string> = {
        Character: 'bg-cyan-500/80 border-cyan-400/30',
        World: 'bg-violet-500/80 border-violet-400/30',
        Story: 'bg-emerald-500/80 border-emerald-400/30',
        'RP Card': 'bg-indigo-500/80 border-indigo-400/30',
        Community: 'bg-orange-500/80 border-orange-400/30',
        Meme: 'bg-amber-500/80 border-amber-400/30',
        'AI Character': 'bg-rose-500/80 border-rose-400/30',
    };
    
    const badgeStyle = typeColorMap[item.type] || 'bg-gray-500/80 border-gray-400/30';
    const isOwn = item.authorId === currentUserId;
    
    const content = (
        <>
            {/* Image Container */}
            <div className="absolute inset-0 overflow-hidden">
                <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80"></div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
            </div>
            
            <AgeRatingBadge rating={item.contentMetadata?.ageRating} />
            
            <button 
                onClick={(e) => { e.stopPropagation(); setIsReportOpen(true); }} 
                className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-md rounded-full text-gray-400 hover:text-red-400 hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20"
                title="Report"
            >
                <FlagIcon />
            </button>

            {/* Info Content */}
            <div className="absolute bottom-0 left-0 w-full p-4 z-20 transform transition-transform duration-300 translate-y-1 group-hover:translate-y-0">
                <div className="flex justify-between items-end">
                    <div className="min-w-0 flex-grow pr-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block uppercase tracking-wider border backdrop-blur-sm ${badgeStyle}`}>
                            {item.type}
                        </span>
                        <h3 className="font-bold text-lg leading-tight text-white truncate drop-shadow-md">{item.title}</h3>
                        <p className="text-xs text-gray-300 truncate mt-0.5 font-medium opacity-80 group-hover:opacity-100 transition-opacity">by {item.author}</p>
                    </div>
                    
                    {!isOwn && onStartConversation && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onStartConversation(item.authorId); }}
                            className="flex-shrink-0 p-2 rounded-full bg-white/10 hover:bg-cyan-500 hover:text-white text-gray-200 backdrop-blur-md transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                            aria-label={`Message ${item.author}`}
                        >
                            <MessageIcon />
                        </button>
                    )}
                </div>
            </div>
        </>
    );

    const commonClasses = "w-full aspect-[3/4] rounded-xl overflow-hidden relative group border border-white/10 shadow-lg bg-gray-900 transition-all duration-300 hover:shadow-cyan-900/20 hover:border-cyan-500/30";

    return (
        <>
            <div 
                onClick={onClick} 
                className={`${commonClasses} ${onClick ? 'cursor-pointer' : ''} text-left`}
                role={onClick ? "button" : undefined}
                tabIndex={onClick ? 0 : undefined}
                onKeyDown={onClick ? (e) => { if(e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
            >
                {content}
            </div>
            <ReportModal 
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                type="Content"
                targetName={item.title}
                targetId={item.id}
            />
        </>
    );
};

export default DiscoveryCard;
