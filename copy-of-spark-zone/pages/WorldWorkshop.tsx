
import React, { useState } from 'react';
import { World, WorldWorkshopSection } from '../types';
import WorldOutlineSidebar from '../components/WorldOutlineSidebar';
import WorldEditorView from '../components/WorldEditorView';

const EmptyEditorView: React.FC = () => (
    <div className="flex-grow flex flex-col items-center justify-center text-gray-400 h-full bg-black/20">
        <p className="text-lg">Select a section to start building your world.</p>
    </div>
);

interface WorldWorkshopProps {
    world: World;
    onExit: () => void;
    onSave: (world: World) => void;
}

const WorldWorkshop: React.FC<WorldWorkshopProps> = ({ world: initialWorld, onExit, onSave }) => {
    const [world, setWorld] = useState<World>(initialWorld);
    const [activeSection, setActiveSection] = useState<WorldWorkshopSection>('blueprint');
    const [isEditorVisible, setIsEditorVisible] = useState(true); // Default to editor visible on load

    const handleSelectSection = (section: WorldWorkshopSection) => {
        setActiveSection(section);
        setIsEditorVisible(true);
    };

    const handleSaveAndExit = () => {
        onSave(world);
    };

    return (
        <div className="fixed inset-0 z-[60] flex h-full w-full bg-black bg-gradient-to-tr from-black via-[#010619] to-blue-900/20 text-gray-100 font-sans">
            {/* Mobile View */}
            <div className="md:hidden w-full h-full">
                {isEditorVisible ? (
                    <WorldEditorView
                        activeSection={activeSection}
                        worldData={world}
                        setWorldData={setWorld}
                        onBack={() => setIsEditorVisible(false)}
                        onSave={handleSaveAndExit}
                    />
                ) : (
                    <WorldOutlineSidebar
                        world={world}
                        activeSection={activeSection}
                        onSelectSection={handleSelectSection}
                        onExit={onExit}
                    />
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex flex-1 min-w-0 h-full">
                <WorldOutlineSidebar
                    world={world}
                    activeSection={activeSection}
                    onSelectSection={handleSelectSection}
                    onExit={onExit}
                />
                <div className="flex-1 flex flex-col min-w-0">
                    {activeSection ? (
                        <WorldEditorView
                            activeSection={activeSection}
                            worldData={world}
                            setWorldData={setWorld}
                            onSave={handleSaveAndExit}
                        />
                    ) : (
                        <EmptyEditorView />
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorldWorkshop;
