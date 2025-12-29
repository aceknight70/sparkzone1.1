
import React, { useState } from 'react';
import { Character, CharacterConnection, User } from '../types';
import { characters as allCharacters } from '../mockData';
import UserAvatar from '../components/UserAvatar';
import ImageModal from '../components/ImageModal';
import ShareButton from '../components/ShareButton';

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2c-4.418 0-8 3.134-8 7 0 2.444 1.206 4.634 3.09 5.982.257.185.334.502.213.766l-1.06 1.768a.75.75 0 001.28.766l1.23-2.05a.75.75 0 01.62-.358 10.42 10.42 0 002.83 0 .75.75 0 01.62.358l1.23 2.05a.75.75 0 001.28-.766l-1.06-1.768a.75.75 0 01.213-.766A7.96 7.96 0 0018 9c0-3.866-3.582-7-8-7z" clipRule="evenodd" /></svg>;
const SparkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const MicrophoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-cyan-400"><path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" /><path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" /></svg>;

interface CharacterPageProps {
    character: Character;
    onExit: () => void;
    onViewCharacter: (characterId: number) => void;
    onEdit: () => void;
    onStartConversation: (userId: number) => void;
    currentUser: User;
}

type CharacterSheetTab = 'blueprint' | 'gallery' | 'connections';

// --- Reusable Components for Tabs ---

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`mb-8 ${className}`}>
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 pb-2 border-b-2 border-violet-500/30">{title}</h2>
        {children}
    </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-12 text-gray-400">
        <p>{message}</p>
    </div>
);

// --- Blueprint Tab Components & View ---

const DetailItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    value ? (
        <div>
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
            <p className="text-lg text-white">{value}</p>
        </div>
    ) : null
);

