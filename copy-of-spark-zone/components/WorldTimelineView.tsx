
import React from 'react';
import { World } from '../types';

interface WorldTimelineViewProps {
    world: World;
}

const WorldTimelineView: React.FC<WorldTimelineViewProps> = ({ world }) => {
    const events = world.timeline || [];

    if (events.length === 0) {
        return (
            <div className="flex-grow flex items-center justify-center text-gray-500 h-full bg-black/20">
                <p>The chronicles of this world are yet to be written.</p>
            </div>
        );
    }

    return (
        <div className="flex-grow h-full overflow-y-auto bg-black/20 p-4 md:p-8">
            <div className="max-w-3xl mx-auto relative pb-20">
                <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-tight">The Chronicles of {world.name}</h2>
                
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-1/2 top-20 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-violet-500 to-transparent md:-ml-px"></div>

                <div className="space-y-12 relative">
                    {events.map((event, index) => (
                        <div key={event.id} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                            
                            {/* Content Card */}
                            <div className="flex-1 w-full pl-12 md:pl-0">
                                <div className="glass-panel p-6 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] group relative">
                                    
                                    {/* Connector Dot (Mobile: Left, Desktop: Center-facing) */}
                                    <div className={`absolute top-6 w-4 h-4 rounded-full bg-gray-900 border-2 border-cyan-400 shadow-[0_0_10px_cyan] z-10 
                                        -left-[41px] md:left-auto 
                                        ${index % 2 === 0 ? 'md:-left-[41px] md:right-auto' : 'md:-right-[41px] md:left-auto'}
                                    `}></div>

                                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 block">{event.dateLabel}</span>
                                    <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                                    
                                    {event.imageUrl && (
                                        <div className="mb-4 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                                            <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                        </div>
                                    )}
                                    
                                    <p className="text-sm text-gray-300 leading-relaxed">{event.description}</p>
                                </div>
                            </div>

                            {/* Spacer for alternate side */}
                            <div className="hidden md:block flex-1"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorldTimelineView;
