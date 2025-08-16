import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { useGraphStore } from "../store/useGraphStore";
import { generateNodeSummary } from "../utils/aiGeneration";

const NodeWithFollowUp = ({ id, data }) => {
  const addFollowUpBlank = useGraphStore((state) => state.addFollowUpBlank);
  const updateNode = useGraphStore((state) => state.updateNode);
  const getContextPath = useGraphStore((state) => state.getContextPath);
  const toggleCollapse = useGraphStore((state) => state.toggleCollapse);

  const [questionEdit, setQuestionEdit] = useState(data.question || "");
  const [tldrEdit, setTldrEdit] = useState(data.tldr || "");
  const [loadingAsk, setLoadingAsk] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [editingTLDR, setEditingTLDR] = useState(false);

  // Regenerate answer
  const handleRegenerateAnswer = async () => {
    if (!questionEdit.trim()) return;
    setLoadingAsk(true);
    const contextPath = getContextPath(id);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionEdit, contextPath }),
      });
      const dataRes = await res.json();
      const answerText = dataRes.answer || "No answer received.";

      updateNode(id, { question: questionEdit, answer: answerText });
    } catch (err) {
      console.error(err);
      updateNode(id, { question: questionEdit, answer: "Error fetching answer." });
    }

    setLoadingAsk(false);
  };

  // Generate TLDR
  const fetchSummaryAsTLDR = async () => {
    if (loadingSummary || !data.answer) return;
    setLoadingSummary(true);

    try {
      const summary = await generateNodeSummary(data.question, data.answer);
      updateNode(id, { tldr: summary.description || "(No summary generated)" });
      setTldrEdit(summary.description || "");
      setEditingTLDR(true); // automatically enable edit after generating
    } catch (err) {
      console.error(err);
      updateNode(id, { tldr: "(Error generating summary)" });
      setTldrEdit("(Error generating summary)");
      setEditingTLDR(true);
    }

    setLoadingSummary(false);
  };

  const saveCustomTLDR = () => {
    updateNode(id, { tldr: tldrEdit });
    setEditingTLDR(false);
  };

  return (
    <div className="relative bg-white rounded shadow p-4 border border-gray-300 min-w-[220px]">
      {/* Question */}
      <div className="font-semibold text-gray-800 mb-2">
        <input
          type="text"
          value={questionEdit}
          onChange={(e) => setQuestionEdit(e.target.value)}
          className="text-xs px-2 py-1 border rounded w-full"
        />
      </div>

      {/* Answer */}
      {!data.isBlankFollowUp && !data.collapsed && (
        <div className="text-sm text-gray-600 mb-2">{data.answer || "(No answer yet)"}</div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap mb-2">
        <button
          onClick={handleRegenerateAnswer}
          disabled={loadingAsk}
          className="text-xs px-2 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          {loadingAsk ? "Asking..." : "Regenerate"}
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

        <button
          onClick={() => toggleCollapse(id)}
          className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
        >
          {data.collapsed ? "Expand" : "Collapse"}
        </button>
      </div>

      {/* TLDR Box — always editable */}
      {data.tldr && (
        <div
          className="absolute top-0 left-full ml-2 w-56 bg-purple-50 border border-purple-300 p-2 rounded text-purple-800 text-xs shadow"
          onClick={() => setEditingTLDR(true)}
        >
          <strong>TLDR:</strong>
          {editingTLDR ? (
            <>
              <textarea
                value={tldrEdit}
                onChange={(e) => setTldrEdit(e.target.value)}
                className="w-full text-xs p-1 border rounded mt-1 mb-1"
              />
              <button
                onClick={saveCustomTLDR}
                className="text-xs px-2 py-1 border rounded bg-purple-600 text-white hover:bg-purple-700"
              >
                Save
              </button>
            </>
          ) : (
            <div>{data.tldr}</div>
          )}
        </div>
      )}

      <Handle type="target" position={Position.Top} isConnectable />
      <Handle type="source" position={Position.Bottom} isConnectable />
    </div>
  );
};

export default NodeWithFollowUp;
