"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import { supabase } from "@/lib/supabase";

export default function ScheduleBoard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showEventForm, setShowEventForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [newSchedule, setNewSchedule] = useState({ title: "", category: "purple", notes: "", event_date: "", timezone: "Local" });

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
            const { data } = await supabase.from("schedules").select("*").order("event_date", { ascending: true });
            setSchedules(data || []);
        } catch (err) {
            console.error("Error fetching schedules:", err);
        } finally {
            setLoading(false);
        }
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
        return schedules.filter(s => {
            const date = new Date(s.event_date);
            return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
        });
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
                </div>
                <button onClick={() => {
                    setShowEventForm(true);
                    setEditingSchedule(null);
                    const nowISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                    setNewSchedule({ title: "", category: "purple", notes: "", event_date: nowISO, timezone: "Local" });
                }} className="px-8 py-4 bg-white/40 backdrop-blur-md border border-white/40 hover:border-blue-500/50 rounded-2xl text-[#1a1a1a] font-bold shadow-xl transition-all hover:scale-105 flex items-center gap-2 group">
                    <span className="text-xl font-bold">+</span>
                    New Event
                </button>
            </div>

            {/* Calendar Controls */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all">←</button>
                    <h2 className="text-3xl font-black text-white px-2 tracking-tighter">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all">→</button>
                </div>
                <button onClick={() => setCurrentDate(new Date())} className="px-6 py-2.5 bg-white/40 backdrop-blur-md border border-white/40 hover:bg-white/50 rounded-xl text-[#1a1a1a] font-bold transition-all shadow-xl">Today</button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-2 overflow-hidden shadow-2xl">
                <div className="grid grid-cols-7 gap-px text-center border-b border-white/10">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                        <div key={day} className="py-4 text-[11px] font-black tracking-[0.2em] text-white/40">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-white/5">
                    {calendarDays.map((date, idx) => {
                        const dayEvents = getEventsForDay(date.year, date.month, date.day);
                        const isToday = new Date().toDateString() === new Date(date.year, date.month, date.day).toDateString();

                        return (
                            <div key={idx} className={`min-h-[160px] p-5 bg-[#12141a]/60 transition-all group relative overflow-hidden ${date.isOtherMonth ? 'opacity-20' : ''}`}>
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-xl font-black tracking-tighter ${isToday ? 'bg-blue-500 text-white px-3 py-1 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-white/20'}`}>
                                        {date.day}
                                    </span>
                                </div>
                                <div className="space-y-1.5 pt-1">
                                    {dayEvents.map(event => (
                                        <div key={event.id} onClick={(e) => { e.stopPropagation(); startEditSchedule(event); }} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black cursor-pointer transition-all hover:scale-[1.03] shadow-lg truncate border backdrop-blur-sm ${event.category === 'purple' ? 'bg-purple-500/30 text-purple-200 border-purple-500/40' :
                                            event.category === 'blue' ? 'bg-blue-500/30 text-blue-200 border-blue-500/40' :
                                                event.category === 'red' ? 'bg-red-500/30 text-red-200 border-red-500/40' :
                                                    event.category === 'green' ? 'bg-green-500/30 text-green-200 border-green-500/40' :
                                                        event.category === 'yellow' ? 'bg-yellow-500/30 text-yellow-200 border-yellow-500/40' :
                                                            'bg-white/10 text-white border-white/20'
                                            }`}>
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
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" onClick={() => setShowEventForm(false)}></div>
                    <form onSubmit={addSchedule} className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.1)] p-10 animate-in zoom-in-95 duration-500 space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-3xl font-black text-[#1a1a1a] tracking-tighter">{editingSchedule ? "Edit Event" : "New Event Entry"}</h3>
                            <button type="button" onClick={() => setShowEventForm(false)} className="w-10 h-10 bg-[#1a1a1a]/5 hover:bg-[#1a1a1a]/10 rounded-full flex items-center justify-center text-[#1a1a1a]/30 transition-all hover:rotate-90">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[#1a1a1a]/40 text-[10px] font-black uppercase ml-2 tracking-widest">Event Title</label>
                            <input value={newSchedule.title} onChange={e => setNewSchedule({ ...newSchedule, title: e.target.value })} placeholder="What's happening?" className="w-full px-6 py-4 bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 rounded-2xl text-[#1a1a1a] outline-none focus:border-blue-500 transition-all font-bold" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[#1a1a1a]/40 text-[10px] font-black uppercase ml-2 tracking-widest">Event Color</label>
                            <div className="flex gap-3 px-2">
                                {['purple', 'blue', 'red', 'green', 'yellow'].map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setNewSchedule({ ...newSchedule, category: c })}
                                        className={`w-9 h-9 rounded-full border-4 transition-all ${newSchedule.category === c ? 'border-[#1a1a1a]/20 scale-110' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-110'} ${c === 'purple' ? 'bg-purple-500' :
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
                                <label className="text-[#1a1a1a]/40 text-[10px] font-black uppercase ml-2 tracking-widest">Date</label>
                                <input type="datetime-local" value={newSchedule.event_date} onChange={e => setNewSchedule({ ...newSchedule, event_date: e.target.value })} className="w-full px-6 py-4 bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 rounded-2xl text-[#1a1a1a] outline-none focus:border-blue-500 transition-all font-mono" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[#1a1a1a]/40 text-[10px] font-black uppercase ml-2 tracking-widest">Timezone</label>
                                <select value={newSchedule.timezone} onChange={e => setNewSchedule({ ...newSchedule, timezone: e.target.value })} className="w-full px-6 py-4 bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 rounded-2xl text-[#1a1a1a] outline-none text-xs font-bold appearance-none">
                                    {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[#1a1a1a]/40 text-[10px] font-black uppercase ml-2 tracking-widest">Additional Notes</label>
                            <textarea value={newSchedule.notes} onChange={e => setNewSchedule({ ...newSchedule, notes: e.target.value })} placeholder="Extra details..." className="w-full px-6 py-4 bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 rounded-2xl text-[#1a1a1a] outline-none focus:border-blue-500 transition-all italic min-h-[120px]" />
                        </div>

                        <div className="pt-4 space-y-3">
                            <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] shadow-xl text-xl font-black transition-all hover:scale-[1.01]">
                                {editingSchedule ? "Update Event" : "Register Event"}
                            </button>
                            {editingSchedule && (
                                <button type="button" onClick={() => deleteSchedule(editingSchedule.id)} className="w-full py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all">Delete Event</button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
