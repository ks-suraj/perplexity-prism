// src/components/ChatUI.jsx
import React, { useState, useEffect, useRef } from "react";
import { useGraphStore } from "../store/useGraphStore";
import ChatThread from "./ChatThread";

const ChatUI = () => {
  const nodes = useGraphStore((state) => state.nodes);
  const [input, setInput] = useState("");
  const addFollowUpBlank = useGraphStore((state) => state.addFollowUpBlank);
  const chatEndRef = useRef(null);

  const handleAddNew = () => {
    if (!input.trim()) return;
    addFollowUpBlank("1"); // attach to root by default
    setInput("");
  };

  // Scroll to bottom on new nodes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [nodes]);

  const edges = useGraphStore((state) => state.edges);
  const rootNodes = nodes.filter((n) => !edges.some((e) => e.target === n.id));

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4 border-b bg-white shadow-sm flex justify-center">
        <h1 className="text-xl font-bold text-center text-gray-800">Perplexity Prism Chat</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {rootNodes.map((root) => (
            <div key={root.id} className="border-l-2 border-gray-200">
              <ChatThread nodeId={root.id} />
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="p-4 border-t bg-white flex gap-2 shadow-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a new question..."
          className="flex-1 px-3 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => e.key === "Enter" && handleAddNew()}
        />
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
