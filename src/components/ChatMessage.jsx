import React, { useState } from "react";
import { useGraphStore } from "../store/useGraphStore";
import { generateNodeSummary } from "../utils/aiGeneration";

const ChatMessage = ({ node }) => {
  const updateNode = useGraphStore((state) => state.updateNode);
  const addFollowUpBlank = useGraphStore((state) => state.addFollowUpBlank);

  const [questionEdit, setQuestionEdit] = useState(node.data.question || "");
  const [tldrEdit, setTldrEdit] = useState(node.data.tldr || "");
  const [loadingAsk, setLoadingAsk] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [editingTLDR, setEditingTLDR] = useState(false);

  const handleRegenerateAnswer = async () => {
    if (!questionEdit.trim()) return;
    setLoadingAsk(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: questionEdit, contextPath: [] }),
      });
      const dataRes = await res.json();
      const answerText = dataRes.answer || "No answer received.";
      updateNode(node.id, { question: questionEdit, answer: answerText });
    } catch (err) {
      console.error(err);
      updateNode(node.id, { question: questionEdit, answer: "Error fetching answer." });
    }

    setLoadingAsk(false);
  };

  const fetchSummaryAsTLDR = async () => {
    if (loadingSummary || !node.data.answer) return;
    setLoadingSummary(true);

    try {
      const summary = await generateNodeSummary(node.data.question, node.data.answer);
      updateNode(node.id, { tldr: summary.description || "(No summary generated)" });
      setTldrEdit(summary.description || "");
      setEditingTLDR(true);
    } catch (err) {
      console.error(err);
      updateNode(node.id, { tldr: "(Error generating summary)" });
      setTldrEdit("(Error generating summary)");
      setEditingTLDR(true);
    }

    setLoadingSummary(false);
  };

  const saveCustomTLDR = () => {
    updateNode(node.id, { tldr: tldrEdit });
    setEditingTLDR(false);
  };

  return (
    <div className="flex flex-col gap-1 bg-white p-3 rounded shadow max-w-full">
      {/* Question */}
      <input
        type="text"
        value={questionEdit}
        onChange={(e) => setQuestionEdit(e.target.value)}
        className="px-2 py-1 border rounded w-full text-sm mb-1"
      />

      {/* Answer */}
      <div className="text-gray-700 text-sm">{node.data.answer || "(No answer yet)"}</div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-1 flex-wrap">
        <button
          onClick={handleRegenerateAnswer}
          disabled={loadingAsk}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loadingAsk ? "Asking..." : "Regenerate"}
        </button>

        <button
          onClick={fetchSummaryAsTLDR}
          className="px-2 py-1 text-xs text-purple-600 border rounded hover:bg-purple-50"
        >
          {loadingSummary ? "Summarizing..." : "TLDR"}
        </button>

        <button
          onClick={() => addFollowUpBlank(node.id)}
          className="px-2 py-1 text-xs text-blue-600 border rounded hover:bg-blue-50"
        >
          ➕ Follow-up
        </button>
      </div>

      {/* TLDR */}
      {node.data.tldr && (
        <div
          className="mt-1 p-2 bg-purple-50 border border-purple-300 rounded text-purple-800 text-xs cursor-pointer"
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
            <div>{node.data.tldr}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
