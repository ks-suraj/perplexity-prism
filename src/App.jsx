import React, { useState } from "react";
import ResearchCanvas from "./components/ResearchCanvas";
import { useGraphStore } from "./store/useGraphStore";

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const addNode = useGraphStore((state) => state.addNode);

  const handleAddNode = async () => {
    if (input.trim() === "") return;

    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input.trim(),
          contextPath: [], // For main questions, no parent context
        }),
      });

      const data = await res.json();

      addNode({
        question: input.trim(),
        answer: data.answer || "No answer received.",
      });

      setInput("");
    } catch (err) {
      console.error("Error fetching answer:", err);
      addNode({
        question: input.trim(),
        answer: "Error fetching answer.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Perplexity Prism</h1>
        <p className="text-lg text-gray-600 mt-2">
          Your visual research copilot, powered by Perplexity.
        </p>
      </div>

      <div className="flex justify-center items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a new question..."
          className="border rounded px-3 py-2 w-96"
          disabled={loading}
        />
        <button
          onClick={handleAddNode}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Asking..." : "Ask New Question"}
        </button>
      </div>

      <ResearchCanvas />
    </div>
  );
}

export default App;
