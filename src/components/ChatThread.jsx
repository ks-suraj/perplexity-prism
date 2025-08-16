// src/components/ChatThread.jsx
import React, { useState } from "react";
import { useGraphStore } from "../store/useGraphStore";
import ChatMessage from "./ChatMessage";

const ChatThread = ({ nodeId, depth = 0 }) => {
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);

  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  // Find children of this node
  const childEdges = edges.filter((e) => e.source === nodeId);
  const childNodes = childEdges.map((e) => nodes.find((n) => n.id === e.target)).filter(Boolean);

  return (
    <div style={{ marginLeft: depth * 20 }} className="flex flex-col gap-2">
      <ChatMessage node={node} />
      {childNodes.map((child) => (
        <ChatThread key={child.id} nodeId={child.id} depth={depth + 1} />
      ))}
    </div>
  );
};

export default ChatThread;
