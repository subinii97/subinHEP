"use client";

import WorldClock from "@/components/clock/WorldClock";
import Timer from "@/components/clock/Timer";
import Stopwatch from "@/components/clock/Stopwatch";

export default function ClockPage() {
    return (
        <div className="min-h-screen text-white pt-4 pb-20 px-6 font-sans selection:bg-rose-500 selection:text-white">
            <div className="max-w-4xl mx-auto space-y-4">
                <WorldClock />
                <Timer />
                <Stopwatch />
            </div>

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