const TraitSlider: React.FC<{ trait: { name: string; value: number; labels: [string, string] } }> = ({ trait }) => (
    <div>
        <div className="flex justify-between items-center mb-1 text-sm font-medium">
            <span className="text-gray-300">{trait.labels[0]}</span>
            <span className="font-bold text-white">{trait.name}</span>
            <span className="text-gray-300">{trait.labels[1]}</span>
        </div>
        <input
            type="range"
            min="0"
            max="100"
            value={trait.value}
            disabled
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-default [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
        />
    </div>
);

const Blueprint: React.FC<{ character: Character }> = ({ character }) => {
    const { physicalDetails, appearance, personality, backstory, abilities, clashConfig, voiceConfig } = character;

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Combat Card */}
                {clashConfig && (
                    <div className="md:col-span-1">
                        <Section title="Combat Profile">
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <SparkIcon />
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-lg font-bold text-white">{character.name}</h4>
                                        <p className="text-xs text-cyan-400 uppercase tracking-widest">{clashConfig.element} {clashConfig.class}</p>
                                    </div>
                                    <div className="text-2xl font-black text-yellow-500">{clashConfig.hp} HP</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                    <div className="bg-black/30 p-2 rounded border border-white/5">
                                        <span className="text-gray-400 block text-xs uppercase">Attack</span>
                                        <span className="text-white font-bold">{clashConfig.atk}</span>
                                    </div>
                                    <div className="bg-black/30 p-2 rounded border border-white/5">
                                        <span className="text-gray-400 block text-xs uppercase">Defense</span>
                                        <span className="text-white font-bold">{clashConfig.def}</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-3 rounded border-l-2 border-cyan-500">
                                    <p className="text-xs font-bold text-cyan-300 uppercase mb-1">{clashConfig.specialAbility.name}</p>
                                    <p className="text-xs text-gray-300">{clashConfig.specialAbility.description}</p>
                                </div>
                            </div>
                        </Section>
                    </div>
                )}

                {/* Voice Profile */}
                {voiceConfig && (
                    <div className="md:col-span-1">
                        <Section title="Sonic Identity">
                            <div className="bg-gray-900/50 border border-violet-500/30 p-4 rounded-xl">
                                <div className="flex items-center gap-3 mb-2">
                                    <MicrophoneIcon />
                                    <span className="font-bold text-white text-lg">Voice Model: {voiceConfig.voiceId}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs text-gray-400">Pitch</span>
                                    <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500" style={{ width: `${((voiceConfig.pitch - 0.5) / 1.5) * 100}%` }}></div>
                                    </div>
                                    <span className="text-xs text-white">{voiceConfig.pitch}</span>
                                </div>
                                <p className="text-xs text-gray-500 italic">This character uses a custom synthesized voice in Live Chats.</p>
                            </div>
                        </Section>
                    </div>
                )}
            </div>

            { (appearance || physicalDetails) && (
                <Section title="Description">
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {physicalDetails && (
                            <div className="md:col-span-1 space-y-4 p-6 bg-gray-900/50 border border-violet-500/30 rounded-lg">
                                <h3 className="text-lg font-bold text-white mb-2">Vitals</h3>
                                {Object.entries(physicalDetails).map(([key, value]) => (
                                    <DetailItem key={key} label={key} value={value} />
                                ))}
                            </div>
                        )}
                        {appearance && (
                            <div className={physicalDetails ? 'md:col-span-2' : 'md:col-span-3'}>
                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{appearance}</p>
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {personality && (
                 <Section title="Personality">
                     <div className="space-y-6">
                        {personality.description && <p className="text-gray-300 italic">{personality.description}</p>}
                        {personality.traits && (
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 pt-4">
                                {personality.traits.map(trait => <TraitSlider key={trait.name} trait={trait} />)}
                            </div>
                        )}
                        {personality.quirks && personality.quirks.length > 0 && (
                             <div className="pt-4">
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Quirks & Habits</h4>
                                <div className="flex flex-wrap gap-2">
                                    {personality.quirks.map(quirk => (
                                        <span key={quirk} className="bg-gray-800 text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                                            {quirk}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                     </div>
                 </Section>
            )}
            
            {backstory && (
                <Section title="Backstory">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{backstory}</p>
                </Section>
            )}

            {abilities && abilities.length > 0 && (
                <Section title="Abilities & Skills">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {abilities.map(ability => (
                            <div key={ability.name} className="bg-gray-900/50 border border-violet-500/30 rounded-lg p-4 transition-all hover:border-violet-400 hover:shadow-lg hover:shadow-violet-500/10">
                                <h3 className="font-bold text-white text-lg">{ability.name}</h3>
                                <p className="text-sm text-gray-400 mt-1">{ability.description}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
};

// --- Gallery Tab View ---

const Gallery: React.FC<{ character: Character; onImageClick: (url: string) => void }> = ({ character, onImageClick }) => {
    const { gallery } = character;

    if (!gallery || (!gallery.themeSongUrl && (!gallery.images || gallery.images.length === 0))) {
        return <EmptyState message={`${character.name} hasn't added anything to their gallery yet.`} />;
    }

    return (
        <div className="space-y-8">
            {gallery.themeSongUrl && (
                <Section title="Theme Song">
                    <div className="aspect-video w-full max-w-2xl mx-auto rounded-lg overflow-hidden border border-violet-500/30">
                        <iframe
                            className="w-full h-full"
                            src={gallery.themeSongUrl}
                            title={`${character.name}'s Theme Song`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </Section>
            )}
            {gallery.images && gallery.images.length > 0 && (
                <Section title="Moodboard">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {gallery.images.map((img, index) => (
                             <button 
                                key={index} 
                                onClick={() => onImageClick(img)}
                                className="aspect-square rounded-lg overflow-hidden group border border-violet-500/30 block"
                            >
                                <img src={img} alt={`Moodboard image ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </button>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
};

// --- Connections Tab View ---

interface ConnectionCardProps {
    connection: CharacterConnection;
    connectedCharacter: Character;
    onView: (characterId: number) => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection, connectedCharacter, onView }) => (
    <button onClick={() => onView(connectedCharacter.id)} className="w-full text-left bg-gray-900/50 border border-violet-500/30 rounded-lg p-4 flex items-center gap-4 hover:border-violet-400 transition-colors duration-200 hover:shadow-lg hover:shadow-violet-500/10">
        <UserAvatar src={connectedCharacter.imageUrl} size="16" />
        <div className="flex-grow">
            <p className="font-bold text-white text-lg">{connectedCharacter.name}</p>
            <p className="text-sm text-gray-400">{connectedCharacter.epithet}</p>
        </div>
        <div className="text-right flex-shrink-0">
            <p className="font-semibold text-cyan-400">{connection.relationship}</p>
            {connection.description && <p className="text-xs text-gray-500 max-w-xs truncate">{connection.description}</p>}
        </div>
    </button>
);


const Connections: React.FC<{ character: Character, onViewCharacter: (id: number) => void }> = ({ character, onViewCharacter }) => {
    const { connections } = character;

    if (!connections || connections.length === 0) {
        return (
            <div>
                 <EmptyState message={`${character.name} hasn't formed any connections yet.`} />
                 <div className="text-center">
                    <button className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-semibold rounded-full hover:bg-cyan-500/30 transition-colors">
                        <PlusIcon />
                        Add Connection
                    </button>
                 </div>
            </div>
        );
    }

    const connectionDetails = connections
        .map(conn => ({
            connection: conn,
            character: allCharacters.find(c => c.id === conn.characterId)
        }))
        .filter(details => details.character); // Filter out any connections where the character wasn't found

    return (
        <Section title="Social Web">
             <div className="flex justify-end mb-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-semibold rounded-full hover:bg-cyan-500/30 transition-colors text-sm">
                    <PlusIcon />
                    Add Connection
                </button>
            </div>
            <div className="space-y-4">
                {connectionDetails.map(({ connection, character }) => (
                    <ConnectionCard 
                        key={connection.characterId} 
                        connection={connection} 
                        connectedCharacter={character!} 
                        onView={onViewCharacter} 
                    />
                ))}
            </div>
        </Section>
    );
};


// --- Main Page Component ---

const CharacterPage: React.FC<CharacterPageProps> = ({ character, onExit, onViewCharacter, onEdit, onStartConversation, currentUser }) => {
    const [activeTab, setActiveTab] = useState<CharacterSheetTab>('blueprint');
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const isOwnCharacter = character.authorId === currentUser.id;

    const handleImageClick = (url: string) => {
        setSelectedImageUrl(url);
    };

    const closeImageModal = () => {
        setSelectedImageUrl(null);
    };

    const TabButton: React.FC<{ tab: CharacterSheetTab, label: string }> = ({ tab, label }) => {
        const isActive = activeTab === tab;
        return (
            <button
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 font-semibold transition-colors duration-200 ${isActive ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-cyan-300'}`}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="animate-fadeIn min-h-screen">
             <div className="absolute top-4 left-4 z-20">
                 <button onClick={onExit} className="flex items-center gap-1 text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-black/70 transition-colors">
                    <ArrowLeftIcon />
                    <span>Back</span>
                </button>
            </div>
             <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                 <ShareButton 
                    title={character.name}
                    text={`Meet ${character.name}, ${character.epithet}. ${character.tagline}`}
                    className="text-white bg-black/50 backdrop-blur-sm px-4 py-1.5 rounded-full hover:bg-black/70 transition-colors text-sm font-semibold"
                    iconOnly
                 />
                 {isOwnCharacter ? (
                     <button onClick={onEdit} className="flex items-center gap-2 text-white bg-black/50 backdrop-blur-sm px-4 py-1.5 rounded-full hover:bg-black/70 transition-colors">
                        <EditIcon />
                        <span>Edit</span>
                    </button>
                 ) : (
                    <button onClick={() => onStartConversation(character.authorId)} className="flex items-center gap-2 text-white bg-cyan-500/80 backdrop-blur-sm px-4 py-1.5 rounded-full hover:bg-cyan-500 transition-colors">
                        <MessageIcon />
                        <span>Message Author</span>
                    </button>
                 )}
            </div>

            <div className="h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: `url(${character.bannerUrl || character.imageUrl})` }}>
                <div className="h-full w-full bg-black/40 backdrop-blur-sm"></div>
            </div>
            
            <div className="container mx-auto max-w-4xl p-4">
                <div className="flex flex-col md:flex-row items-center md:items-end -mt-24 md:-mt-28">
                    <UserAvatar src={character.imageUrl} size="32" className="border-4 border-black"/>
                    <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left flex-grow">
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">{character.name}</h1>
                        <p className="text-xl text-cyan-400 font-medium drop-shadow-md">{character.epithet}</p>
                    </div>
                </div>
                
                <blockquote className="mt-6 text-center md:text-left text-lg text-gray-300 italic border-l-4 border-cyan-500 pl-4">
                  "{character.tagline}"
                </blockquote>
                
                <div className="mt-6 flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    {character.archetypeTags.map(tag => (
                        <span key={tag} className="bg-gray-800/80 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full border border-violet-500/30">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-8">
                    <div className="border-b border-violet-500/30">
                        <div className="flex space-x-4">
                            <TabButton tab="blueprint" label="Blueprint" />
                            <TabButton tab="gallery" label="Gallery" />
                            <TabButton tab="connections" label="Connections" />
                        </div>
                    </div>
                     <div className="py-8">
                        {activeTab === 'blueprint' && <Blueprint character={character} />}
                        {activeTab === 'gallery' && <Gallery character={character} onImageClick={handleImageClick} />}
                        {activeTab === 'connections' && <Connections character={character} onViewCharacter={onViewCharacter} />}
                    </div>
                </div>

            </div>

             <ImageModal 
                isOpen={!!selectedImageUrl}
                onClose={closeImageModal}
                imageUrl={selectedImageUrl}
            />
        </div>
    );
};

export default CharacterPage;
