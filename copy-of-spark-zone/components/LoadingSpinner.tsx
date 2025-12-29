
import React from 'react';

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center w-full h-full min-h-[50vh] animate-fadeIn">
        <div className="relative w-10 h-10 md:w-12 md:h-12">
            <div className="absolute inset-0 border-4 border-cyan-900/50 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
    </div>
);

export default LoadingSpinner;
