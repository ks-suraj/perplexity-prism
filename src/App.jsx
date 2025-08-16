// src/App.jsx
import React, { useState } from "react";
import { useGraphStore } from "./store/useGraphStore";
import ResearchFlow from "./components/ResearchFlow";
import ChatUI from "./components/ChatUI";

export default function App() {
  const { addNode } = useGraphStore();
  const [rootQuestion, setRootQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("tree"); // "tree" or "chat"

  const handleAskRoot = async () => {
    if (!rootQuestion.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: rootQuestion,
          contextPath: [],
        }),
      });

      const data = await res.json();
      const answer = data.answer || "No answer received.";
      addNode({ question: rootQuestion, answer });
      setRootQuestion("");
    } catch (err) {
      console.error("Error fetching root answer:", err);
      addNode({ question: rootQuestion, answer: "Error fetching answer." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header with Root Question & Mode Switch */}
      <div className="p-4 border-b flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          placeholder="Ask your root question..."
          value={rootQuestion}
          onChange={(e) => setRootQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAskRoot()}
        />
        <button
          className="bg-blue-500 text-white rounded px-4 py-2"
          onClick={handleAskRoot}
          disabled={loading}
        >
          {loading ? "Asking..." : "Ask"}
        </button>

        {/* Mode Toggle */}
        <button
          className="ml-2 bg-gray-200 text-gray-800 rounded px-4 py-2 hover:bg-gray-300"
          onClick={() => setMode(mode === "tree" ? "chat" : "tree")}
        >
          Switch to {mode === "tree" ? "Chat" : "Tree"} View
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {mode === "tree" ? <ResearchFlow /> : <ChatUI />}
      </div>
    </div>
  );
}
