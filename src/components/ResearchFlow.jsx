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
import { Plus, Sparkles } from "lucide-react";

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
        const newEdge = { 
          ...connection, 
          type: "smoothstep", 
          animated: true, 
          createdAt: Date.now(),
          style: { 
            stroke: '#3b82f6', 
            strokeWidth: 2,
            strokeDasharray: '5,5',
          }
        };
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
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Floating Add Node Button */}
      <button
        onClick={handleAddNode}
        className="absolute z-20 bottom-6 right-6 flex items-center space-x-2 px-4 py-3 bg-white text-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-primary-300 group"
        title="Add AI Node"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <Plus className="w-4 h-4 text-white" />
        </div>
        <span className="font-medium">Add Node</span>
      </button>

      {/* Welcome Message for Empty State */}
      {nodes.length <= 1 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">Start Your Research</h3>
              <p className="text-gray-500 max-w-md">
                Ask a question in the top bar to begin.
              </p>
            </div>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes.map((n) => ({
          ...n,
          draggable: true,
          connectable: true,
          selectable: true,
          style: { width: 'auto', height: 'auto' },
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
        defaultEdgeOptions={{ 
          type: "smoothstep", 
          animated: true, 
          style: { 
            stroke: '#3b82f6', 
            strokeWidth: 2,
            strokeDasharray: '5,5',
          } 
        }}
        className="bg-transparent"
      >
        {/* MiniMap Customization */}
        <MiniMap
          nodeColor={(n) => (n.data.isBlankFollowUp ? "#a855f7" : "#3b82f6")}
          nodeStrokeWidth={2}
          nodeBorderRadius={8}
          maskColor="rgba(0,0,0,0.1)"
          style={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '12px',
          }}
        />
        
        {/* Controls Styling */}
        <Controls 
          showInteractive={false}
          className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg"
        />
        
        {/* Background Grid */}
        <Background 
          gap={24} 
          size={1} 
          color="#e5e7eb"
          className="opacity-50"
        />
      </ReactFlow>
    </div>
  );
}
