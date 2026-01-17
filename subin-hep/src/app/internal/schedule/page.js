"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import { supabase } from "@/lib/supabase";

export default function ScheduleBoard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [phdDeadlines, setPhdDeadlines] = useState([]);
    const [loading, setLoading] = useState(true);

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showEventForm, setShowEventForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [selectedPhd, setSelectedPhd] = useState(null);
    const [newSchedule, setNewSchedule] = useState({ title: "", category: "purple", notes: "", event_date: "", timezone: "Local" });
    const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);

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

    useEffect(() => {
        const auth = sessionStorage.getItem("internal_auth");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchSchedules();
        }
    }, [isAuthenticated]);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const { data: scheduleData } = await supabase.from("schedules").select("*").order("event_date", { ascending: true });
            setSchedules(scheduleData || []);

            const { data: phdData } = await supabase.from("phd_applications").select("*").order("deadline", { ascending: true });
            setPhdDeadlines(phdData || []);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDateWithTimezone = (dateString, timezoneValue) => {
        if (!dateString) return '-';
        const d = new Date(dateString);
        const getBase = (dt) => {
            const y = dt.getFullYear();
            const m = String(dt.getMonth() + 1).padStart(2, '0');
            const day = String(dt.getDate()).padStart(2, '0');
            const hh = String(dt.getHours()).padStart(2, '0');
            const minmin = String(dt.getMinutes()).padStart(2, '0');
            return `${y}.${m}.${day} ${hh}:${minmin}`;
        };
        if (!timezoneValue || timezoneValue === 'Local') return getBase(d);
        const str = String(dateString);
        const isoMatch = str.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T\s](\d{1,2}):(\d{2}))?/);
        if (isoMatch) {
            const [_, y, m, day, h, min] = isoMatch;
            return `${y}.${m.padStart(2, '0')}.${day.padStart(2, '0')} ${h || '00'}:${min || '00'} (${timezoneValue})`;
        }
        return str + ` (${timezoneValue})`;
    };

    const renderNotesWithLinks = (text) => {
        if (!text) return '—';
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 transition-all font-medium" onClick={(e) => e.stopPropagation()}>
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    const formatForInput = (dateString) => {
        if (!dateString) return "";
        const str = String(dateString);
        const isoMatch = str.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T\s](\d{1,2}):(\d{2}))?/);
        if (isoMatch) {
            const [_, y, m, d, h, min] = isoMatch;
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${(h || '00').padStart(2, '0')}:${(min || '00').padStart(2, '0')}`;
        }
        return "";
    };

    const addSchedule = async (e) => {
        e.preventDefault();
        const payload = {
            title: newSchedule.title,
            category: newSchedule.category,
            // notes is intentionally omitted here as it's not in the DB schema
            event_date: newSchedule.event_date,
            timezone: newSchedule.timezone
        };

        if (editingSchedule) {
            const { error } = await supabase.from("schedules").update(payload).eq("id", editingSchedule.id);
            if (!error) {
                setShowEventForm(false);
                setNewSchedule({ title: "", category: "Research", event_date: "", timezone: "Local" });
                setEditingSchedule(null);
                fetchSchedules();
            }
        } else {
            const { error } = await supabase.from("schedules").insert([payload]);
            if (!error) {
                setShowEventForm(false);
                setNewSchedule({ title: "", category: "Research", event_date: "", timezone: "Local" });
                fetchSchedules();
            }
        }
    };

    const deleteSchedule = async (id) => {
        if (confirm("Are you sure you want to delete this event?")) {
            const { error } = await supabase.from("schedules").delete().eq("id", id);
            if (!error) fetchSchedules();
        }
    };

    const startEditSchedule = (item) => {
        setNewSchedule({
            title: item.title,
            category: item.category || 'purple',
            notes: item.notes || "",
            event_date: formatForInput(item.event_date),
            timezone: item.timezone || "Local"
        });
        setEditingSchedule(item);
        setShowEventForm(true);
    };

    // Calendar generation
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startOffset = firstDay.getDay(); // 0(Sun) - 6(Sat)

        const calendar = [];

        // Prev month padding
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startOffset - 1; i >= 0; i--) {
            calendar.push({
                day: prevMonthLastDay - i,
                month: month - 1,
                year,
                isOtherMonth: true
            });
        }

        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
            calendar.push({
                day: i,
                month,
                year,
                isOtherMonth: false
            });
        }

        // Next month padding
        const endOffset = 42 - calendar.length;
        for (let i = 1; i <= endOffset; i++) {
            calendar.push({
                day: i,
                month: month + 1,
                year,
                isOtherMonth: true
            });
        }

        return calendar;
    }, [currentDate]);

    const getEventsForDay = (year, month, day) => {
        const standardEvents = schedules.filter(s => {
            const date = new Date(s.event_date);
            return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
        }).map(s => ({ ...s, type: 'standard' }));

        const phdEvents = [];
        phdDeadlines.forEach(p => {
            // 1. Deadline
            if (p.deadline) {
                const date = new Date(p.deadline);
                if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
                    phdEvents.push({
                        id: `phd-dl-${p.id}`,
                        appId: p.id,
                        title: p.university,
                        category: 'phd',
                        event_date: p.deadline,
                        type: 'phd',
                        status: p.status,
                        label: '[Deadline]'
                    });
                }
            }
            // 2. Interview
            if (p.interview_date) {
                const date = new Date(p.interview_date);
                if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
                    phdEvents.push({
                        id: `phd-iv-${p.id}`,
                        appId: p.id,
                        title: p.university,
                        category: 'purple',
                        event_date: p.interview_date,
                        type: 'phd',
                        status: p.status,
                        label: '[Interview]'
                    });
                }
            }
            // 3. Decision
            if (p.decision_date) {
                const date = new Date(p.decision_date);
                if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
                    phdEvents.push({
                        id: `phd-dec-${p.id}`,
                        appId: p.id,
                        title: p.university,
                        category: p.status === 'Rejected' ? 'red' : 'green',
                        event_date: p.decision_date,
                        type: 'phd',
                        status: p.status,
                        label: p.status === 'Accepted' ? '[Accepted]' : p.status === 'Rejected' ? '[Rejected]' : '[Decision]'
                    });
                }
            }
            // 4. Submission
            if (p.submit_date) {
                const date = new Date(p.submit_date);
                if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
                    phdEvents.push({
                        id: `phd-sub-${p.id}`,
                        appId: p.id,
                        title: p.university,
                        category: 'blue',
                        event_date: p.submit_date,
                        type: 'phd',
                        status: p.status,
                        label: '[Submitted]'
                    });
                }
            }
        });

        return [...standardEvents, ...phdEvents].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
    };

    if (!isAuthenticated) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
            <h1 className="text-3xl font-bold text-white/20">Login Access Required</h1>
            <Link href="/internal" className="px-8 py-3 bg-[#718eac] text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl">Back to Hub Gate</Link>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
                <div>
                    <Link href="/internal" className="text-blue-400 text-sm font-bold flex items-center gap-2 mb-4 hover:translate-x-[-4px] transition-transform">
                        ← Back to Hub
                    </Link>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Event Schedule Tracker</h1>
                </div>
                <button onClick={() => {
                    setShowEventForm(true);
                    setEditingSchedule(null);
                    const nowISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                    setNewSchedule({ title: "", category: "purple", notes: "", event_date: nowISO, timezone: "Local" });
                }} className="px-8 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 rounded-2xl text-white font-bold shadow-xl transition-all hover:scale-105 flex items-center gap-2 group">
                    <span className="text-xl font-bold text-white/80">+</span>
                    New Event
                </button>
            </div>

            {/* Calendar Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 mb-8">
                <div className="hidden md:block"></div> {/* Left spacer */}
                <div className="flex items-center justify-center gap-4">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all">←</button>
                    <h2 className="text-3xl font-black text-white px-2 tracking-tighter text-center min-w-[200px]">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all">→</button>
                </div>
                <div className="flex justify-end">
                    <button onClick={() => setCurrentDate(new Date())} className="px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 rounded-xl text-white font-bold transition-all shadow-xl">Today</button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-2 overflow-hidden shadow-2xl">
                <div className="grid grid-cols-7 gap-px text-center border-b border-white/10">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                        <div key={day} className="py-4 text-[11px] font-black tracking-[0.2em] text-white/70">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-white/5">
                    {calendarDays.map((date, idx) => {
                        const dayEvents = getEventsForDay(date.year, date.month, date.day);
                        const isToday = new Date().toDateString() === new Date(date.year, date.month, date.day).toDateString();

                        return (
                            <div key={idx} className={`min-h-[160px] p-4 bg-white/5 hover:bg-white/10 transition-all group relative overflow-hidden ${date.isOtherMonth ? 'opacity-40' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-sm font-black tracking-tighter ${isToday ? 'bg-blue-500 text-white px-2 py-0.5 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-white/80'}`}>
                                        {date.day}
                                    </span>
                                </div>
                                <div className="space-y-1.5 pt-1">
                                    {dayEvents.map(event => (
                                        <div key={event.id} onClick={(e) => {
                                            e.stopPropagation();
                                            if (event.type === 'phd') {
                                                const app = phdDeadlines.find(p => p.id === event.appId);
                                                if (app) setSelectedPhd(app);
                                            } else {
                                                startEditSchedule(event);
                                            }
                                        }} className={`px-2.5 py-2 rounded-lg text-xs font-black cursor-pointer transition-all hover:scale-[1.03] shadow-lg truncate border backdrop-blur-sm ${event.type === 'phd' ?
                                            event.label === '[Deadline]' ? 'bg-white/10 text-white/90 border-white/20 shadow-none hover:bg-white/20' :
                                                event.label === '[Interview]' ? 'bg-purple-500/40 text-white border-purple-400/50 shadow-purple-500/20' :
                                                    (event.label === '[Decision]' || event.label === '[Accepted]') ? 'bg-green-500/40 text-white border-green-400/50 shadow-green-500/20' :
                                                        event.label === '[Rejected]' ? 'bg-red-500/40 text-white border-red-400/50 shadow-red-500/20' :
                                                            event.label === '[Submitted]' ? 'bg-blue-500/40 text-white border-blue-400/50 shadow-blue-500/20' :
                                                                'bg-blue-400/40 text-white border-blue-300/50' :
                                            event.category === 'purple' ? 'bg-purple-600/80 text-white border-purple-400/50' :
                                                event.category === 'blue' ? 'bg-blue-600/80 text-white border-blue-400/50' :
                                                    event.category === 'red' ? 'bg-red-600/80 text-white border-red-400/50' :
                                                        event.category === 'green' ? 'bg-green-600/80 text-white border-green-400/50' :
                                                            event.category === 'yellow' ? 'bg-yellow-500/80 text-white border-yellow-300/50' :
                                                                'bg-white/30 text-white border-white/50'
                                            }`}>
                                            {event.type === 'phd' && <span className="opacity-60 mr-1">{event.label}</span>}
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Event Form Modal */}
            {showEventForm && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEventForm(false)}></div>
                    <form onSubmit={addSchedule} className="relative w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] p-10 animate-in zoom-in-95 duration-500 space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-3xl font-black text-white tracking-tighter">{editingSchedule ? "Edit Event" : "New Event Entry"}</h3>
                            <button type="button" onClick={() => setShowEventForm(false)} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/30 transition-all hover:rotate-90">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="text-white/40 text-[10px] font-black uppercase ml-2 tracking-widest">Event Title</label>
                            <input value={newSchedule.title} onChange={e => setNewSchedule({ ...newSchedule, title: e.target.value })} placeholder="What's happening?" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-bold placeholder:text-white/20" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-white/40 text-[10px] font-black uppercase ml-2 tracking-widest">Event Color</label>
                            <div className="flex gap-3 px-2">
                                {['purple', 'blue', 'red', 'green', 'yellow'].map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setNewSchedule({ ...newSchedule, category: c })}
                                        className={`w-9 h-9 rounded-full border-4 transition-all ${newSchedule.category === c ? 'border-white/40 scale-110' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-110'} ${c === 'purple' ? 'bg-purple-500' :
                                            c === 'blue' ? 'bg-blue-500' :
                                                c === 'red' ? 'bg-red-500' :
                                                    c === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-white/40 text-[10px] font-black uppercase ml-2 tracking-widest">Date</label>
                                <input type="datetime-local" value={newSchedule.event_date} onChange={e => setNewSchedule({ ...newSchedule, event_date: e.target.value })} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-all font-mono" required />
                            </div>
                            <div className="space-y-1 relative">
                                <label className="text-white/40 text-[10px] font-black uppercase ml-2 tracking-widest">Timezone</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-all text-left font-bold flex items-center justify-between text-xs"
                                    >
                                        <span>{TIMEZONES.find(tz => tz.value === newSchedule.timezone)?.label || newSchedule.timezone}</span>
                                        <span className="text-white/20">▼</span>
                                    </button>

                                    {showTimezoneDropdown && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar">
                                            {TIMEZONES.map((tz) => (
                                                <button
                                                    key={tz.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setNewSchedule({ ...newSchedule, timezone: tz.value });
                                                        setShowTimezoneDropdown(false);
                                                    }}
                                                    className="w-full px-6 py-4 text-left hover:bg-white/5 transition-all font-bold flex items-center justify-between border-b border-white/5 last:border-none text-xs"
                                                >
                                                    <span className="text-white">{tz.label}</span>
                                                    {newSchedule.timezone === tz.value && <span className="text-blue-400">✓</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-white/40 text-[10px] font-black uppercase ml-2 tracking-widest">Additional Notes</label>
                            <textarea value={newSchedule.notes} onChange={e => setNewSchedule({ ...newSchedule, notes: e.target.value })} placeholder="Extra details..." className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-blue-500 transition-all italic min-h-[120px] placeholder:text-white/20" />
                        </div>

                        <div className="pt-4 space-y-3">
                            <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] shadow-xl text-xl font-black transition-all hover:scale-[1.01]">
                                {editingSchedule ? "Update Event" : "Register Event"}
                            </button>
                            {editingSchedule && (
                                <button type="button" onClick={() => deleteSchedule(editingSchedule.id)} className="w-full py-4 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl transition-all">Delete Event</button>
                            )}
                        </div>
                    </form>
                </div>
            )}
            {/* PhD Detail Modal */}
            {selectedPhd && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedPhd(null)}></div>
                    <div className="relative w-full max-w-4xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden animate-in zoom-in-95 duration-500 p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-2">
                                <span className={`px-4 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest inline-block ${selectedPhd.status === 'Accepted' ? 'bg-green-500 text-white' :
                                    selectedPhd.status === 'Interview' ? 'bg-purple-500 text-white' :
                                        selectedPhd.status === 'Submitted' ? 'bg-blue-500 text-white' :
                                            selectedPhd.status === 'Rejected' ? 'bg-red-500 text-white' :
                                                'bg-yellow-500 text-white'
                                    }`}>{selectedPhd.status}</span>
                                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{selectedPhd.university}</h3>
                            </div>
                            <button onClick={() => setSelectedPhd(null)} className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/20 transition-all hover:rotate-90">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-white/80 text-[10px] font-black uppercase tracking-widest block ml-2">Program Deadline</label>
                                    <div className="px-6 py-4 bg-white/5 rounded-xl border border-white/10 text-white font-mono text-lg font-bold">
                                        {formatDateWithTimezone(selectedPhd.deadline, selectedPhd.timezone)}
                                    </div>
                                </div>

                                {selectedPhd.submit_date && (
                                    <div className="space-y-2">
                                        <label className="text-blue-400/80 text-[10px] font-black uppercase tracking-widest block ml-2 text-glow-blue">Submission Recorded</label>
                                        <div className="px-6 py-4 bg-white/5 rounded-xl border border-white/10 text-white font-mono text-lg font-bold">
                                            {formatDateWithTimezone(selectedPhd.submit_date, 'Local')}
                                        </div>
                                    </div>
                                )}

                                {selectedPhd.interview_date && (
                                    <div className="space-y-2">
                                        <label className="text-purple-400/80 text-[10px] font-black uppercase tracking-widest block ml-2 text-glow-purple">Interview Recorded</label>
                                        <div className="px-6 py-4 bg-white/5 rounded-xl border border-white/10 text-white font-mono text-lg font-bold">
                                            {formatDateWithTimezone(selectedPhd.interview_date, 'Local')}
                                        </div>
                                    </div>
                                )}

                                {selectedPhd.decision_date && (
                                    <div className="space-y-2">
                                        <label className={`${selectedPhd.status === 'Rejected' ? 'text-red-400/80 text-glow-red' : 'text-green-400/80 text-glow-green'} text-[10px] font-black uppercase tracking-widest block ml-2`}>Decision Recorded</label>
                                        <div className="px-6 py-4 bg-white/5 rounded-xl border border-white/10 text-white font-mono text-lg font-bold">
                                            {formatDateWithTimezone(selectedPhd.decision_date, 'Local')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-white/80 text-[10px] font-black uppercase tracking-widest block ml-2">Notes & Details</label>
                                    <div className="px-6 py-6 bg-white/5 rounded-[1.5rem] border border-white/10 text-white leading-relaxed text-base font-medium min-h-[200px] break-words">
                                        {renderNotesWithLinks(selectedPhd.notes)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <button onClick={() => { window.location.href = `/internal/phd?id=${selectedPhd.id}`; }} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white text-base font-black transition-all border border-white/10">Full Details & Edit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* PhD Detail Modal */}

        </div>
    );
}
