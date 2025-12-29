
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { User, UserCreation, Character } from '../types';
import UserAvatar from './UserAvatar';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;


interface CharacterSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (id: number) => void;
    characters: UserCreation[];
    currentUser: User;
    selectedId?: number;
    selectedIds?: number[];
}

const CharacterSelectorModal: React.FC<CharacterSelectorModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    characters,
    currentUser,
    selectedId,
    selectedIds
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const allOptions = useMemo(() => [
        { id: currentUser.id, name: 'You', epithet: 'Yourself', imageUrl: currentUser.avatarUrl },
        ...characters.map(c => ({...c, epithet: (c as Character).epithet || ''}))
    ], [currentUser, characters]);

    const filteredOptions = useMemo(() => 
        allOptions.filter(option =>
            option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.epithet.toLowerCase().includes(searchTerm.toLowerCase())
        ), [allOptions, searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div
                ref={modalRef}
                className="w-full max-w-2xl bg-gray-900/80 border border-violet-500/50 rounded-lg shadow-xl flex flex-col max-h-[80vh]"
            >
                <div className="p-4 border-b border-violet-500/30">
                    <h2 className="text-xl font-bold text-cyan-400">Select Character</h2>
                    <p className="text-sm text-gray-400">Choose a persona or cast member.</p>
                </div>

                <div className="p-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search characters..."
                            className="w-full bg-gray-800/60 border border-violet-500/30 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <SearchIcon />
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 overflow-y-auto custom-scrollbar">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => {
                            const isSelected = selectedId === option.id || (selectedIds && selectedIds.includes(option.id));
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => onSelect(option.id)}
                                    className={`relative w-full flex items-center gap-4 p-4 text-left rounded-lg transition-all duration-200 transform hover:scale-[1.03] 
                                        ${isSelected 
                                            ? 'bg-violet-500/30 ring-2 ring-cyan-400' 
                                            : 'bg-gray-800/60 hover:bg-violet-500/20'
                                        }`
                                    }
                                >
                                    <UserAvatar src={option.imageUrl} size="12" />
                                    <div className="min-w-0 flex-grow">
                                        <p className="font-bold text-white truncate">{option.name}</p>
                                        <p className="text-sm text-gray-400 truncate">{option.epithet}</p>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 text-cyan-400">
                                            <CheckCircleIcon />
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="sm:col-span-2 text-center py-8 text-gray-500">
                            <p>No characters found for "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CharacterSelectorModal;
