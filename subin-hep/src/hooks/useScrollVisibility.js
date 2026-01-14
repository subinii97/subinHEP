import { useState, useEffect, useRef } from 'react';

export function useScrollVisibility(isRefreshPage, isMenuOpen) {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const resetAutoHideTimer = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            if (window.scrollY < 10 && !isRefreshPage) return;

            timeoutRef.current = setTimeout(() => {
                if (!isMenuOpen) {
                    setIsVisible(false);
                }
            }, 2000);
        };

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10 && !isRefreshPage) {
                setIsVisible(true);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                lastScrollY.current = currentScrollY;
                return;
            }

            setIsVisible(true);
            resetAutoHideTimer();

            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false);
            } else if (currentScrollY < lastScrollY.current) {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;
        };

        const handleInteraction = () => {
            setIsVisible(true);
            resetAutoHideTimer();
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("wheel", handleInteraction);
        window.addEventListener("touchmove", handleInteraction);
        window.addEventListener("mousemove", (e) => {
            if (e.clientY < 100) handleInteraction();
        });

        if (window.scrollY >= 10 || isRefreshPage) {
            resetAutoHideTimer();
        } else {
            setIsVisible(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("wheel", handleInteraction);
            window.removeEventListener("touchmove", handleInteraction);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isMenuOpen, isRefreshPage]);

    return isVisible;
}
