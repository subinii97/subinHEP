"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { X, Search, Plus } from "lucide-react";
import { ALL_TIMEZONES } from "@/data/timezones";

export default function WorldClock() {
    const [now, setNow] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [isZonePickerOpen, setIsZonePickerOpen] = useState(false);
    const [citySearch, setCitySearch] = useState("");

    // Update time every second
    useEffect(() => {
        setNow(new Date());
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Filter timezones
    const filteredTimezones = useMemo(() => {
        const query = (citySearch || "").trim().toLowerCase();
        if (!query) return ALL_TIMEZONES;

        return ALL_TIMEZONES
            .filter(tz =>
                tz.label.toLowerCase().includes(query) ||
                (tz.ko && tz.ko.includes(query))
            )
            .sort((a, b) => {
                const aIdx = a.label.toLowerCase().indexOf(query);
                const bIdx = b.label.toLowerCase().indexOf(query);

                if (aIdx === 0 && bIdx !== 0) return -1;
                if (bIdx === 0 && aIdx !== 0) return 1;

                return a.label.localeCompare(b.label);
            });
    }, [citySearch]);

    const formatTime = (date, timeZone) => {
        if (!date) return "--:--:--";
        try {
            return new Intl.DateTimeFormat("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
                timeZone: timeZone || "Asia/Seoul",
            }).format(date);
        } catch (e) {
            return "--:--:--";
        }
    };

    return (
        <>
            <section className="animate-fade-in-up">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 p-4 md:p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">

                    {/* Local Time */}
                    <div className="text-center md:text-left flex flex-col gap-2">
                        <span className="text-sm font-bold tracking-widest text-rose-400 uppercase">
                            Seoul (Local)
                        </span>
                        <div className="text-5xl md:text-7xl font-light tracking-tighter tabular-nums">
                            {formatTime(now, "Asia/Seoul")}
                        </div>
                        <div className="text-white/40 text-sm">
                            {now ? now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "--"}
                        </div>
                    </div>

                    {/* Divider (Desktop) */}
                    <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

                    {/* World Time */}
                    <div className="text-center md:text-right flex flex-col items-center md:items-end gap-2 min-w-[240px]">
                        {selectedZone ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold tracking-widest text-blue-400 uppercase">
                                        {selectedZone.label}
                                    </span>
                                    <button
                                        onClick={() => setSelectedZone(null)}
                                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X size={14} className="text-white/60" />
                                    </button>
                                </div>
                                <div className="text-5xl md:text-7xl font-light tracking-tighter tabular-nums">
                                    {formatTime(now, selectedZone.zone)}
                                </div>
                                <div className="text-white/40 text-sm">
                                    {now ? now.toLocaleDateString("en-US", { timeZone: selectedZone.zone, weekday: 'long', month: 'long', day: 'numeric' }) : "--"}
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    setCitySearch("");
                                    setIsZonePickerOpen(true);
                                    setTimeout(() => document.getElementById('city-search-input')?.focus(), 100);
                                }}
                                className="group flex flex-col items-center justify-center w-full h-full min-h-[100px] gap-3 border-2 border-dashed border-white/20 rounded-2xl hover:border-white/50 hover:bg-white/5 transition-all duration-300"
                            >
                                <div className="p-3 bg-white/10 rounded-full group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                                    <Plus size={32} className="text-white" />
                                </div>
                                <span className="text-sm font-medium text-white/60 group-hover:text-white">Add World Clock</span>
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* --- Zone Picker Modal --- */}
            {isZonePickerOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={() => setIsZonePickerOpen(false)}
                >
                    <div
                        className="bg-[#1e293b] rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-white/10 flex flex-col gap-4 bg-white/5">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg">Select City</h3>
                                <button onClick={() => setIsZonePickerOpen(false)}><X size={20} /></button>
                            </div>
                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                <input
                                    id="city-search-input"
                                    type="text"
                                    autoComplete="off"
                                    className="w-full bg-white/10 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all placeholder:text-white/30"
                                    placeholder="Search city (Ex: Seoul, New York)..."
                                    value={citySearch}
                                    onChange={(e) => setCitySearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto p-2">
                            {filteredTimezones.length === 0 ? (
                                <div className="p-8 text-center text-white/30 text-sm">검색 결과가 없습니다</div>
                            ) : (
                                filteredTimezones.map((tz) => (
                                    <button
                                        key={`${tz.label}-${tz.zone}`}
                                        onClick={() => { setSelectedZone(tz); setIsZonePickerOpen(false); setCitySearch(""); }}
                                        className="w-full text-left p-4 hover:bg-blue-500/20 hover:text-blue-200 rounded-xl transition-all flex justify-between items-center group"
                                    >
                                        <span className="font-medium">{tz.label}</span>
                                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/50 group-hover:bg-blue-500/20 group-hover:text-blue-200">{tz.offset}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
