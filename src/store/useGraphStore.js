import { create } from "zustand";
import { nanoid } from "nanoid";

export const useGraphStore = create((set, get) => ({
  nodes: [
    {
      id: "1",
      data: { 
        question: "Welcome to Perplexity Prism", 
        answer: "", 
        label: "Welcome to Perplexity Prism",
        collapsed: false,
        tldr: "",
      },
      position: { x: 250, y: 0 },
      draggable: true,
      connectable: true,
    },
  ],
  edges: [],

  setNodes: (updater) =>
    set((state) => ({
      nodes: typeof updater === "function" ? updater(state.nodes) : updater,
    })),
  setEdges: (updater) =>
    set((state) => ({
      edges: typeof updater === "function" ? updater(state.edges) : updater,
    })),

  addNode: ({ question, answer }) =>
    set((state) => {
      const id = nanoid();
      const newNode = {
        id,
        data: { question, answer, label: `${question} — ${answer}`, collapsed: false, tldr: "" },
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
        draggable: true,
        connectable: true,
      };
      return { nodes: [...state.nodes, newNode] };
    }),

  addFollowUpBlank: (parentId) =>
    set((state) => {
      const newId = nanoid();
      const newNode = {
        id: newId,
        data: { question: "", answer: "", isBlankFollowUp: true, collapsed: false, tldr: "" },
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
        draggable: true,
        connectable: true,
      };
      const newEdge = { id: `${parentId}-${newId}`, source: parentId, target: newId };
      return {
        nodes: [...state.nodes, newNode],
        edges: [...state.edges, newEdge],
      };
    }),

  updateNode: (nodeId, newData) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId
          ? { 
              ...n, 
              data: { 
                ...n.data, 
                ...newData, 
                label: `${newData.question || n.data.question} — ${newData.answer || n.data.answer}`,
                isBlankFollowUp: false,
              } 
            }
          : n
      ),
    })),

  toggleCollapse: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, collapsed: !n.data.collapsed } }
          : n
      ),
    })),

  getContextPath: (nodeId, visited = new Set()) => {
    const { nodes, edges } = get();
    const node = nodes.find(n => n.id === nodeId);
    if (!node || visited.has(nodeId)) return [];

    visited.add(nodeId);

    const currentQA = node.data
      ? [`Q: ${node.data.question || ""}\nA: ${node.data.answer || ""}`]
      : [];

    const parentEdges = edges.filter(e => e.target === nodeId);
    if (parentEdges.length === 0) return currentQA;

    const parentContext = parentEdges.flatMap(e => get().getContextPath(e.source, visited));

    return [...parentContext, ...currentQA];
  },
}));
