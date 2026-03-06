import ConnectionHeader from "@/components/ConnectionHeader";
import WalletPanel from "@/components/WalletPanel";

export default function Home() {
  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_10%_20%,rgba(32,179,122,0.2),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(45,136,255,0.2),transparent_35%),#080d1a] px-4 py-8 text-[#f4f8ff]">
      <main className="grid w-full max-w-230 gap-6">
        <ConnectionHeader />
        <WalletPanel />
      </main>
    </div>
  );
}
