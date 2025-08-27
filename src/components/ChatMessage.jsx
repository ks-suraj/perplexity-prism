// src/components/ChatMessage.jsx
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
      const answerText = dataRes.answer || "(No answer yet)";
      updateNode(node.id, { question: questionEdit, answer: answerText });
    } catch (err) {
      console.error(err);
      updateNode(node.id, { question: questionEdit, answer: "(Error fetching answer)" });
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
    <div className="flex flex-col gap-1 bg-white p-4 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition w-full max-w-[600px]">
      {/* Question with thread indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1 h-1 rounded-full bg-blue-500"></div>
        <input
          type="text"
          value={questionEdit}
          onChange={(e) => setQuestionEdit(e.target.value)}
          className="flex-1 text-sm font-semibold px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Answer with better containment */}
      <div className="text-gray-700 text-sm mb-2 max-h-[200px] overflow-y-auto pl-3 border-l-2 border-gray-200">
        {node.data.answer || "(No answer yet)"}
      </div>
      
      {/* Rest of the component remains the same */}
    </div>
  );
};

export default ChatMessage;
