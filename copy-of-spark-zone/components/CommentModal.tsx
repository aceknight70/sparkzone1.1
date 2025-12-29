
import React, { useState, useRef, useEffect } from 'react';
import { Post, Comment, User, UserCreation, Character } from '../types';
import CommentComponent from './Comment';
import UserAvatar from './UserAvatar';
import CharacterSelectorModal from './CharacterSelectorModal';
import { GoogleGenAI, Type } from '@google/genai';
import LightningBoltIcon from './icons/LightningBoltIcon';

const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const PaperAirplaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>;

interface CommentModalProps {
    post: Post;
    comments: Comment[];
    currentUser: User;
    userCreations: UserCreation[];
    allUsers: User[];
    onClose: () => void;
    onCreateComment: (postId: number, content: string, character?: UserCreation) => void;
    onSparkComment: (commentId: number) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ post, comments, currentUser, userCreations, allUsers, onClose, onCreateComment, onSparkComment }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const commentListRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [commentText, setCommentText] = useState('');
    const [isIC, setIsIC] = useState(false);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectedVoiceId, setSelectedVoiceId] = useState(currentUser.id);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [error, setError] = useState('');
    
    const userCharacters = userCreations.filter(c => c.type === 'Character' || c.type === 'AI Character') as Character[];

    const selectedVoice = selectedVoiceId === currentUser.id
        ? { id: currentUser.id, name: 'You', epithet: 'Yourself', imageUrl: currentUser.avatarUrl }
        : userCharacters.find(c => c.id === selectedVoiceId);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    useEffect(() => {
        commentListRef.current?.scrollTo({ top: commentListRef.current.scrollHeight, behavior: 'smooth' });
    }, [comments]);
    
    useEffect(() => {
        if (!isIC) setSelectedVoiceId(currentUser.id);
    }, [isIC]);

    // Auto-expand Textarea Logic
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
        }
    }, [commentText]);


    const handleCreate = () => {
        if (!commentText.trim()) return;
        const character = isIC && selectedVoiceId !== currentUser.id ? userCharacters.find(c => c.id === selectedVoiceId) : undefined;
        onCreateComment(post.id, commentText, character);
        setCommentText('');
        setAiSuggestions([]);
    };
    
    const handleGenerateSuggestions = async () => {
        setIsAiLoading(true);
        setAiSuggestions([]);
        setError('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const lastComments = comments.slice(-3).map(c => `${c.character?.name || c.author.name}: ${c.content}`).join('\n');
            
            let promptContext = `You are a creative role-playing assistant.
            Given the original post: "${post.content}"
            And the last few comments:\n${lastComments}\n
            Suggest three distinct, short, and creative replies.`;

            if (isIC && selectedVoiceId !== currentUser.id) {
                promptContext += `\nReply in character as: ${selectedVoice?.name} (${selectedVoice?.epithet}).`;
            }

            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    suggestions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                    }
                }
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: promptContext,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                }
            });

            const data = JSON.parse(response.text);
            if (data.suggestions && Array.isArray(data.suggestions)) {
                setAiSuggestions(data.suggestions);
            }

        } catch (e) {
            console.error("AI Suggestion Error:", e);
            setError("Failed to generate suggestions.");
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div ref={modalRef} className="w-full max-w-2xl bg-gray-900 border border-violet-500/50 rounded-lg shadow-xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-violet-500/30 flex justify-between items-center bg-gray-900 z-10 rounded-t-lg">
                    <h2 className="text-xl font-bold text-cyan-400">Comments</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-4" ref={commentListRef}>
                    {/* Original Post Context */}
                    <div className="bg-gray-800/40 p-3 rounded-lg mb-4 border-l-2 border-cyan-500">
                        <div className="flex items-center gap-2 mb-1">
                            <UserAvatar src={post.character?.imageUrl || post.author.avatarUrl} size="6" />
                            <span className="text-xs font-bold text-cyan-300">{post.character?.name || post.author.name}</span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">{post.content}</p>
                    </div>

                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <CommentComponent 
                                key={comment.id} 
                                comment={comment} 
                                currentUser={currentUser}
                                onSpark={onSparkComment}
                            />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            No comments yet. Be the first to spark a conversation!
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-violet-500/30 bg-gray-900 z-10 rounded-b-lg">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-400">Reply as:</label>
                            <div className="flex items-center gap-2 bg-gray-800 rounded-full p-1 pr-3 cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => setIsSelectorOpen(true)}>
                                <UserAvatar src={selectedVoice?.imageUrl} size="6" />
                                <span className="text-xs font-bold text-cyan-400">{selectedVoice?.name}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                                <label htmlFor="ic-mode" className="text-xs text-gray-400 cursor-pointer">IC Mode</label>
                                <input 
                                    type="checkbox" 
                                    id="ic-mode" 
                                    checked={isIC} 
                                    onChange={(e) => setIsIC(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-600 text-cyan-500 focus:ring-cyan-500 bg-gray-700"
                                />
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleGenerateSuggestions}
                            disabled={isAiLoading}
                            className="flex items-center gap-1 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors disabled:opacity-50"
                        >
                            <LightningBoltIcon className={`w-3 h-3 ${isAiLoading ? 'animate-pulse' : ''}`} />
                            {isAiLoading ? 'Thinking...' : 'AI Assist'}
                        </button>
                    </div>

                    {aiSuggestions.length > 0 && (
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                            {aiSuggestions.map((suggestion, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setCommentText(suggestion)}
                                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs text-violet-200 hover:bg-violet-500/20 hover:border-violet-400 transition-all"
                                >
                                    {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex items-start gap-3 mb-4">
                        <UserAvatar src={selectedVoice?.imageUrl} size="10" />
                        <div className="flex-grow">
                            <textarea 
                                ref={textareaRef}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder={`Replying as ${selectedVoice?.name}...`}
                                className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none text-sm md:text-base leading-relaxed py-2"
                                rows={1}
                                enterKeyHint="enter"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <button 
                            onClick={handleCreate}
                            disabled={!commentText.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>Post</span>
                            <PaperAirplaneIcon />
                        </button>
                    </div>
                </div>
            </div>

            {isSelectorOpen && (
                <CharacterSelectorModal
                    isOpen={isSelectorOpen}
                    onClose={() => setIsSelectorOpen(false)}
                    characters={userCharacters}
                    currentUser={currentUser}
                    selectedId={selectedVoiceId}
                    onSelect={(id) => {
                        setSelectedVoiceId(id);
                        setIsSelectorOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default CommentModal;
