
import React, { useState, useEffect, useRef } from 'react';

const MusicalNoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V9.017c0-.428.267-.815.668-.964l10.5-3a.75.75 0 01.936.598z" clipRule="evenodd" /></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;

interface SonicJukeboxProps {
    musicUrl: string | null;
    onClear: () => void;
}

const SonicJukebox: React.FC<SonicJukeboxProps> = ({ musicUrl, onClear }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const youtubePlayerRef = useRef<any>(null);

    // Check if it's a YouTube link
    const getYoutubeId = (url: string) => {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]*)/);
        return match ? match[1] : null;
    };

    const youtubeId = musicUrl ? getYoutubeId(musicUrl) : null;

    // Initialize YouTube API
    useEffect(() => {
        if (!window['YT']) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            window['onYouTubeIframeAPIReady'] = () => {};
        }
    }, []);

    useEffect(() => {
        if (!musicUrl) {
            setIsPlaying(false);
            return;
        }

        // Reset state for new track
        setIsPlaying(true);

        if (youtubeId) {
            if (window['YT'] && window['YT'].Player) {
                // Destroy old player if exists
                if (youtubePlayerRef.current) {
                    youtubePlayerRef.current.destroy();
                }
                youtubePlayerRef.current = new window['YT'].Player('sonic-youtube-player', {
                    height: '0',
                    width: '0',
                    videoId: youtubeId,
                    playerVars: {
                        'autoplay': 1,
                        'controls': 0,
                        'loop': 1,
                        'playlist': youtubeId // Required for loop
                    },
                    events: {
                        'onReady': (event: any) => {
                            event.target.setVolume(volume * 100);
                            event.target.playVideo();
                        }
                    }
                });
            }
        } else if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
        }
    }, [musicUrl, youtubeId]);

    // Volume Control
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
        if (youtubePlayerRef.current && youtubePlayerRef.current.setVolume) {
            youtubePlayerRef.current.setVolume(volume * 100);
        }
    }, [volume]);

    // Toggle Play/Pause
    const togglePlay = () => {
        if (isPlaying) {
            setIsPlaying(false);
            audioRef.current?.pause();
            youtubePlayerRef.current?.pauseVideo();
        } else {
            setIsPlaying(true);
            audioRef.current?.play();
            youtubePlayerRef.current?.playVideo();
        }
    };

    const handleClose = () => {
        setIsPlaying(false);
        onClear();
        if (youtubePlayerRef.current) {
            youtubePlayerRef.current.destroy();
            youtubePlayerRef.current = null;
        }
    };

    if (!musicUrl) return null;

    return (
        <div className={`fixed bottom-40 right-4 z-[60] transition-all duration-300 flex flex-col items-end ${isExpanded ? 'w-64' : 'w-12'}`}>
            {/* Hidden Players */}
            <div id="sonic-youtube-player" className="hidden"></div>
            {!youtubeId && <audio ref={audioRef} src={musicUrl} loop className="hidden" />}

            {/* Main Widget */}
            <div className={`bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300 ${isExpanded ? 'p-4 w-full' : 'p-0 w-12 h-12 rounded-full'}`}>
                
                {/* Collapsed View (Icon only) */}
                {!isExpanded && (
                    <button 
                        onClick={() => setIsExpanded(true)} 
                        className={`w-full h-full flex items-center justify-center text-cyan-400 hover:text-white transition-colors ${isPlaying ? 'animate-spin-slow' : ''}`}
                    >
                        <MusicalNoteIcon />
                    </button>
                )}

                {/* Expanded View */}
                {isExpanded && (
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Sonic Atmosphere</span>
                            </div>
                            <button onClick={() => setIsExpanded(false)} className="text-gray-500 hover:text-white"><XMarkIcon /></button>
                        </div>

                        {/* Visualizer (Fake) */}
                        <div className="flex items-end justify-center gap-1 h-8 w-full">
                            {[1,2,3,4,5,6,7,8].map(i => (
                                <div 
                                    key={i} 
                                    className={`w-1 bg-cyan-500/50 rounded-t transition-all duration-200`} 
                                    style={{ height: isPlaying ? `${Math.random() * 100}%` : '10%' }}
                                ></div>
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            <button onClick={togglePlay} className="text-white hover:text-cyan-300 transition-colors">
                                {isPlaying ? <PauseIcon /> : <PlayIcon />}
                            </button>
                            
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.1" 
                                value={volume} 
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
                            />

                            <button onClick={handleClose} className="text-xs text-red-400 hover:underline">Stop</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SonicJukebox;
