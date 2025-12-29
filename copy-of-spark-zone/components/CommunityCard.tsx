
import React from 'react';
import { Community } from '../types';

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;

interface CommunityCardProps {
    community: Community;
    onClick: () => void;
    isMember?: boolean;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, onClick, isMember }) => {
    return (
        <div 
            onClick={onClick}
            className="bg-gray-900/50 border border-violet-500/30 rounded-lg overflow-hidden cursor-pointer group hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/20 transition-all"
        >
            <div className="h-20 bg-cover bg-center relative" style={{ backgroundImage: `url(${community.bannerUrl})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            </div>
            <div className="p-4 relative">
                <div className="absolute -top-8 left-4 border-4 border-gray-900 rounded-xl overflow-hidden w-16 h-16">
                    <img src={community.imageUrl} alt={community.name} className="w-full h-full object-cover" />
                </div>
                <div className="mt-8">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-white truncate">{community.name}</h3>
                        {isMember && <span className="text-[10px] font-bold text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded-full border border-cyan-500/30">MEMBER</span>}
                    </div>
                    <p className="text-xs text-gray-400 font-mono">{community.tag}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                        {community.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <UsersIcon />
                            <span>{community.members.length}</span>
                        </div>
                        <div className="text-xs text-yellow-500 font-bold">
                            Lvl {community.level}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityCard;