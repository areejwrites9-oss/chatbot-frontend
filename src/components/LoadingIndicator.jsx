export default function LoadingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500">
      <div className="flex space-x-1">
        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
      </div>
      <span>Thinking...</span>
      <span>Processing...</span>
    </div>
  );
}
