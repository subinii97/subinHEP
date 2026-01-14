"use client";

import { useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";

export default function Timer() {
    const { remaining, isRunning, start, pause, reset, setTime } = useTimer(60000);
    const [inputDetails, setInputDetails] = useState({ min: 1, sec: 0 });
    const [isSetting, setIsSetting] = useState(true);

    const formatStopwatch = (ms) => {
        const totalSec = Math.floor(ms / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        const cis = Math.floor((ms % 1000) / 10);
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${cis
            .toString()
            .padStart(2, "0")}`;
    };

    const handleStart = () => {
        if (isSetting) {
            const totalMs = (parseInt(inputDetails.min) * 60 + parseInt(inputDetails.sec)) * 1000;
            setTime(totalMs);
            setIsSetting(false);
        }
        start();
    };

    const handleReset = () => {
        reset();
        setIsSetting(true);
    };

    return (
        <section className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-xl flex flex-col items-center gap-8 relative overflow-hidden">
                <h2 className="text-2xl font-bold text-white/80 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Timer
                </h2>

                {isSetting ? (
                    <div className="flex items-center gap-4 text-4xl md:text-6xl font-light">
                        <div className="flex flex-col gap-2 items-center">
                            <input
                                type="number"
                                min="0"
                                value={inputDetails.min}
                                onChange={(e) => setInputDetails({ ...inputDetails, min: e.target.value })}
                                className="w-24 md:w-32 bg-transparent border-b-2 border-white/20 text-center focus:outline-none focus:border-rose-500 transition-colors"
                                placeholder="00"
                            />
                            <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Min</span>
                        </div>
                        <span className="text-white/20 pb-6">:</span>
                        <div className="flex flex-col gap-2 items-center">
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={inputDetails.sec}
                                onChange={(e) => setInputDetails({ ...inputDetails, sec: e.target.value })}
                                className="w-24 md:w-32 bg-transparent border-b-2 border-white/20 text-center focus:outline-none focus:border-rose-500 transition-colors"
                                placeholder="00"
                            />
                            <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Sec</span>
                        </div>
                    </div>
                ) : (
                    <div
                        className="text-6xl md:text-8xl font-mono tracking-tighter text-white tabular-nums"
                    >
                        {formatStopwatch(remaining)}
                    </div>
                )}

                <div className="flex gap-4">
                    {isSetting ? (
                        <button
                            onClick={handleStart}
                            className="px-8 py-3 bg-rose-500 hover:bg-rose-600 rounded-full font-bold text-white transition-all shadow-lg hover:shadow-rose-500/30 flex items-center gap-2"
                        >
                            <Play size={18} fill="currentColor" /> Start Timer
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={isRunning ? pause : start}
                                className={`px-8 py-3 rounded-full font-bold text-white transition-all shadow-lg flex items-center gap-2 ${isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"
                                    }`}
                            >
                                {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                                {isRunning ? "Pause" : "Resume"}
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold text-white transition-all flex items-center gap-2"
                            >
                                <RotateCcw size={18} /> Reset
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
