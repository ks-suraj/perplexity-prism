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
    <div className="w-full h-screen flex flex-col bg-bgGray">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white shadow-md p-4 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        {/* Input + Ask Button */}
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            value={rootQuestion}
            onChange={(e) => setRootQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskRoot()}
            placeholder="Ask your root question..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <button
            onClick={handleAskRoot}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-blue-600 transition-all shadow-sm"
          >
            {loading ? "Asking..." : "Ask"}
          </button>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="mt-2 md:mt-0 flex gap-2">
          <button
            onClick={() => setMode("tree")}
            className={`px-4 py-2 rounded-xl transition-all font-semibold ${
              mode === "tree"
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Tree
          </button>
          <button
            onClick={() => setMode("chat")}
            className={`px-4 py-2 rounded-xl transition-all font-semibold ${
              mode === "chat"
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Chat
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {mode === "tree" ? <ResearchFlow /> : <ChatUI />}
      </div>
    </div>
  );
}
