export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
      <div className="animate-fade-in">
        <h1 className="text-5xl font-extrabold text-slate-800 mb-6 tracking-tight">
          안녕하세요, 반갑습니다.
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
          데이터를 통해 세상을 탐구하고, <br />
          그 과정에서 얻은 실험 결과와 일상을 기록하는 공간입니다.
        </p>
      </div>
    </main>
  );
}
