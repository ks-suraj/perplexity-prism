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
        data: { question, answer, label: `${question} — ${answer}` },
        position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
        draggable: true,
        connectable: true,
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
      };
      const newEdge = {
        id: `${parentId}-${newId}`,
        source: parentId,
        target: newId,
        createdAt: Date.now(),
      };
      return {
        nodes: [...state.nodes, newNode],
        edges: [...state.edges, newEdge],
      };
    }),

  /**
   * Build context path including all parents recursively
   * Returns an array of "Q: ...\nA: ..." strings
   * Deduplicates repeated nodes
   */
  getContextPath: (nodeId, visited = new Set()) => {
    const { nodes, edges } = get();
    const node = nodes.find(n => n.id === nodeId);
    if (!node || visited.has(nodeId)) return [];

    visited.add(nodeId);

    // Include current node's Q&A
    const currentQA = node.data
      ? [`Q: ${node.data.question || ""}\nA: ${node.data.answer || ""}`]
      : [];

    // Find all parent edges
    const parentEdges = edges.filter(e => e.target === nodeId);

    if (parentEdges.length === 0) return currentQA;

    // Recursively collect context from all parents
    const parentContext = parentEdges.flatMap(e => get().getContextPath(e.source, visited));

    return [...parentContext, ...currentQA];
  },
}));
