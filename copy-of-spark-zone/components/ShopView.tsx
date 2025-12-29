
import React from 'react';
import { ShopItem, User } from '../types';
import { shopItems } from '../mockData';

const SparkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-400"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const PaintBrushIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-pink-400"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;

interface ShopViewProps {
    onClose: () => void;
    onPurchase: (item: ShopItem) => void;
    currentUser: User;
}

const ShopView: React.FC<ShopViewProps> = ({ onClose, onPurchase, currentUser }) => {
    const bundles = shopItems.filter(i => i.type === 'bundle');
    const subscriptions = shopItems.filter(i => i.type === 'subscription');
    const cosmetics = shopItems.filter(i => i.type === 'cosmetic' || i.type === 'tool');

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-5xl bg-[#080808] border border-violet-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20"><XMarkIcon /></button>
                
                <div className="overflow-y-auto p-6 md:p-8">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500 uppercase tracking-tight mb-2">
                            Spark Store
                        </h1>
                        <p className="text-gray-400">Fuel your creativity and support the platform.</p>
                        <div className="mt-4 inline-flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full border border-yellow-500/30">
                            <SparkIcon />
                            <span className="text-yellow-400 font-bold">{currentUser.sparkClashProfile?.sparks || 0} Sparks Available</span>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {/* Section 1: Bundles & Subs */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* LEFT: CURRENCY BUNDLES */}
                            <div>
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <SparkIcon /> Buy Sparks
                                </h2>
                                <div className="space-y-3">
                                    {bundles.map(item => (
                                        <div key={item.id} className={`relative flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:bg-white/5 ${item.highlight ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-gray-800'}`}>
                                            {item.highlight && <span className="absolute -top-3 left-4 bg-cyan-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">BEST VALUE</span>}
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                                                    <SparkIcon />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-lg">{item.currencyAmount} Sparks</div>
                                                    <div className="text-xs text-gray-400">{item.name}</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => onPurchase(item)}
                                                className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                                            >
                                                ${item.price}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT: SUBSCRIPTION */}
                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    Premium Membership
                                </h2>
                                {subscriptions.map(item => (
                                    <div key={item.id} className="flex-grow flex flex-col bg-gradient-to-b from-violet-900/20 to-black border-2 border-violet-500/50 rounded-xl p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 blur-[50px] rounded-full pointer-events-none"></div>
                                        
                                        <div className="mb-6">
                                            <h3 className="text-2xl font-black text-white">{item.name}</h3>
                                            <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                                        </div>

                                        <div className="flex-grow space-y-3 mb-8">
                                            {item.perks?.map((perk, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <CheckCircleIcon />
                                                    <span className="text-sm text-gray-200">{perk}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button 
                                            onClick={() => onPurchase(item)}
                                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-1"
                                        >
                                            {currentUser.isPremium ? 'Manage Subscription' : `Subscribe for $${item.price}/mo`}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 2: Cosmetics & Tools */}
                        <div>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <PaintBrushIcon /> Cosmetics & Lifestyle
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {cosmetics.map(item => (
                                    <div key={item.id} className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 flex flex-col hover:border-pink-500/50 transition-colors group">
                                        <div className="aspect-video bg-black/40 rounded-lg mb-3 overflow-hidden border border-gray-800">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1 mb-4 flex-grow line-clamp-2">{item.description}</p>
                                        <button 
                                            onClick={() => onPurchase(item)}
                                            className="w-full py-2 bg-gray-800 text-cyan-400 font-bold text-sm rounded-lg border border-gray-700 hover:bg-gray-700 hover:border-cyan-500 flex items-center justify-center gap-2"
                                        >
                                            <SparkIcon /> {item.price}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopView;
