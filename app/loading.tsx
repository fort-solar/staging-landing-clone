export default function Loading() {
  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] h-[3px] bg-emerald-100 overflow-hidden pointer-events-none"
    >
      <div className="h-full bg-[linear-gradient(90deg,#2CB22C,#048A05)] animate-[topProgress_1.2s_ease-in-out_infinite]" />
    </div>
  );
}
