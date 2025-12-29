import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`flex items-center justify-center gap-1 ${className}`}>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-[0_2px_2px_rgba(0,192,255,0.4)]">
                Spark
            </h1>
            <svg
                viewBox="0 0 24 32"
                className="h-[2.75rem] md:h-14 w-auto -ml-2 -mr-1.5 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,192,255,0.8)]"
                fill="currentColor"
            >
                <path d="M11.39 2.53L2.09 17.3c-.7.98.15 2.45 1.31 2.45h7.1L8.3 29.35c-.4 1.25.79 2.4 1.93 1.62L21.92 14.7c.7-.98-.15-2.45-1.31-2.45h-7.1l2.19-9.62c.4-1.25-.79-2.4-1.93-1.62l-.38.2z" />
            </svg>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-[0_2px_2px_rgba(0,192,255,0.4)]">
                Zone
            </h1>
        </div>
    );
};

export default Logo;