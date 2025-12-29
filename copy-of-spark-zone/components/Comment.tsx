import React from 'react';
import { Comment, User } from '../types';
import UserAvatar from './UserAvatar';

const SparkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5a3.375 3.375 0 00-3.375 3.375V18a3.375 3.375 0 003.375 3.375h.001c1.863 0 3.375-1.512 3.375-3.375V16.875a3.375 3.375 0 00-3.375-3.375h-.001z" /></svg>;
const SparkIconFilled = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;

interface CommentProps {
    comment: Comment;
    currentUser: User;
    onSpark: (commentId: number) => void;
}

const CommentComponent: React.FC<CommentProps> = ({ comment, currentUser, onSpark }) => {
    const isIC = !!comment.character;
    const author = isIC ? comment.character! : comment.author;
    const authorName = author.name;
    const authorAvatar = author.imageUrl || (author as User).avatarUrl;
    
    const isSparked = comment.sparkedBy.includes(currentUser.id);

    const icClasses = isIC ? "bg-cyan-500/5" : "";

    return (
        <div className={`flex items-start gap-3 py-4 rounded-md -mx-2 px-2 ${icClasses}`}>
            <UserAvatar src={authorAvatar} size="10" />
            <div className="flex-grow">
                <div className="flex items-baseline flex-wrap gap-x-2 text-sm">
                    <p className="font-bold text-white hover:underline cursor-pointer">{authorName}</p>
                    {isIC && <span className="text-xs text-cyan-400">as {comment.author.name}</span>}
                    <span className="text-xs text-gray-500">·</span>
                    <p className="text-xs text-gray-500">{comment.timestamp}</p>
                </div>
                <p className="text-gray-300 mt-1 whitespace-pre-wrap">{comment.content}</p>
                <div className="mt-2">
                     <button 
                        onClick={() => onSpark(comment.id)}
                        className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded-full transition-colors ${isSparked ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:text-yellow-300 hover:bg-yellow-400/10'}`}
                    >
                        {isSparked ? <SparkIconFilled /> : <SparkIcon />} 
                        <span className="font-semibold">{comment.sparks > 0 ? comment.sparks : 'Spark'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommentComponent;