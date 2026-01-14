"use client";

import { Play, Pause, RotateCcw, Flag } from "lucide-react";
import { useStopwatch } from "@/hooks/useStopwatch";

export default function Stopwatch() {
    const { elapsed, isRunning, laps, start, pause, reset, lap } = useStopwatch();

    const formatStopwatch = (ms) => {
        const totalSec = Math.floor(ms / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        const cis = Math.floor((ms % 1000) / 10);
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${cis
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <section className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-4 shadow-xl flex flex-col md:flex-row gap-4 items-start">

                {/* Stopwatch Controls & Display */}
                <div className="flex-1 w-full flex flex-col items-center gap-4">
                    <h2 className="text-2xl font-bold text-white/80 flex items-center gap-2 self-start">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Stopwatch
                    </h2>

                    <div className="relative">
                        <div className="text-6xl md:text-8xl font-mono tracking-tighter tabular-nums px-4 py-8 text-white">
                            {formatStopwatch(elapsed)}
                        </div>
                    </div>

                    <div className="flex gap-4 w-full justify-center">
                        <button
                            onClick={isRunning ? pause : start}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${isRunning
                                ? "bg-red-500/20 text-red-400 border-2 border-red-500/50 hover:bg-red-500 hover:text-white"
                                : "bg-blue-500/20 text-blue-400 border-2 border-blue-500/50 hover:bg-blue-500 hover:text-white"
                                }`}
                        >
                            {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>

                        <button
                            onClick={lap}
                            disabled={!isRunning}
                            className="w-16 h-16 rounded-full flex items-center justify-center transition-all bg-white/5 text-white/80 border-2 border-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Flag size={20} />
                        </button>

                        <button
                            onClick={reset}
                            className="w-16 h-16 rounded-full flex items-center justify-center transition-all bg-white/5 text-white/80 border-2 border-white/10 hover:bg-white/20"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>

                {/* Laps List */}
                <div className="w-full md:w-80 max-h-[300px] overflow-y-auto custom-scrollbar bg-black/20 rounded-xl p-4 border border-white/5">
                    <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">Laps</h3>
                    <div className="space-y-2">
                        {laps.length === 0 && <div className="text-white/20 text-center py-8 text-sm italic">No laps recorded</div>}
                        {laps.map((l, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <span className="text-white/50 text-sm font-mono">#{laps.length - idx}</span>
                                <span className="font-mono text-lg">{formatStopwatch(l)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
