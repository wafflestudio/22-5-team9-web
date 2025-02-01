import { useState } from 'react';

interface MessageInputProps {
  onSend: (text: string) => Promise<void>;
  sending: boolean;
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (text.trim().length === 0 || sending) return;

    void (async () => {
      try {
        setSending(true);
        await onSend(text.trim());
        setText('');
      } catch (err) {
        console.error('Failed to send message:', err);
      } finally {
        setSending(false);
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={text.trim().length === 0 || sending}
          className="px-4 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>
    </form>
  );
}
