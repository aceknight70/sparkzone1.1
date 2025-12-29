
import React from 'react';

const UserAvatar: React.FC<{ src?: string; size?: string; className?: string }> = ({ src, size = '10', className = '' }) => {
    // Note: TailwindCSS needs to see the full class name to work correctly with JIT compilation.
    // Dynamic classes like `w-${size}` might not work if the size is not predefined in the safe list.
    // For this app, we'll assume the sizes used ('10', '12', '24') will be picked up.
    const sizeClasses = `w-${size} h-${size}`;

    if (src) {
        return (
            <img 
                src={src} 
                alt="User Avatar" 
                loading="lazy"
                decoding="async"
                className={`${sizeClasses} rounded-full object-cover flex-shrink-0 ${className}`} 
            />
        );
    }
    return (
        <div className={`${sizeClasses} rounded-full bg-gradient-to-tr from-cyan-500 to-violet-500 flex-shrink-0 ${className}`}></div>
    );
};

export default UserAvatar;
