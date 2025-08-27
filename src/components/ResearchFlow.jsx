// src/components/ResearchFlow.jsx
import React, { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { useGraphStore } from "../store/useGraphStore";
import NodeWithFollowUp from "./NodeWithFollowUp";

const nodeTypes = {
  default: NodeWithFollowUp,
};

export default function ResearchFlow() {
  const { nodes, edges, setNodes, setEdges, addNode, addFollowUp } = useGraphStore();

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) => {
        const newEdge = { ...connection, type: "smoothstep", animated: true, createdAt: Date.now() };
        return addEdge(newEdge, eds);
      }),
    [setEdges]
  );

  const handleFollowUp = async (parentId, question) => {
    const contextPath = useGraphStore.getState().getContextPath(parentId);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, contextPath }),
      });
      const data = await res.json();
      const answer = data.answer || "No answer received.";
      addFollowUp(parentId, question, answer);
    } catch (err) {
      console.error("Error fetching follow-up answer:", err);
      addFollowUp(parentId, question, "Error fetching answer.");
    }
  };

  const handleAddNode = async () => {
    const question = prompt("Enter your question:");
    if (!question) return;

    try {
      const res = await fetch("/api/tldr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const json = await res.json();
      addNode({
        question: json.title || question,
        answer: json.description || "",
      });
    } catch (err) {
      console.error("Error generating TL;DR:", err);
      addNode({ question, answer: "" });
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Floating Add Node Button */}
      <button
        onClick={handleAddNode}
        className="absolute z-20 top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200"
        title="Add AI Node"
      >
        + Add Node
      </button>

      <ReactFlow
        nodes={nodes.map((n) => ({
          ...n,
          draggable: true,
          connectable: true,
          selectable: true,
          style: { width: 'auto', height: 'auto' }, // Add this line
          data: { ...n.data, onFollowUp: (q) => handleFollowUp(n.id, q) },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        nodesDraggable
        nodesConnectable
        elementsSelectable
        fitView
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{ type: "smoothstep", animated: true, style: { stroke: "#888" } }}
      >
        {/* MiniMap Customization */}
        <MiniMap
          nodeColor={(n) => (n.data.isBlankFollowUp ? "#A78BFA" : "#60A5FA")}
          nodeStrokeWidth={2}
          nodeBorderRadius={8}
          maskColor="rgba(0,0,0,0.1)"
        />
        {/* Controls Styling */}
        <Controls showInteractive={false} />
        {/* Background Grid */}
        <Background gap={16} size={1} color="#e0e0e0" />
      </ReactFlow>
    </div>
  );
}
