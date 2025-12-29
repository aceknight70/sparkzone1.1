
import React, { useState, useRef, useEffect } from 'react';

const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const FlagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 3.5c0-.266.102-.523.284-.716A.994.994 0 014 2.5h8.75c.426 0 .827.257.975.625l.875 2.187 1.925-.77a.75.75 0 01.89.334l.5 1.25a.75.75 0 01-.22.882l-2.153 1.615c.013.129.02.26.02.392 0 2.761-2.686 5-6 5s-6-2.239-6-5c0-.133.007-.264.02-.393L.505 6.013a.75.75 0 01-.22-.882l.5-1.25a.75.75 0 01.89-.334l1.925.77L4.5 2.125z" clipRule="evenodd" /><path d="M3 15.5v3.75a.75.75 0 001.5 0V15.5H3z" /></svg>;

export type ReportType = 'Content' | 'User' | 'Bug' | 'Feedback';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: ReportType;
    targetName?: string; // The name of the user/post/world being reported
    targetId?: number | string;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, type, targetName, targetId }) => {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const reportReasons: Record<ReportType, string[]> = {
        'Content': ['Inappropriate Content', 'Harassment', 'Spam', 'Misinformation', 'Copyright Violation'],
        'User': ['Harassment', 'Impersonation', 'Bot/Spam Account', 'Inappropriate Profile'],
        'Bug': ['UI Issue', 'Crash/Error', 'Performance', 'Other'],
        'Feedback': ['Feature Request', 'General Suggestion', 'Appreciation', 'Other']
    };

    useEffect(() => {
        if (!isOpen) return;
        // Reset state on open
        setReason(reportReasons[type][0]);
        setDescription('');
        setIsSuccess(false);
        setIsSubmitting(false);

        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, type]);


    const handleSubmit = () => {
        setIsSubmitting(true);
        // Simulate API call to "Skynet" reporting system
        setTimeout(() => {
            console.log(`Report Submitted: Type=${type}, ID=${targetId}, Reason=${reason}, Desc=${description}`);
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(onClose, 2000); // Close after success message
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div ref={modalRef} className="w-full max-w-md bg-gray-900 border border-red-500/30 rounded-lg shadow-xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-red-500/30 flex justify-between items-center bg-red-900/10">
                    <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                        <FlagIcon />
                        {type === 'Feedback' || type === 'Bug' ? 'Send Feedback' : 'Report Issue'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon /></button>
                </div>

                <div className="p-6">
                    {isSuccess ? (
                        <div className="text-center py-8 animate-fadeIn">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            </div>
                            <h3 className="text-lg font-bold text-white">Received</h3>
                            <p className="text-gray-400 mt-2">
                                {type === 'Feedback' ? "Thanks for helping improve Spark Zone!" : "Skynet has received your report and will investigate."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {targetName && (
                                <p className="text-sm text-gray-400">
                                    Reporting: <span className="font-semibold text-white">{targetName}</span>
                                </p>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Reason</label>
                                <select 
                                    value={reason} 
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full bg-gray-800/60 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    {reportReasons[type].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Details</label>
                                <textarea 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    placeholder="Please provide more details..."
                                    className="w-full bg-gray-800/60 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                                />
                            </div>

                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full mt-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? 'Sending...' : 'Submit Report'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
