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
    <div className="relative flex flex-col">
      {/* Message with indent and connection line */}
      <div className={`relative ${depth > 0 ? "ml-8 pt-4" : ""}`}>
        {depth > 0 && (
          <>
            <div className="absolute left-[-24px] top-0 bottom-0 border-l-2 border-gray-200" />
            <div className="absolute left-[-24px] top-[24px] w-6 border-t-2 border-gray-200" />
          </>
        )}
        <ChatMessage node={node} />
      </div>

      {/* Child messages */}
      <div className="mt-4">
        {childNodes.map((child) => (
          <ChatThread key={child.id} nodeId={child.id} depth={depth + 1} />
        ))}
      </div>
    </div>
  );
};

export default ChatThread;
