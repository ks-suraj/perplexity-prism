// src/components/ChatUI.jsx
import React, { useState, useEffect, useRef } from "react";
import { useGraphStore } from "../store/useGraphStore";
import ChatThread from "./ChatThread";
import { Send, MessageSquare, Sparkles } from "lucide-react";

const ChatUI = () => {
  const nodes = useGraphStore((state) => state.nodes);
  const [input, setInput] = useState("");
  const addFollowUpBlank = useGraphStore((state) => state.addFollowUpBlank);
  const chatEndRef = useRef(null);

  const handleAddNew = () => {
    if (!input.trim()) return;
    addFollowUpBlank("1"); // attach to root by default
    setInput("");
  };

  // Scroll to bottom on new nodes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [nodes]);

  const edges = useGraphStore((state) => state.edges);
  const rootNodes = nodes.filter((n) => !edges.some((e) => e.target === n.id));

  return (
    <div className="flex flex-col h-full bg-bg-secondary">
      {/* Chat Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Research Chat</h2>
              <p className="text-sm text-gray-500">Explore your research through conversation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {rootNodes.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Start a Conversation</h3>
                <p className="text-gray-500 max-w-md">
                  Ask your first question above to begin exploring your research topic through AI-powered chat.
                </p>
              </div>
            </div>
          ) : (
            // Chat Threads
            <div className="space-y-8">
              {rootNodes.map((root) => (
                <div key={root.id} className="relative">
                  <ChatThread nodeId={root.id} />
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a new question..."
              className="w-full px-4 py-3 pr-12 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400 bg-gray-50 focus:bg-white"
              onKeyDown={(e) => e.key === "Enter" && handleAddNew()}
            />
            <button
              onClick={handleAddNew}
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
