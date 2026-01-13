import React from 'react';

export default function Input({
    type = 'text',
    placeholder,
    value,
    onChange,
    isTextarea = false,
    className = '',
    ...props
}) {
    const baseStyles = "w-full p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/10 border border-white/10 outline-none text-[#FFF2E0] placeholder:text-[#FFF2E0]/40 transition focus:border-white/30";

    if (isTextarea) {
        return (
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`${baseStyles} resize-none h-48 md:h-64 ${className}`}
                {...props}
            />
        );
    }

    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${baseStyles} ${className}`}
            {...props}
        />
    );
}
