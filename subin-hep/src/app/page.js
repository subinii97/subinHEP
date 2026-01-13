export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
      <div className="animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-6 md:mb-8 tracking-tighter">
          Hello. Nice to meet you.
        </h1>
        <p className="text-base md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Explore the world through experiments and data, <br />
          and understand the fundamental physics around us.
        </p>
      </div>
    </main>
  );
}
