import React from 'react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl', zIndex = 'z-[110]' }) {
    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 ${zIndex} flex items-center justify-center bg-black/60 backdrop-blur-md p-4`}
            onClick={onClose}
        >
            <div
                className={`bg-[#6b7887] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full ${maxWidth} max-h-[80vh] overflow-y-auto border border-white/10`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-[#FFF2E0]">{title}</h2>
                    <button onClick={onClose} className="text-[#FFF2E0]/60 text-xl px-2 hover:text-[#FFF2E0] transition-colors">✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}
