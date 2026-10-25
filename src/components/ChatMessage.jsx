export default function ChatMessage({ message }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-2xl border px-4 py-3 text-sm leading-6 shadow-sm ${
          isUser
            ? 'border-sky-200 bg-sky-50 text-slate-800'
            : 'border-slate-200 bg-white text-slate-700'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 border-t border-slate-200 pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Sources
            </p>
            <ul className="space-y-1 text-xs text-slate-600">
              {message.sources.map((source, index) => (
                <li key={`${source.source}-${index}`}>
                  • {source.source}
                  {source.score !== null && source.score !== undefined ? ` (${source.score.toFixed(3)})` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
