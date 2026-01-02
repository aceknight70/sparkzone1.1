import React, { useState, useEffect } from 'react';
import { SparkClashCard, CardRarity, SparkClashDeck } from '../types/sparkClash';
import { allSparkClashCards, newSparkClashCards } from '../data/sparkClashCards';

interface SparkClashPageProps {
  currentUser: any;
}

const SparkClashPage: React.FC<SparkClashPageProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'collection' | 'deck-builder' | 'play' | 'packs'>('collection');
  const [selectedCards, setSelectedCards] = useState<SparkClashCard[]>([]);
  const [filterRarity, setFilterRarity] = useState<CardRarity | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDeck, setCurrentDeck] = useState<SparkClashDeck | null>(null);
  const [showNewCards, setShowNewCards] = useState(false);

  // Filter cards based on search and rarity
  const filteredCards = allSparkClashCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'ALL' || card.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  const getRarityColor = (rarity: CardRarity) => {
    switch (rarity) {
      case CardRarity.COMMON: return 'border-gray-400 text-gray-300';
      case CardRarity.RARE: return 'border-blue-400 text-blue-300';
      case CardRarity.EPIC: return 'border-purple-400 text-purple-300';
      case CardRarity.LEGENDARY: return 'border-yellow-400 text-yellow-300';
      default: return 'border-gray-400 text-gray-300';
    }
  };

  const getRarityGlow = (rarity: CardRarity) => {
    switch (rarity) {
      case CardRarity.COMMON: return 'shadow-gray-500/20';
      case CardRarity.RARE: return 'shadow-blue-500/30';
      case CardRarity.EPIC: return 'shadow-purple-500/40';
      case CardRarity.LEGENDARY: return 'shadow-yellow-500/50';
      default: return 'shadow-gray-500/20';
    }
  };

  const CardComponent: React.FC<{ card: SparkClashCard; showNew?: boolean }> = ({ card, showNew = false }) => (
    <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 ${getRarityColor(card.rarity)} 
                    hover:scale-105 transition-all duration-300 cursor-pointer group
                    shadow-lg ${getRarityGlow(card.rarity)} hover:shadow-2xl`}>
      {showNew && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold z-10 animate-pulse">
          NEW
        </div>
      )}
      
      <div className="p-3">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-sm text-white truncate">{card.name}</h3>
          <div className="flex space-x-1">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">{card.cost}</span>
            {card.attack > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">{card.attack}</span>
            )}
            {card.health > 0 && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">{card.health}</span>
            )}
          </div>
        </div>

        {/* Card Image */}
        <div className="w-full h-24 bg-gray-800 rounded-lg mb-2 overflow-hidden">
          <img 
            src={card.imageUrl} 
            alt={card.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Card Type & Rarity */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">{card.type}</span>
          <span className={`text-xs font-bold ${getRarityColor(card.rarity).split(' ')[1]}`}>
            {card.rarity}
          </span>
        </div>

        {/* Card Description */}
        <p className="text-xs text-gray-300 mb-2 line-clamp-3">{card.description}</p>

        {/* Abilities */}
        {card.abilities.length > 0 && (
          <div className="space-y-1">
            {card.abilities.map((ability, index) => (
              <div key={index} className="bg-gray-800 rounded px-2 py-1">
                <span className="text-xs text-cyan-300 font-medium">{ability}</span>
              </div>
            ))}
          </div>
        )}

        {/* Flavor Text */}
        {card.flavorText && (
          <p className="text-xs text-gray-500 italic mt-2 border-t border-gray-700 pt-2">
            "{card.flavorText}"
          </p>
        )}
      </div>
    </div>
  );

  const CollectionView = () => (
    <div className="space-y-4">
      {/* New Cards Banner */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-4 mb-6">
        <h2 className="text-xl font-bold text-white mb-2">🆕 20 New Cards Added!</h2>
        <p className="text-cyan-100 mb-3">
          Discover powerful new cards with unique abilities and strategies. From legendary creatures to tactical spells!
        </p>
        <button
          onClick={() => setShowNewCards(!showNewCards)}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          {showNewCards ? 'Show All Cards' : 'Show New Cards Only'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-gray-800 rounded-xl p-4">
        <input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500"
        />
        <select
          value={filterRarity}
          onChange={(e) => setFilterRarity(e.target.value as CardRarity | 'ALL')}
          className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-cyan-500"
        >
          <option value="ALL">All Rarities</option>
          <option value={CardRarity.COMMON}>Common</option>
          <option value={CardRarity.RARE}>Rare</option>
          <option value={CardRarity.EPIC}>Epic</option>
          <option value={CardRarity.LEGENDARY}>Legendary</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {(showNewCards ? newSparkClashCards : filteredCards).map((card) => (
          <CardComponent 
            key={card.id} 
            card={card} 
            showNew={showNewCards || newSparkClashCards.some(newCard => newCard.id === card.id)}
          />
        ))}
      </div>

      {/* Collection Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{allSparkClashCards.length}</div>
          <div className="text-gray-400 text-sm">Total Cards</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {allSparkClashCards.filter(c => c.rarity === CardRarity.LEGENDARY).length}
          </div>
          <div className="text-gray-400 text-sm">Legendary</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {allSparkClashCards.filter(c => c.rarity === CardRarity.EPIC).length}
          </div>
          <div className="text-gray-400 text-sm">Epic</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {allSparkClashCards.filter(c => c.rarity === CardRarity.RARE).length}
          </div>
          <div className="text-gray-400 text-sm">Rare</div>
        </div>
      </div>
    </div>
  );

  const PlayView = () => (
    <div className="space-y-6">
      {/* Player Stats */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Spark Clash Arena</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">{currentUser.sparkClashProfile?.sparks || 1250}</div>
            <div className="text-gray-300">Sparks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{currentUser.sparkClashProfile?.battlePower || 2100}</div>
            <div className="text-gray-300">Battle Power</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">15</div>
            <div className="text-gray-300">Wins</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">8</div>
            <div className="text-gray-300">Losses</div>
          </div>
        </div>
      </div>

      {/* Game Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-700 transition-colors">
          <h3 className="text-xl font-bold text-white mb-2">🎯 Ranked Match</h3>
          <p className="text-gray-400 mb-4">Climb the ranks and prove your skills</p>
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all">
            Find Match
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-700 transition-colors">
          <h3 className="text-xl font-bold text-white mb-2">⚡ Quick Play</h3>
          <p className="text-gray-400 mb-4">Fast matches with casual rules</p>
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all">
            Quick Match
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-700 transition-colors">
          <h3 className="text-xl font-bold text-white mb-2">🏆 Tournament</h3>
          <p className="text-gray-400 mb-4">Compete in structured tournaments</p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all">
            Join Tournament
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-700 transition-colors">
          <h3 className="text-xl font-bold text-white mb-2">🎲 Arena Draft</h3>
          <p className="text-gray-400 mb-4">Draft cards and battle for rewards</p>
          <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all">
            Enter Arena
          </button>
        </div>
      </div>

      {/* Featured New Cards in Play */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">🆕 New Cards in the Meta</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newSparkClashCards.slice(0, 4).map((card) => (
            <div key={card.id} className="bg-gray-900 rounded-lg p-3">
              <img src={card.imageUrl} alt={card.name} className="w-full h-20 object-cover rounded mb-2" />
              <h4 className="text-white font-medium text-sm">{card.name}</h4>
              <span className={`text-xs ${getRarityColor(card.rarity).split(' ')[1]}`}>
                {card.rarity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          ⚡ Spark Clash ⚡
        </h1>
        <p className="text-gray-400 mt-2">Strategic card battles in the digital realm</p>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap gap-2 bg-gray-800 rounded-xl p-2">
          {[
            { key: 'collection', label: '📚 Collection', count: allSparkClashCards.length },
            { key: 'deck-builder', label: '🏗️ Deck Builder' },
            { key: 'play', label: '⚔️ Battle' },
            { key: 'packs', label: '📦 Packs' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                ${activeTab === tab.key
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
              {tab.label}
              {tab.count && (
                <span className="bg-gray-600 text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'collection' && <CollectionView />}
        {activeTab === 'play' && <PlayView />}
        {activeTab === 'deck-builder' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">🏗️ Deck Builder</h2>
            <p className="text-gray-400">Construct powerful decks from your collection</p>
          </div>
        )}
        {activeTab === 'packs' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">📦 Card Packs</h2>
            <p className="text-gray-400">Open packs to expand your collection</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SparkClashPage;