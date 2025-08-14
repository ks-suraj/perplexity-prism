import { create } from "zustand";
import { nanoid } from "nanoid";

export const useGraphStore = create((set, get) => ({
  nodes: [
    {
      id: "1",
      data: { 
        question: "Welcome to Perplexity Prism", 
        answer: "", 
        label: "Welcome to Perplexity Prism" 
      },
      position: { x: 250, y: 0 },
      draggable: true,
      connectable: true,
      parentId: null,
    },
  ],
  edges: [],

  setNodes: (updater) => set((state) => ({
    nodes: typeof updater === "function" ? updater(state.nodes) : updater
  })),
  setEdges: (updater) => set((state) => ({
    edges: typeof updater === "function" ? updater(state.edges) : updater
  })),

  addNode: ({ question, answer }) =>
    set((state) => {
      const id = nanoid();
      const newNode = {
        id,
        data: { question, answer, label: `${question} — ${answer}` },
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
        draggable: true,
        connectable: true,
        parentId: null,
      };
      return { nodes: [...state.nodes, newNode] };
    }),

  addFollowUp: (parentId, question, answer) =>
    set((state) => {
      const newId = nanoid();
      const newNode = {
        id: newId,
        data: { question, answer, label: `${question} — ${answer}` },
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
        draggable: true,
        connectable: true,
        parentId,
      };
      const newEdge = { id: `${parentId}-${newId}`, source: parentId, target: newId };
      return { nodes: [...state.nodes, newNode], edges: [...state.edges, newEdge] };
    }),

  getContextPath: (nodeId) => {
    const nodesMap = Object.fromEntries(get().nodes.map(n => [n.id, n]));
    let path = [];
    let current = nodesMap[nodeId];
    while (current) {
      path.unshift(current.data.question);
      current = current.parentId ? nodesMap[current.parentId] : null;
    }
    return path;
  }
}));
