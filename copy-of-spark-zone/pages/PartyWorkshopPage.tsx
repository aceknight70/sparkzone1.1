
import React, { useState } from 'react';
import { Party, PartyMember } from '../types';
import PartyOutlineSidebar from '../components/PartyOutlineSidebar';
import PartyEditorView from '../components/PartyEditorView';
import { currentUser } from '../mockData';

export type PartyWorkshopSection = 'blueprint' | 'stage' | 'members';

interface PartyWorkshopPageProps {
    party?: Party;
    onExit: () => void;
    onSave: (party: Party) => void;
}

const getNewParty = (): Party => ({
    id: Date.now(),
    type: 'RP Card',
    status: 'Active',
    authorId: currentUser.id,
    name: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1543893325-48a2f4595349?q=80&w=1200&auto=format&fit=crop',
    hostId: currentUser.id,
    isPublic: true,
    members: [{...currentUser, isHost: true}],
    chat: [],
    stage: {
        mode: 'social',
        social: { sharedImages: [] },
        theatre: { videoUrl: '', isPlaying: false, progress: 0 },
        tabletop: { 
            mapUrl: null, 
            tokens: [], 
            showGrid: true, 
            gridSize: 50, 
            initiative: [], 
            activeTurnIndex: 0 
        }
    }
});

const PartyWorkshopPage: React.FC<PartyWorkshopPageProps> = ({ party: initialParty, onExit, onSave }) => {
    const [party, setParty] = useState<Party>(initialParty || getNewParty());
    const [activeSection, setActiveSection] = useState<PartyWorkshopSection>('blueprint');
    const [isEditorVisible, setIsEditorVisible] = useState(true);

    const handleSelectSection = (section: PartyWorkshopSection) => {
        setActiveSection(section);
        setIsEditorVisible(true);
    };

    const handleSave = () => {
        onSave(party);
    };

    return (
         <div className="fixed inset-0 z-[60] flex h-full w-full bg-black bg-gradient-to-tr from-black via-[#010619] to-blue-900/20 text-gray-100 font-sans">
            {/* Mobile View */}
            <div className="md:hidden w-full h-full">
                {isEditorVisible ? (
                    <PartyEditorView
                        partyData={party}
                        setPartyData={setParty}
                        activeSection={activeSection}
                        onBack={() => setIsEditorVisible(false)}
                        onSave={handleSave}
                    />
                ) : (
                    <PartyOutlineSidebar
                        party={party}
                        activeSection={activeSection}
                        onSelectSection={handleSelectSection}
                        onExit={onExit}
                    />
                )}
            </div>
             {/* Desktop View */}
            <div className="hidden md:flex flex-1 min-w-0 h-full">
                <PartyOutlineSidebar
                    party={party}
                    activeSection={activeSection}
                    onSelectSection={handleSelectSection}
                    onExit={onExit}
                />
                <PartyEditorView
                    partyData={party}
                    setPartyData={setParty}
                    activeSection={activeSection}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
};

export default PartyWorkshopPage;
