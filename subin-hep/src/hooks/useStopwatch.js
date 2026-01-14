import { useState, useEffect, useRef } from 'react';

export function useStopwatch() {
    const [elapsed, setElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState([]);

    const startTimeRef = useRef(0);
    const savedElapsedRef = useRef(0);
    const animationFrameRef = useRef(null);

    const updateStopwatch = () => {
        const currentTime = Date.now();
        setElapsed(savedElapsedRef.current + (currentTime - startTimeRef.current));
        animationFrameRef.current = requestAnimationFrame(updateStopwatch);
    };

    const start = () => {
        setIsRunning(true);
    };

    const pause = () => {
        setIsRunning(false);
    };

    const reset = () => {
        setIsRunning(false);
        setElapsed(0);
        setLaps([]);
        savedElapsedRef.current = 0;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    const lap = () => {
        setLaps(prev => [elapsed, ...prev]);
    };

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now();
            animationFrameRef.current = requestAnimationFrame(updateStopwatch);
        } else {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            savedElapsedRef.current = elapsed;
        }
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isRunning]);

    return {
        elapsed,
        isRunning,
        laps,
        start,
        pause,
        reset,
        lap
    };
}
