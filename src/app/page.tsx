import ConnectionHeader from "@/components/ConnectionHeader";
import WalletPanel from "@/components/WalletPanel";

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#060b16] px-2 py-4 text-[#f4f8ff] sm:px-4 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(58,221,173,0.25),transparent_35%),radial-gradient(circle_at_88%_78%,rgba(61,140,255,0.26),transparent_40%),radial-gradient(circle_at_52%_45%,rgba(255,204,105,0.08),transparent_28%)]" />
      <div className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-[#00d09c]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-16 h-72 w-72 rounded-full bg-[#2d88ff]/12 blur-3xl" />

      <main className="relative z-10 mx-auto grid w-full max-w-230 gap-4 sm:gap-6">
        <ConnectionHeader />
        <WalletPanel />
      </main>
    </div>
  );
}
