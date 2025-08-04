import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom node with editable label
const EditableNode = ({ id, data, selected }) => {
  const [label, setLabel] = useState(data.label);

  const onChange = (evt) => {
    setLabel(evt.target.value);
    data.onChange(id, evt.target.value);
  };

  return (
    <div style={{ padding: 10, border: selected ? '2px solid blue' : '1px solid gray', borderRadius: 4, background: 'white', minWidth: 150 }}>
      <textarea
        value={label}
        onChange={onChange}
        rows={3}
        style={{ width: '100%', resize: 'vertical', fontSize: 14 }}
      />
      {/* Handles for connections */}
      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />
    </div>
  );
};

// Node types registry
const nodeTypes = {
  editableNode: EditableNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'editableNode',
    data: { label: 'Root Question', onChange: () => {} },
    position: { x: 250, y: 30 },
  },
];

const initialEdges = [];

const ResearchTree = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Update node label callback
  const onNodeLabelChange = useCallback((id, label) => {
    setNodes((nds) =>
      nds.map((node) => node.id === id ? { ...node, data: { ...node.data, label } } : node)
    );
  }, [setNodes]);

  // Attach this callback to every node’s data for editing
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: { ...node.data, onChange: onNodeLabelChange }
      }))
    );
  }, [onNodeLabelChange, setNodes]);

  // Add new child node under selected node
  const addChildNode = () => {
    if (!selectedNodeId) {
      alert('Select a node first!');
      return;
    }
    const newId = (nodes.length + 1).toString();
    const parentNode = nodes.find((n) => n.id === selectedNodeId);

    const newNode = {
      id: newId,
      type: 'editableNode',
      position: { x: parentNode.position.x + 0, y: parentNode.position.y + 100 },
      data: { label: 'New node', onChange: onNodeLabelChange },
    };

    const newEdge = { id: `e${selectedNodeId}-${newId}`, source: selectedNodeId, target: newId };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  };

  return (
    <div>
      <button onClick={addChildNode} style={{ marginBottom: 10, padding: 6 }}>Add Child Node</button>
      <div style={{ width: '100%', height: '480px', border: '1px solid #bbb', borderRadius: '8px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes, event) => {
            onNodesChange(changes, event);
          }}
          onEdgesChange={onEdgesChange}
          onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
          onNodeClick={(event, node) => setSelectedNodeId(node.id)}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background color="#cfd8dc" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ResearchTree;
