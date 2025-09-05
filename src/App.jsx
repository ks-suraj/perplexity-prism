// src/App.jsx
import React, { useState } from "react";
import { useGraphStore } from "./store/useGraphStore";
import ResearchFlow from "./components/ResearchFlow";
import ChatUI from "./components/ChatUI";
import { Search, Sparkles, MessageSquare, GitBranch } from "lucide-react";

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
    <div className="w-full h-screen flex flex-col bg-bg-secondary">
      {/* Modern Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Perplexity Prism</h1>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setMode("tree")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === "tree"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <GitBranch className="w-4 h-4" />
                <span>Research Flow</span>
              </button>
              <button
                onClick={() => setMode("chat")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === "chat"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Search Bar */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={rootQuestion}
              onChange={(e) => setRootQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAskRoot()}
              placeholder="Ask your research question..."
              className="input-search w-full pl-10 pr-32 text-base"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <button
                onClick={handleAskRoot}
                disabled={loading || !rootQuestion.trim()}
                className="btn-primary px-6 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  "Ask"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {mode === "tree" ? <ResearchFlow /> : <ChatUI />}
      </main>
    </div>
  );
}
