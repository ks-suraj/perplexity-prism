import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { useGraphStore } from "../store/useGraphStore";
import { generateNodeSummary } from "../utils/aiGeneration";

const NodeWithFollowUp = ({ id, data }) => {
  const addFollowUpBlank = useGraphStore((state) => state.addFollowUpBlank);
  const updateNode = useGraphStore((state) => state.updateNode);
  const getContextPath = useGraphStore((state) => state.getContextPath);
  const toggleCollapse = useGraphStore((state) => state.toggleCollapse);

  const [followUpText, setFollowUpText] = useState(data.question || "");
  const [loadingAsk, setLoadingAsk] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchSummaryAsTLDR = async () => {
    if (loadingSummary || !data.answer) return;
    setLoadingSummary(true);

    try {
      const summary = await generateNodeSummary(data.question, data.answer);
      updateNode(id, { tldr: summary.description || "(No summary generated)" });
    } catch (err) {
      console.error("Failed to generate TLDR:", err);
      updateNode(id, { tldr: "(Error generating summary)" });
    }

    setLoadingSummary(false);
  };

  const handleSubmitFollowUp = async () => {
    if (!followUpText.trim()) return;
    setLoadingAsk(true);
    const contextPath = getContextPath(id);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: followUpText, contextPath }),
      });
      const dataRes = await res.json();
      const answerText = dataRes.answer || "No answer received.";

      updateNode(id, {
        question: followUpText,
        answer: answerText,
        isBlankFollowUp: false,
        tldr: "", // TLDR box hidden until requested
      });
    } catch (err) {
      console.error(err);
      updateNode(id, {
        question: followUpText,
        answer: "Error fetching answer.",
        isBlankFollowUp: false,
        tldr: "",
      });
    }

    setLoadingAsk(false);
  };

  return (
    <div className="relative bg-white rounded shadow p-4 border border-gray-300 min-w-[200px]">
      {/* Main Node Question */}
      <div className="font-semibold text-gray-800 mb-2">
        {data.isBlankFollowUp ? (
          <input
            type="text"
            value={followUpText}
            onChange={(e) => setFollowUpText(e.target.value)}
            placeholder="Type your follow-up..."
            className="text-xs px-2 py-1 border rounded w-full"
          />
        ) : (
          data.question
        )}
      </div>

      {/* Main Node Answer */}
      {!data.isBlankFollowUp && !data.collapsed && (
        <div className="text-sm text-gray-600 mb-2">
          {data.answer || "(No answer yet)"}
        </div>
      )}

      {/* Action Buttons */}
      {data.isBlankFollowUp ? (
        <div className="flex gap-2">
          <button
            onClick={handleSubmitFollowUp}
            disabled={loadingAsk}
            className="text-xs px-2 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            {loadingAsk ? "Asking..." : "Ask"}
          </button>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => toggleCollapse(id)}
            className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
          >
            {data.collapsed ? "Expand" : "Collapse"}
          </button>

          <button
            onClick={fetchSummaryAsTLDR}
            className="text-xs px-2 py-1 border rounded text-purple-600 hover:bg-purple-50"
          >
            {loadingSummary ? "Summarizing..." : "TLDR"}
          </button>

          <button
            onClick={() => addFollowUpBlank(id)}
            className="text-xs px-2 py-1 border rounded text-blue-600 hover:bg-blue-50"
          >
            ➕ Follow-up
          </button>
        </div>
      )}

      {/* TLDR Box — visually attached */}
      {!data.isBlankFollowUp && data.tldr && (
        <div className="absolute top-0 left-full ml-2 w-56 bg-purple-50 border border-purple-300 p-2 rounded text-purple-800 text-xs shadow">
          <strong>TLDR:</strong>
          <div>{data.tldr}</div>
        </div>
      )}

      <Handle type="target" position={Position.Top} isConnectable />
      <Handle type="source" position={Position.Bottom} isConnectable />
    </div>
  );
};

export default NodeWithFollowUp;
