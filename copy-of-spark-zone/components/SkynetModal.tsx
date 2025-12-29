
import React, { useEffect, useRef } from 'react';

const ShieldExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-red-500"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>;

interface SkynetModalProps {
    isOpen: boolean;
    onClose: () => void;
    violationType: string;
    warningCount: number;
}

const SkynetModal: React.FC<SkynetModalProps> = ({ isOpen, onClose, violationType, warningCount }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Auto-close after 5 seconds for warnings, unless it's a block
            if (warningCount < 3) {
                const timer = setTimeout(onClose, 5000);
                return () => clearTimeout(timer);
            }
        }
    }, [isOpen, onClose, warningCount]);

    if (!isOpen) return null;

    const isRestricted = warningCount >= 3;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-red-900/80 backdrop-blur-md animate-fadeIn">
            <div ref={modalRef} className="w-full max-w-lg bg-black border-2 border-red-500 rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.5)] flex flex-col overflow-hidden relative">
                {/* Cyberpunk Scan Lines Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCBMIDAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwZmYwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')]"></div>
                
                <div className="p-8 flex flex-col items-center text-center relative z-10">
                    <div className="animate-pulse mb-4">
                        <ShieldExclamationIcon />
                    </div>
                    
                    <h1 className="text-4xl font-extrabold text-red-500 tracking-widest mb-2 uppercase font-mono">
                        {isRestricted ? 'SYSTEM LOCKDOWN' : 'SKYNET INTERVENTION'}
                    </h1>
                    
                    <div className="bg-red-500/20 border border-red-500 px-4 py-2 rounded mb-6">
                        <p className="text-red-200 font-mono text-sm uppercase">
                            Violation Detected: {violationType}
                        </p>
                    </div>

                    <p className="text-gray-300 mb-6 max-w-xs mx-auto">
                        {isRestricted 
                            ? "Multiple violations detected. Your account has been temporarily restricted from posting."
                            : "This content violates Spark Zone community guidelines. Please review our safety protocols."
                        }
                    </p>

                    <div className="flex gap-2 mb-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-12 h-3 rounded-full ${i <= warningCount ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-gray-800'}`}></div>
                        ))}
                    </div>
                    
                    <p className="text-red-400 font-bold text-sm mb-4 uppercase">
                        Current Status: {isRestricted ? 'RESTRICTED' : `WARNING ${warningCount}/3`}
                    </p>

                    <button 
                        onClick={onClose}
                        className={`px-8 py-3 font-bold rounded-full transition-all duration-200 ${isRestricted ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/40'}`}
                        disabled={isRestricted}
                    >
                        {isRestricted ? 'Contact Support' : 'Acknowledge Protocol'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SkynetModal;
