
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { memeTemplates } from '../mockData';
import LightningBoltIcon from '../components/icons/LightningBoltIcon';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const CloudArrowUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>;
const Squares2X2Icon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3-3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3-3h-2.25a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3-3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" /></svg>;

interface Caption {
    id: number;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    strokeColor: string;
    rotation: number;
}

interface MemeCreationPageProps {
    onExit: () => void;
    onSave: (memeData: { name: string; imageUrl: string }) => void;
}

const MemeCreationPage: React.FC<MemeCreationPageProps> = ({ onExit, onSave }) => {
    // --- State ---
    const [captions, setCaptions] = useState<Caption[]>([
        { id: 1, text: 'TOP TEXT', x: 250, y: 60, fontSize: 50, color: '#ffffff', strokeColor: '#000000', rotation: 0 },
        { id: 2, text: 'BOTTOM TEXT', x: 250, y: 450, fontSize: 50, color: '#ffffff', strokeColor: '#000000', rotation: 0 }
    ]);
    const [selectedCaptionId, setSelectedCaptionId] = useState<number | null>(null);
    const [backgroundSrc, setBackgroundSrc] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);
    const [saveTitle, setSaveTitle] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

    // Canvas Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageObjRef = useRef<HTMLImageElement | null>(null);
    
    // Dragging Refs
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const activeCaptionStart = useRef({ x: 0, y: 0 });

    // --- Initialization ---
    useEffect(() => {
        // Load default template safely
        loadImage(memeTemplates[0].imageUrl);
    }, []);

    // --- Canvas Drawing Logic ---
    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Background
        if (imageObjRef.current) {
            ctx.drawImage(imageObjRef.current, 0, 0, canvas.width, canvas.height);
        } else {
            // Placeholder background
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#333';
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Drop image here', canvas.width/2, canvas.height/2);
        }

        // Draw Captions
        captions.forEach(cap => {
            ctx.save();
            ctx.translate(cap.x, cap.y);
            ctx.rotate((cap.rotation * Math.PI) / 180);

            ctx.font = `900 ${cap.fontSize}px Impact, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineJoin = 'round';

            // Stroke
            ctx.lineWidth = cap.fontSize / 15;
            ctx.strokeStyle = cap.strokeColor;
            ctx.strokeText(cap.text.toUpperCase(), 0, 0);

            // Fill
            ctx.fillStyle = cap.color;
            ctx.fillText(cap.text.toUpperCase(), 0, 0);

            // Selection Indicator
            if (cap.id === selectedCaptionId) {
                const metrics = ctx.measureText(cap.text.toUpperCase());
                const width = metrics.width + 20;
                const height = cap.fontSize * 1.2;
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#22d3ee'; // Cyan
                ctx.setLineDash([5, 5]);
                ctx.strokeRect(-width / 2, -height / 2, width, height);
            }

            ctx.restore();
        });
    }, [captions, selectedCaptionId]);

    useEffect(() => {
        drawCanvas();
    }, [drawCanvas]);

    // --- Image Handling ---
    const loadImage = (src: string) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            imageObjRef.current = img;
            if (canvasRef.current) {
                // Resize canvas to match image aspect ratio, but constrain max size
                const maxWidth = 800;
                const scale = Math.min(1, maxWidth / img.width);
                canvasRef.current.width = img.width * scale;
                canvasRef.current.height = img.height * scale;
                
                // Reposition captions if they are outside
                setCaptions(prev => prev.map(c => ({
                    ...c,
                    x: Math.min(c.x, canvasRef.current!.width),
                    y: Math.min(c.y, canvasRef.current!.height)
                })));
            }
            setBackgroundSrc(src);
            drawCanvas();
        };
        img.src = src;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (typeof ev.target?.result === 'string') {
                loadImage(ev.target.result);
            }
        };
        reader.readAsDataURL(file);
    };

    // --- Drag & Drop for File Upload ---
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    // --- AI Generation ---
    const generateAiTemplate = async () => {
        if (!aiPrompt) return;
        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: `A funny, high-quality meme template image about: ${aiPrompt}. No text overlays.` }] },
                config: { responseModalities: [Modality.IMAGE] },
            });

            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                    loadImage(imageUrl);
                    break;
                }
            }
        } catch (e) {
            console.error("AI Gen Failed", e);
            alert("Failed to generate image.");
        } finally {
            setIsAiLoading(false);
            setAiPrompt('');
        }
    };

    // --- Interaction Logic (Text Dragging) ---
    const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
        const { x, y } = getCanvasCoordinates(e);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        // Check if clicked on a caption (reverse order to pick top-most)
        for (let i = captions.length - 1; i >= 0; i--) {
            const cap = captions[i];
            ctx.save();
            ctx.font = `900 ${cap.fontSize}px Impact`;
            const metrics = ctx.measureText(cap.text.toUpperCase());
            const width = metrics.width;
            const height = cap.fontSize;
            ctx.restore();

            // Simple hit detection (rotation ignored for hit test for simplicity in this version)
            // Assuming centered origin for rotation
            if (
                x >= cap.x - width / 2 &&
                x <= cap.x + width / 2 &&
                y >= cap.y - height / 2 &&
                y <= cap.y + height / 2
            ) {
                setSelectedCaptionId(cap.id);
                isDragging.current = true;
                dragStart.current = { x, y };
                activeCaptionStart.current = { x: cap.x, y: cap.y };
                return;
            }
        }
        
        // Deselect if clicked background
        setSelectedCaptionId(null);
    };

    const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging.current || selectedCaptionId === null) return;
        e.preventDefault(); // Prevent scroll on touch

        const { x, y } = getCanvasCoordinates(e);
        const dx = x - dragStart.current.x;
        const dy = y - dragStart.current.y;

        setCaptions(prev => prev.map(c => 
            c.id === selectedCaptionId 
                ? { ...c, x: activeCaptionStart.current.x + dx, y: activeCaptionStart.current.y + dy } 
                : c
        ));
    };

    const handlePointerUp = () => {
        isDragging.current = false;
    };

    // --- CRUD ---
    const addCaption = () => {
        const newId = Math.max(...captions.map(c => c.id), 0) + 1;
        const canvas = canvasRef.current;
        setCaptions([...captions, {
            id: newId,
            text: 'NEW TEXT',
            x: canvas ? canvas.width / 2 : 250,
            y: canvas ? canvas.height / 2 : 250,
            fontSize: 50,
            color: '#ffffff',
            strokeColor: '#000000',
            rotation: 0
        }]);
        setSelectedCaptionId(newId);
    };

    const updateSelectedCaption = (updates: Partial<Caption>) => {
        setCaptions(prev => prev.map(c => c.id === selectedCaptionId ? { ...c, ...updates } : c));
    };

    const deleteSelectedCaption = () => {
        if (selectedCaptionId !== null) {
            setCaptions(prev => prev.filter(c => c.id !== selectedCaptionId));
            setSelectedCaptionId(null);
        }
    };

    const handleFinalSave = () => {
        if (!saveTitle) {
            alert("Please enter a title!");
            return;
        }
        setIsSaveModalOpen(false);
        
        if (canvasRef.current) {
            // Deselect to remove selection box
            setSelectedCaptionId(null);
            setTimeout(() => {
                const dataUrl = canvasRef.current!.toDataURL('image/png');
                onSave({ name: saveTitle, imageUrl: dataUrl });
            }, 50);
        }
    };

    return (
        <div 
            className="flex flex-col h-full bg-[#050505] text-white font-sans overflow-hidden bg-gradient-to-tr from-black via-[#010619] to-blue-900/20"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-violet-500/30 bg-black/40 backdrop-blur-md z-20">
                <div className="flex items-center gap-3">
                    <button onClick={onExit} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeftIcon />
                    </button>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400 uppercase tracking-wider">Memeforge</h1>
                </div>
                <div className="flex gap-2">
                    <button onClick={addCaption} className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-800/60 hover:bg-gray-700 rounded-full text-sm font-bold border border-violet-500/30 transition-colors">
                        <PlusIcon /> Text
                    </button>
                    <button onClick={() => setIsSaveModalOpen(true)} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-full text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5">
                        <DownloadIcon /> Save
                    </button>
                </div>
            </header>

            {/* Drag Overlay */}
            {isDragOver && (
                <div className="absolute inset-0 z-50 bg-cyan-900/80 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-cyan-400 border-dashed m-4 rounded-2xl animate-pulse">
                    <CloudArrowUpIcon />
                    <h2 className="text-2xl font-bold text-white mt-4">Drop Image Template Here</h2>
                </div>
            )}

            <div className="flex flex-grow overflow-hidden relative">
                
                {/* --- Left Toolbar: Assets --- */}
                <aside className="w-80 bg-gray-900/50 backdrop-blur-md border-r border-violet-500/30 flex flex-col z-10 overflow-y-auto custom-scrollbar hidden md:flex">
                    <div className="p-4 space-y-6">
                        {/* Title Input */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Meme Title</label>
                            <input 
                                type="text" 
                                value={saveTitle} 
                                onChange={(e) => setSaveTitle(e.target.value)} 
                                placeholder="Enter a spicy title..." 
                                className="w-full bg-gray-800/60 border border-violet-500/30 rounded-lg p-3 text-white focus:border-cyan-500 outline-none transition-colors"
                            />
                        </div>

                        {/* AI Generator */}
                        <div className="bg-gray-900/60 p-4 rounded-xl border border-violet-500/30">
                            <div className="flex items-center gap-2 mb-3 text-cyan-400 font-bold text-sm">
                                <LightningBoltIcon className="w-4 h-4" /> AI Background
                            </div>
                            <textarea 
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="Describe a funny situation..."
                                className="w-full bg-black/40 border border-violet-500/30 rounded-lg p-2 text-sm text-white resize-none mb-3 focus:border-cyan-500 outline-none"
                                rows={2}
                            />
                            <button 
                                onClick={generateAiTemplate}
                                disabled={isAiLoading || !aiPrompt}
                                className="w-full py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-cyan-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                            >
                                {isAiLoading ? <SparklesIcon className="animate-spin" /> : <SparklesIcon />}
                                {isAiLoading ? 'Dreaming...' : 'Generate'}
                            </button>
                        </div>

                        {/* Upload */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Upload Template</label>
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                            <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-gray-900/50 border border-violet-500/30 hover:border-violet-400 rounded-xl text-gray-400 hover:text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                <PhotoIcon /> From Device
                            </button>
                            <p className="text-[10px] text-gray-500 mt-2 text-center">Supports PNG, JPG, GIF (Static)</p>
                        </div>

                        {/* Templates */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Preset Templates</label>
                                <button onClick={() => setIsTemplateDrawerOpen(true)} className="text-xs text-cyan-400 hover:underline">View All</button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {memeTemplates.slice(0, 4).map(t => (
                                    <button 
                                        key={t.id} 
                                        onClick={() => loadImage(t.imageUrl)}
                                        className="aspect-square rounded-lg overflow-hidden border border-violet-500/30 hover:border-cyan-400 transition-all relative group"
                                    >
                                        <img src={t.imageUrl} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold">USE</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* --- Center: Canvas --- */}
                <main className="flex-grow relative flex items-center justify-center overflow-hidden p-4 md:p-8 select-none pb-32 md:pb-8">
                    {/* Checkerboard pattern for transparency */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')]"></div>
                    
                    <div className="relative shadow-2xl shadow-black">
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={handlePointerDown}
                            onMouseMove={handlePointerMove}
                            onMouseUp={handlePointerUp}
                            onMouseLeave={handlePointerUp}
                            onTouchStart={handlePointerDown}
                            onTouchMove={handlePointerMove}
                            onTouchEnd={handlePointerUp}
                            className="max-w-full max-h-[60vh] md:max-h-[85vh] cursor-crosshair rounded-sm touch-none"
                        />
                    </div>
                </main>

                {/* --- Right: Properties Panel (Context Aware - Desktop) --- */}
                <aside className="w-72 bg-gray-900/50 backdrop-blur-md border-l border-violet-500/30 flex flex-col z-10 hidden md:flex">
                    <div className="p-4 border-b border-violet-500/30">
                        <h3 className="font-bold text-gray-300">Layer Properties</h3>
                    </div>
                    
                    <div className="p-4 flex-grow">
                        {selectedCaptionId !== null ? (
                            <div className="space-y-6 animate-fadeIn">
                                {captions.filter(c => c.id === selectedCaptionId).map(caption => (
                                    <div key={caption.id} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Text Content</label>
                                            <textarea 
                                                value={caption.text} 
                                                onChange={(e) => updateSelectedCaption({ text: e.target.value })}
                                                className="w-full bg-gray-800/60 border border-violet-500/30 rounded p-2 text-white text-lg font-bold resize-none focus:border-cyan-500 outline-none"
                                                rows={2}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Size: {caption.fontSize}px</label>
                                            <input 
                                                type="range" 
                                                min="20" max="150" 
                                                value={caption.fontSize} 
                                                onChange={(e) => updateSelectedCaption({ fontSize: Number(e.target.value) })}
                                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Rotation: {caption.rotation}°</label>
                                            <input 
                                                type="range" 
                                                min="-180" max="180" 
                                                value={caption.rotation} 
                                                onChange={(e) => updateSelectedCaption({ rotation: Number(e.target.value) })}
                                                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Fill</label>
                                                <div className="flex items-center gap-2 bg-gray-800/60 p-1 rounded border border-violet-500/30">
                                                    <input 
                                                        type="color" 
                                                        value={caption.color} 
                                                        onChange={(e) => updateSelectedCaption({ color: e.target.value })}
                                                        className="w-6 h-6 rounded bg-transparent cursor-pointer border-none p-0"
                                                    />
                                                    <span className="text-xs text-gray-300 font-mono">{caption.color}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Stroke</label>
                                                <div className="flex items-center gap-2 bg-gray-800/60 p-1 rounded border border-violet-500/30">
                                                    <input 
                                                        type="color" 
                                                        value={caption.strokeColor} 
                                                        onChange={(e) => updateSelectedCaption({ strokeColor: e.target.value })}
                                                        className="w-6 h-6 rounded bg-transparent cursor-pointer border-none p-0"
                                                    />
                                                    <span className="text-xs text-gray-300 font-mono">{caption.strokeColor}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button onClick={deleteSelectedCaption} className="w-full py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-bold rounded-lg border border-red-900/50 transition-colors flex items-center justify-center gap-2">
                                            <TrashIcon /> Remove Text
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-10 italic text-sm">
                                Select a text layer on the canvas to edit styles.
                            </div>
                        )}
                    </div>
                </aside>

                {/* Mobile Bottom Bar (Context Aware) */}
                {selectedCaptionId !== null ? (
                    <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gray-900/90 border-t border-violet-500/30 p-4 pb-safe flex flex-col gap-3 z-20 shadow-2xl animate-fadeIn backdrop-blur-md">
                       <div className="flex justify-between items-center mb-1">
                           <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Editing Text</span>
                           <button onClick={() => setSelectedCaptionId(null)} className="text-xs text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded border border-white/10">Done</button>
                       </div>
                       
                       <input 
                           type="text" 
                           value={captions.find(c => c.id === selectedCaptionId)?.text || ''} 
                           onChange={(e) => updateSelectedCaption({ text: e.target.value })}
                           className="w-full bg-black/40 border border-violet-500/30 rounded p-2 text-white font-bold text-lg focus:border-cyan-500 outline-none mb-2"
                           placeholder="Type caption..."
                       />
                       
                       <div className="flex items-center gap-4">
                           <div className="flex-grow">
                               <label className="text-[10px] text-gray-500 block mb-1">Size</label>
                               <input 
                                   type="range" 
                                   min="20" max="150" 
                                   value={captions.find(c => c.id === selectedCaptionId)?.fontSize || 50} 
                                   onChange={(e) => updateSelectedCaption({ fontSize: Number(e.target.value) })}
                                   className="w-full h-1 bg-gray-700 rounded-lg appearance-none accent-cyan-500"
                               />
                           </div>
                           <div className="flex-shrink-0">
                               <label className="text-[10px] text-gray-500 block mb-1">Color</label>
                               <div className="relative w-8 h-8 rounded-full border border-gray-600 overflow-hidden">
                                   <input 
                                       type="color" 
                                       value={captions.find(c => c.id === selectedCaptionId)?.color || '#ffffff'} 
                                       onChange={(e) => updateSelectedCaption({ color: e.target.value })}
                                       className="absolute -top-2 -left-2 w-12 h-12 p-0 border-none bg-transparent"
                                   />
                               </div>
                           </div>
                           <button onClick={deleteSelectedCaption} className="p-2 bg-red-900/20 text-red-400 rounded-lg border border-red-900/30">
                               <TrashIcon />
                           </button>
                       </div>
                    </div>
                ) : (
                    <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gray-900/90 border-t border-violet-500/30 p-4 flex justify-around items-center pb-safe z-20 backdrop-blur-md">
                         <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-1 text-gray-400 active:scale-95 transition-transform w-16">
                            <div className="p-2 bg-gray-800 rounded-full border border-white/10"><PhotoIcon className="w-5 h-5"/></div>
                            <span className="text-[10px]">Upload</span>
                         </button>
                         <button onClick={addCaption} className="flex flex-col items-center gap-1 text-cyan-400 active:scale-95 transition-transform w-20 -mt-6">
                            <div className="p-4 bg-cyan-600 rounded-full shadow-lg shadow-cyan-500/40 border border-cyan-400">
                                <PlusIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-bold">Add Text</span>
                         </button>
                         <button onClick={() => setIsTemplateDrawerOpen(true)} className="flex flex-col items-center gap-1 text-gray-400 active:scale-95 transition-transform w-16">
                            <div className="p-2 bg-gray-800 rounded-full border border-white/10"><Squares2X2Icon className="w-5 h-5"/></div>
                            <span className="text-[10px]">Templates</span>
                         </button>
                    </div>
                )}
            </div>

            {/* Template Modal */}
            {isTemplateDrawerOpen && (
                <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm" onClick={() => setIsTemplateDrawerOpen(false)}>
                    <div className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl border border-violet-500/30" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-violet-500/30 flex justify-between items-center bg-gray-900">
                            <h3 className="font-bold text-white">Select Template</h3>
                            <button onClick={() => setIsTemplateDrawerOpen(false)} className="text-gray-400 hover:text-white">Close</button>
                        </div>
                        <div className="p-4 overflow-y-auto grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/20">
                            {memeTemplates.map(t => (
                                <button key={t.id} onClick={() => { loadImage(t.imageUrl); setIsTemplateDrawerOpen(false); }}>
                                    <img src={t.imageUrl} className="rounded-lg hover:ring-2 ring-cyan-500 transition-all w-full h-auto object-cover border border-violet-500/20" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Save Modal */}
            {isSaveModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4">
                    <div className="bg-gray-900 border border-violet-500/50 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2">Save Your Masterpiece</h3>
                        <p className="text-gray-400 text-sm mb-4">Give your meme a catchy title before exporting.</p>
                        <input 
                            type="text" 
                            value={saveTitle} 
                            onChange={(e) => setSaveTitle(e.target.value)} 
                            placeholder="e.g. When the code compiles first try..." 
                            className="w-full bg-black/50 border border-violet-500/30 rounded-lg p-3 text-white focus:border-cyan-500 outline-none mb-6"
                            autoFocus
                        />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleFinalSave} className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-full shadow-lg transition-transform hover:-translate-y-0.5">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemeCreationPage;
