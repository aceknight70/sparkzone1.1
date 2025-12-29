
import React, { useState } from 'react';
import UserAvatar from './UserAvatar';
import { Post, User } from '../types';
import ReportModal, { ReportType } from './ReportModal';
import ShareButton from './ShareButton';

// --- Reusable Icon Components ---
const SparkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
const SparkIconFilled = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l2.976-7.969H4.614a.75.75 0 01-.635-1.103l7.436-9.563a.75.75 0 01.53-.282z" clipRule="evenodd" /></svg>;
const CommentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.068.158 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.206 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>;
const MessageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2c-4.418 0-8 3.134-8 7 0 2.444 1.206 4.634 3.09 5.982.257.185.334.502.213.766l-1.06 1.768a.75.75 0 001.28.766l1.23-2.05a.75.75 0 01.62-.358 10.42 10.42 0 002.83 0 .75.75 0 01.62.358l1.23 2.05a.75.75 0 001.28-.766l-1.06-1.768a.75.75 0 01.213-.766A7.96 7.96 0 0018 9c0-3.866-3.582-7-8-7z" clipRule="evenodd" /></svg>;
const FlagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 3.5c0-.266.102-.523.284-.716A.994.994 0 014 2.5h8.75c.426 0 .827.257.975.625l.875 2.187 1.925-.77a.75.75 0 01.89.334l.5 1.25a.75.75 0 01-.22.882l-2.153 1.615c.013.129.02.26.02.392 0 2.761-2.686 5-6 5s-6-2.239-6-5c0-.133.007-.264.02-.393L.505 6.013a.75.75 0 01-.22-.882l.5-1.25a.75.75 0 01.89-.334l1.925.77L4.5 2.125z" clipRule="evenodd" /><path d="M3 15.5v3.75a.75.75 0 001.5 0V15.5H3z" /></svg>;


interface PostCardProps {
    post: Post;
    currentUser: User;
    onSpark: (postId: number) => void;
    onComment: (postId: number) => void;
    onStartConversation: (userId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onSpark, onComment, onStartConversation }) => {
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [animateSpark, setAnimateSpark] = useState(false);
    
    const author = post.character || post.author;
    const authorName = post.character ? post.character.name : post.author.name;
    const authorAvatar = post.character ? post.character.imageUrl : post.author.avatarUrl;
    const isOC = !!post.character;

    const isSparked = post.sparkedBy.includes(currentUser.id);
    const isOwnPost = post.author.id === currentUser.id;

    const handleSpark = () => {
        setAnimateSpark(true);
        onSpark(post.id);
        setTimeout(() => setAnimateSpark(false), 300);
    };

    return (
        <>
        <div className="glass-panel glass-panel-hover rounded-xl mb-6 overflow-hidden relative transition-all duration-300">
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 relative">
                        <UserAvatar size="12" src={authorAvatar} className="ring-2 ring-white/10" />
                        {isOC && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full border-2 border-gray-900" title="Original Character"></div>}
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-white text-lg leading-tight truncate">{authorName}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                    {isOC && <span className="text-cyan-400">@{post.author.name}</span>}
                                    <span>•</span>
                                    <span>{post.timestamp}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 -mr-2">
                                {!isOwnPost && (
                                    <button onClick={() => onStartConversation(post.author.id)} className="p-2 rounded-full text-gray-500 hover:bg-white/5 hover:text-cyan-400 transition-colors" aria-label={`Message`}>
                                        <MessageIcon />
                                    </button>
                                )}
                                <button onClick={() => setIsReportOpen(true)} className="p-2 rounded-full text-gray-500 hover:bg-white/5 hover:text-red-400 transition-colors" aria-label="Report">
                                    <FlagIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mt-4 pl-16">
                    <p className="text-gray-200 whitespace-pre-wrap text-[15px] leading-relaxed">
                        {post.content}
                    </p>
                    {post.media && (
                        <div className="mt-4 rounded-lg overflow-hidden border border-white/10 bg-black/50">
                            {post.media.type === 'video' ? (
                                <video src={post.media.url} controls className="w-full max-h-96 object-contain" />
                            ) : (
                                <img 
                                    src={post.media.url} 
                                    alt="Post attachment" 
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full max-h-96 object-contain" 
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-white/5 bg-black/20 flex justify-between items-center pl-16">
                <div className="flex gap-6">
                    <button 
                        onClick={handleSpark}
                        className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${isSparked ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]' : 'text-gray-400 hover:text-cyan-400'}`}
                    >
                        <div className={`transform transition-transform duration-300 ${animateSpark ? 'scale-150' : 'scale-100'} ${isSparked ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {isSparked ? <SparkIconFilled /> : <SparkIcon />}
                        </div>
                        <span>{post.sparks || 'Spark'}</span>
                    </button>
                    
                    <button 
                        onClick={() => onComment(post.id)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors group"
                    >
                        <div className="group-hover:text-violet-400 transition-colors"><CommentIcon /></div>
                        <span>{post.comments || 'Reply'}</span>
                    </button>
                </div>
                
                <ShareButton 
                    title="Spark Zone Post"
                    text={`Check out this post by ${authorName} on Spark Zone:\n\n"${post.content}"`}
                    className="text-gray-400 hover:text-white text-sm"
                    showLabel={false}
                    iconOnly={true}
                />
            </div>
        </div>
        <ReportModal 
            isOpen={isReportOpen}
            onClose={() => setIsReportOpen(false)}
            type="Content"
            targetName={`Post by ${authorName}`}
            targetId={post.id}
        />
        </>
    );
};

export default React.memo(PostCard);
