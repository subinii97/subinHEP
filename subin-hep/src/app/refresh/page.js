import Image from "next/image";

export default function RefreshPage() {
    return (
        <main className="relative min-h-screen w-full overflow-hidden">
            {/* Background Image Container */}
            <div className="fixed inset-0 -z-5 overflow-hidden">
                <Image
                    src="/assets/refresh-bg.jpeg"
                    alt="Refresh Background"
                    fill
                    priority
                    quality={100}
                    unoptimized={true}
                    className="object-cover object-center pointer-events-none"
                />
                {/* Subtle overlay for better atmosphere */}
                <div className="absolute inset-0 bg-black/5"></div>
            </div>
        </main>
    );
}
