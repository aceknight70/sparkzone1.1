
import React from 'react';
import Logo from '../components/Logo';

interface IntroPageProps {
    onComplete: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fadeIn">
            <div className="flex flex-col items-center text-center">
                <Logo />
                <p className="mt-6 max-w-md text-lg text-gray-300">
                    let the spark of creativity start here embark on a role-play journey
                </p>
                <button
                    onClick={onComplete}
                    className="mt-12 px-8 py-3 bg-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default IntroPage;
