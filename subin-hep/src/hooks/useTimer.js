import { useState, useEffect, useRef } from 'react';

export function useTimer(initialDuration = 60000) {
    const [duration, setDuration] = useState(initialDuration);
    const [remaining, setRemaining] = useState(initialDuration);
    const [isRunning, setIsRunning] = useState(false);

    const endTimeRef = useRef(0);
    const animationFrameRef = useRef(null);

    const updateTimer = () => {
        const now = Date.now();
        const timeLeft = Math.max(0, endTimeRef.current - now);
        setRemaining(timeLeft);

        if (timeLeft > 0) {
            animationFrameRef.current = requestAnimationFrame(updateTimer);
        } else {
            setIsRunning(false);
            setRemaining(0);
        }
    };

    const start = () => {
        setIsRunning(true);
    };

    const pause = () => {
        setIsRunning(false);
    };

    const reset = () => {
        setIsRunning(false);
        setRemaining(0); // Or reset to duration? The original logic sets it to 0 and goes back to setting mode.
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    // Set explicit remaining time (e.g. when setting NEW duration)
    const setTime = (ms) => {
        setDuration(ms);
        setRemaining(ms);
    };

    useEffect(() => {
        if (isRunning) {
            endTimeRef.current = Date.now() + remaining;
            animationFrameRef.current = requestAnimationFrame(updateTimer);
        } else {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isRunning]);

    return {
        remaining,
        isRunning,
        start,
        pause,
        reset,
        setTime
    };
}
