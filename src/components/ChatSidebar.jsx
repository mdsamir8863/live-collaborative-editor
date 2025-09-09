"use client";

import React, { useState } from "react";
import { SendHorizonal, Bot, User } from "lucide-react";

export default function ChatSidebar({ editorRef }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I can help edit your text. Try asking me something.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json();

      if (res.ok && data.reply) {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "⚠️ Error: " + (data.error || "Unknown") },
        ]);
      }
    } catch (err) {
      console.error("Chat API Error:", err);
      setMessages((m) => [...m, { role: "assistant", content: "⚠️ API Error" }]);
    } finally {
      setLoading(false);
    }
  }

  function handleEditorAction(action) {
    if (!editorRef?.current) return;
    switch (action.type) {
      case "replaceSelection":
        editorRef.current.replaceSelection(action.text);
        break;
      case "insertAtCursor":
        editorRef.current.insertAtCursor(action.text);
        break;
      case "replaceAll":
        editorRef.current.replaceAll(action.text);
        break;
    }
  }

  return (
    <div className="w-full sm:w-80 h-full border-l border-gray-200 flex flex-col bg-white">
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2 ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="p-2 rounded-full bg-indigo-100">
                <Bot size={16} className="text-indigo-600" />
              </div>
            )}
            <div
              className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm break-words ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="p-2 rounded-full bg-gray-200">
                <User size={16} className="text-gray-700" />
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">AI is typing...</div>}
      </div>

      {/* Input Box */}
      <div className="border-t border-gray-200 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Gemini..."
            className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-3 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
          >
            <SendHorizonal size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
