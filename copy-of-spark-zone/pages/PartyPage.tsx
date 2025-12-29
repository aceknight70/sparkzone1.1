
import React, { useState, useEffect } from 'react';
import { Party, PartyShopItem, User } from '../types';
import { partyShopItems, allUsers } from '../mockData';
import UserAvatar from '../components/UserAvatar';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const ShoppingBagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" /></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.992 2.126l4.31 4.31a3 3 0 004.242 0l4.31-4.31a3 3 0 00.992-2.126V5.25a3 3 0 00-3-3H5.25zM15.75 7.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" /><path fillRule="evenodd" d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H2.25zM12.75 12.75v-6.75a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25H12.75zM2.25 14.25h9v6.75a8.25 8.25 0 01-8.25-8.25zM12.75 14.25h9a8.25 8.25 0 01-8.25 8.25v-6.75z" clipRule="evenodd" /></svg>;
const SparkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const SwatchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 00-3.471 2.987 10.04 10.04 0 014.815 4.815 18.748 18.748 0 002.987-3.472l3.386-5.079A1.902 1.902 0 0020.599 1.5zm-8.3 14.025a18.76 18.76 0 001.885.955 6.502 6.502 0 00-3.76 1.777l-.922.921a4.857 4.857 0 00-.883 2.627 3.238 3.238 0 00.913 2.296.75.75 0 001.205-.623c.1-.84.445-1.628.986-2.262L14.73 18.2a18.76 18.76 0 00-2.43 1.325zM12 9.015a11.53 11.53 0 01-3.327-.292 2.234 2.234 0 00-1.922 2.824 13.567 13.567 0 002.392 3.864 13.57 13.57 0 003.863 2.392 2.234 2.234 0 002.824-1.922A11.532 11.532 0 0112 9.015z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const FaceSmileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z" clipRule="evenodd" /></svg>;
const ArchiveBoxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" /><path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;

