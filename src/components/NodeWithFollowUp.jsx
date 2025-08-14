import React from "react";
import { Handle, Position } from "reactflow";
import { useGraphStore } from "../store/useGraphStore";

const NodeWithFollowUp = ({ id, data }) => {
  const addFollowUp = useGraphStore((state) => state.addFollowUp);
  const getContextPath = useGraphStore((state) => state.getContextPath);

  const handleFollowUp = async () => {
    const followUpQuestion = prompt("Ask a follow-up:");
    if (!followUpQuestion) return;
    const contextPath = getContextPath(id);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: followUpQuestion, contextPath }),
      });
      const dataRes = await res.json();
      addFollowUp(id, followUpQuestion, dataRes.answer || "No answer received.");
    } catch (err) {
      console.error("Error fetching follow-up:", err);
      addFollowUp(id, followUpQuestion, "Error fetching answer.");
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 border border-gray-300 min-w-[200px]">
      <div className="font-semibold text-gray-800 mb-2">{data.question}</div>
      {data.answer && <div className="text-sm text-gray-600 mb-2">{data.answer}</div>}
      <button onClick={handleFollowUp} className="text-sm text-blue-600 hover:underline">
        ➕ Follow-up
      </button>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default NodeWithFollowUp;
