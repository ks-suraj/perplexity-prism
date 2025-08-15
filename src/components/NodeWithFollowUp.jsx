import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { useGraphStore } from "../store/useGraphStore";

const NodeWithFollowUp = ({ id, data }) => {
  const addFollowUp = useGraphStore((state) => state.addFollowUp);
  const getContextPath = useGraphStore((state) => state.getContextPath);
  const toggleCollapse = useGraphStore((state) => state.toggleCollapse);

  const [isAsking, setIsAsking] = useState(false);
  const [followUpText, setFollowUpText] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  // Auto-generate follow-up suggestion
  const handleSuggestFollowUp = async () => {
    setLoadingSuggestion(true);
    setIsAsking(true);

    try {
      const contextPath = getContextPath(id);
      const res = await fetch("/api/autosuggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contextPath }),
      });

      const { suggestion } = await res.json();
      setFollowUpText(suggestion || "");
    } catch (err) {
      console.error("Error fetching suggestion:", err);
      setFollowUpText("Error generating suggestion.");
    }

    setLoadingSuggestion(false);
  };

  // Submit follow-up after edit
  const handleSubmitFollowUp = async () => {
    if (!followUpText.trim()) return;
    const contextPath = getContextPath(id);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: followUpText, contextPath }),
      });
      const dataRes = await res.json();
      addFollowUp(id, followUpText, dataRes.answer || "No answer received.");
    } catch (err) {
      console.error("Error fetching follow-up:", err);
      addFollowUp(id, followUpText, "Error fetching answer.");
    }

    setIsAsking(false);
    setFollowUpText("");
  };

  const tldr = data.answer ? data.answer.split(".")[0] + "." : "";

  return (
    <div className="bg-white rounded shadow p-4 border border-gray-300 min-w-[200px]">
      <div className="font-semibold text-gray-800 mb-2">{data.question}</div>

      {!data.collapsed ? (
        data.answer && <div className="text-sm text-gray-600 mb-2">{data.answer}</div>
      ) : (
        <div className="text-sm italic text-gray-500 mb-2">{tldr || "(No summary)"}</div>
      )}

      {!isAsking ? (
        <div className="flex gap-2">
          <button
            onClick={() => toggleCollapse(id)}
            className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
          >
            {data.collapsed ? "Expand" : "Collapse"}
          </button>
          <button
            onClick={handleSuggestFollowUp}
            className="text-xs px-2 py-1 border rounded text-blue-600 hover:bg-blue-50"
          >
            ➕ {loadingSuggestion ? "Loading..." : "Follow-up"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={followUpText}
            onChange={(e) => setFollowUpText(e.target.value)}
            className="text-xs px-2 py-1 border rounded w-full"
            placeholder="Type your follow-up..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitFollowUp}
              className="text-xs px-2 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Ask
            </button>
            <button
              onClick={() => setIsAsking(false)}
              className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Handle type="target" position={Position.Top} isConnectable={true} />
      <Handle type="source" position={Position.Bottom} isConnectable={true} />
    </div>
  );
};

export default NodeWithFollowUp;
