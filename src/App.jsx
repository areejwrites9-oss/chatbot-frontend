import { useEffect, useState } from 'react';

import ChatInput from './components/ChatInput';
import ChatWindow from './components/ChatWindow';
import { checkBackendHealth, ingestDocuments, sendChatMessage } from './services/api';

// ---- Easy-to-edit settings -------------------------------------------------
const APP_TITLE = 'Areej Chatbot';
const APP_SUBTITLE = 'Ask questions about the loaded knowledge base';

// Clickable example questions shown before the first message. Change freely.
const SUGGESTED_QUESTIONS = [
  'Who is Areej Fatima?',
  'What are her skills?',
  'What projects has she built?',
  'What are her hobbies?',
];
// ---------------------------------------------------------------------------

const welcomeMessage = {
  id: 'welcome',
  sender: 'assistant',
  content:
    'Welcome! Ask me questions about the uploaded knowledge base. I will answer using the retrieved context from the backend.',
  sources: [],
};

const STATUS_STYLES = {
  checking: {
    label: 'Checking backend...',
    dot: 'bg-amber-400 animate-pulse',
    pill: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  online: {
    label: 'Backend online',
    dot: 'bg-emerald-500',
    pill: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  offline: {
    label: 'Backend offline',
    dot: 'bg-rose-500',
    pill: 'border-rose-200 bg-rose-50 text-rose-700',
  },
};

function SparkleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
    </svg>
  );
}

function RefreshIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12a9 9 0 11-3-6.7" />
      <path d="M21 4v5h-5" />
    </svg>
  );
}

function TrashIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
    </svg>
  );
}

function CloseIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function App() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    async function verifyBackend() {
      try {
        const result = await checkBackendHealth();
        setBackendStatus(result.status === 'ok' ? 'online' : 'online');
      } catch (err) {
        setBackendStatus('offline');
        setError(err.message || 'The backend is not reachable.');
      }
    }

    verifyBackend();
  }, []);

  // One function used by both the text box and the suggestion chips.
  const sendQuestion = async (question) => {
    const trimmedInput = question.trim();
    if (!trimmedInput || isLoading) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: trimmedInput,
      sources: [],
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await sendChatMessage(trimmedInput);
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: response.answer,
        sources: response.sources || [],
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (err) {
      setError(err.message || 'Something went wrong while sending the question.');
      setMessages((previous) => [
        ...previous,
        {
          id: `assistant-error-${Date.now()}`,
          sender: 'assistant',
          content: 'Sorry, I could not answer that question right now. Please check the backend status and try again.',
          sources: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendQuestion(input);
  };

  const handleIngest = async () => {
    setError('');
    setIsLoading(true);
    setIsIngesting(true);

    try {
      const result = await ingestDocuments();
      setMessages((previous) => [
        ...previous,
        {
          id: `ingest-${Date.now()}`,
          sender: 'assistant',
          content: `Knowledge base refreshed. Documents processed: ${result.documents_processed}. Chunks processed: ${result.chunks_processed}. Vectors stored: ${result.vectors_stored}.`,
          sources: [],
        },
      ]);
    } catch (err) {
      setError(err.message || 'Ingestion failed.');
    } finally {
      setIsIngesting(false);
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([welcomeMessage]);
    setInput('');
    setError('');
  };

  const status = STATUS_STYLES[backendStatus] || STATUS_STYLES.checking;
  const showSuggestions = messages.length === 1;
  const hasConversation = messages.length > 1;

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-teal-50 text-slate-800">
      {/* Header */}
      <header className="border-b border-white/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-teal-500 text-white shadow-md">
              <SparkleIcon />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight text-slate-800 md:text-xl">{APP_TITLE}</h1>
              <p className="hidden text-xs text-slate-500 sm:block">{APP_SUBTITLE}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium sm:inline-flex ${status.pill}`}
            >
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              {status.label}
            </span>

            {hasConversation && (
              <button
                type="button"
                onClick={handleClearChat}
                disabled={isLoading}
                title="Clear chat"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <TrashIcon />
                <span className="hidden md:inline">Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleIngest}
              disabled={isLoading}
              title="Re-read the documents into the knowledge base"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshIcon className={`h-4 w-4 ${isIngesting ? 'animate-spin' : ''}`} />
              <span>{isIngesting ? 'Refreshing...' : 'Refresh knowledge'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-3 py-4 md:px-6 md:py-6">
        {/* Status on small screens */}
        <div className="mb-3 sm:hidden">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${status.pill}`}>
            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-3 flex items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError('')}
              className="mt-0.5 rounded-lg p-1 text-rose-500 transition hover:bg-rose-100"
              aria-label="Dismiss error"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        {/* Chat card */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white bg-white/90 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/70">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ChatWindow messages={messages} isLoading={isLoading} />
          </div>

          {showSuggestions && (
            <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">Try asking</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendQuestion(question)}
                    disabled={isLoading}
                    className="rounded-full border border-teal-200 bg-white px-3 py-1.5 text-sm text-teal-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 bg-white">
            <ChatInput value={input} onChange={setInput} onSubmit={handleSubmit} disabled={isLoading} />
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          Answers are generated from your documents. Use "Refresh knowledge" after editing them.
        </p>
      </main>
    </div>
  );
}