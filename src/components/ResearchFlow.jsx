import React, { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge
} from "reactflow";
import "reactflow/dist/style.css";
import { useGraphStore } from "../store/useGraphStore";
import NodeWithFollowUp from "./NodeWithFollowUp";

const nodeTypes = { default: NodeWithFollowUp };

export default function ResearchFlow() {
  const { nodes, edges, setNodes, setEdges, addFollowUp } = useGraphStore();

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
        const newEdge = { ...connection, type: "default", animated: false, createdAt: Date.now() };
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
        body: JSON.stringify({ question, contextPath })
      });
      const data = await res.json();
      const answer = data.answer || "No answer received.";
      addFollowUp(parentId, question, answer);
    } catch (err) {
      console.error("Error fetching follow-up answer:", err);
      addFollowUp(parentId, question, "Error fetching answer.");
    }
  };

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes.map(n => ({
          ...n,
          draggable: true,
          connectable: true,
          selectable: true,
          data: { ...n.data, onFollowUp: (q) => handleFollowUp(n.id, q) }
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        nodesDraggable
        nodesConnectable
        elementsSelectable
        fitView={false}
        defaultEdgeOptions={{ type: "default", animated: false }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
