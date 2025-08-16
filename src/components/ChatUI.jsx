// src/components/ChatUI.jsx
import React, { useState } from "react";
import { useGraphStore } from "../store/useGraphStore";
import ChatThread from "./ChatThread";

const ChatUI = () => {
  const nodes = useGraphStore((state) => state.nodes);
  const [input, setInput] = useState("");
  const addFollowUpBlank = useGraphStore((state) => state.addFollowUpBlank);

  const handleAddNew = () => {
    if (!input.trim()) return;
    addFollowUpBlank("1"); // attach to root by default
    setInput("");
  };

  // Root nodes (no incoming edges)
  const edges = useGraphStore((state) => state.edges);
  const rootNodes = nodes.filter((n) => !edges.some((e) => e.target === n.id));

  return (
    <div className="p-4 max-w-xl mx-auto h-screen overflow-y-auto bg-gray-50 flex flex-col">
      <h1 className="text-lg font-bold mb-4 text-center">Perplexity Prism Chat</h1>

      <div className="flex-1 flex flex-col gap-3">
        {rootNodes.map((root) => (
          <ChatThread key={root.id} nodeId={root.id} />
        ))}
      </div>

      {/* Input to add blank follow-up to root */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a new question..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          onClick={handleAddNew}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
