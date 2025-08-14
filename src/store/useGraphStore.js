import { create } from "zustand";
import { nanoid } from "nanoid";

export const useGraphStore = create((set) => ({
  nodes: [
    {
      id: "1",
      data: { label: "Welcome to Perplexity Prism" },
      position: { x: 250, y: 0 },
    },
  ],
  edges: [],
  addNode: (label) =>
    set((state) => {
      const id = nanoid();
      const newNode = {
        id,
        data: { label },
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
      };
      return { nodes: [...state.nodes, newNode] };
    }),
  addEdge: (connection) =>
    set((state) => ({
      edges: [...state.edges, { ...connection, id: nanoid() }],
    })),
  addFollowUp: (parentId, label) =>
    set((state) => {
      const newId = nanoid();
      const newNode = {
        id: newId,
        data: { label },
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
      };
      const newEdge = {
        id: `${parentId}-${newId}`,
        source: parentId,
        target: newId,
      };
      return {
        nodes: [...state.nodes, newNode],
        edges: [...state.edges, newEdge],
      };
    }),
}));
