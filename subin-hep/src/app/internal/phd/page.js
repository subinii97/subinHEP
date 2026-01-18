"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/common/Button";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function PhDBoardContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
    const [filterYear, setFilterYear] = useState('All');

    const searchParams = useSearchParams();
    const appIdFromUrl = searchParams.get('id');

    useEffect(() => {
        if (appIdFromUrl && apps.length > 0) {
            const app = apps.find(a => a.id.toString() === appIdFromUrl);
            if (app) setSelectedApp(app);
        }
    }, [appIdFromUrl, apps]);

    // Forms
    const [showAppForm, setShowAppForm] = useState(false);
    const [newApp, setNewApp] = useState({
        university: "",
        status: "Considering",
        deadline: "",
        submit_date: "",
        interview_date: "",
        decision_date: "",
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
            const { data } = await supabase.from("phd_applications").select("*");

            // Sort: High priority to Decision Date (if exists) or Deadline (if no decision)
            // Show the most "recent" activity (decision or upcoming deadline) at the top
            const sortedData = (data || []).sort((a, b) => {
                const dateA = a.decision_date ? new Date(a.decision_date) : new Date(a.deadline);
                const dateB = b.decision_date ? new Date(b.decision_date) : new Date(b.deadline);
                return dateB - dateA;
            });

            setApps(sortedData);
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

    const exportToPDF = () => {
        try {
            if (typeof jsPDF === 'undefined' || typeof autoTable !== 'function') {
                console.error("PDF libraries not fully loaded:", { jsPDF: typeof jsPDF, autoTable: typeof autoTable });
                alert("PDF libraries are still loading. Please wait a moment and try again.");
                return;
            }

            const doc = new jsPDF();

            // Add Title
            doc.setFontSize(18);
            doc.text("PhD Application Board", 14, 22);
            doc.setFontSize(10);
            doc.setTextColor(100);

            // Full timestamp with time
            const now = new Date();
            const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
            doc.text(`Generated on: ${timestamp} (Filter: ${filterYear})`, 14, 30);

            const tableColumn = ["University / Program", "Status", "Milestone Dates", "Notes"];
            const tableRows = [];

            filteredApps.forEach(app => {
                let milestoneDates = `Deadline: ${formatDateWithTimezone(app.deadline, app.timezone)}`;
                if (app.submit_date) milestoneDates += `\nSubmitted: ${formatDateWithTimezone(app.submit_date, 'Local')}`;
                if (app.interview_date) milestoneDates += `\nInterview: ${formatDateWithTimezone(app.interview_date, 'Local')}`;
                if (app.decision_date) milestoneDates += `\nDecision: ${formatDateWithTimezone(app.decision_date, 'Local')}`;

                const appData = [
                    app.university || '-',
                    app.status || '-',
                    milestoneDates,
                    app.notes || '-'
                ];
                tableRows.push(appData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
                columnStyles: {
                    0: { cellWidth: 50 }, // University
                    1: { cellWidth: 25 }, // Status
                    2: { cellWidth: 55 }, // Milestone Dates
                    3: { cellWidth: 50 }  // Notes reduced
                },
                headStyles: { fillColor: [113, 142, 172], textColor: 255 },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                margin: { left: 14, right: 14 }
            });

            doc.save(`PhD_Applications_${new Date().getFullYear()}_${filterYear}.pdf`);
        } catch (error) {
            console.error("PDF Export failed:", error);
            alert(`PDF Export failed: ${error.message || 'Unknown error'}. Please check the console for details.`);
        }
    };

    const availableYears = ['All', ...new Set(apps.map(app => new Date(app.deadline).getFullYear().toString()))].sort((a, b) => b - a);

    const filteredApps = filterYear === 'All'
        ? apps
        : apps.filter(app => new Date(app.deadline).getFullYear().toString() === filterYear);

    const renderNotesWithLinks = (text) => {
        if (!text) return '—';
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 transition-all font-medium break-all" onClick={(e) => e.stopPropagation()}>{part}</a>;
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
            timezone: newApp.timezone,
            submit_date: newApp.submit_date || null,
            interview_date: newApp.interview_date || null,
            decision_date: newApp.decision_date || null
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
            decision_date: formatForInput(item.decision_date),
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
        <div className="max-w-[1600px] mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-3 border-b border-white/10 pb-4">
                <div>
                    <Link href="/internal" className="text-purple-400 text-sm font-bold flex items-center gap-2 mb-4 hover:translate-x-[-4px] transition-transform">
                        ← Back to Hub
                    </Link>
                    <h1 className="text-4xl font-black text-white tracking-tighter">PhD Application Board</h1>
                </div>
            </div>

            {/* Year Filters & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div className="flex flex-wrap items-center gap-3 overflow-x-auto pb-1 custom-scrollbar">
                    {availableYears.map(year => (
                        <button
                            key={year}
                            onClick={() => setFilterYear(year)}
                            className={`px-6 py-2 rounded-xl font-black text-sm tracking-widest transition-all border ${filterYear === year
                                ? 'bg-white text-purple-900 border-white shadow-lg shadow-white/20'
                                : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white/60'
                                }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={exportToPDF} className="px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 rounded-2xl text-white/70 hover:text-white font-bold transition-all flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        PDF Export
                    </button>
                    <button onClick={() => {
                        setShowAppForm(true);
                        setEditingApp(null);
                        const nowISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                        setNewApp({ university: "", status: "Considering", deadline: nowISO, submit_date: "", interview_date: "", decision_date: "", notes: "", timezone: "Local" });
                    }} className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 rounded-2xl text-white font-bold shadow-xl transition-all hover:scale-105 flex items-center gap-1 group whitespace-nowrap">
                        <span className="text-xl font-bold text-white/80">+</span>
                        New Program
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {showAppForm && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAppForm(false)}></div>
                    <form onSubmit={addApp} className="relative w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] p-10 md:p-14 animate-in zoom-in-95 duration-500 space-y-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-center">
                            <h3 className="text-3xl font-black text-white tracking-tighter">{editingApp ? "Edit Program" : "New Program Entry"}</h3>
                            <button type="button" onClick={() => setShowAppForm(false)} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/30 transition-all hover:rotate-90">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-1">
                                <label className="text-white/40 text-[10px] font-black uppercase ml-3 tracking-widest">University / Program</label>
                                <input value={newApp.university} onChange={e => setNewApp({ ...newApp, university: e.target.value })} placeholder="e.g. Stanford University" className="w-full px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-all font-bold placeholder:text-white/20" required />
                            </div>
                            <div className="space-y-1 relative">
                                <label className="text-white/40 text-[10px] font-black uppercase ml-3 tracking-widest">Status</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                        className="w-full px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-all text-left font-bold flex items-center justify-between"
                                    >
                                        <span className={
                                            newApp.status === 'Considering' ? 'text-yellow-400' :
                                                newApp.status === 'Submitted' ? 'text-blue-400' :
                                                    newApp.status === 'Interview' ? 'text-purple-400' :
                                                        newApp.status === 'Accepted' ? 'text-green-400' :
                                                            newApp.status === 'Rejected' ? 'text-red-400' :
                                                                'text-gray-400'
                                        }>
                                            ● {newApp.status}
                                        </span>
                                        <span className="text-white/20">▼</span>
                                    </button>

                                    {showStatusDropdown && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden">
                                            {[
                                                { label: 'Considering', color: 'text-yellow-400' },
                                                { label: 'Submitted', color: 'text-blue-400' },
                                                { label: 'Interview', color: 'text-purple-400' },
                                                { label: 'Accepted', color: 'text-green-400' },
                                                { label: 'Rejected', color: 'text-red-400' }
                                            ].map((status) => (
                                                <button
                                                    key={status.label}
                                                    type="button"
                                                    onClick={() => {
                                                        setNewApp({ ...newApp, status: status.label });
                                                        setShowStatusDropdown(false);
                                                    }}
                                                    className="w-full px-8 py-4 text-left hover:bg-white/5 transition-all font-bold flex items-center gap-3 border-b border-white/5 last:border-none"
                                                >
                                                    <span className={status.color}>●</span>
                                                    <span className="text-white">{status.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-white/40 text-[10px] font-black uppercase ml-3 tracking-widest">Deadline</label>
                                <input type="datetime-local" value={newApp.deadline} onChange={e => setNewApp({ ...newApp, deadline: e.target.value })} className="w-full px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-all font-mono" required />
                            </div>
                            <div className="space-y-1 relative">
                                <label className="text-white/40 text-[10px] font-black uppercase ml-3 tracking-widest">Timezone</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                                        className="w-full px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-all text-left font-bold flex items-center justify-between"
                                    >
                                        <span>{TIMEZONES.find(tz => tz.value === newApp.timezone)?.label || newApp.timezone}</span>
                                        <span className="text-white/20">▼</span>
                                    </button>

                                    {showTimezoneDropdown && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
                                            {TIMEZONES.map((tz) => (
                                                <button
                                                    key={tz.value}
                                                    type="button"
                                                    onClick={() => {
                                                        setNewApp({ ...newApp, timezone: tz.value });
                                                        setShowTimezoneDropdown(false);
                                                    }}
                                                    className="w-full px-8 py-4 text-left hover:bg-white/5 transition-all font-bold flex items-center justify-between border-b border-white/5 last:border-none"
                                                >
                                                    <span className="text-white">{tz.label}</span>
                                                    {newApp.timezone === tz.value && <span className="text-purple-400">✓</span>}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {(newApp.status === 'Submitted' || newApp.status === 'Interview' || newApp.status === 'Accepted' || newApp.status === 'Rejected') && (
                                <div className="space-y-1 animate-in slide-in-from-left-2">
                                    <label className="text-purple-400/60 text-[10px] font-black uppercase ml-3 tracking-widest">Submit Date</label>
                                    <input type="datetime-local" value={newApp.submit_date} onChange={e => setNewApp({ ...newApp, submit_date: e.target.value })} className="w-full px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-all font-mono" />
                                </div>
                            )}

                            {(newApp.status === 'Interview' || newApp.status === 'Accepted' || newApp.status === 'Rejected') && (
                                <div className="space-y-1 animate-in slide-in-from-left-2">
                                    <label className="text-purple-400/60 text-[10px] font-black uppercase ml-3 tracking-widest">Interview Date</label>
                                    <input type="datetime-local" value={newApp.interview_date} onChange={e => setNewApp({ ...newApp, interview_date: e.target.value })} className="w-full px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-all font-mono" />
                                </div>
                            )}

                            {(newApp.status === 'Accepted' || newApp.status === 'Rejected') && (
                                <div className="space-y-1 animate-in slide-in-from-left-2">
                                    <label className="text-purple-400/60 text-[10px] font-black uppercase ml-3 tracking-widest">Decision Date</label>
                                    <input type="datetime-local" value={newApp.decision_date} onChange={e => setNewApp({ ...newApp, decision_date: e.target.value })} className="w-full px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-all font-mono" />
                                </div>
                            )}

                            <div className="space-y-1 md:col-span-2">
                                <label className="text-white/40 text-[10px] font-black uppercase ml-3 tracking-widest">Notes</label>
                                <textarea value={newApp.notes} onChange={e => setNewApp({ ...newApp, notes: e.target.value })} placeholder="Details or missing docs..." className="w-full px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-purple-500 transition-all italic min-h-[140px] placeholder:text-white/20" />
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
            <div id="phd-table-container" className="overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
                <table className="w-full text-left border-collapse table-auto">
                    <thead>
                        <tr className="border-b border-white/40 bg-white/5">
                            <th className="px-8 py-4 text-white/80 text-[11px] font-black uppercase tracking-widest border-r border-white/40 text-center">University / Program</th>
                            <th className="px-8 py-4 text-white/80 text-[11px] font-black uppercase tracking-widest border-r border-white/40 text-center">Status</th>
                            <th className="px-8 py-4 text-white/80 text-[11px] font-black uppercase tracking-widest border-r border-white/40 text-center">Dates</th>
                            <th className="px-8 py-4 text-white/80 text-[11px] font-black uppercase tracking-widest text-center">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {filteredApps.map((app, i) => (
                            <tr key={i} onClick={() => setSelectedApp(app)} className="hover:bg-white/5 transition-all group cursor-pointer border-b border-white/40 last:border-0">
                                <td className="px-8 py-5 font-black text-white text-xl tracking-tighter transition-colors border-r border-white/40 whitespace-nowrap">{app.university}</td>
                                <td className="px-8 py-5 border-r border-white/40">
                                    <div className="flex justify-center flex-col items-center gap-2">
                                        <span className={`px-4 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest ${app.status === 'Accepted' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' :
                                            app.status === 'Interview' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' :
                                                app.status === 'Submitted' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' :
                                                    app.status === 'Rejected' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' :
                                                        'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                                            }`}>{app.status}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 border-r border-white/40 text-center min-w-[250px]">
                                    <div className="flex flex-col items-center gap-3">
                                        {app.decision_date && (
                                            <div className={`flex flex-col items-center ${app.status === 'Rejected' ? 'text-glow-red' : 'text-glow-green'}`}>
                                                <span className={`${app.status === 'Rejected' ? 'text-red-400/80' : 'text-green-400/80'} text-[9px] font-black uppercase tracking-widest mb-0.5`}>Decision Recorded</span>
                                                <span className="text-white font-mono font-bold text-base">{formatDateWithTimezone(app.decision_date, 'KST').split(' (')[0]}</span>
                                            </div>
                                        )}
                                        {app.interview_date && (
                                            <div className={`flex flex-col items-center ${app.decision_date ? 'pt-3 border-t border-white/10 w-full' : ''} text-glow-purple`}>
                                                <span className="text-purple-400/80 text-[9px] font-black uppercase tracking-widest mb-0.5">Interview Recorded</span>
                                                <span className="text-white font-mono font-bold text-base">{formatDateWithTimezone(app.interview_date, 'KST').split(' (')[0]}</span>
                                            </div>
                                        )}
                                        <div className={`flex flex-col items-center ${(app.decision_date || app.interview_date) ? 'pt-3 border-t border-white/10 w-full' : ''}`}>
                                            <span className="text-white/80 text-[9px] font-black uppercase tracking-widest mb-0.5">Program Deadline</span>
                                            <span className="text-white font-mono font-bold text-base">{formatDateWithTimezone(app.deadline, app.timezone)}</span>
                                        </div>
                                        {app.submit_date && (
                                            <div className="flex flex-col items-center pt-3 border-t border-white/10 w-full text-glow-blue">
                                                <span className="text-blue-400/80 text-[9px] font-black uppercase tracking-widest mb-0.5">Submission Recorded</span>
                                                <span className="text-white font-mono font-bold text-base">{formatDateWithTimezone(app.submit_date, 'KST').split(' (')[0]}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-5">
                                    <div className="text-white/60 italic text-lg font-medium leading-relaxed line-clamp-3 break-words max-w-md whitespace-pre-wrap">
                                        {renderNotesWithLinks(app.notes)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {apps.length === 0 && !loading && (
                            <tr><td colSpan="4" className="px-8 py-32 text-center text-white/10 text-xl italic font-bold">No application data found on board.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Detail */}
            {selectedApp && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedApp(null)}></div>
                    <div className="relative w-full max-w-4xl bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden animate-in zoom-in-95 duration-500 p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-2">
                                <span className={`px-4 py-1.5 text-[10px] font-black rounded-lg uppercase tracking-widest inline-block ${selectedApp.status === 'Accepted' ? 'bg-green-500 text-white' :
                                    selectedApp.status === 'Interview' ? 'bg-purple-500 text-white' :
                                        selectedApp.status === 'Submitted' ? 'bg-blue-500 text-white' :
                                            selectedApp.status === 'Rejected' ? 'bg-red-500 text-white' :
                                                'bg-yellow-500 text-white'
                                    }`}>{selectedApp.status}</span>
                                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{selectedApp.university}</h3>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white/20 transition-all hover:rotate-90">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                {selectedApp.decision_date && (
                                    <div className="space-y-2">
                                        <label className={`${selectedApp.status === 'Rejected' ? 'text-red-400/80 text-glow-red' : 'text-green-400/80 text-glow-green'} text-[10px] font-black uppercase tracking-widest block ml-2`}>Decision Recorded</label>
                                        <div className="px-6 py-4 bg-white/5 rounded-xl border border-white/10 text-white font-mono text-lg font-bold">
                                            {formatDateWithTimezone(selectedApp.decision_date, 'Local')}
                                        </div>
                                    </div>
                                )}

                                {selectedApp.interview_date && (
                                    <div className="space-y-2">
                                        <label className="text-purple-400/80 text-[10px] font-black uppercase tracking-widest block ml-2 text-glow-purple">Interview Recorded</label>
                                        <div className="px-6 py-4 bg-white/5 rounded-xl border border-white/10 text-white font-mono text-lg font-bold">
                                            {formatDateWithTimezone(selectedApp.interview_date, 'Local')}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-white/80 text-[10px] font-black uppercase tracking-widest block ml-2">Program Deadline</label>
                                    <div className="px-6 py-4 bg-white/5 rounded-xl border border-white/10 text-white font-mono text-lg font-bold">
                                        {formatDateWithTimezone(selectedApp.deadline, selectedApp.timezone)}
                                    </div>
                                </div>

                                {selectedApp.submit_date && (
                                    <div className="space-y-2">
                                        <label className="text-blue-400/80 text-[10px] font-black uppercase tracking-widest block ml-2 text-glow-blue">Submission Recorded</label>
                                        <div className="px-6 py-4 bg-white/5 rounded-xl border border-white/10 text-white font-mono text-lg font-bold">
                                            {formatDateWithTimezone(selectedApp.submit_date, 'Local')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-white/80 text-[10px] font-black uppercase tracking-widest block ml-2">Notes</label>
                                    <div className="px-6 py-6 bg-white/5 rounded-[1.5rem] border border-white/10 text-white leading-relaxed text-base font-medium min-h-[200px] break-words whitespace-pre-wrap">
                                        {renderNotesWithLinks(selectedApp.notes)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => { startEditApp(selectedApp); setSelectedApp(null); }} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-white text-base font-black transition-all border border-white/10">Edit</button>
                                    <button onClick={() => { deleteApp(selectedApp.id); setSelectedApp(null); }} className="w-full py-4 bg-red-500/10 hover:bg-red-600 rounded-xl text-white text-base font-black transition-all shadow-lg border border-red-500/20">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PhDBoard() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-white/20 font-black tracking-widest uppercase animate-pulse">Loading PhD Board...</div>
            </div>
        }>
            <PhDBoardContent />
        </Suspense>
    );
}
