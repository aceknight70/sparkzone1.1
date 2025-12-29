
import React, { useState } from 'react';
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import MainApp from './pages/MainApp';
import ProfileEditorPage from './pages/ProfileEditorPage';
import { currentUser as defaultUser } from './mockData';
import { User } from './types';

type AppState = 'intro' | 'login' | 'profile-setup' | 'main';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('intro');
    const [userData, setUserData] = useState<User>(defaultUser);

    const handleProfileSave = (updates: Partial<User>) => {
        setUserData(prev => ({ ...prev, ...updates }));
        setAppState('main');
    };

    const renderContent = () => {
        switch (appState) {
            case 'intro':
                return <IntroPage onComplete={() => setAppState('login')} />;
            case 'login':
                return <LoginPage onLogin={() => setAppState('profile-setup')} />;
            case 'profile-setup':
                return (
                    <ProfileEditorPage 
                        currentUser={userData} 
                        onSave={handleProfileSave} 
                        onExit={() => setAppState('main')} // Acts as Skip
                        mode="create"
                    />
                );
            case 'main':
                return <MainApp initialCurrentUser={userData} />;
            default:
                return <IntroPage onComplete={() => setAppState('login')} />;
        }
    };

    return (
        // Fixed inset-0 locks the app to the viewport.
        // h-[100dvh] uses dynamic viewport height to handle mobile address bars correctly.
        <div className="fixed inset-0 h-[100dvh] w-full bg-black text-gray-100 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
            {/* Global Background */}
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-blue-900/10 pointer-events-none z-0"></div>
            
            {/* Content - flex-grow ensures it fills the space */}
            <div className="relative z-10 flex-grow flex flex-col min-h-0 w-full">
                {renderContent()}
            </div>
        </div>
    );
};

export default App;
