"use client";
import { useEffect, useRef } from 'react';
import katex from 'katex';

export default function Math({ formula, inline = true }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            try {
                katex.render(formula, containerRef.current, {
                    throwOnError: false,
                    displayMode: !inline
                });
            } catch (error) {
                console.error("KaTeX rendering error:", error);
            }
        }
    }, [formula, inline]);

    return <span ref={containerRef} />;
}
