
import React, { useState, useMemo, useEffect } from 'react';
import { User, UserCreation, SparkCardTemplate, SparkElement, SparkCard } from '../types';
import UserAvatar from '../components/UserAvatar';
import { cardTemplates } from '../mockData';

// --- Icons ---
const BoltIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l2.976-7.969H4.614a.75.75 0 01-.635-1.103l7.436-9.563a.75.75 0 01.53-.282z" clipRule="evenodd" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const SwatchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 00-3.471 2.987 10.04 10.04 0 014.815 4.815 18.748 18.748 0 002.987-3.472l3.386-5.079A1.902 1.902 0 0020.599 1.5zm-8.3 14.025a18.76 18.76 0 001.885.955 6.502 6.502 0 00-3.76 1.777l-.922.921a4.857 4.857 0 00-.883 2.627 3.238 3.238 0 00.913 2.296.75.75 0 001.205-.623c.1-.84.445-1.628.986-2.262L14.73 18.2a18.76 18.76 0 00-2.43 1.325zM12 9.015a11.53 11.53 0 01-3.327-.292 2.234 2.234 0 00-1.922 2.824 13.567 13.567 0 002.392 3.864 13.57 13.57 0 003.863 2.392 2.234 2.234 0 002.824-1.922A11.532 11.532 0 0112 9.015z" clipRule="evenodd" /></svg>;
const RectangleStackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" /><path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" /><path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25a.75.75 0 00.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134 0z" /></svg>;
const BeakerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.919z" clipRule="evenodd" /></svg>;
const ShoppingBagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>;
const ForwardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-yellow-400"><path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.753 6.753 0 002.793-.546A6.753 6.753 0 0013.235 4.5 6.753 6.753 0 005.166 2.621zm6.84 9.076a8.253 8.253 0 01-5.263-5.23A8.25 8.25 0 0117.257 9.076l.005.001a.75.75 0 01-.002 1.498l-.006-.002a9.751 9.751 0 00-5.259 3.033c.484.851.654 1.83.654 2.844 0 2.855-1.572 5.235-3.832 6.38a1.001 1.001 0 01-1.39-.743l-.719-2.875a1.001 1.001 0 01.744-1.216 4.985 4.985 0 002.73-4.23c0-1.127-.29-2.167-.79-3.076a9.75 9.75 0 00-2.166-2.404.75.75 0 011.025-1.096zM10.5 4.5h3v.75a.75.75 0 001.5 0v-.75h3c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-7.5c-.414 0-.75.336-.75.75s.336.75.75.75z" clipRule="evenodd" /></svg>;
const SkullIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-gray-400"><path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.353 0-.67.286-.67.638v.692c0 .324.227.601.543.654 1.87.306 3.046 1.455 3.046 2.87v.693c0 .285-.236.516-.521.516H1.521c-.285 0-.521-.231-.521-.516v-.693c0-1.415 1.176-2.564 3.046-2.87.316-.053.543-.33.543-.654v-.692c0-.352-.317-.638-.67-.638a.658.658 0 01-.66-.664c.002-1.823.13-3.652.376-5.452a.75.75 0 01.878-.645c1.842.334 3.722.562 5.632.676.332.02.61-.246.61-.578zM4.5 18.75a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h15a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75H4.5z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>;

// --- Card Component ---

