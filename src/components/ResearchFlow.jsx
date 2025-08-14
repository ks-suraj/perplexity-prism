import React, { useCallback, useEffect } from "react";
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
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const getContextPath = (nodeId, allEdges, allNodes) => {
    let path = [];
    let currentId = nodeId;
    while (true) {
      const currentNode = allNodes.find((n) => n.id === currentId);
      if (!currentNode) break;
      path.unshift(currentNode.data.question);
      const parentEdge = allEdges.find((e) => e.target === currentId);
      if (!parentEdge) break;
      currentId = parentEdge.source;
    }
    return path;
  };

  const handleFollowUp = async (parentId, question) => {
    const contextPath = getContextPath(parentId, edges, nodes);
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

  useEffect(() => {
    // fitView only once on mount so dragging isn't reset
  }, []);

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes.map((n) => ({
          ...n,
          draggable: true,
          connectable: true,
          data: {
            ...n.data,
            onFollowUp: (q) => handleFollowUp(n.id, q),
          },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
