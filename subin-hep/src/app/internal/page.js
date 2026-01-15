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
        const { data: appData } = await supabase.from("phd_applications").select("*").order("deadline", { ascending: true });
        const { data: scheduleData } = await supabase.from("schedules").select("*").order("event_date", { ascending: true });
        setApps(appData || []);
        setSchedules(scheduleData || []);
        setLoading(false);
    };

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
                    Close
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Statistics */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total</p>
                        <h3 className="text-2xl font-bold text-white">{apps.length}</h3>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Queue</p>
                        <h3 className="text-2xl font-bold text-white">{schedules.length}</h3>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                        <h3 className="text-2xl font-bold text-green-400">Stable</h3>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Update</p>
                        <h3 className="text-2xl font-bold text-white">None</h3>
                    </div>
                </div>

                {/* List Tracker */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm">A</span>
                            Entries
                        </h2>
                        <button onClick={() => setShowAppForm(!showAppForm)} className="text-[#E6E6FA] text-sm font-medium hover:underline">
                            {showAppForm ? "Done" : "+ New"}
                        </button>
                    </div>

                    {showAppForm && (
                        <form onSubmit={addApp} className="p-6 bg-white/5 rounded-3xl border border-[#718eac]/30 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                            <input value={newApp.university} onChange={e => setNewApp({ ...newApp, university: e.target.value })} placeholder="Title" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-[#718eac]" required />
                            <select value={newApp.status} onChange={e => setNewApp({ ...newApp, status: e.target.value })} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none">
                                <option value="In Progress">In Progress</option>
                                <option value="Submitted">Submitted</option>
                                <option value="Interview">Interview</option>
                                <option value="Accepted">Accepted</option>
                            </select>
                            <input type="date" value={newApp.deadline} onChange={e => setNewApp({ ...newApp, deadline: e.target.value })} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none" />
                            <input value={newApp.notes} onChange={e => setNewApp({ ...newApp, notes: e.target.value })} placeholder="Details" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none" />
                            <Button type="submit" className="md:col-span-2 py-2">Commit</Button>
                        </form>
                    )}

                    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5 shadow-inner">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-6 py-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">Identify</th>
                                    <th className="px-6 py-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">State</th>
                                    <th className="px-6 py-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">Target</th>
                                    <th className="px-6 py-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">Log</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-white/80">
                                {apps.map((app, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-white">{app.university}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${app.status === 'Accepted' ? 'bg-green-500/20 text-green-400' :
                                                app.status === 'Interview' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-yellow-500/20 text-yellow-500'
                                                }`}>{app.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono">{app.deadline}</td>
                                        <td className="px-6 py-4 text-sm opacity-60 truncate max-w-[150px]">{app.notes}</td>
                                    </tr>
                                ))}
                                {apps.length === 0 && !loading && (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-white/20 italic">No entry logs found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Timeline */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm">T</span>
                            Timeline
                        </h2>
                        <button onClick={() => setShowScheduleForm(!showScheduleForm)} className="text-[#E6E6FA] text-sm font-medium hover:underline">
                            {showScheduleForm ? "Done" : "+ New"}
                        </button>
                    </div>

                    {showScheduleForm && (
                        <form onSubmit={addSchedule} className="p-6 bg-white/5 rounded-3xl border border-[#718eac]/30 space-y-4 animate-in slide-in-from-top-2">
                            <input value={newSchedule.title} onChange={e => setNewSchedule({ ...newSchedule, title: e.target.value })} placeholder="Event" className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none" required />
                            <input type="datetime-local" value={newSchedule.event_date} onChange={e => setNewSchedule({ ...newSchedule, event_date: e.target.value })} className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white outline-none" />
                            <Button type="submit" className="w-full py-2">Push</Button>
                        </form>
                    )}

                    <div className="space-y-4">
                        {schedules.map((item, i) => (
                            <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors">
                                <p className="text-[#C0D6E4] text-[10px] font-bold mb-1 uppercase tracking-widest opacity-40">{item.category}</p>
                                <h4 className="text-white font-bold mb-2 text-lg">{item.title}</h4>
                                <div className="flex items-center gap-2 text-white/30 text-xs font-mono">
                                    {new Date(item.event_date).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {schedules.length === 0 && !loading && (
                            <div className="p-8 bg-white/5 rounded-2xl border border-dashed border-white/20 text-center">
                                <p className="text-white/20 text-sm">Timeline empty.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
