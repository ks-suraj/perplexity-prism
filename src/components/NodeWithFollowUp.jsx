import React from "react";
import { Handle, Position } from "reactflow";
import { useGraphStore } from "../store/useGraphStore";

const NodeWithFollowUp = ({ id, data }) => {
  const addFollowUp = useGraphStore((state) => state.addFollowUp);

  const handleFollowUp = async () => {
    const followUpQuestion = prompt("Ask a follow-up:");
    if (followUpQuestion) {
      await addFollowUp(id, followUpQuestion);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 border border-gray-300 min-w-[250px]">
      <div className="font-semibold text-gray-800">{data.question}</div>
      <div className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">
        {data.answer}
      </div>
      <button
        onClick={handleFollowUp}
        className="text-sm text-blue-600 hover:underline mt-3"
      >
        ➕ Ask Follow-Up
      </button>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default NodeWithFollowUp;
