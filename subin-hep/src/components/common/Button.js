import React from 'react';

export default function Button({
    children,
    onClick,
    variant = 'primary',
    className = '',
    type = 'button',
    ...props
}) {
    const baseStyles = "px-6 py-3 font-bold rounded-full transition-all active:scale-95 shadow-lg flex items-center justify-center";

    const variants = {
        primary: "bg-[#718eac] text-[#FFF2E0] hover:scale-105 hover:bg-[#53718d]",
        secondary: "bg-white/10 text-[#FFF2E0] hover:bg-white/20",
        danger: "bg-red-400/20 text-red-300 hover:bg-red-400/30",
        ghost: "text-[#FFF2E0]/60 hover:text-white"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
