import React, { useState } from "react";
import ResearchCanvas from "./components/ResearchCanvas";
import { useGraphStore } from "./store/useGraphStore";

function App() {
  const [input, setInput] = useState("");
  const addNode = useGraphStore((state) => state.addNode);

  const handleAddNode = () => {
    if (input.trim() !== "") {
      addNode(input.trim());
      setInput("");
    }
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
        />
        <button
          onClick={handleAddNode}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ask New Question
        </button>
      </div>

      <ResearchCanvas />
    </div>
  );
}

export default App;
