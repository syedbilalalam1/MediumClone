import React, { useState } from "react";

const AIChat = () => {
  const [messages, setMessages] = useState([
    { role: "user", content: "Hello!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${base}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'AI request failed');
      setMessages((m) => [...m, { role: 'assistant', content: json.content || '' }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: e.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-[90%] md:w-[60%] mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4">AI Chat</h2>
      <div className="border rounded p-4 h-[50vh] overflow-y-auto bg-white">
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded ${m.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
              {m.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">Thinking...</div>}
      </div>
      <form onSubmit={sendMessage} className="mt-4 flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
        />
        <button className="btn !rounded-full !bg-green-700 !text-white">Send</button>
      </form>
    </section>
  );
};

export default AIChat;


