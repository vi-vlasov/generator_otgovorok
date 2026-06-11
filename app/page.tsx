import ExcuseGenerator from "@/components/ExcuseGenerator";

export default function Home() {
  return (
    <div className="relative flex min-h-svh flex-1 flex-col overflow-hidden px-4 py-8 sm:px-6 sm:py-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 animate-blob rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div
          className="absolute right-0 top-24 h-80 w-80 animate-blob rounded-full bg-amber-400/15 blur-3xl"
          style={{ animationDelay: "-7s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-64 w-64 animate-blob rounded-full bg-violet-500/20 blur-3xl"
          style={{ animationDelay: "-14s" }}
        />
      </div>

      <main className="relative">
        <ExcuseGenerator />
      </main>
    </div>
  );
}
