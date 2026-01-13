"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Play, Pause, RotateCcw, Plus, X, Flag, Search } from "lucide-react";

// Extended list with Korean search terms
const ALL_TIMEZONES = [
    { label: "Accra", zone: "Africa/Accra", offset: "GMT", ko: "아크라" },
    { label: "Addis Ababa", zone: "Africa/Addis_Ababa", offset: "EAT", ko: "아디스아바바" },
    { label: "Adelaide", zone: "Australia/Adelaide", offset: "ACDT", ko: "애들레이드" },
    { label: "Algiers", zone: "Africa/Algiers", offset: "CET", ko: "알제" },
    { label: "Almaty", zone: "Asia/Almaty", offset: "ALMT", ko: "알마티" },
    { label: "Amman", zone: "Asia/Amman", offset: "EET", ko: "암만" },
    { label: "Amsterdam", zone: "Europe/Amsterdam", offset: "CET", ko: "암스테르담" },
    { label: "Anchorage", zone: "America/Anchorage", offset: "AKST", ko: "앵커리지" },
    { label: "Ankara", zone: "Europe/Istanbul", offset: "+03", ko: "앙카라" },
    { label: "Antananarivo", zone: "Africa/Antananarivo", offset: "EAT", ko: "안타나나리보" },
    { label: "Asuncion", zone: "America/Asuncion", offset: "-03", ko: "아순시온" },
    { label: "Athens", zone: "Europe/Athens", offset: "EET", ko: "아테네" },
    { label: "Auckland", zone: "Pacific/Auckland", offset: "NZDT", ko: "오클랜드" },
    { label: "Baghdad", zone: "Asia/Baghdad", offset: "+03", ko: "바그다드" },
    { label: "Bangkok", zone: "Asia/Bangkok", offset: "ICT", ko: "방콕" },
    { label: "Barcelona", zone: "Europe/Madrid", offset: "CET", ko: "바르셀로나" },
    { label: "Beijing", zone: "Asia/Shanghai", offset: "CST", ko: "베이징 북경" },
    { label: "Beirut", zone: "Asia/Beirut", offset: "EET", ko: "베이루트" },
    { label: "Belgrade", zone: "Europe/Belgrade", offset: "CET", ko: "베오그라드" },
    { label: "Bengaluru", zone: "Asia/Kolkata", offset: "IST", ko: "벵갈루루" },
    { label: "Berlin", zone: "Europe/Berlin", offset: "CET", ko: "베를린" },
    { label: "Bogota", zone: "America/Bogota", offset: "COT", ko: "보고타" },
    { label: "Boston", zone: "America/New_York", offset: "EST", ko: "보스턴" },
    { label: "Brasilia", zone: "America/Sao_Paulo", offset: "-03", ko: "브라질리아" },
    { label: "Brisbane", zone: "Australia/Brisbane", offset: "AEST", ko: "브리즈번" },
    { label: "Brussels", zone: "Europe/Brussels", offset: "CET", ko: "브뤼셀" },
    { label: "Bucharest", zone: "Europe/Bucharest", offset: "EET", ko: "부쿠레슈티" },
    { label: "Budapest", zone: "Europe/Budapest", offset: "CET", ko: "부다페스트" },
    { label: "Buenos Aires", zone: "America/Argentina/Buenos_Aires", offset: "-03", ko: "부에노스아이레스" },
    { label: "Cairo", zone: "Africa/Cairo", offset: "EET", ko: "카이로" },
    { label: "Calgary", zone: "America/Edmonton", offset: "MST", ko: "캘거리" },
    { label: "Canberra", zone: "Australia/Sydney", offset: "AEDT", ko: "캔버라" },
    { label: "Cape Town", zone: "Africa/Johannesburg", offset: "SAST", ko: "케이프타운" },
    { label: "Caracas", zone: "America/Caracas", offset: "-04", ko: "카라카스" },
    { label: "Casablanca", zone: "Africa/Casablanca", offset: "+01", ko: "카사블랑카" },
    { label: "Chicago", zone: "America/Chicago", offset: "CST", ko: "시카고" },
    { label: "Copenhagen", zone: "Europe/Copenhagen", offset: "CET", ko: "코펜하겐" },
    { label: "Dallas", zone: "America/Chicago", offset: "CST", ko: "달라스 댈러스" },
    { label: "Dar es Salaam", zone: "Africa/Dar_es_Salaam", offset: "EAT", ko: "다르에스살람" },
    { label: "Darwin", zone: "Australia/Darwin", offset: "ACST", ko: "다윈" },
    { label: "Denver", zone: "America/Denver", offset: "MST", ko: "덴버" },
    { label: "Detroit", zone: "America/Detroit", offset: "EST", ko: "디트로이트" },
    { label: "Dhaka", zone: "Asia/Dhaka", offset: "+06", ko: "다카" },
    { label: "Doha", zone: "Asia/Qatar", offset: "+03", ko: "도하" },
    { label: "Dubai", zone: "Asia/Dubai", offset: "GST", ko: "두바이" },
    { label: "Dublin", zone: "Europe/Dublin", offset: "GMT", ko: "더블린" },
    { label: "Edmonton", zone: "America/Edmonton", offset: "MST", ko: "에드먼턴" },
    { label: "Frankfurt", zone: "Europe/Berlin", offset: "CET", ko: "프랑크푸르트" },
    { label: "Guatemala City", zone: "America/Guatemala", offset: "CST", ko: "과테말라" },
    { label: "Halifax", zone: "America/Halifax", offset: "AST", ko: "해리팩스" },
    { label: "Hanoi", zone: "Asia/Bangkok", offset: "ICT", ko: "하노이" },
    { label: "Harare", zone: "Africa/Harare", offset: "CAT", ko: "하라레" },
    { label: "Havana", zone: "America/Havana", offset: "CST", ko: "하바나 아바나" },
    { label: "Helsinki", zone: "Europe/Helsinki", offset: "EET", ko: "헬싱키" },
    { label: "Hong Kong", zone: "Asia/Hong_Kong", offset: "HKT", ko: "홍콩" },
    { label: "Honolulu", zone: "Pacific/Honolulu", offset: "HST", ko: "호놀룰루 하와이" },
    { label: "Houston", zone: "America/Chicago", offset: "CST", ko: "휴스턴" },
    { label: "Indianapolis", zone: "America/Indiana/Indianapolis", offset: "EST", ko: "인디애나폴리스" },
    { label: "Islamabad", zone: "Asia/Karachi", offset: "PKT", ko: "이슬라마바드" },
    { label: "Istanbul", zone: "Europe/Istanbul", offset: "+03", ko: "이스탄불" },
    { label: "Jakarta", zone: "Asia/Jakarta", offset: "WIB", ko: "자카르타" },
    { label: "Jerusalem", zone: "Asia/Jerusalem", offset: "IST", ko: "예루살렘" },
    { label: "Johannesburg", zone: "Africa/Johannesburg", offset: "SAST", ko: "요하네스버그" },
    { label: "Kabul", zone: "Asia/Kabul", offset: "+0430", ko: "카불" },
    { label: "Karachi", zone: "Asia/Karachi", offset: "PKT", ko: "카라치" },
    { label: "Kathmandu", zone: "Asia/Kathmandu", offset: "+0545", ko: "카트만두" },
    { label: "Khartum", zone: "Africa/Khartoum", offset: "CAT", ko: "하르툼" },
    { label: "Kingston", zone: "America/Jamaica", offset: "EST", ko: "킹스턴" },
    { label: "Kinshasa", zone: "Africa/Kinshasa", offset: "WAT", ko: "킨샤사" },
    { label: "Kolkata", zone: "Asia/Kolkata", offset: "IST", ko: "콜카타" },
    { label: "Kuala Lumpur", zone: "Asia/Kuala_Lumpur", offset: "MYT", ko: "쿠알라룸푸르" },
    { label: "Kuwait City", zone: "Asia/Kuwait", offset: "+03", ko: "쿠웨이트" },
    { label: "Kyiv", zone: "Europe/Kyiv", offset: "EET", ko: "키이우 키예프" },
    { label: "La Paz", zone: "America/La_Paz", offset: "-04", ko: "라파스" },
    { label: "Lagos", zone: "Africa/Lagos", offset: "WAT", ko: "라고스" },
    { label: "Lahore", zone: "Asia/Karachi", offset: "PKT", ko: "라호르" },
    { label: "Lima", zone: "America/Lima", offset: "-05", ko: "리마" },
    { label: "Lisbon", zone: "Europe/Lisbon", offset: "WET", ko: "리스본" },
    { label: "London", zone: "Europe/London", offset: "GMT", ko: "런던" },
    { label: "Los Angeles", zone: "America/Los_Angeles", offset: "PST", ko: "로스앤젤레스 LA" },
    { label: "Madrid", zone: "Europe/Madrid", offset: "CET", ko: "마드리드" },
    { label: "Manila", zone: "Asia/Manila", offset: "PST", ko: "마닐라" },
    { label: "Melbourne", zone: "Australia/Melbourne", offset: "AEDT", ko: "멜버른" },
    { label: "Mexico City", zone: "America/Mexico_City", offset: "CST", ko: "멕시코시티" },
    { label: "Miami", zone: "America/New_York", offset: "EST", ko: "마이애미" },
    { label: "Minneapolis", zone: "America/Chicago", offset: "CST", ko: "미니애폴리스" },
    { label: "Minsk", zone: "Europe/Minsk", offset: "+03", ko: "민스크" },
    { label: "Montevideo", zone: "America/Montevideo", offset: "-03", ko: "몬테비데오" },
    { label: "Montreal", zone: "America/Toronto", offset: "EST", ko: "몬트리올" },
    { label: "Moscow", zone: "Europe/Moscow", offset: "MSK", ko: "모스크바" },
    { label: "Mumbai", zone: "Asia/Kolkata", offset: "IST", ko: "뭄바이" },
    { label: "Nairobi", zone: "Africa/Nairobi", offset: "EAT", ko: "나이로비" },
    { label: "Nassau", zone: "America/Nassau", offset: "EST", ko: "나소" },
    { label: "New Delhi", zone: "Asia/Kolkata", offset: "IST", ko: "뉴델리" },
    { label: "New Orleans", zone: "America/Chicago", offset: "CST", ko: "뉴올리언스" },
    { label: "New York", zone: "America/New_York", offset: "EST", ko: "뉴욕" },
    { label: "Oslo", zone: "Europe/Oslo", offset: "CET", ko: "오슬로" },
    { label: "Ottawa", zone: "America/Toronto", offset: "EST", ko: "오타와" },
    { label: "Paris", zone: "Europe/Paris", offset: "CET", ko: "파리" },
    { label: "Perth", zone: "Australia/Perth", offset: "AWST", ko: "퍼스" },
    { label: "Philadelphia", zone: "America/New_York", offset: "EST", ko: "필라델피아" },
    { label: "Phoenix", zone: "America/Phoenix", offset: "MST", ko: "피닉스" },
    { label: "Prague", zone: "Europe/Prague", offset: "CET", ko: "프라하" },
    { label: "Reykjavik", zone: "Atlantic/Reykjavik", offset: "GMT", ko: "레이캬비크" },
    { label: "Rio de Janeiro", zone: "America/Sao_Paulo", offset: "-03", ko: "리우데자네이루" },
    { label: "Riyadh", zone: "Asia/Riyadh", offset: "+03", ko: "리야드" },
    { label: "Rome", zone: "Europe/Rome", offset: "CET", ko: "로마" },
    { label: "Salt Lake City", zone: "America/Denver", offset: "MST", ko: "솔트레이크시티" },
    { label: "San Francisco", zone: "America/Los_Angeles", offset: "PST", ko: "샌프란시스코" },
    { label: "San Juan", zone: "America/Puerto_Rico", offset: "AST", ko: "산후안" },
    { label: "San Salvador", zone: "America/El_Salvador", offset: "CST", ko: "산살바도르" },
    { label: "Santiago", zone: "America/Santiago", offset: "-03", ko: "산티아고" },
    { label: "Santo Domingo", zone: "America/Santo_Domingo", offset: "AST", ko: "산토도밍고" },
    { label: "Sao Paulo", zone: "America/Sao_Paulo", offset: "-03", ko: "상파울루" },
    { label: "Seattle", zone: "America/Los_Angeles", offset: "PST", ko: "시애틀" },
    { label: "Seoul", zone: "Asia/Seoul", offset: "KST", ko: "서울" },
    { label: "Shanghai", zone: "Asia/Shanghai", offset: "CST", ko: "상하이 상해" },
    { label: "Singapore", zone: "Asia/Singapore", offset: "SGT", ko: "싱가포르" },
    { label: "Sofia", zone: "Europe/Sofia", offset: "EET", ko: "소피아" },
    { label: "Stockholm", zone: "Europe/Stockholm", offset: "CET", ko: "스톡홀름" },
    { label: "Suva", zone: "Pacific/Fiji", offset: "+12", ko: "수바" },
    { label: "Sydney", zone: "Australia/Sydney", offset: "AEDT", ko: "시드니" },
    { label: "Taipei", zone: "Asia/Taipei", offset: "CST", ko: "타이베이 대만" },
    { label: "Tallinn", zone: "Europe/Tallinn", offset: "EET", ko: "탈린" },
    { label: "Tashkent", zone: "Asia/Tashkent", offset: "+05", ko: "타슈켄트" },
    { label: "Tehran", zone: "Asia/Tehran", offset: "+0330", ko: "테헤란" },
    { label: "Tel Aviv", zone: "Asia/Jerusalem", offset: "IST", ko: "텔아비브" },
    { label: "Tokyo", zone: "Asia/Tokyo", offset: "JST", ko: "도쿄" },
    { label: "Toronto", zone: "America/Toronto", offset: "EST", ko: "토론토" },
    { label: "Vancouver", zone: "America/Vancouver", offset: "PST", ko: "밴쿠버" },
    { label: "Vienna", zone: "Europe/Vienna", offset: "CET", ko: "빈 비엔나" },
    { label: "Warsaw", zone: "Europe/Warsaw", offset: "CET", ko: "바르샤바" },
    { label: "Washington DC", zone: "America/New_York", offset: "EST", ko: "워싱턴" },
    { label: "Yangon", zone: "Asia/Yangon", offset: "+0630", ko: "양곤" },
    { label: "Zurich", zone: "Europe/Zurich", offset: "CET", ko: "취리히" }
];