const PartyCard: React.FC<{ party: Party; onSelect: () => void; onEdit: () => void; }> = ({ party, onSelect, onEdit }) => (
    <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg overflow-hidden group transition-all hover:border-violet-400 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col text-left">
        <button onClick={onSelect} className="aspect-video overflow-hidden block w-full relative">
            <img src={party.imageUrl} alt={party.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            {party.rpFormat && (
                <span className="absolute top-2 right-2 bg-indigo-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {party.rpFormat}
                </span>
            )}
        </button>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-white truncate">{party.name}</h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2 flex-grow">{party.description}</p>
            
            {party.genreTags && party.genreTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {party.genreTags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-800 text-cyan-300 text-xs font-medium px-2 py-0.5 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-4 pt-3 border-t border-violet-500/20 flex items-center justify-between gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <UsersIcon />
                    <span>{party.members.length} members</span>
                </div>
                <button onClick={onEdit} className="text-xs font-semibold text-cyan-400 hover:underline">Edit</button>
            </div>
        </div>
    </div>
);

const ShopItemCard: React.FC<{ item: PartyShopItem; onGift: (item: PartyShopItem) => void; isOwned?: boolean }> = ({ item, onGift, isOwned: propIsOwned = false }) => {
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isOwned, setIsOwned] = useState(propIsOwned);

    const handlePurchase = () => {
        if (isOwned) return;
        setIsPurchasing(true);
        setTimeout(() => {
            setIsPurchasing(false);
            setIsOwned(true);
        }, 1500);
    };

    const getRarityStyles = (rarity?: string) => {
        switch(rarity) {
            case 'Legendary': return { border: 'border-yellow-500/50', glow: 'hover:shadow-yellow-500/20', text: 'text-yellow-400', bg: 'bg-yellow-500' };
            case 'Epic': return { border: 'border-purple-500/50', glow: 'hover:shadow-purple-500/20', text: 'text-purple-400', bg: 'bg-purple-600' };
            case 'Rare': return { border: 'border-cyan-500/50', glow: 'hover:shadow-cyan-500/20', text: 'text-cyan-400', bg: 'bg-cyan-600' };
            default: return { border: 'border-gray-700', glow: 'hover:shadow-white/5', text: 'text-gray-400', bg: 'bg-gray-600' };
        }
    };

    const styles = getRarityStyles(item.rarity);

    return (
        <div className={`bg-gray-900 rounded-xl overflow-hidden border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${styles.border} ${styles.glow} relative group flex flex-col h-full`}>
            {/* Image */}
            <div className="h-32 relative overflow-hidden bg-black/40">
                <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                
                {/* Rarity & Type Badge */}
                <div className="absolute top-2 left-2 flex gap-1">
                    {item.rarity && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${styles.bg} text-white shadow-lg`}>
                            {item.rarity}
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col flex-grow">
                <h3 className="font-bold text-white text-sm leading-tight mb-1 truncate">{item.name}</h3>
                <p className="text-[10px] text-gray-400 line-clamp-2 mb-3 flex-grow">{item.description}</p>

                <div className="flex gap-2 mt-auto">
                    {isOwned ? (
                        <button className="flex-1 py-1.5 bg-gray-800 text-green-400 border border-green-500/30 rounded font-bold text-xs flex items-center justify-center gap-1 cursor-default">
                            <CheckCircleIcon /> Owned
                        </button>
                    ) : (
                        <button 
                            onClick={handlePurchase}
                            disabled={isPurchasing}
                            className="flex-1 py-1.5 bg-white hover:bg-gray-200 text-black font-bold rounded text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                            {isPurchasing ? (
                                <span className="animate-pulse">...</span>
                            ) : (
                                <>
                                    <SparkIcon /> {item.price}
                                </>
                            )}
                        </button>
                    )}
                    
                    <button 
                        onClick={() => onGift(item)}
                        className="px-2 py-1.5 bg-gray-800 hover:bg-pink-900/30 text-gray-400 hover:text-pink-400 border border-gray-700 hover:border-pink-500/50 rounded transition-colors"
                        title="Gift to Friend"
                    >
                        <GiftIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

const PartyItemShop: React.FC<{ balance: number }> = ({ balance }) => {
    const [shopFilter, setShopFilter] = useState<'all' | 'gift' | 'template' | 'sticker'>('all');
    const [viewMode, setViewMode] = useState<'market' | 'inventory'>('market');
    const [giftingItem, setGiftingItem] = useState<PartyShopItem | null>(null);
    
    // Mock Inventory (just a subset of shop items for demo)
    const inventoryItems = partyShopItems.filter((_, i) => i % 2 === 0);
    
    const itemsToDisplay = viewMode === 'market' 
        ? partyShopItems.filter(item => shopFilter === 'all' || item.type === shopFilter)
        : inventoryItems.filter(item => shopFilter === 'all' || item.type === shopFilter);

    const handleGift = (item: PartyShopItem) => {
        setGiftingItem(item);
    };

    const confirmGift = (userId: number) => {
        alert(`Gifted ${giftingItem?.name} successfully!`);
        setGiftingItem(null);
    };

    return (
        <div className="animate-fadeIn pb-20">
            {/* Hero Banner (Only in Market) */}
            {viewMode === 'market' && (
                <div className="relative rounded-2xl overflow-hidden mb-6 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] group">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=1200&auto=format&fit=crop')" }}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
                    <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="max-w-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">Flash Sale</span>
                                <span className="text-xs font-mono text-cyan-400">Ends in 04:22:19</span>
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight italic mb-2">
                                NEON NIGHTS <br/><span className="text-cyan-400">COLLECTION</span>
                            </h2>
                            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                Transform your party room into a cyberpunk lounge. Includes dynamic backgrounds, glitch effects, and exclusive synthwave stickers.
                            </p>
                            <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-wide rounded-full shadow-lg shadow-cyan-500/40 transition-all flex items-center gap-2 text-sm">
                                Get Bundle <span className="bg-black/20 px-1.5 rounded text-[10px]">1500 ⚡</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-Navigation & Balance */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 sticky top-0 bg-[#050505]/95 backdrop-blur-md z-10 py-4 border-b border-white/5">
                
                {/* View Toggle */}
                <div className="flex bg-gray-900/80 p-1 rounded-lg border border-white/10">
                    <button 
                        onClick={() => setViewMode('market')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'market' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Market
                    </button>
                    <button 
                        onClick={() => setViewMode('inventory')}
                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'inventory' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        My Stash
                    </button>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide pb-1">
                    {[
                        { id: 'all', label: 'All', icon: null },
                        { id: 'gift', label: 'Gifts', icon: <GiftIcon /> },
                        { id: 'template', label: 'Themes', icon: <SwatchIcon /> },
                        { id: 'sticker', label: 'Stickers', icon: <FaceSmileIcon /> },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setShopFilter(tab.id as any)}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                                shopFilter === tab.id 
                                    ? 'bg-cyan-900/30 text-cyan-400 border-cyan-500/50' 
                                    : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
                
                {/* Balance */}
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-yellow-500/30 shadow-sm ml-auto md:ml-0">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mr-1">Balance:</span>
                    <SparkIcon />
                    <span className="font-bold text-yellow-400 text-sm">{balance}</span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {itemsToDisplay.map(item => (
                    <ShopItemCard 
                        key={item.id} 
                        item={item} 
                        onGift={handleGift}
                        isOwned={viewMode === 'inventory'}
                    />
                ))}
            </div>
            
            {itemsToDisplay.length === 0 && (
                <div className="text-center py-20 text-gray-500 bg-gray-900/30 rounded-2xl border border-dashed border-gray-800">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                        <ArchiveBoxIcon />
                    </div>
                    <p>No items found in this section.</p>
                </div>
            )}

            {/* Gift Modal */}
            {giftingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setGiftingItem(null)}>
                    <div className="w-full max-w-sm bg-gray-900 border border-pink-500/30 rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-4 bg-pink-900/20 border-b border-pink-500/20 text-center">
                            <h3 className="font-bold text-pink-400 uppercase tracking-widest text-sm">Send Gift</h3>
                            <p className="text-white font-bold mt-1">{giftingItem.name}</p>
                        </div>
                        <div className="p-4 max-h-60 overflow-y-auto space-y-2">
                            <p className="text-xs text-gray-400 mb-2 uppercase font-bold">Select Friend</p>
                            {allUsers.slice(1).map(user => (
                                <button 
                                    key={user.id} 
                                    onClick={() => confirmGift(user.id)}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors group"
                                >
                                    <UserAvatar src={user.avatarUrl} size="8" />
                                    <span className="text-sm text-gray-300 group-hover:text-white font-medium">{user.name}</span>
                                    <span className="ml-auto text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">SEND</span>
                                </button>
                            ))}
                        </div>
                        <div className="p-3 bg-black/20 border-t border-white/5 text-center">
                            <button onClick={() => setGiftingItem(null)} className="text-xs text-gray-500 hover:text-white">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

interface PartyPageProps {
    parties: Party[];
    onSelectParty: (partyId: number) => void;
    onCreateParty: () => void;
    onEditParty: (partyId: number) => void;
    currentUser: User;
}

type PartyViewMode = 'hub' | 'shop';

const PartyPage: React.FC<PartyPageProps> = ({ parties, onSelectParty, onCreateParty, onEditParty, currentUser }) => {
    const [viewMode, setViewMode] = useState<PartyViewMode>('hub');

    return (
        <div className="container mx-auto px-4 py-8 animate-fadeIn h-full overflow-y-auto pb-20 md:pb-4">
             <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 sticky top-0 bg-black/90 backdrop-blur-xl z-20 py-4 border-b border-white/5">
                <div className="flex items-center gap-2 bg-gray-900/80 p-1 rounded-full border border-white/10 shadow-lg">
                    <button 
                        onClick={() => setViewMode('hub')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'hub' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Party Hub
                    </button>
                    <button 
                        onClick={() => setViewMode('shop')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'shop' ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        <ShoppingBagIcon /> Item Bazaar
                    </button>
                </div>

                {viewMode === 'hub' && (
                    <button onClick={onCreateParty} className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                        <PlusIcon />
                        <span>Create Party</span>
                    </button>
                )}
            </div>

            {viewMode === 'hub' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parties.map(party => (
                        <PartyCard 
                            key={party.id} 
                            party={party} 
                            onSelect={() => onSelectParty(party.id)}
                            onEdit={() => onEditParty(party.id)}
                        />
                    ))}
                </div>
            ) : (
                <PartyItemShop balance={currentUser.sparkClashProfile?.sparks || 0} />
            )}
        </div>
    );
};

export default PartyPage;
