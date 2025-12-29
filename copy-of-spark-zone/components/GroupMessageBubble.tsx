
import React, { useRef, useState, useEffect } from 'react';
import { currentUser } from '../mockData';
import { GroupMessage } from '../types';
import UserAvatar from './UserAvatar';

const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;

interface GroupMessageBubbleProps {
    message: GroupMessage;
    onDelete?: () => void;
}

const GroupMessageBubble: React.FC<GroupMessageBubbleProps> = ({ message, onDelete }) => {
    const isOwnMessage = message.sender.id === currentUser.id;
    const isRP = !!message.character;
    
    const avatarSrc = isRP ? message.character?.imageUrl : message.sender.avatarUrl;
    const senderName = isRP ? message.character?.name : message.sender.name;

    const [showMenu, setShowMenu] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handlePressStart = () => {
        if (!isOwnMessage || !onDelete) return;
        timerRef.current = setTimeout(() => {
            if (navigator.vibrate) navigator.vibrate(50);
            setShowMenu(true);
        }, 600);
    };

    const handlePressEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        if (showMenu) {
            const timer = setTimeout(() => setShowMenu(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showMenu]);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(false);
        if (onDelete) onDelete();
    };

    const getYoutubeEmbed = (text: string) => {
        const match = text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]*)/);
        return match ? match[1] : null;
    };

    const videoId = getYoutubeEmbed(message.text);

    return (
       <div className={`group flex items-start gap-4 max-w-full ${isOwnMessage ? 'flex-row-reverse' : ''} p-2 transition-all`}>
           <div className="flex-shrink-0 mt-1 relative">
                <UserAvatar src={avatarSrc} size="10" className={`ring-2 ${isRP ? 'ring-cyan-500' : 'ring-gray-700'} shadow-lg`} />
                {isRP && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-black" />}
           </div>
           
           <div 
                className={`flex-grow min-w-0 flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} relative z-10`}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                onTouchMove={handlePressEnd}
                onContextMenu={(e) => { if(isOwnMessage) e.preventDefault(); }}
            >
                {/* Header */}
                <div className={`flex items-baseline gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-sm font-bold tracking-wide ${isRP ? 'text-cyan-400' : 'text-gray-400'}`}>
                        {senderName}
                    </span>
                    <span className="text-[10px] text-gray-600 font-mono opacity-50 group-hover:opacity-100 transition-opacity">{message.timestamp}</span>
                    {isOwnMessage && onDelete && !showMenu && (
                        <button 
                            onClick={onDelete} 
                            className="text-gray-600 hover:text-red-500 transition-colors p-0.5 opacity-0 group-hover:opacity-100"
                            title="Delete"
                        >
                            <TrashIcon className="w-3 h-3"/>
                        </button>
                    )}
                </div>
                
                {/* Bubble */}
                <div className={`relative max-w-3xl select-none`}>
                    
                    {/* Context Menu */}
                    {showMenu && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md flex items-center gap-3 z-50 rounded-lg p-1.5 border border-white/10 shadow-xl animate-fadeIn">
                             <button 
                                onClick={handleDeleteClick}
                                className="p-1.5 hover:bg-red-900/50 rounded text-red-400 transition-colors"
                                title="Delete"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                                className="p-1.5 hover:bg-white/10 rounded text-gray-400 transition-colors"
                                title="Close"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Text Content */}
                    {message.text && (
                        <div className={`
                            whitespace-pre-wrap break-words leading-relaxed text-sm md:text-base p-3 rounded-2xl
                            ${isRP 
                                ? 'bg-cyan-900/10 border-l-2 border-cyan-500 text-gray-100 shadow-[0_0_10px_rgba(6,182,212,0.05)]' // RP Style
                                : 'text-gray-300' // OOC Style (Minimal)
                            }
                        `}>
                            {message.text}
                        </div>
                    )}

                    {/* Media Attachments */}
                    {message.imageUrl && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-w-md shadow-lg group-hover:shadow-cyan-900/20 transition-all bg-black/50">
                            <img src={message.imageUrl} alt="Attachment" className="w-full h-auto block" loading="lazy" />
                        </div>
                    )}
                    
                    {message.audioUrl && (
                        <div className="mt-2 p-2 bg-[#1a1a1a] rounded-xl border border-white/5 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 2.485.519 4.817 1.44 6.905.342 1.241 1.519 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" /><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" /></svg>
                            </div>
                            <audio controls src={message.audioUrl} className="h-8 max-w-[200px] opacity-70 hover:opacity-100 transition-opacity accent-cyan-500" />
                        </div>
                    )}
                    
                    {videoId && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-white/10 w-full max-w-lg aspect-video bg-black shadow-lg">
                            <iframe 
                                src={`https://www.youtube.com/embed/${videoId}`} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    )}
                </div>
           </div>
       </div>
    );
};

export default GroupMessageBubble;
