import React from "react";
import { Handle, Position } from "reactflow";
import { useGraphStore } from "../store/useGraphStore";

const NodeWithFollowUp = ({ id, data }) => {
  const followUp = useGraphStore((state) => state.addFollowUp);

  const handleFollowUp = () => {
    const followUpQuestion = prompt("Ask a follow-up:");
    if (followUpQuestion) {
      followUp(id, followUpQuestion);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 border border-gray-300 min-w-[200px]">
      <div className="font-semibold text-gray-800 mb-2">{data.label}</div>
      <button
        onClick={handleFollowUp}
        className="text-sm text-blue-600 hover:underline"
      >
        ➕
      </button>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default NodeWithFollowUp;
