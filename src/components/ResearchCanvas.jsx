import React, { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { useGraphStore } from "../store/useGraphStore";
import NodeWithFollowUp from "./NodeWithFollowUp";

const nodeTypes = {
  default: NodeWithFollowUp,
};

export default function ResearchCanvas() {
  const { nodes, edges, addEdge } = useGraphStore();

  const onConnect = useCallback(
    (connection) => {
      addEdge(connection);
    },
    [addEdge]
  );

  const onNodesChange = useCallback((changes) => {
    useGraphStore.setState((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    useGraphStore.setState((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  }, []);

  return (
    <div className="h-[600px] w-full rounded-xl border border-gray-300 shadow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
