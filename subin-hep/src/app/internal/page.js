"use client";

import { useState, useEffect } from "react";
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
    const [newApp, setNewApp] = useState({ university: "", status: "In Progress", deadline: "", notes: "", timezone: "Local" });
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
                setNewApp({ university: "", status: "In Progress", deadline: "", notes: "", timezone: "Local" });
                setEditingApp(null);
                fetchData();
            }
        } else {
            const { error } = await supabase.from("phd_applications").insert([payload]);
            if (!error) {
                setShowAppForm(false);
                setNewApp({ university: "", status: "In Progress", deadline: "", notes: "", timezone: "Local" });
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

            {/* Main Content Grid: 3 Columns total (2 for PhD, 1 for Schedule) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* PhD App Board (Left, 2 Columns) */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm">🎓</span>
                                PhD Application Status
                            </h2>
                            <button onClick={() => {
                                setShowAppForm(!showAppForm);
                                setEditingApp(null);
                                const nowISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                                setNewApp({ university: "", status: "In Progress", deadline: nowISO, notes: "", timezone: "Local" });
                            }} className="text-[#E6E6FA] text-sm font-medium hover:underline">
                                {showAppForm ? "Cancel" : "+ Add Program"}
                            </button>
                        </div>

                        {showAppForm && (
                            <form onSubmit={addApp} className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-[#718eac]/30 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                                <div className="space-y-1">
                                    <label className="text-white/40 text-[10px] font-bold uppercase ml-2">University / Program</label>
                                    <input value={newApp.university} onChange={e => setNewApp({ ...newApp, university: e.target.value })} placeholder="e.g. Stanford University" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#718eac] transition-all" required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-white/40 text-[10px] font-bold uppercase ml-2">Status</label>
                                    <select value={newApp.status} onChange={e => setNewApp({ ...newApp, status: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#718eac] transition-all appearance-none">
                                        <option value="In Progress">In Progress</option>
                                        <option value="Submitted">Submitted</option>
                                        <option value="Interview">Interview</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Considering">Considering</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-white/40 text-[10px] font-bold uppercase ml-2">Deadline & Timezone</label>
                                    <div className="flex gap-2">
                                        <input type="datetime-local" value={newApp.deadline} onChange={e => setNewApp({ ...newApp, deadline: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#718eac] transition-all" />
                                        <select value={newApp.timezone} onChange={e => setNewApp({ ...newApp, timezone: e.target.value })} className="w-24 px-2 py-3 bg-white/5 border border-white/10 rounded-2xl text-white outline-none text-xs">
                                            {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.value}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-white/40 text-[10px] font-bold uppercase ml-2">Notes</label>
                                    <input value={newApp.notes} onChange={e => setNewApp({ ...newApp, notes: e.target.value })} placeholder="Details or missing docs..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#718eac] transition-all" />
                                </div>
                                <Button type="submit" className="md:col-span-2 py-4 rounded-2xl text-lg font-bold">
                                    {editingApp ? "Update Application" : "Register Program"}
                                </Button>
                            </form>
                        )}

                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
                            <table className="w-full text-left border-collapse table-fixed">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/10">
                                        <th className="w-48 px-6 py-5 text-white/80 text-[10px] font-bold uppercase tracking-widest border-r border-white/10 text-center">University</th>
                                        <th className="w-28 px-6 py-5 text-white/80 text-[10px] font-bold uppercase tracking-widest border-r border-white/10 text-center">Status</th>
                                        <th className="w-40 px-6 py-5 text-white/80 text-[10px] font-bold uppercase tracking-widest border-r border-white/10 text-center">Deadline</th>
                                        <th className="w-auto px-6 py-5 text-white/80 text-[10px] font-bold uppercase tracking-widest text-center">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-white/80">
                                    {apps.map((app, i) => (
                                        <tr key={i} onClick={() => setSelectedApp(app)} className="hover:bg-white/5 transition-all group cursor-pointer">
                                            <td className="px-6 py-5 font-bold text-white transition-colors border-r border-white/5">{app.university}</td>
                                            <td className="px-6 py-5 border-r border-white/5">
                                                <div className="flex justify-center">
                                                    <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-tight ${app.status === 'Accepted' ? 'bg-green-500/20 text-green-400' :
                                                        app.status === 'Interview' ? 'bg-blue-500/20 text-blue-400' :
                                                            app.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                                                                app.status === 'Considering' ? 'bg-gray-500/20 text-gray-400' :
                                                                    'bg-yellow-500/20 text-yellow-500'
                                                        }`}>{app.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-mono text-white/70 border-r border-white/5 text-center">
                                                {(() => {
                                                    const formatted = formatDateWithTimezone(app.deadline, app.timezone);
                                                    // New Pattern: "YYYY.MM.DD HH:mm (TZ)" -> split into "YYYY.MM.DD" and "HH:mm (TZ)"
                                                    const match = formatted.match(/^(\d{4}\.\d{2}\.\d{2}) (.*)$/);
                                                    if (match) {
                                                        return (
                                                            <div className="flex flex-col items-center">
                                                                <span className="whitespace-nowrap">{match[1]}</span>
                                                                <span className="text-[10px] text-white/40 font-bold tracking-wider">{match[2]}</span>
                                                            </div>
                                                        );
                                                    }
                                                    return formatted;
                                                })()}
                                            </td>
                                            <td className="px-6 py-5 text-base text-white/70 italic">{renderNotesWithLinks(app.notes)}</td>
                                        </tr>
                                    ))}
                                    {apps.length === 0 && !loading && (
                                        <tr><td colSpan="4" className="px-6 py-16 text-center text-white/20 italic font-medium">No application data found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Schedule Section (Right, 1 Column) */}
                <div className="lg:col-span-1 space-y-6">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm">📅</span>
                                Schedule
                            </h2>
                            <button onClick={() => {
                                setShowScheduleForm(!showScheduleForm);
                                setEditingSchedule(null);
                                const nowISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                                setNewSchedule({ title: "", category: "Research", event_date: nowISO, timezone: "Local" });
                            }} className="text-[#E6E6FA] text-sm font-medium hover:underline">
                                {showScheduleForm ? "Cancel" : "+ New Event"}
                            </button>
                        </div>

                        {showScheduleForm && (
                            <form onSubmit={addSchedule} className="p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-[#718eac]/30 space-y-4 animate-in slide-in-from-top-2">
                                <input value={newSchedule.title} onChange={e => setNewSchedule({ ...newSchedule, title: e.target.value })} placeholder="Event Title" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#718eac] transition-all" required />
                                <div className="space-y-2">
                                    <select value={newSchedule.category} onChange={e => setNewSchedule({ ...newSchedule, category: e.target.value })} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none">
                                        <option value="Research">Research</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Deadline">Deadline</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <input type="datetime-local" value={newSchedule.event_date} onChange={e => setNewSchedule({ ...newSchedule, event_date: e.target.value })} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none" />
                                        <select value={newSchedule.timezone} onChange={e => setNewSchedule({ ...newSchedule, timezone: e.target.value })} className="w-24 px-2 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none text-xs">
                                            {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.value}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full py-4 rounded-2xl font-bold">
                                    {editingSchedule ? "Update Event" : "Push to Timeline"}
                                </Button>
                            </form>
                        )}

                        <div className="space-y-4">
                            {schedules.map((item, i) => (
                                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.category === 'Research' ? 'text-purple-400' :
                                            item.category === 'Meeting' ? 'text-blue-400' :
                                                item.category === 'Deadline' ? 'text-red-400' : 'text-white/80'
                                            }`}>{item.category}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => startEditSchedule(item)} className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[11px] text-white font-bold transition-colors">Edit</button>
                                            <button onClick={() => deleteSchedule(item.id)} className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-[11px] text-red-400 font-bold transition-colors">Delete</button>
                                        </div>
                                    </div>

                                    <h4 className="text-white font-bold text-lg mb-2">{item.title}</h4>

                                    <div className="flex items-center gap-2 text-white/70 text-sm font-mono">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        {formatDateWithTimezone(item.event_date, item.timezone)}
                                    </div>
                                </div>
                            ))}
                            {schedules.length === 0 && !loading && (
                                <div className="p-12 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center">
                                    <p className="text-white/20 font-medium">No scheduled events.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
            {/* PhD Application Detail Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedApp(null)}></div>
                    <div className="relative w-full max-w-lg bg-[#6b7887] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-8 pb-0 flex justify-between items-start">
                            <div className="space-y-1">
                                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-tight ${selectedApp.status === 'Accepted' ? 'bg-green-500/20 text-green-400' :
                                    selectedApp.status === 'Interview' ? 'bg-blue-500/20 text-blue-400' :
                                        selectedApp.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                                            selectedApp.status === 'Considering' ? 'bg-gray-500/20 text-gray-400' :
                                                'bg-yellow-500/10 text-yellow-500'
                                    }`}>{selectedApp.status}</span>
                                <h3 className="text-2xl font-bold text-[#FFF2E0] mt-2">{selectedApp.university}</h3>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-[#FFF2E0]/40 group transition-all">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[#FFF2E0]/40 text-[10px] font-bold uppercase tracking-widest block ml-1">Deadline</label>
                                <div className="px-5 py-4 bg-black/10 rounded-2xl border border-white/5 flex items-center gap-4">
                                    <span className="text-xl">📅</span>
                                    {(() => {
                                        const formatted = formatDateWithTimezone(selectedApp.deadline, selectedApp.timezone);
                                        const match = formatted.match(/^(\d{4}\.\d{2}\.\d{2}) (.*)$/);
                                        if (match) {
                                            return (
                                                <div className="flex flex-col">
                                                    <span className="text-[#FFF2E0] font-mono text-xl font-bold">{match[1]}</span>
                                                    <span className="text-[#FFF2E0]/50 font-mono text-xs font-bold tracking-wider">{match[2]}</span>
                                                </div>
                                            );
                                        }
                                        return <span className="text-[#FFF2E0] font-mono text-lg">{formatted}</span>;
                                    })()}
                                </div>
                            </div>

                            {selectedApp.notes && (
                                <div className="space-y-2">
                                    <label className="text-[#FFF2E0]/40 text-[10px] font-bold uppercase tracking-widest block ml-1">Notes</label>
                                    <div className="px-5 py-4 bg-black/10 rounded-2xl border border-white/5 text-[#FFF2E0]/90 italic leading-relaxed whitespace-pre-wrap text-base">
                                        {renderNotesWithLinks(selectedApp.notes)}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-white/10">
                                <button
                                    onClick={() => { startEditApp(selectedApp); setSelectedApp(null); }}
                                    className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-bold transition-all border border-white/10 flex items-center justify-center"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => { deleteApp(selectedApp.id); setSelectedApp(null); }}
                                    className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-100 text-sm font-bold transition-all border border-red-500/20 flex items-center justify-center"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
