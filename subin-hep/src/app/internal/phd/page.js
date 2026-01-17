"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import { supabase } from "@/lib/supabase";

export default function PhDBoard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    // Forms
    const [showAppForm, setShowAppForm] = useState(false);
    const [newApp, setNewApp] = useState({
        university: "",
        status: "In Progress",
        deadline: "",
        submit_date: "",
        interview_date: "",
        notes: "",
        timezone: "Local"
    });
    const [editingApp, setEditingApp] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);

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
            fetchApps();
        }
    }, [isAuthenticated]);

    const fetchApps = async () => {
        setLoading(true);
        try {
            const { data } = await supabase.from("phd_applications").select("*").order("deadline", { ascending: true });
            setApps(data || []);
        } catch (err) {
            console.error("Error fetching apps:", err);
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
            const [_, y, mm, dd, h, m] = isoMatch;
            return `${y}.${mm.padStart(2, '0')}.${dd.padStart(2, '0')} ${(h || '00').padStart(2, '0')}:${(m || '00').padStart(2, '0')} (${timezoneValue})`;
        }
        return str + ` (${timezoneValue})`;
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

    const renderNotesWithLinks = (text) => {
        if (!text) return '—';
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 transition-all font-medium" onClick={(e) => e.stopPropagation()}>{part}</a>;
            }
            return part;
        });
    };

    const addApp = async (e) => {
        e.preventDefault();
        const payload = {
            university: newApp.university,
            status: newApp.status,
            notes: newApp.notes,
            deadline: newApp.deadline,
            timezone: newApp.timezone
            // submit_date and interview_date omitted as they don't exist in DB schema yet
        };

        if (editingApp) {
            const { error } = await supabase.from("phd_applications").update(payload).eq("id", editingApp.id);
            if (!error) {
                setShowAppForm(false);
                setNewApp({ university: "", status: "In Progress", deadline: "", submit_date: "", interview_date: "", notes: "", timezone: "Local" });
                setEditingApp(null);
                fetchApps();
            }
        } else {
            const { error } = await supabase.from("phd_applications").insert([payload]);
            if (!error) {
                setShowAppForm(false);
                setNewApp({ university: "", status: "In Progress", deadline: "", submit_date: "", interview_date: "", notes: "", timezone: "Local" });
                fetchApps();
            }
        }
    };

    const deleteApp = async (id) => {
        if (confirm("Are you sure you want to delete this application?")) {
            const { error } = await supabase.from("phd_applications").delete().eq("id", id);
            if (!error) fetchApps();
        }
    };

    const startEditApp = (item) => {
        setNewApp({
            university: item.university,
            status: item.status,
            deadline: formatForInput(item.deadline),
            submit_date: formatForInput(item.submit_date),
            interview_date: formatForInput(item.interview_date),
            notes: item.notes || "",
            timezone: item.timezone || "Local"
        });
        setEditingApp(item);
        setShowAppForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    <Link href="/internal" className="text-purple-400 text-sm font-bold flex items-center gap-2 mb-4 hover:translate-x-[-4px] transition-transform">
                        ← Back to Hub
                    </Link>
                    <button onClick={() => {
                        setShowAppForm(true);
                        setEditingApp(null);
                        const nowISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                        setNewApp({ university: "", status: "In Progress", deadline: nowISO, submit_date: "", interview_date: "", notes: "", timezone: "Local" });
                    }} className="px-8 py-4 bg-white/40 backdrop-blur-md border border-white/40 hover:border-purple-500/50 rounded-2xl text-[#1a1a1a] font-bold shadow-xl transition-all hover:scale-105 flex items-center gap-2 group">
                        <span className="text-xl font-bold">+</span>
                        New Program
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {showAppForm && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" onClick={() => setShowAppForm(false)}></div>
                    <form onSubmit={addApp} className="relative w-full max-w-4xl bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.1)] p-10 md:p-14 animate-in zoom-in-95 duration-500 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-3xl font-black text-[#1a1a1a] tracking-tighter">{editingApp ? "Edit Program" : "New Program Entry"}</h3>
                            <button type="button" onClick={() => setShowAppForm(false)} className="w-10 h-10 bg-[#1a1a1a]/5 hover:bg-[#1a1a1a]/10 rounded-full flex items-center justify-center text-[#1a1a1a]/30 transition-all hover:rotate-90">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-1">
                                <label className="text-[#1a1a1a]/40 text-[10px] font-black uppercase ml-3 tracking-widest">University / Program</label>
                                <input value={newApp.university} onChange={e => setNewApp({ ...newApp, university: e.target.value })} placeholder="e.g. Stanford University" className="w-full px-8 py-4 bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 rounded-2xl text-[#1a1a1a] outline-none focus:border-purple-500 transition-all font-bold" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[#1a1a1a]/40 text-[10px] font-black uppercase ml-3 tracking-widest">Status</label>
                                <select value={newApp.status} onChange={e => setNewApp({ ...newApp, status: e.target.value })} className="w-full px-8 py-4 bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 rounded-2xl text-[#1a1a1a] outline-none focus:border-purple-500 transition-all appearance-none font-bold">
                                    <option value="In Progress">In Progress</option>
                                    <option value="Submitted">Submitted</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Considering">Considering</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[#1a1a1a]/40 text-[10px] font-black uppercase ml-3 tracking-widest">Deadline</label>
                                <input type="datetime-local" value={newApp.deadline} onChange={e => setNewApp({ ...newApp, deadline: e.target.value })} className="w-full px-8 py-4 bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 rounded-2xl text-[#1a1a1a] outline-none focus:border-purple-500 transition-all font-mono" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[#1a1a1a]/40 text-[10px] font-black uppercase ml-3 tracking-widest">Timezone</label>
                                <select value={newApp.timezone} onChange={e => setNewApp({ ...newApp, timezone: e.target.value })} className="w-full px-8 py-4 bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 rounded-2xl text-[#1a1a1a] outline-none focus:border-purple-500 transition-all font-bold appearance-none">
                                    {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                                </select>
                            </div>

                            {(newApp.status === 'Submitted' || newApp.status === 'Interview' || newApp.status === 'Accepted' || newApp.status === 'Rejected') && (
                                <div className="space-y-1 animate-in slide-in-from-left-2">
                                    <label className="text-purple-600 text-[10px] font-black uppercase ml-3 tracking-widest">Submit Date</label>
                                    <input type="datetime-local" value={newApp.submit_date} onChange={e => setNewApp({ ...newApp, submit_date: e.target.value })} className="w-full px-8 py-4 bg-purple-50 border border-purple-100 rounded-2xl text-[#1a1a1a] outline-none focus:border-purple-500 transition-all font-mono" />
                                </div>
                            )}

                            {(newApp.status === 'Interview' || newApp.status === 'Accepted' || newApp.status === 'Rejected') && (
                                <div className="space-y-1 animate-in slide-in-from-left-2">
                                    <label className="text-purple-600 text-[10px] font-black uppercase ml-3 tracking-widest">Interview Date</label>
                                    <input type="datetime-local" value={newApp.interview_date} onChange={e => setNewApp({ ...newApp, interview_date: e.target.value })} className="w-full px-8 py-4 bg-purple-50 border border-purple-100 rounded-2xl text-[#1a1a1a] outline-none focus:border-purple-500 transition-all font-mono" />
                                </div>
                            )}

                            <div className="space-y-1 md:col-span-2">
                                <label className="text-[#1a1a1a]/40 text-[10px] font-black uppercase ml-3 tracking-widest">Notes & Portal Link</label>
                                <textarea value={newApp.notes} onChange={e => setNewApp({ ...newApp, notes: e.target.value })} placeholder="Details or missing docs..." className="w-full px-8 py-4 bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 rounded-2xl text-[#1a1a1a] outline-none focus:border-purple-500 transition-all italic min-h-[140px]" />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-[1.5rem] shadow-xl text-xl font-black transition-all hover:scale-[1.01]">
                                {editingApp ? "Update Details" : "Register Program"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
                <table className="w-full text-left border-collapse table-auto">
                    <thead>
                        <tr className="border-b border-black/5 bg-black/5">
                            <th className="px-8 py-6 text-[#1a1a1a]/40 text-[11px] font-black uppercase tracking-widest border-r border-black/5">University / Program</th>
                            <th className="px-8 py-6 text-[#1a1a1a]/40 text-[11px] font-black uppercase tracking-widest border-r border-black/5 text-center">Status</th>
                            <th className="px-8 py-6 text-[#1a1a1a]/40 text-[11px] font-black uppercase tracking-widest border-r border-black/5 text-center">Dates (KST)</th>
                            <th className="px-8 py-6 text-[#1a1a1a]/40 text-[11px] font-black uppercase tracking-widest text-center">Notes / Status Detail</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {apps.map((app, i) => (
                            <tr key={i} onClick={() => setSelectedApp(app)} className="hover:bg-white/20 transition-all group cursor-pointer">
                                <td className="px-8 py-8 font-black text-[#1a1a1a] text-xl tracking-tighter transition-colors border-r border-black/5 whitespace-nowrap">{app.university}</td>
                                <td className="px-8 py-8 border-r border-black/5">
                                    <div className="flex justify-center flex-col items-center gap-2">
                                        <span className={`px-4 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest ${app.status === 'Accepted' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' :
                                            app.status === 'Interview' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' :
                                                app.status === 'Rejected' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' :
                                                    app.status === 'Considering' ? 'bg-gray-400 text-white' :
                                                        'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                                            }`}>{app.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-8 border-r border-black/5 text-center min-w-[250px]">
                                    <div className="space-y-1">
                                        <div className="flex flex-col items-center">
                                            <span className="text-purple-600/40 text-[9px] font-black uppercase tracking-widest mb-0.5">Deadline</span>
                                            <span className="text-[#1a1a1a] font-mono font-bold text-base">{formatDateWithTimezone(app.deadline, 'KST').split(' (')[0]}</span>
                                        </div>
                                        {app.submit_date && (
                                            <div className="flex flex-col items-center pt-1 border-t border-black/5">
                                                <span className="text-purple-600/20 text-[9px] font-black uppercase tracking-widest">Submitted</span>
                                                <span className="text-[#1a1a1a]/40 font-mono text-xs font-bold">{formatDateWithTimezone(app.submit_date, 'KST').split(' (')[0]}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-8">
                                    <div className="text-[#1a1a1a]/60 italic text-lg font-medium leading-relaxed truncate max-w-md">
                                        {app.notes || '—'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {apps.length === 0 && !loading && (
                            <tr><td colSpan="4" className="px-8 py-32 text-center text-[#1a1a1a]/10 text-xl italic font-bold">No application data found on board.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Detail */}
            {selectedApp && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-md" onClick={() => setSelectedApp(null)}></div>
                    <div className="relative w-full max-w-4xl bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 duration-500 p-12">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-2">
                                <span className={`px-4 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest inline-block ${selectedApp.status === 'Accepted' ? 'bg-green-500 text-white' :
                                    selectedApp.status === 'Interview' ? 'bg-blue-500 text-white' :
                                        selectedApp.status === 'Rejected' ? 'bg-red-500 text-white' :
                                            'bg-yellow-500 text-white'
                                    }`}>{selectedApp.status}</span>
                                <h3 className="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tighter">{selectedApp.university}</h3>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="w-12 h-12 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-black/20 transition-all hover:rotate-90">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-purple-600/40 text-[10px] font-black uppercase tracking-widest block ml-2">Program Deadline</label>
                                    <div className="px-6 py-5 bg-black/5 rounded-[1.5rem] border border-black/5">
                                        <div className="text-[#1a1a1a] font-mono text-2xl font-black tracking-tighter">{formatDateWithTimezone(selectedApp.deadline, selectedApp.timezone)}</div>
                                    </div>
                                </div>

                                {selectedApp.submit_date && (
                                    <div className="space-y-2">
                                        <label className="text-purple-600/20 text-[10px] font-black uppercase tracking-widest block ml-2">Submission Recorded</label>
                                        <div className="px-6 py-4 bg-purple-50 rounded-xl border border-purple-100 text-[#1a1a1a] font-mono text-lg font-bold">
                                            {formatDateWithTimezone(selectedApp.submit_date, 'Local')}
                                        </div>
                                    </div>
                                )}

                                {selectedApp.interview_date && (
                                    <div className="space-y-2">
                                        <label className="text-blue-600/20 text-[10px] font-black uppercase tracking-widest block ml-2">Interview Recorded</label>
                                        <div className="px-6 py-4 bg-blue-50 rounded-xl border border-blue-100 text-[#1a1a1a] font-mono text-lg font-bold">
                                            {formatDateWithTimezone(selectedApp.interview_date, 'Local')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-black/10 text-[10px] font-black uppercase tracking-widest block ml-2">Notes & Details</label>
                                    <div className="px-6 py-6 bg-black/5 rounded-[1.5rem] border border-black/5 text-[#1a1a1a]/80 italic leading-relaxed text-base font-medium min-h-[200px]">
                                        {renderNotesWithLinks(selectedApp.notes)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => { startEditApp(selectedApp); setSelectedApp(null); }} className="w-full py-4 bg-black/5 hover:bg-black/10 rounded-xl text-[#1a1a1a] text-base font-black transition-all border border-black/5">Edit</button>
                                    <button onClick={() => { deleteApp(selectedApp.id); setSelectedApp(null); }} className="w-full py-4 bg-red-50 hover:bg-red-600 rounded-xl text-white text-base font-black transition-all shadow-lg shadow-red-500/20">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
