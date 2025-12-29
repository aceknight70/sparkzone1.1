
import React from 'react';

interface PageWrapperProps {
    title: string;
    children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
    return (
        <div className="container mx-auto px-4 py-8 animate-fadeIn">
            <h1 className="text-4xl font-bold text-cyan-400 mb-6">{title}</h1>
            <div>{children}</div>
        </div>
    );
};

export default PageWrapper;
