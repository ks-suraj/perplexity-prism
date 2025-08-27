// src/components/NodeWithFollowUp.jsx
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
      setEditingTLDR(true);
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
    <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-4 min-w-[180px] max-w-[300px] hover:shadow-xl transition-all">
      {/* Question */}
      <input
        type="text"
        value={questionEdit}
        onChange={(e) => setQuestionEdit(e.target.value)}
        className="text-sm font-semibold w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
      />

      {/* Answer - Added max height and overflow control */}
      {!data.isBlankFollowUp && !data.collapsed && (
        <div className="text-gray-700 text-sm mb-2 max-h-[200px] overflow-y-auto">
          {data.answer || "(No answer yet)"}
        </div>
      )}

      {/* Action Buttons - Keeping existing buttons */}
      <div className="flex gap-2 flex-wrap mb-2">
        <button
          onClick={handleRegenerateAnswer}
          disabled={loadingAsk}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {loadingAsk ? "Asking..." : "Regenerate"}
        </button>

        <button
          onClick={fetchSummaryAsTLDR}
          className="px-2 py-1 text-xs text-purple-600 border rounded hover:bg-purple-50 transition"
        >
          {loadingSummary ? "Summarizing..." : "TLDR"}
        </button>

        <button
          onClick={() => addFollowUpBlank(id)}
          className="px-2 py-1 text-xs text-blue-600 border rounded hover:bg-blue-50 transition"
        >
          ➕ Follow-up
        </button>

        <button
          onClick={() => toggleCollapse(id)}
          className="px-2 py-1 text-xs border rounded hover:bg-gray-100 transition"
        >
          {data.collapsed ? "Expand" : "Collapse"}
        </button>
      </div>

      {/* TLDR Panel - Repositioned to right side */}
      {data.tldr && (
        <div
          className="absolute top-1/2 left-full -translate-y-1/2 ml-3 w-64 bg-purple-50 border border-purple-300 p-2 rounded-lg text-purple-800 text-xs shadow-lg cursor-pointer transition-all"
          onClick={() => setEditingTLDR(true)}
        >
          <strong>TLDR:</strong>
          {editingTLDR ? (
            <div className="mt-1">
              <textarea
                value={tldrEdit}
                onChange={(e) => setTldrEdit(e.target.value)}
                className="w-full text-xs p-1 border rounded mb-1"
                rows={3}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  saveCustomTLDR();
                }}
                className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="mt-1">{data.tldr}</div>
          )}
        </div>
      )}

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} isConnectable />
      <Handle type="source" position={Position.Bottom} isConnectable />
    </div>
  );
};

export default NodeWithFollowUp;
