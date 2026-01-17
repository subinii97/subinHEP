"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import { supabase } from "@/lib/supabase";

export default function InternalPage() {
    const [authId, setAuthId] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState("");

    const [apps, setApps] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    // Forms
    const [showAppForm, setShowAppForm] = useState(false);
    const [newApp, setNewApp] = useState({ university: "", status: "Considering", deadline: "", notes: "", timezone: "Local" });
    const [editingApp, setEditingApp] = useState(null); // 수정 중인 박사 지원 정보
    const [selectedApp, setSelectedApp] = useState(null); // 상세 보기 중인 박사 지원 정보
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [newSchedule, setNewSchedule] = useState({ title: "", category: "Research", event_date: "", timezone: "Local" });
    const [editingSchedule, setEditingSchedule] = useState(null); // 수정 중인 스케줄

    const TIMEZONES = [
        { label: 'Local (Device Time)', value: 'Local', offset: null },
        { label: 'UTC', value: 'UTC', offset: 0 },
        { label: 'KST (UTC+9)', value: 'KST', offset: 9 },
        { label: 'CET (UTC+1)', value: 'CET', offset: 1 },
        { label: 'CEST (UTC+2)', value: 'CEST', offset: 2 },
        { label: 'EST (UTC-5)', value: 'EST', offset: -5 },
        { label: 'EDT (UTC-4)', value: 'EDT', offset: -4 },
        { label: 'PST (UTC-8)', value: 'PST', offset: -8 },
        { label: 'PDT (UTC-7)', value: 'PDT', offset: -7 },
    ];

    const formatDateWithTimezone = (dateString, timezoneValue) => {
        if (!dateString) return '-';
        const d = new Date(dateString);

        // Helper to format as YYYY.MM.DD HH:mm
        const getBase = (dt) => {
            const y = dt.getFullYear();
            const m = String(dt.getMonth() + 1).padStart(2, '0');
            const day = String(dt.getDate()).padStart(2, '0');
            const hh = String(dt.getHours()).padStart(2, '0');
            const minmin = String(dt.getMinutes()).padStart(2, '0');
            return `${y}.${m}.${day} ${hh}:${minmin}`;
        };

        if (!timezoneValue || timezoneValue === 'Local') {
            return getBase(d);
        }

        const str = String(dateString);

        // 1. Try ISO-like format: YYYY-MM-DD (or / .)
        const isoMatch = str.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T\s](\d{1,2}):(\d{2}))?/);
        if (isoMatch) {
            const [_, y, m, day, h, min] = isoMatch;
            const mm = m.padStart(2, '0');
            const dd = day.padStart(2, '0');
            const hh = (h || '00').padStart(2, '0');
            const minmin = (min || '00').padStart(2, '0');
            return `${y}.${mm}.${dd} ${hh}:${minmin} (${timezoneValue})`;
        }

        // 2. Try US format: MM/DD/YYYY
        const usMatch = str.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})(?:[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(AM|PM))?)?/i);
        if (usMatch) {
            let [_, m, day, y, h, min, sec, ampm] = usMatch;
            const mm = m.padStart(2, '0');
            const dd = day.padStart(2, '0');
            let hour = parseInt(h || '0');
            if (ampm) {
                if (ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
                if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
            }
            const hh = String(hour).padStart(2, '0');
            const minmin = (min || '00').padStart(2, '0');
            return `${y}.${mm}.${dd} ${hh}:${minmin} (${timezoneValue})`;
        }

        // 3. Fallback: Just return the raw string to avoid timezone shifting
        return str + ` (${timezoneValue})`;
    };

    const formatForInput = (dateString) => {
        if (!dateString) return "";
        const str = String(dateString);

        // 1. Try ISO: YYYY-MM-DD...
        const isoMatch = str.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T\s](\d{1,2}):(\d{2}))?/);
        if (isoMatch) {
            const [_, y, m, d, h, min] = isoMatch;
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${(h || '00').padStart(2, '0')}:${(min || '00').padStart(2, '0')}`;
        }

        // 2. Try US: MM/DD/YYYY...
        const usMatch = str.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})(?:[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(AM|PM))?)?/i);
        if (usMatch) {
            let [_, m, d, y, h, min, sec, ampm] = usMatch;
            let hour = parseInt(h || '0');
            if (ampm) {
                if (ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
                if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
            }
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${String(hour).padStart(2, '0')}:${(min || '00').padStart(2, '0')}`;
        }

        return "";
    };

    const renderNotesWithLinks = (text) => {
        if (!text) return '—';
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 transition-all font-medium"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    const CORRECT_ID = process.env.NEXT_PUBLIC_INTERNAL_ID;
    const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_INTERNAL_PASSWORD;

    const handleLogin = (e) => {
        e.preventDefault();

        if (!CORRECT_ID || !CORRECT_PASSWORD) {
            setError("System configuration error: Credentials not loaded. Please restart the server.");
            return;
        }

        if (authId.trim() === CORRECT_ID && authPassword === CORRECT_PASSWORD) {
            setIsAuthenticated(true);
            setError("");
            sessionStorage.setItem("internal_auth", "true");
        } else {
            setError("Incorrect credentials.");
        }
    };

    useEffect(() => {
        const auth = sessionStorage.getItem("internal_auth");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: appData } = await supabase.from("phd_applications").select("*").order("deadline", { ascending: true });
            const { data: scheduleData } = await supabase.from("schedules").select("*").order("event_date", { ascending: true });
            setApps(appData || []);
            setSchedules(scheduleData || []);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const getUpcomingTasks = () => {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const upcomingApps = apps
            .filter(app => {
                const deadline = new Date(app.deadline);
                return deadline >= now && deadline <= nextWeek;
            })
            .map(app => ({
                id: `app-${app.id}`,
                title: `${app.university} Deadline`,
                date: app.deadline,
                type: 'deadline',
                urgency: 'high'
            }));

        const upcomingSchedules = schedules
            .filter(s => {
                const eventDate = new Date(s.event_date);
                return eventDate >= now && eventDate <= nextWeek;
            })
            .map(s => ({
                id: `sched-${s.id}`,
                title: s.title,
                date: s.event_date,
                type: 'event',
                urgency: 'medium'
            }));

        return [...upcomingApps, ...upcomingSchedules].sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const upcomingTasks = getUpcomingTasks();

    const addApp = async (e) => {
        e.preventDefault();
        const payload = {
            university: newApp.university,
            status: newApp.status,
            notes: newApp.notes,
            deadline: newApp.deadline, // Raw string 저장
            timezone: newApp.timezone // DB 저장을 위해 추가
        };

        if (editingApp) {
            const { error } = await supabase.from("phd_applications").update(payload).eq("id", editingApp.id);

            if (!error) {
                setShowAppForm(false);
                setNewApp({ university: "", status: "Considering", deadline: "", notes: "", timezone: "Local" });
                setEditingApp(null);
                fetchData();
            }
        } else {
            const { error } = await supabase.from("phd_applications").insert([payload]);
            if (!error) {
                setShowAppForm(false);
                setNewApp({ university: "", status: "Considering", deadline: "", notes: "", timezone: "Local" });
                fetchData();
            }
        }
    };

    const deleteApp = async (id) => {
        if (confirm("Are you sure you want to delete this application?")) {
            const { error } = await supabase.from("phd_applications").delete().eq("id", id);
            if (!error) fetchData();
        }
    };

    const startEditApp = (item) => {
        setNewApp({
            university: item.university,
            status: item.status,
            deadline: formatForInput(item.deadline), // Robust formatting for input
            notes: item.notes || "",
            timezone: item.timezone || "Local"
        });
        setEditingApp(item);
        setShowAppForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 맨 위로
    };

    const addSchedule = async (e) => {
        e.preventDefault();

        // 날짜/시간을 Raw String으로 저장
        const payload = {
            title: newSchedule.title,
            category: newSchedule.category,
            event_date: newSchedule.event_date,
            timezone: newSchedule.timezone // DB 저장을 위해 추가
        };

        if (editingSchedule) {
            const { error } = await supabase.from("schedules").update(payload).eq("id", editingSchedule.id);

            if (!error) {
                setShowScheduleForm(false);
                setNewSchedule({ title: "", category: "Research", event_date: "", timezone: "Local" });
                setEditingSchedule(null);
                fetchData();
            }
        } else {
            const { error } = await supabase.from("schedules").insert([payload]);
            if (!error) {
                setShowScheduleForm(false);
                setNewSchedule({ title: "", category: "Research", event_date: "", timezone: "Local" });
                fetchData();
            }
        }
    };

    const deleteSchedule = async (id) => {
        if (confirm("Are you sure you want to delete this event?")) {
            const { error } = await supabase.from("schedules").delete().eq("id", id);
            if (!error) fetchData();
        }
    };

    const startEditSchedule = (item) => {
        setNewSchedule({
            title: item.title,
            category: item.category,
            event_date: formatForInput(item.event_date), // Robust formatting for input
            timezone: item.timezone || "Local"
        });
        setEditingSchedule(item);
        setShowScheduleForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [showPassword, setShowPassword] = useState(false);

    if (!isAuthenticated) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#718eac]/20 rounded-2xl flex items-center justify-center text-[#718eac] text-3xl mx-auto mb-4">
                            🔒
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Internal Gate</h1>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="text"
                            value={authId}
                            onChange={(e) => setAuthId(e.target.value)}
                            placeholder="ID"
                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#718eac]/50 transition-all font-mono"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={authPassword}
                                onChange={(e) => setAuthPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#718eac]/50 transition-all font-mono"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </button>
                        </div>
                        {error && <p className="text-red-400 text-sm mt-2 ml-2">{error}</p>}
                        <Button type="submit" className="w-full py-4 rounded-2xl text-lg font-bold">Access</Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                <div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-2">Internal Hub</h1>
                </div>
                <button
                    onClick={() => { sessionStorage.removeItem("internal_auth"); setIsAuthenticated(false); }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white/60 text-sm border border-white/10 transition-all font-medium"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* PhD Application Status Card */}
                <Link href="/internal/phd" className="group relative overflow-hidden p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)] flex flex-col items-center text-center space-y-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-20 h-20 bg-purple-500/20 rounded-3xl flex items-center justify-center text-purple-400 text-4xl group-hover:scale-110 transition-transform duration-500">
                        🎓
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">PhD Application Status</h2>
                        <p className="text-white/40 leading-relaxed font-medium">Manage university programs, track deadlines, and update application milestones in full-width detail.</p>
                    </div>
                    <div className="pt-4">
                        <span className="px-6 py-2.5 bg-white/10 rounded-xl text-white/80 text-sm font-bold border border-white/10 group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500 transition-all duration-300">Open Dashboard</span>
                    </div>
                </Link>

                {/* Schedule & Calendar Card */}
                <Link href="/internal/schedule" className="group relative overflow-hidden p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] flex flex-col items-center text-center space-y-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center text-blue-400 text-4xl group-hover:scale-110 transition-transform duration-500">
                        📅
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Schedule & Calendar</h2>
                        <p className="text-white/40 leading-relaxed font-medium">View events in a dedicated calendar view and manage research milestones, meetings, and deadlines.</p>
                    </div>
                    <div className="pt-4">
                        <span className="px-6 py-2.5 bg-white/10 rounded-xl text-white/80 text-sm font-bold border border-white/10 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">Open Calendar</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
