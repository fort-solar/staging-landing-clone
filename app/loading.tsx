export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#EAF5EE_0%,#F7F9FB_58%)] px-6 transition-colors">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl transition-colors">
        <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-[#048A05]" />
        <h4 className="mt-5 text-xl font-bold text-slate-900">Preparing your view...</h4>
        <p className="mt-1.5 text-xs text-slate-500">Loading your content, please wait</p>
      </div>
    </div>
  );
}
