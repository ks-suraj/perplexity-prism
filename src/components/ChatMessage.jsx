// src/components/ChatMessage.jsx
import React, { useState } from "react";
import { useGraphStore } from "../store/useGraphStore";
import { generateNodeSummary } from "../utils/aiGeneration";
import { 
  RotateCcw, 
  FileText, 
  Plus, 
  Sparkles, 
  Edit3,
  MessageSquare,
  User
} from "lucide-react";

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
    <div className="space-y-4">
      {/* Question Message */}
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl rounded-tl-md shadow-sm border border-gray-200 p-4">
            <input
              type="text"
              value={questionEdit}
              onChange={(e) => setQuestionEdit(e.target.value)}
              className="w-full text-sm font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-0 placeholder:text-gray-400"
              placeholder="Enter your question..."
            />
          </div>
        </div>
      </div>

      {/* Answer Message */}
      {node.data.answer && (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 rounded-2xl rounded-tl-md border border-gray-200 p-4">
              <div className="text-sm text-gray-700 leading-relaxed mb-3">
                {node.data.answer}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRegenerateAnswer}
                  disabled={loadingAsk}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{loadingAsk ? "Asking..." : "Regenerate"}</span>
                </button>

                <button
                  onClick={fetchSummaryAsTLDR}
                  disabled={loadingSummary}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>{loadingSummary ? "Summarizing..." : "TLDR"}</span>
                </button>

                <button
                  onClick={() => addFollowUpBlank(node.id)}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Follow-up</span>
                </button>
              </div>

              {/* TLDR Summary */}
              {node.data.tldr && (
                <div className="mt-3 p-3 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-lg border border-secondary-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-3 h-3 text-secondary-600" />
                    <span className="text-xs font-semibold text-secondary-700 uppercase tracking-wide">TLDR</span>
                    <button
                      onClick={() => setEditingTLDR(true)}
                      className="ml-auto p-1 hover:bg-secondary-200 rounded transition-colors"
                    >
                      <Edit3 className="w-3 h-3 text-secondary-600" />
                    </button>
                  </div>
                  
                  {editingTLDR ? (
                    <div className="space-y-2">
                      <textarea
                        value={tldrEdit}
                        onChange={(e) => setTldrEdit(e.target.value)}
                        className="w-full text-xs p-2 border border-secondary-300 rounded focus:outline-none focus:ring-1 focus:ring-secondary-500 resize-none"
                        rows={2}
                        placeholder="Enter your summary..."
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={saveCustomTLDR}
                          className="btn-primary text-xs px-2 py-1"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingTLDR(false);
                            setTldrEdit(node.data.tldr);
                          }}
                          className="btn-secondary text-xs px-2 py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-secondary-800 leading-relaxed">
                      {node.data.tldr}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
