// src/components/NodeWithFollowUp.jsx
import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { useGraphStore } from "../store/useGraphStore";
import { generateNodeSummary } from "../utils/aiGeneration";
import { 
  MessageSquare, 
  RotateCcw, 
  FileText, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Edit3,
  X,
  Move,
  Maximize2
} from "lucide-react";

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
  const [tldrSize, setTldrSize] = useState({ width: 320, height: 200 });
  const [isResizing, setIsResizing] = useState(false);

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
    } catch (err) {
      console.error(err);
      updateNode(id, { tldr: "(Error generating summary)" });
      setTldrEdit("(Error generating summary)");
    }

    setLoadingSummary(false);
  };

  // TLDR Resize Handler
  const handleTLDRResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = tldrSize.width;
    const startHeight = tldrSize.height;

    const handleMouseMove = (e) => {
      e.preventDefault();
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newWidth = Math.max(250, Math.min(600, startWidth + deltaX));
      const newHeight = Math.max(180, Math.min(500, startHeight + deltaY));
      
      setTldrSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = (e) => {
      e.preventDefault();
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    // Add visual feedback
    document.body.style.cursor = 'se-resize';
    document.body.style.userSelect = 'none';
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const saveCustomTLDR = () => {
    updateNode(id, { tldr: tldrEdit });
    setEditingTLDR(false);
  };

  return (
    <div className="relative group">
      {/* Main Node Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 min-w-[280px] max-w-[400px] hover:shadow-xl transition-all duration-200 group-hover:border-primary-200">
        {/* Question Input */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
            Question
          </label>
          <input
            type="text"
            value={questionEdit}
            onChange={(e) => setQuestionEdit(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            placeholder="Enter your question..."
          />
        </div>

        {/* Answer Content */}
        {!data.isBlankFollowUp && !data.collapsed && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              Answer
            </label>
            <div className="text-gray-700 text-sm leading-relaxed max-h-[200px] overflow-y-auto bg-gray-50 rounded-lg p-3 border border-gray-100">
              {data.answer || "(No answer yet)"}
            </div>
          </div>
        )}

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
            onClick={() => addFollowUpBlank(id)}
            className="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Follow-up</span>
          </button>

          <button
            onClick={() => toggleCollapse(id)}
            className="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1"
          >
            {data.collapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            <span>{data.collapsed ? "Expand" : "Collapse"}</span>
          </button>
        </div>

        {/* Connection Handles */}
        <Handle 
          type="target" 
          position={Position.Top} 
          isConnectable 
          className="w-3 h-3 bg-primary-500 border-2 border-white"
        />
        <Handle 
          type="source" 
          position={Position.Bottom} 
          isConnectable 
          className="w-3 h-3 bg-primary-500 border-2 border-white"
        />
      </div>

      {/* TLDR Panel - Attached to Node */}
      {data.tldr && (
        <div 
          className={`absolute top-0 left-full ml-8 bg-white border border-gray-200 rounded-xl shadow-xl transition-all duration-200 hover:shadow-2xl group/tldr ${isResizing ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
          style={{
            width: tldrSize.width,
            height: tldrSize.height,
            minWidth: '250px',
            minHeight: '180px',
            zIndex: 10
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">TLDR Summary</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {Math.round(tldrSize.width)}×{Math.round(tldrSize.height)}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingTLDR(!editingTLDR);
                }}
                className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit3 className="w-3 h-3 text-blue-600" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateNode(id, { tldr: "" });
                }}
                className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                title="Close TLDR"
              >
                <X className="w-3 h-3 text-red-600" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4 h-full overflow-auto" style={{ height: `calc(100% - 60px)` }}>
            {editingTLDR ? (
              <div className="space-y-3 h-full flex flex-col">
                <textarea
                  value={tldrEdit}
                  onChange={(e) => setTldrEdit(e.target.value)}
                  className="flex-1 w-full text-sm p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter your summary..."
                />
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveCustomTLDR();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTLDR(false);
                      setTldrEdit(data.tldr);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-700 leading-relaxed h-full overflow-auto">
                {data.tldr}
              </div>
            )}
          </div>
          
          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize bg-blue-500 hover:bg-blue-600 transition-all duration-200 opacity-90 hover:opacity-100"
            onMouseDown={handleTLDRResizeStart}
            style={{
              clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)'
            }}
            title="Drag to resize"
          />
          
          {/* Resize indicator dots */}
          <div className="absolute bottom-1 right-1 w-6 h-6 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-0 right-1.5 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-0 right-3 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-1.5 right-0 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-1.5 right-1.5 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute bottom-3 right-0 w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeWithFollowUp;
