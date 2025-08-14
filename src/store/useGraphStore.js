import { create } from "zustand";
import { nanoid } from "nanoid";

export const useGraphStore = create((set) => ({
  nodes: [
    {
      id: "1",
      data: { question: "Welcome to Perplexity Prism", answer: "Ask me something!" },
      position: { x: 250, y: 0 },
    },
  ],
  edges: [],

  addNode: ({ question, answer }) =>
    set((state) => {
      const id = nanoid();
      const newNode = {
        id,
        data: { question, answer },
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

  addFollowUp: async (parentId, followUpQuestion) => {
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: followUpQuestion,
          contextPath: [parentId],
        }),
      });
      const data = await res.json();

      set((state) => {
        const newId = nanoid();
        const newNode = {
          id: newId,
          data: { question: followUpQuestion, answer: data.answer || "No answer" },
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
      });
    } catch (err) {
      console.error("Error fetching follow-up:", err);
    }
  },
}));
