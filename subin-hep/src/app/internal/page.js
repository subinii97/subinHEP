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
    const [newApp, setNewApp] = useState({ university: "", status: "In Progress", deadline: "", notes: "" });
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [newSchedule, setNewSchedule] = useState({ title: "", category: "Research", event_date: "" });

    const CORRECT_ID = process.env.NEXT_PUBLIC_INTERNAL_ID;
    const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_INTERNAL_PASSWORD;

    const handleLogin = (e) => {
        e.preventDefault();
        if (authId === CORRECT_ID && authPassword === CORRECT_PASSWORD) {
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
        const { error } = await supabase.from("phd_applications").insert([newApp]);
        if (!error) {
            setShowAppForm(false);
            setNewApp({ university: "", status: "In Progress", deadline: "", notes: "" });
            fetchData();
        }
    };

    const addSchedule = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from("schedules").insert([newSchedule]);
        if (!error) {
            setShowScheduleForm(false);
            setNewSchedule({ title: "", category: "Research", event_date: "" });
            fetchData();
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    if (!isAuthenticated) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl">
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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Upcoming Alerts */}
                <aside className="lg:col-span-1 space-y-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <span className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-500 text-sm">🔔</span>
                        Upcoming
                    </h2>

                    <div className="space-y-3">
                        {upcomingTasks.length === 0 ? (
                            <div className="p-6 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center">
                                <p className="text-white/30 text-xs">No urgent tasks</p>
                            </div>
                        ) : (
                            upcomingTasks.map((task) => (
                                <div key={task.id} className={`p-4 rounded-2xl border transition-all ${task.type === 'deadline'
                                    ? 'bg-red-500/10 border-red-500/20'
                                    : 'bg-blue-500/10 border-blue-500/20'
                                    }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${task.type === 'deadline' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {task.type.toUpperCase()}
                                        </span>
                                        <span className="text-white/40 text-[10px] tabular-nums">
                                            {Math.ceil((new Date(task.date) - new Date()) / (1000 * 60 * 60 * 24))}d left
                                        </span>
                                    </div>
                                    <h4 className="text-white font-bold text-sm leading-tight mb-1">{task.title}</h4>
                                    <p className="text-white/40 text-[10px] font-mono">
                                        {new Date(task.date).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 bg-gradient-to-br from-[#718eac]/20 to-transparent rounded-3xl border border-white/10 mt-8">
                        <h3 className="text-white font-bold mb-3">Quick Tip</h3>
                        <p className="text-white/60 text-xs leading-relaxed">
                            Check all submission portals 24h before deadline. Don't forget the time zone differences.
                        </p>
                    </div>
                </aside>

                {/* PhD App Board & Schedule */}
                <div className="lg:col-span-3 space-y-12">
                    {/* PhD Application Tracker */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm">🎓</span>
                                PhD Application Status
                            </h2>
                            <button onClick={() => setShowAppForm(!showAppForm)} className="text-[#E6E6FA] text-sm font-medium hover:underline">
                                {showAppForm ? "Cancel" : "+ Add Program"}
                            </button>
                        </div>

                        {showAppForm && (
                            <form onSubmit={addApp} className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-[#718eac]/30 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
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
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-white/40 text-[10px] font-bold uppercase ml-2">Deadline</label>
                                    <input type="date" value={newApp.deadline} onChange={e => setNewApp({ ...newApp, deadline: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#718eac] transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-white/40 text-[10px] font-bold uppercase ml-2">Notes</label>
                                    <input value={newApp.notes} onChange={e => setNewApp({ ...newApp, notes: e.target.value })} placeholder="Details or missing docs..." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#718eac] transition-all" />
                                </div>
                                <Button type="submit" className="md:col-span-2 py-4 rounded-2xl text-lg font-bold">Register Program</Button>
                            </form>
                        )}

                        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/10">
                                        <th className="px-6 py-5 text-white/40 text-[10px] font-bold uppercase tracking-widest">University</th>
                                        <th className="px-6 py-5 text-white/40 text-[10px] font-bold uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-5 text-white/40 text-[10px] font-bold uppercase tracking-widest">Deadline</th>
                                        <th className="px-6 py-5 text-white/40 text-[10px] font-bold uppercase tracking-widest">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-white/80">
                                    {apps.map((app, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-all group">
                                            <td className="px-6 py-5 font-bold text-white group-hover:text-[#718eac] transition-colors">{app.university}</td>
                                            <td className="px-6 py-5">
                                                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-tight ${app.status === 'Accepted' ? 'bg-green-500/20 text-green-400' :
                                                    app.status === 'Interview' ? 'bg-blue-500/20 text-blue-400' :
                                                        app.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-yellow-500/20 text-yellow-500'
                                                    }`}>{app.status}</span>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-mono opacity-80">{app.deadline}</td>
                                            <td className="px-6 py-5 text-sm opacity-60 italic">{app.notes || '—'}</td>
                                        </tr>
                                    ))}
                                    {apps.length === 0 && !loading && (
                                        <tr><td colSpan="4" className="px-6 py-16 text-center text-white/20 italic font-medium">No application data found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Schedule Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm">📅</span>
                                Schedule
                            </h2>
                            <button onClick={() => setShowScheduleForm(!showScheduleForm)} className="text-[#E6E6FA] text-sm font-medium hover:underline">
                                {showScheduleForm ? "Cancel" : "+ New Event"}
                            </button>
                        </div>

                        {showScheduleForm && (
                            <form onSubmit={addSchedule} className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-[#718eac]/30 space-y-4 animate-in slide-in-from-top-2 max-w-xl">
                                <input value={newSchedule.title} onChange={e => setNewSchedule({ ...newSchedule, title: e.target.value })} placeholder="Event Title" className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-[#718eac] transition-all" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <select value={newSchedule.category} onChange={e => setNewSchedule({ ...newSchedule, category: e.target.value })} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none">
                                        <option value="Research">Research</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Deadline">Deadline</option>
                                    </select>
                                    <input type="datetime-local" value={newSchedule.event_date} onChange={e => setNewSchedule({ ...newSchedule, event_date: e.target.value })} className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none" />
                                </div>
                                <Button type="submit" className="w-full py-4 rounded-2xl font-bold">Push to Timeline</Button>
                            </form>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {schedules.map((item, i) => (
                                <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 hover:border-white/30 transition-all flex justify-between items-center">
                                    <div>
                                        <p className={`text-[10px] font-black mb-1 uppercase tracking-[0.2em] ${item.category === 'Research' ? 'text-purple-400' :
                                            item.category === 'Meeting' ? 'text-blue-400' :
                                                item.category === 'Deadline' ? 'text-red-400' : 'text-[#718eac]'
                                            }`}>{item.category}</p>
                                        <h4 className="text-white font-bold text-xl group-hover:text-[#718eac] transition-colors">{item.title}</h4>
                                        <p className="text-white/30 text-xs font-mono mt-2 flex items-center gap-2">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                            {new Date(item.event_date).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                        {item.category === 'Research' ? '🧪' : item.category === 'Meeting' ? '👥' : item.category === 'Deadline' ? '🚨' : '✨'}
                                    </div>
                                </div>
                            ))}
                            {schedules.length === 0 && !loading && (
                                <div className="col-span-2 p-12 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 text-center">
                                    <p className="text-white/20 font-medium">No scheduled events.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
