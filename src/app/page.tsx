import WalletPanel from "@/components/WalletPanel";

export default function Home() {
  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_10%_20%,rgba(32,179,122,0.2),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(45,136,255,0.2),transparent_35%),#080d1a] px-4 py-8 text-[#f4f8ff]">
      <main className="grid w-full max-w-230 gap-6">
        <div className="rounded-2xl border border-white/15 bg-linear-to-br from-[rgba(17,31,68,0.95)] to-[rgba(15,56,73,0.95)] p-6 max-[700px]:p-4">
          <p className="mb-2 text-[0.78rem] tracking-[0.09em] text-[#8ddfcb] uppercase">Web3 MVP</p>
          <h1 className="text-[clamp(1.6rem,4vw,2.5rem)] leading-[1.15] text-balance">
            Connect MetaMask and show live wallet info.
          </h1>
          <p className="mt-3 max-w-[62ch] leading-6 text-white/90">
            This starter reads your connected address, active chain, and native token balance directly in the browser.
          </p>
        </div>
        <WalletPanel />
      </main>
    </div>
  );
}
