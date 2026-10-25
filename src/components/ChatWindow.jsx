import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';

export default function ChatWindow({ messages, isLoading }) {
  return (
    <div className="flex h-[calc(100vh-180px)] flex-col gap-4 overflow-y-auto bg-slate-50 p-4 md:p-6">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isLoading && <LoadingIndicator />}
    </div>
  );
}