export default function ClockPage() {
    // --- World Clock State ---
    const [now, setNow] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null); // { label, zone }
    const [isZonePickerOpen, setIsZonePickerOpen] = useState(false);
    const [citySearch, setCitySearch] = useState("");

    // --- Timer State (Milliseconds) ---
    const [timerDuration, setTimerDuration] = useState(60 * 1000); // ms default
    const [timerRemaining, setTimerRemaining] = useState(60 * 1000); // ms
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerInputDetails, setTimerInputDetails] = useState({ min: 1, sec: 0 });
    const [isTimerSetting, setIsTimerSetting] = useState(true);

    const timerEndTimeRef = useRef(0);
    const timerAnimationFrameRef = useRef(null);

    // --- Stopwatch State ---
    const [swElapsed, setSwElapsed] = useState(0); // milliseconds
    const [isSwRunning, setIsSwRunning] = useState(false);
    const [laps, setLaps] = useState([]);
    const swStartTimeRef = useRef(0);
    const swSavedElapsedRef = useRef(0);
    const swAnimationFrameRef = useRef(null);

    // --- Effects ---

    // --- Effects & Logic ---

    // World Clock Update (1s interval)
    useEffect(() => {
        setNow(new Date());
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Reactively compute filtered and sorted list
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

                // Prioritize "Starts With" (index 0)
                if (aIdx === 0 && bIdx !== 0) return -1;
                if (bIdx === 0 && aIdx !== 0) return 1;

                // Otherwise alphabetical
                return a.label.localeCompare(b.label);
            });
    }, [citySearch]);

    // Timer Logic (High precision)
    const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, timerEndTimeRef.current - now);
        setTimerRemaining(remaining);

        if (remaining > 0) {
            timerAnimationFrameRef.current = requestAnimationFrame(updateTimer);
        } else {
            setIsTimerRunning(false);
            setTimerRemaining(0);
        }
    };

    useEffect(() => {
        if (isTimerRunning) {
            // If resuming, calculate new end time based on current remaining
            timerEndTimeRef.current = Date.now() + timerRemaining;
            timerAnimationFrameRef.current = requestAnimationFrame(updateTimer);
        } else {
            if (timerAnimationFrameRef.current) cancelAnimationFrame(timerAnimationFrameRef.current);
        }
        return () => {
            if (timerAnimationFrameRef.current) cancelAnimationFrame(timerAnimationFrameRef.current);
        };
    }, [isTimerRunning]);

    // Stopwatch Logic (High precision)
    const updateStopwatch = () => {
        const currentTime = Date.now();
        setSwElapsed(swSavedElapsedRef.current + (currentTime - swStartTimeRef.current));
        swAnimationFrameRef.current = requestAnimationFrame(updateStopwatch);
    };

    useEffect(() => {
        if (isSwRunning) {
            swStartTimeRef.current = Date.now();
            swAnimationFrameRef.current = requestAnimationFrame(updateStopwatch);
        } else {
            if (swAnimationFrameRef.current) cancelAnimationFrame(swAnimationFrameRef.current);
            swSavedElapsedRef.current = swElapsed;
        }
        return () => {
            if (swAnimationFrameRef.current) cancelAnimationFrame(swAnimationFrameRef.current);
        };
    }, [isSwRunning]);

    // --- Helpers ---

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

    const formatStopwatch = (ms) => {
        const totalSec = Math.floor(ms / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        const cis = Math.floor((ms % 1000) / 10); // centiseconds
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${cis
            .toString()
            .padStart(2, "0")}`;
    };

    // --- Handlers ---

    const handleTimerStart = () => {
        if (isTimerSetting) {
            const totalMs = (parseInt(timerInputDetails.min) * 60 + parseInt(timerInputDetails.sec)) * 1000;
            setTimerDuration(totalMs);
            setTimerRemaining(totalMs);
            setIsTimerSetting(false);
        }
        setIsTimerRunning(true);
    };

    const handleTimerReset = () => {
        setIsTimerRunning(false);
        setIsTimerSetting(true);
        setTimerRemaining(0);
        if (timerAnimationFrameRef.current) cancelAnimationFrame(timerAnimationFrameRef.current);
    };

    const handleSwLap = () => {
        setLaps((prev) => [swElapsed, ...prev]);
    };

    const handleSwReset = () => {
        setIsSwRunning(false);
        setSwElapsed(0);
        setLaps([]);
        swSavedElapsedRef.current = 0;
    };

    return (
        <div className="min-h-screen text-white pt-4 pb-20 px-6 font-sans selection:bg-rose-500 selection:text-white">
            <div className="max-w-4xl mx-auto space-y-4">

                {/* --- Header: World Clock --- */}
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

                {/* --- Timer Section --- */}
                <section className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <div className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-xl flex flex-col items-center gap-8 relative overflow-hidden">
                        <h2 className="text-2xl font-bold text-white/80 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Timer
                        </h2>

                        {isTimerSetting ? (
                            <div className="flex items-center gap-4 text-4xl md:text-6xl font-light">
                                <div className="flex flex-col gap-2 items-center">
                                    <input
                                        type="number"
                                        min="0"
                                        value={timerInputDetails.min}
                                        onChange={(e) => setTimerInputDetails({ ...timerInputDetails, min: e.target.value })}
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
                                        value={timerInputDetails.sec}
                                        onChange={(e) => setTimerInputDetails({ ...timerInputDetails, sec: e.target.value })}
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
                                {formatStopwatch(timerRemaining)}
                            </div>
                        )}

                        <div className="flex gap-4">
                            {isTimerSetting ? (
                                <button
                                    onClick={handleTimerStart}
                                    className="px-8 py-3 bg-rose-500 hover:bg-rose-600 rounded-full font-bold text-white transition-all shadow-lg hover:shadow-rose-500/30 flex items-center gap-2"
                                >
                                    <Play size={18} fill="currentColor" /> Start Timer
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                                        className={`px-8 py-3 rounded-full font-bold text-white transition-all shadow-lg flex items-center gap-2 ${isTimerRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"
                                            }`}
                                    >
                                        {isTimerRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                                        {isTimerRunning ? "Pause" : "Resume"}
                                    </button>
                                    <button
                                        onClick={handleTimerReset}
                                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold text-white transition-all flex items-center gap-2"
                                    >
                                        <RotateCcw size={18} /> Reset
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* --- Stopwatch Section --- */}
                <section className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                    <div className="bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-4 shadow-xl flex flex-col md:flex-row gap-4 items-start">

                        {/* Stopwatch Controls & Display */}
                        <div className="flex-1 w-full flex flex-col items-center gap-4">
                            <h2 className="text-2xl font-bold text-white/80 flex items-center gap-2 self-start">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Stopwatch
                            </h2>

                            <div className="relative">
                                <div className="text-6xl md:text-8xl font-mono tracking-tighter tabular-nums px-4 py-8 text-white">
                                    {formatStopwatch(swElapsed)}
                                </div>
                            </div>

                            <div className="flex gap-4 w-full justify-center">
                                <button
                                    onClick={() => setIsSwRunning(!isSwRunning)}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${isSwRunning
                                        ? "bg-red-500/20 text-red-400 border-2 border-red-500/50 hover:bg-red-500 hover:text-white"
                                        : "bg-blue-500/20 text-blue-400 border-2 border-blue-500/50 hover:bg-blue-500 hover:text-white"
                                        }`}
                                >
                                    {isSwRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                </button>

                                <button
                                    onClick={handleSwLap}
                                    disabled={!isSwRunning}
                                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all bg-white/5 text-white/80 border-2 border-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Flag size={20} />
                                </button>

                                <button
                                    onClick={handleSwReset}
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
                                {laps.map((lap, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <span className="text-white/50 text-sm font-mono">#{laps.length - idx}</span>
                                        <span className="font-mono text-lg">{formatStopwatch(lap)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* --- Zone Picker Modal --- */}
            {isZonePickerOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#1e293b] rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col">
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

            <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
        }
      `}</style>
        </div>
    );
}
