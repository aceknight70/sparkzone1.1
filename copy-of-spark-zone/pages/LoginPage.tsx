
import React from 'react';
import Logo from '../components/Logo';

interface LoginPageProps {
    onLogin: () => void;
}

const AuthButton: React.FC<{ children: React.ReactNode, icon?: React.ReactElement, onClick?: () => void }> = ({ children, icon, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-4 px-4 py-3 my-2 font-medium text-white bg-gray-800/50 border border-violet-500/50 rounded-lg hover:bg-violet-500/20 hover:border-violet-500 transition-colors duration-300"
    >
      {icon}
      <span>{children}</span>
    </button>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fadeIn">
            <div className="w-full max-w-sm">
                <Logo className="mb-12" />

                <div className="space-y-4">
                    <AuthButton icon={<EmailIcon />}>Login with Email</AuthButton>
                    <AuthButton icon={<GoogleIcon />}>Login with Google</AuthButton>
                    <AuthButton onClick={onLogin} icon={<GuestIcon />}>Login as Guest</AuthButton>
                </div>
            </div>
        </div>
    );
};

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
);

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.574l6.19 5.238C41.382 36.141 44 30.637 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);

const GuestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);


export default LoginPage;