const CardFrame: React.FC<{ 
    card: SparkCardTemplate; 
    size?: 'xs' | 'sm' | 'md' | 'lg'; 
    onClick?: () => void; 
    isSelected?: boolean;
    cooldown?: number; 
    isDimmed?: boolean; // New prop for swap visual
}> = ({ card, size = 'md', onClick, isSelected, cooldown = 0, isDimmed = false }) => {
    const sizeClasses = {
        xs: 'w-20 h-28 text-[8px]',
        sm: 'w-24 h-32 text-[9px]',
        md: 'w-32 h-44 text-[10px]',
        lg: 'w-48 h-64 text-xs'
    };

    const elementColors: Record<SparkElement, string> = {
        Solar: 'border-orange-500 bg-orange-950/90 shadow-orange-500/20',
        Lunar: 'border-indigo-500 bg-indigo-950/90 shadow-indigo-500/20',
        Terra: 'border-emerald-600 bg-emerald-950/90 shadow-emerald-500/20',
        Void: 'border-purple-600 bg-purple-950/90 shadow-purple-500/20',
        Neutral: 'border-gray-500 bg-gray-900/90 shadow-gray-500/20',
        Stellar: 'border-yellow-400 bg-yellow-950/90 shadow-yellow-500/20'
    };

    const styles = elementColors[card.element] || elementColors['Neutral'];
    const isCoolingDown = cooldown > 0;

    return (
        <div 
            onClick={(!isCoolingDown && !isDimmed) ? onClick : (isDimmed && onClick ? onClick : undefined)}
            className={`
                ${sizeClasses[size]} ${styles} border-2 rounded-lg flex flex-col relative overflow-hidden transition-all duration-200 shadow-lg 
                ${isSelected ? 'ring-2 ring-white scale-110 z-20 -translate-y-4' : ''}
                ${isCoolingDown ? 'grayscale opacity-70 cursor-not-allowed' : ''}
                ${isDimmed ? 'opacity-40 hover:opacity-100 cursor-pointer hover:scale-105 hover:z-30' : (!isCoolingDown && !isSelected && onClick ? 'hover:-translate-y-2 hover:shadow-xl hover:z-20 cursor-pointer' : '')}
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-center p-0.5 bg-black/40 border-b border-white/10">
                <span className="font-bold text-white truncate w-full pl-1">{card.name}</span>
                <div className="flex items-center text-cyan-300 font-bold bg-black/60 rounded-full px-1 py-0.5 border border-cyan-500/30">
                    <span className="text-[1.1em] mr-0.5">{card.energyCost}</span>
                    <BoltIcon />
                </div>
            </div>
            
            {/* Art Placeholder */}
            <div className="flex-grow bg-black/30 flex items-center justify-center p-1 relative group">
                <div className={`absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent`}></div>
                <div className="text-center opacity-90 transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl filter drop-shadow-lg">
                        {card.element === 'Solar' ? '🔥' : card.element === 'Lunar' ? '🌙' : card.element === 'Void' ? '🟣' : card.element === 'Terra' ? '⛰️' : '⚔️'}
                    </span>
                </div>
            </div>

            {/* Description - Adjusted for visibility on smaller sizes */}
            <div className="p-1 bg-black/70 text-gray-300 text-center flex flex-col justify-center border-t border-white/10 h-[30%]">
                {/* Hide text on xs size to prevent clutter */}
                {size !== 'xs' && <p className="leading-tight line-clamp-2 mb-0.5 opacity-80">{card.description}</p>}
                {card.baseStats && (
                    <div className="flex justify-center gap-1 text-[0.9em] font-mono font-bold items-center">
                        {card.baseStats.damage && <span className="text-red-400 bg-red-950/50 px-1 rounded-[2px] border border-red-500/30 flex items-center">{card.baseStats.damage} D</span>}
                        {card.baseStats.shield && <span className="text-blue-400 bg-blue-950/50 px-1 rounded-[2px] border border-blue-500/30 flex items-center">{card.baseStats.shield} S</span>}
                    </div>
                )}
            </div>

            {/* Cooldown Overlay */}
            {isCoolingDown && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30 backdrop-blur-[1px]">
                    <div className="text-center">
                        <ClockIcon />
                        <span className="text-lg font-black text-white">{cooldown}</span>
                    </div>
                </div>
            )}
            
            {/* Swap Mode Indicator */}
            {isDimmed && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-transparent">
                    <span className="bg-black/80 text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">Tap to Swap</span>
                </div>
            )}
        </div>
    );
};

// ... BattleView, CollectionView, MarketView remain unchanged ... 
// (I will just include the updated ForgeView below within the full file content for clarity)

// --- Views ---

const BattleView: React.FC<{ onExit: () => void, currentUser: User }> = ({ onExit, currentUser }) => {
    // ... same content as previous, keeping it for completeness ...
    const [playerHp, setPlayerHp] = useState(100);
    const [enemyHp, setEnemyHp] = useState(100);
    const [playerEnergy, setPlayerEnergy] = useState(3);
    const [hand, setHand] = useState<(SparkCardTemplate | null)[]>([
        cardTemplates[0], cardTemplates[1], cardTemplates[4], cardTemplates[5], null, null
    ]);
    const [reserveOpen, setReserveOpen] = useState(false);
    const [cooldowns, setCooldowns] = useState<Record<number, number>>({});
    const [isSwapMode, setIsSwapMode] = useState(false);
    const [swapTargetIndex, setSwapTargetIndex] = useState<number | null>(null);
    const [matchResult, setMatchResult] = useState<'victory' | 'defeat' | null>(null);
    const enemyAvatar = "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=200&auto=format&fit=crop";

    useEffect(() => {
        if (playerHp <= 0) setMatchResult('defeat');
        else if (enemyHp <= 0) setMatchResult('victory');
    }, [playerHp, enemyHp]);

    const handleCardClick = (idx: number, card: SparkCardTemplate) => {
        if (isSwapMode) {
            setSwapTargetIndex(idx);
            setReserveOpen(true);
            setIsSwapMode(false);
            return;
        }
        if (cooldowns[idx] > 0) return;
        if (playerEnergy < card.energyCost) return;

        setPlayerEnergy(prev => prev - card.energyCost);
        console.log(`Played ${card.name}`);
        if (card.baseStats?.damage) setEnemyHp(prev => Math.max(0, prev - card.baseStats!.damage!));
        setCooldowns(prev => ({ ...prev, [idx]: 2 }));
    };

    const handleEndTurn = () => {
        if (matchResult) return;
        setTimeout(() => {
            const dmg = Math.floor(Math.random() * 15) + 5;
            setPlayerHp(prev => Math.max(0, prev - dmg));
        }, 500);
        setCooldowns(prev => {
            const next = { ...prev };
            for (const key in next) {
                if (next[key] > 0) next[key] -= 1;
                if (next[key] <= 0) delete next[key];
            }
            return next;
        });
        setPlayerEnergy(prev => Math.min(10, prev + 2));
    };

    const toggleSwapMode = () => {
        if (playerEnergy < 1 && !isSwapMode) {
            alert("Need 1 Energy to swap cards!");
            return;
        }
        setIsSwapMode(!isSwapMode);
    };

    const confirmSwap = (newCard: SparkCardTemplate) => {
        if (swapTargetIndex !== null) {
            const newHand = [...hand];
            newHand[swapTargetIndex] = newCard;
            setHand(newHand);
            setPlayerEnergy(prev => prev - 1);
            setReserveOpen(false);
            setSwapTargetIndex(null);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#050505] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200')] bg-cover bg-center opacity-20 transition-all duration-1000" style={{ filter: matchResult ? 'grayscale(80%) blur(5px)' : 'none' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/50"></div>
            <div className="relative z-10 flex justify-between items-start p-2 w-full max-w-7xl mx-auto pt-safe">
                <div className="flex items-start w-[45%] md:w-[40%] relative">
                    <div className="relative z-20 mr-[-5px] transform skew-x-[-10deg]">
                        <div className={`w-12 h-12 md:w-20 md:h-20 border-2 border-cyan-500 bg-black shadow-[0_0_10px_cyan] overflow-hidden transition-all ${playerHp < 30 ? 'animate-pulse ring-2 ring-red-500' : ''}`}>
                            <img src={currentUser.avatarUrl} className="w-full h-full object-cover transform skew-x-[10deg] scale-110" />
                        </div>
                    </div>
                    <div className="flex-grow flex flex-col gap-0.5 mt-1">
                        <div className="h-3 md:h-6 bg-gray-900 border border-cyan-900 transform skew-x-[-15deg] relative overflow-hidden shadow-lg w-full">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 transition-all duration-500 ease-out flex items-center justify-end pr-2" style={{ width: `${playerHp}%` }}></div>
                        </div>
                        <span className="text-white font-black text-xs md:text-sm italic drop-shadow-md ml-1">{playerHp}%</span>
                        <div className="flex gap-0.5 transform skew-x-[-15deg] pl-1 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className={`h-1.5 w-6 rounded-sm ${i < playerEnergy ? 'bg-yellow-400 shadow-[0_0_5px_yellow]' : 'bg-gray-800'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-2 z-30">
                    <div className="text-2xl md:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transform -skew-x-12">VS</div>
                </div>
                <div className="flex items-start w-[45%] md:w-[40%] flex-row-reverse relative">
                    <div className="relative z-20 ml-[-5px] transform skew-x-[10deg]">
                        <div className="w-12 h-12 md:w-20 md:h-20 border-2 border-red-500 bg-black shadow-[0_0_10px_red] overflow-hidden">
                            <img src={enemyAvatar} className="w-full h-full object-cover transform skew-x-[-10deg] scale-110" />
                        </div>
                    </div>
                    <div className="flex-grow flex flex-col gap-0.5 mt-1">
                        <div className="h-3 md:h-6 bg-gray-900 border border-red-900 transform skew-x-[15deg] relative overflow-hidden shadow-lg w-full">
                            <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-red-600 via-red-500 to-orange-600 transition-all duration-500 ease-out" style={{ width: `${enemyHp}%` }}></div>
                        </div>
                        <span className="text-white font-black text-xs md:text-sm italic drop-shadow-md text-right mr-1">{enemyHp}%</span>
                    </div>
                </div>
            </div>
            <div className="flex-grow flex items-center justify-center z-0 pointer-events-none relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[90%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                </div>
                {isSwapMode && (
                    <div className="absolute bottom-20 z-40 bg-black/80 px-6 py-2 rounded-full border border-cyan-500/50 animate-pulse">
                        <span className="text-cyan-400 font-bold text-sm uppercase tracking-widest">Select Card to Swap</span>
                    </div>
                )}
            </div>
            <div className="relative z-20 w-full bg-gradient-to-t from-black via-black/90 to-transparent pb-safe px-2 pt-4">
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end px-2 pb-2">
                        <div className="flex items-center gap-2 bg-black/60 rounded-full px-3 py-1 border border-white/10 backdrop-blur-sm">
                            <div className="text-yellow-400 font-black text-lg flex items-center gap-1"><BoltIcon /> {playerEnergy}</div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={toggleSwapMode} className={`flex items-center gap-1 bg-gray-800/80 border px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-lg transition-all ${isSwapMode ? 'border-cyan-400 text-black bg-cyan-500' : 'border-cyan-500/30 text-cyan-400 hover:bg-gray-700'}`}>
                                <SwatchIcon /> {isSwapMode ? 'Cancel' : 'Swap (1⚡)'}
                            </button>
                            <button onClick={handleEndTurn} className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-[0_0_10px_rgba(220,38,38,0.4)] transition-all transform hover:scale-105">
                                End Turn <ForwardIcon />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center items-end h-28 md:h-40 perspective-1000 overflow-visible pb-2 w-full px-2">
                        <div className="flex gap-[-10px] md:gap-2 justify-center w-full">
                            {hand.map((card, idx) => (
                                <div key={idx} className={`relative transition-all duration-200 transform origin-bottom hover:-translate-y-4 hover:scale-110 hover:z-50 ${card ? 'cursor-pointer -ml-2 first:ml-0' : 'mx-1'} ${isSwapMode ? 'animate-wiggle' : ''}`} style={{ zIndex: idx }}>
                                    {card ? <CardFrame card={card} size="xs" onClick={() => handleCardClick(idx, card)} cooldown={cooldowns[idx]} isDimmed={isSwapMode} /> : <div onClick={() => isSwapMode && handleCardClick(idx, card as any)} className={`w-16 h-24 rounded-lg border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-1 ${isSwapMode ? 'cursor-pointer border-cyan-500/50 hover:bg-cyan-900/20' : ''}`}><div className="text-white/20"><PlusIcon /></div></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {reserveOpen && (
                <div className="absolute inset-0 bg-black/90 z-50 flex flex-col animate-fadeIn backdrop-blur-sm">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gray-900">
                        <div>
                            <h2 className="text-lg font-black text-cyan-400 uppercase italic tracking-tighter">Tactical Reserve</h2>
                            <p className="text-gray-400 text-[10px]">Select a card to add to your hand.</p>
                        </div>
                        <button onClick={() => { setReserveOpen(false); setIsSwapMode(false); setSwapTargetIndex(null); }} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"><ArrowLeftIcon /></button>
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto">
                        <div className="grid grid-cols-4 gap-3">
                            {cardTemplates.map(card => (
                                <div key={card.id} className="flex flex-col items-center gap-1 group">
                                    <CardFrame card={card} size="xs" onClick={() => confirmSwap(card)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {matchResult && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn">
                    <div className="text-center p-8 relative overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-r ${matchResult === 'victory' ? 'from-yellow-500/20 to-cyan-500/20' : 'from-red-900/20 to-gray-900/20'} blur-3xl opacity-50`}></div>
                        <div className="relative z-10">
                            <div className={`text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-4 animate-scaleIn drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] ${matchResult === 'victory' ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600' : 'text-gray-500'}`}>
                                {matchResult === 'victory' ? 'VICTORY' : 'DEFEAT'}
                            </div>
                            <div className="flex justify-center mb-8">
                                {matchResult === 'victory' ? <TrophyIcon /> : <div className="opacity-50 grayscale"><TrophyIcon /></div>}
                            </div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">
                                {matchResult === 'victory' ? 'Rank Up! Battle Power +25' : 'System Failure. Battle Power -10'}
                            </p>
                            <button onClick={onExit} className={`px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all transform hover:scale-105 shadow-lg ${matchResult === 'victory' ? 'bg-white text-black hover:bg-yellow-400' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
                                Return to Base
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const CollectionView: React.FC = () => {
    const deck = cardTemplates.slice(0, 10);
    const [mobileTab, setMobileTab] = useState<'deck' | 'inventory'>('inventory');

    const manaCurve = useMemo(() => {
        const curve = [0, 0, 0, 0, 0, 0, 0];
        deck.forEach(c => {
            const cost = Math.min(c.energyCost, 6);
            curve[cost]++;
        });
        return curve;
    }, [deck]);
    const maxCount = Math.max(...manaCurve) || 1;

    return (
        <div className="flex flex-col h-full bg-[#0b0b0f] text-white">
            {/* Mobile Tab Switcher */}
            <div className="md:hidden flex border-b border-white/10 bg-gray-900 sticky top-0 z-30">
                <button 
                    onClick={() => setMobileTab('deck')} 
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${mobileTab === 'deck' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-900/10' : 'text-gray-500 hover:text-white'}`}
                >
                    Deck ({deck.length}/30)
                </button>
                <button 
                    onClick={() => setMobileTab('inventory')} 
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${mobileTab === 'inventory' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-900/10' : 'text-gray-500 hover:text-white'}`}
                >
                    Inventory
                </button>
            </div>

            <div className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
                {/* Left: Deck Stats & List */}
                <div className={`${mobileTab === 'deck' ? 'flex' : 'hidden'} md:flex w-full md:w-80 bg-gray-900 border-r border-white/5 flex-col z-20 shadow-xl h-full overflow-hidden`}>
                    <div className="p-4 md:p-6 bg-black/20 border-b border-white/5 flex-shrink-0">
                        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <RectangleStackIcon /> Active Deck
                            <span className="ml-auto text-xs bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20">{deck.length}/30</span>
                        </h2>
                        
                        {/* Mana Curve Graph - Compact */}
                        <div className="bg-black/40 p-2 rounded-lg border border-white/5 mb-1">
                            <div className="h-16 flex items-end justify-between gap-1 mb-1 px-1">
                                {manaCurve.map((count, cost) => (
                                    <div key={cost} className="flex-1 flex flex-col items-center gap-1 group relative">
                                        <div 
                                            className="w-full bg-gradient-to-t from-cyan-900 to-cyan-500 rounded-sm transition-all duration-500 group-hover:from-cyan-700 group-hover:to-cyan-300"
                                            style={{ height: `${(count / maxCount) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                                        ></div>
                                        <span className="text-[8px] text-gray-500 font-mono font-bold">{cost === 6 ? '6+' : cost}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center text-[8px] text-gray-600 font-bold uppercase tracking-widest">Curve</div>
                        </div>
                    </div>

                    <div className="flex-grow overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {deck.map((card, i) => (
                            <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded hover:bg-white/10 cursor-pointer group border border-transparent hover:border-cyan-500/30 transition-all">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-5 h-5 flex-shrink-0 rounded-full bg-black flex items-center justify-center text-cyan-400 font-bold text-[10px] border border-cyan-500/30 shadow-sm font-mono">
                                        {card.energyCost}
                                    </div>
                                    <span className="text-xs text-gray-300 font-medium group-hover:text-white truncate">{card.name}</span>
                                </div>
                                <span className="text-[10px] text-gray-500 font-mono">x1</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Card Collection Grid */}
                <div className={`${mobileTab === 'inventory' ? 'flex' : 'hidden'} md:flex flex-col flex-grow bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] relative`}>
                    <div className="flex-shrink-0 p-4 border-b border-white/5 bg-[#0b0b0f]/90 backdrop-blur-md z-10 flex flex-wrap gap-3 justify-between items-center">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">Inventory <span className="text-gray-500 text-xs font-normal">({cardTemplates.length})</span></h2>
                        <div className="flex gap-2 w-full md:w-auto">
                            <select className="flex-1 md:flex-none bg-black text-xs text-white border border-gray-700 rounded-lg px-3 py-2 outline-none focus:border-cyan-500">
                                <option>All</option>
                                <option>Solar</option>
                                <option>Lunar</option>
                                <option>Terra</option>
                                <option>Void</option>
                            </select>
                            <select className="flex-1 md:flex-none bg-black text-xs text-white border border-gray-700 rounded-lg px-3 py-2 outline-none focus:border-cyan-500">
                                <option>Energy</option>
                                <option>Name</option>
                                <option>Rarity</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto p-4 md:p-6 custom-scrollbar pb-24 md:pb-6">
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                            {cardTemplates.map(card => (
                                <div key={card.id} className="flex justify-center">
                                    <CardFrame card={card} size="xs" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MarketView: React.FC<{ currentUser: User, onUpdateUser: (updates: Partial<User>) => void }> = ({ currentUser, onUpdateUser }) => {
    const [mode, setMode] = useState<'gacha' | 'direct'>('gacha');
    const [openingPack, setOpeningPack] = useState<any | null>(null);
    const [openedCards, setOpenedCards] = useState<SparkCardTemplate[] | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleBuyPack = (pack: any) => {
        const cost = pack.cost;
        const currentSparks = currentUser.sparkClashProfile?.sparks || 0;

        if (currentSparks < cost) {
            alert("Insufficient Sparks to purchase this pack.");
            return;
        }

        // Deduct sparks immediately to prevent double-click
        onUpdateUser({
            sparkClashProfile: {
                ...currentUser.sparkClashProfile!,
                sparks: currentSparks - cost
            }
        });

        // Start Animation Sequence
        setOpeningPack(pack);
        setIsAnimating(true);
        
        // Simulate delay and generate results
        setTimeout(() => {
            const newCards = generateCardsForPack(pack);
            setOpenedCards(newCards);
            
            // Add cards to inventory
            const currentInventory = currentUser.sparkClashProfile?.inventory || [];
            const newInventoryItems = newCards.map(c => ({
                id: `inst-${Date.now()}-${Math.random()}`,
                templateId: c.id,
                ownerId: currentUser.id
            } as SparkCard));

            onUpdateUser({
                sparkClashProfile: {
                    ...currentUser.sparkClashProfile!,
                    sparks: currentSparks - cost, // Ensure sync
                    inventory: [...currentInventory, ...newInventoryItems]
                }
            });
            
            setIsAnimating(false);
        }, 2500);
    };

    const handleDirectBuy = (card: SparkCardTemplate) => {
         const currentSparks = currentUser.sparkClashProfile?.sparks || 0;
         if (currentSparks < card.price) {
             alert("Insufficient Sparks!");
             return;
         }

         if (confirm(`Purchase ${card.name} for ${card.price} Sparks?`)) {
             const currentInventory = currentUser.sparkClashProfile?.inventory || [];
             const newItem: SparkCard = {
                 id: `inst-${Date.now()}`,
                 templateId: card.id,
                 ownerId: currentUser.id
             };

             onUpdateUser({
                 sparkClashProfile: {
                     ...currentUser.sparkClashProfile!,
                     sparks: currentSparks - card.price,
                     inventory: [...currentInventory, newItem]
                 }
             });
             alert("Purchase Successful!");
         }
    };

    const closePackResult = () => {
        setOpeningPack(null);
        setOpenedCards(null);
    };

    const generateCardsForPack = (pack: any): SparkCardTemplate[] => {
        const cards: SparkCardTemplate[] = [];
        for (let i = 0; i < 5; i++) {
            // Simplified weight logic based on pack type
            let rarityWeight = Math.random();
            // Adjust weights based on pack.rare
            if (pack.rare === 'Epic') rarityWeight += 0.2; 
            if (pack.rare === 'Legendary') rarityWeight += 0.4;
            
            // Pick a random card from pool
            const randomCard = cardTemplates[Math.floor(Math.random() * cardTemplates.length)];
            cards.push(randomCard);
        }
        return cards;
    };

    return (
        <div className="h-full flex flex-col bg-[#0b0b0f] text-white relative">
            <div className="flex justify-center p-4 border-b border-white/5 bg-black/20">
                <div className="bg-gray-900 p-1 rounded-full border border-white/10 flex relative">
                    <button onClick={() => setMode('gacha')} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all z-10 ${mode === 'gacha' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>Warp Gate (Gacha)</button>
                    <button onClick={() => setMode('direct')} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all z-10 ${mode === 'direct' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>Broker (Direct)</button>
                    <div className={`absolute top-1 bottom-1 w-[50%] bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-300 ${mode === 'gacha' ? 'left-1' : 'left-[49%]'}`}></div>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto p-6 md:p-10 custom-scrollbar pb-24 md:pb-6">
                {mode === 'gacha' ? (
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter text-center">Supply Drops</h2>
                        <p className="text-gray-400 text-center text-sm mb-12">Open data packs to acquire new logic cards.</p>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { name: 'Standard Supply', cost: 100, color: 'from-blue-600 to-cyan-600', border: 'border-cyan-500', rare: 'Rare' },
                                { name: 'Elemental Cache', cost: 250, color: 'from-purple-600 to-pink-600', border: 'border-purple-500', rare: 'Epic' },
                                { name: 'Neon Elite', cost: 500, color: 'from-yellow-500 to-orange-600', border: 'border-yellow-500', rare: 'Legendary' }
                            ].map((pack, i) => (
                                <div key={i} className={`relative h-96 rounded-3xl overflow-hidden cursor-pointer group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 ${pack.border} bg-gray-900`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${pack.color} opacity-10 group-hover:opacity-30 transition-opacity`}></div>
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                        <div className="w-32 h-40 bg-black/40 border-2 border-white/20 rounded-xl mb-6 flex items-center justify-center backdrop-blur-md shadow-2xl group-hover:scale-110 transition-transform duration-500 relative">
                                            <span className="text-5xl filter drop-shadow-lg">📦</span>
                                            <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse opacity-0 group-hover:opacity-100"></div>
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{pack.name}</h3>
                                        <div className="h-1 w-12 bg-white/20 my-3 rounded-full"></div>
                                        <p className="text-gray-300 text-xs font-bold mb-6">Contains 5 Cards<br/><span className={`${pack.border.replace('border', 'text')} brightness-150`}>Guaranteed {pack.rare}+</span></p>
                                        <button 
                                            onClick={() => handleBuyPack(pack)}
                                            className="bg-white text-black px-8 py-3 rounded-full font-black flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 uppercase tracking-wide text-sm"
                                        >
                                            Open <span className="flex items-center gap-1 bg-black/10 px-1.5 rounded"><BoltIcon /> {pack.cost}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <ShoppingBagIcon /> Daily Rotation
                            </h2>
                            <span className="text-xs text-gray-500 font-mono">Resets in 14:22:05</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {cardTemplates.slice(0, 12).map(card => (
                                <div key={card.id} className="flex flex-col gap-2 group">
                                    <div className="relative">
                                        <CardFrame card={card} size="sm" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg backdrop-blur-[2px]">
                                            <button 
                                                onClick={() => handleDirectBuy(card)}
                                                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-full shadow-lg transform hover:scale-105 transition-all text-xs flex items-center gap-1"
                                            >
                                                BUY <span className="bg-black/20 px-1 rounded text-[10px]">{card.price} ⚡</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pack Opening Overlay */}
                {openingPack && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-xl">
                        {isAnimating ? (
                            <div className="text-center animate-pulse">
                                <div className="text-6xl mb-4 animate-bounce">📦</div>
                                <h2 className="text-2xl font-bold text-white uppercase italic tracking-widest">Opening {openingPack.name}...</h2>
                            </div>
                        ) : (
                            <div className="text-center w-full max-w-5xl px-4 animate-scaleIn">
                                <h2 className="text-3xl font-black text-white mb-8 uppercase italic tracking-tight">Acquired Data</h2>
                                <div className="flex justify-center gap-4 flex-wrap mb-10">
                                    {openedCards?.map((card, i) => (
                                        <div key={i} className="animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
                                            <CardFrame card={card} size="sm" />
                                            <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-cyan-400">New!</div>
                                        </div>
                                    ))}
                                </div>
                                <button 
                                    onClick={closePackResult}
                                    className="px-10 py-3 bg-white text-black font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                >
                                    Collect All
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const ForgeView: React.FC = () => {
    const [name, setName] = useState('');
    const [element, setElement] = useState<SparkElement>('Neutral');
    const [dmg, setDmg] = useState(1);
    const [shield, setShield] = useState(0);
    
    const sparkCost = (dmg * 15) + (shield * 10) + (element !== 'Neutral' ? 100 : 0);
    const energyCost = Math.max(1, Math.ceil((dmg + shield) / 6));

    const previewCard: SparkCardTemplate = {
        id: 'preview',
        name: name || 'Prototype X',
        description: `Deals ${dmg} damage. ${shield > 0 ? `Grants ${shield} shield.` : ''}`,
        energyCost,
        type: shield > dmg ? 'Defense' : 'Attack',
        element,
        rarity: 'Common',
        baseStats: { damage: dmg, shield },
        effectType: 'None',
        price: sparkCost
    };

    return (
        <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-[#0b0b0f] text-white">
            {/* Right: Preview (Moved to top for mobile ordering flexibility) */}
            <div className="w-full lg:w-1/2 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-900 flex flex-col items-center justify-center p-6 lg:p-12 border-b lg:border-b-0 lg:border-l border-white/5 relative shrink-0 order-1 lg:order-2 h-[45vh] lg:h-full">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                {/* Scale removed for mobile, kept standard size */}
                <div className="relative z-10 drop-shadow-2xl lg:transform lg:scale-150 lg:origin-center transition-all">
                    <CardFrame card={previewCard} size="md" />
                </div>
                <div className="relative z-10 mt-6 lg:mt-16 text-center">
                    <p className="text-gray-500 text-sm uppercase tracking-widest mb-2">Blueprint Preview</p>
                    <div className="flex gap-2 justify-center">
                        <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse delay-75"></span>
                        <span className="w-2 h-2 bg-gray-600 rounded-full animate-pulse delay-150"></span>
                    </div>
                </div>
            </div>

            {/* Left: Controls */}
            <div className="w-full lg:w-1/2 p-6 lg:p-12 overflow-y-auto custom-scrollbar order-2 lg:order-1 flex-grow">
                <div className="mb-8">
                    <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 uppercase italic tracking-tighter mb-2">The Star Forge</h2>
                    <p className="text-gray-400 text-sm md:text-base">Synthesize raw energy into battle logic.</p>
                </div>

                <div className="space-y-6 bg-gray-900/50 p-6 rounded-2xl border border-white/5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Card Designation</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-violet-500 outline-none font-bold placeholder-gray-600 transition-colors" placeholder="e.g. Plasma Strike" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Element</label>
                            <select value={element} onChange={e => setElement(e.target.value as SparkElement)} className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-white focus:border-violet-500 outline-none appearance-none cursor-pointer">
                                {['Neutral', 'Solar', 'Lunar', 'Terra', 'Void', 'Stellar'].map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Energy Cost</label>
                            <div className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-cyan-400 font-black text-center flex items-center justify-center gap-2">
                                {energyCost} <BoltIcon />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Damage Output</label>
                                <span className="text-red-400 font-bold font-mono">{dmg}</span>
                            </div>
                            <input type="range" min="0" max="20" value={dmg} onChange={e => setDmg(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500" />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Shield Capacity</label>
                                <span className="text-blue-400 font-bold font-mono">{shield}</span>
                            </div>
                            <input type="range" min="0" max="20" value={shield} onChange={e => setShield(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-black/40 p-4 rounded-xl flex items-center justify-between border border-white/5">
                    <div>
                        <p className="text-gray-500 text-xs uppercase font-bold">Fabrication Cost</p>
                        <div className="text-2xl font-black text-yellow-400 flex items-center gap-1">
                            <BoltIcon /> {sparkCost}
                        </div>
                    </div>
                    <button className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all shadow-lg hover:shadow-white/20 transform hover:-translate-y-1 flex items-center gap-2">
                        <BeakerIcon /> Forge
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

interface SparkClashPageProps {
    currentUser: User;
    onExit: () => void;
    userCreations: UserCreation[];
    onUpdateUser: (updates: Partial<User>) => void;
}

const SparkClashPage: React.FC<SparkClashPageProps> = ({ currentUser, onExit, onUpdateUser }) => {
    const [view, setView] = useState<'menu' | 'battle' | 'collection' | 'market' | 'forge'>('menu');

    // Main Menu View
    if (view === 'menu') {
        return (
            <div className="fixed inset-0 z-[200] bg-[#050505] flex items-center justify-center overflow-hidden font-sans text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=1200')] bg-cover bg-center opacity-20 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black pointer-events-none"></div>
                
                <button onClick={onExit} className="absolute top-6 left-6 text-white bg-white/5 hover:bg-white/10 p-3 rounded-full backdrop-blur-md z-50 border border-white/10 transition-colors">
                    <ArrowLeftIcon />
                </button>

                <div className="relative z-10 w-full max-w-5xl p-6 flex flex-col md:flex-row gap-8 items-stretch h-[80vh] md:h-[60vh]">
                    
                    {/* Title Section */}
                    <div className="flex flex-col justify-center md:w-1/3 text-left">
                        <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-violet-400 italic tracking-tighter drop-shadow-[0_0_30px_rgba(34,211,238,0.3)] leading-[0.85]">
                            SPARK<br/>CLASH
                        </h1>
                        <p className="text-xl text-gray-400 font-bold tracking-[0.2em] uppercase mt-4 pl-1 border-l-4 border-cyan-500">
                            Cyber-Tactical<br/>Card Battler
                        </p>
                        
                        <div className="mt-8 flex gap-4">
                            <div className="bg-gray-900/80 p-3 rounded-lg border border-white/10 flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-400"><BoltIcon /></div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">Sparks</div>
                                    <div className="text-white font-bold font-mono">{currentUser.sparkClashProfile?.sparks || 0}</div>
                                </div>
                            </div>
                             <div className="bg-gray-900/80 p-3 rounded-lg border border-white/10 flex items-center gap-3">
                                <div className="p-2 bg-red-500/20 rounded-full text-red-400"><span className="font-black">BP</span></div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">Power</div>
                                    <div className="text-white font-bold font-mono">{currentUser.sparkClashProfile?.battlePower || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Grid */}
                    <div className="flex-grow grid grid-cols-2 gap-4">
                        <button onClick={() => setView('battle')} className="col-span-2 bg-gradient-to-br from-red-600 to-orange-700 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:shadow-[0_0_60px_rgba(220,38,38,0.5)] transition-all transform hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <span className="text-6xl mb-2 filter drop-shadow-lg">⚔️</span>
                                <span className="text-4xl font-black italic text-white uppercase tracking-tighter">Enter Arena</span>
                                <span className="text-xs font-bold text-red-200 uppercase tracking-widest mt-1">Ranked Matchmaking</span>
                            </div>
                        </button>

                        <button onClick={() => setView('collection')} className="bg-gray-800 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group border border-white/5 hover:border-cyan-500/50 transition-all hover:bg-gray-700">
                            <div className="p-4 bg-cyan-500/10 rounded-full text-cyan-400 mb-3 group-hover:bg-cyan-500 group-hover:text-white transition-colors"><RectangleStackIcon /></div>
                            <span className="text-xl font-bold text-white uppercase tracking-wide">Hangar</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold mt-1">Manage Decks</span>
                        </button>

                        <div className="flex flex-col gap-4">
                            <button onClick={() => setView('market')} className="flex-grow bg-gray-900 rounded-3xl flex items-center justify-center gap-3 border border-white/5 hover:border-yellow-500/50 transition-all hover:bg-gray-800 group">
                                <ShoppingBagIcon />
                                <div className="text-left">
                                    <span className="block text-lg font-bold text-white uppercase leading-none">Market</span>
                                    <span className="text-[10px] text-gray-500 font-bold">Gacha & Direct</span>
                                </div>
                            </button>
                            
                            <button onClick={() => setView('forge')} className="flex-grow bg-gray-900 rounded-3xl flex items-center justify-center gap-3 border border-white/5 hover:border-violet-500/50 transition-all hover:bg-gray-800 group">
                                <BeakerIcon />
                                <div className="text-left">
                                    <span className="block text-lg font-bold text-white uppercase leading-none">Forge</span>
                                    <span className="text-[10px] text-gray-500 font-bold">Craft Cards</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col font-sans text-white">
            {/* Top Bar for sub-pages (Hidden in Battle) */}
            {view !== 'battle' && (
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md z-50">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('menu')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                            <ArrowLeftIcon /> <span className="font-bold uppercase tracking-wider text-xs group-hover:translate-x-1 transition-transform">Menu</span>
                        </button>
                        <div className="h-4 w-px bg-white/10"></div>
                        <h2 className="text-lg font-bold text-cyan-400 uppercase italic tracking-tighter">
                            {view === 'collection' ? 'Hangar // Deck' : view === 'market' ? 'Black Market' : 'Star Forge'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-full border border-yellow-500/30">
                        <span className="text-yellow-400 text-xs font-bold flex items-center gap-1"><BoltIcon /> {currentUser.sparkClashProfile?.sparks || 0}</span>
                    </div>
                </div>
            )}

            {/* Battle View Header Overlay */}
            {view === 'battle' && (
                <button onClick={() => setView('menu')} className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full border border-white/10 transition-colors">
                    <ArrowLeftIcon />
                </button>
            )}

            {/* Content Render */}
            <div className="flex-grow overflow-hidden relative">
                {view === 'battle' && <BattleView onExit={() => setView('menu')} currentUser={currentUser} />}
                {view === 'collection' && <CollectionView />}
                {view === 'market' && <MarketView currentUser={currentUser} onUpdateUser={onUpdateUser} />}
                {view === 'forge' && <ForgeView />}
            </div>
        </div>
    );
};

export default SparkClashPage;
