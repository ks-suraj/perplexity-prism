// src/components/ChatThread.jsx
import React from "react";
import { useGraphStore } from "../store/useGraphStore";
import ChatMessage from "./ChatMessage";

const ChatThread = ({ nodeId, depth = 0 }) => {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);

  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const childEdges = edges.filter((e) => e.source === nodeId);
  const childNodes = childEdges
    .map((e) => nodes.find((n) => n.id === e.target))
    .filter(Boolean);

  return (
    <div className="relative">
      {/* Main Message */}
      <div className={`${depth > 0 ? "ml-8" : ""}`}>
        <ChatMessage node={node} />
      </div>

      {/* Child Messages with Connection Lines */}
      {childNodes.length > 0 && (
        <div className="mt-6 space-y-6">
          {childNodes.map((child, index) => (
            <div key={child.id} className="relative">
              {/* Connection Line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary-300 to-transparent" />
              
              {/* Connection Dot */}
              <div className="absolute left-4 top-6 w-2 h-2 bg-primary-500 rounded-full border-2 border-white shadow-sm" />
              
              {/* Child Thread */}
              <div className="ml-8">
                <ChatThread nodeId={child.id} depth={depth + 1} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatThread;
