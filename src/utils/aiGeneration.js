// src/utils/aiGeneration.js
export async function generateNodeSummary(question, answer) {
  try {
    const prompt = `
You are a research summarizer.
Summarize the following QA into a concise TL;DR (1-3 lines):

Q: ${question}
A: ${answer}

Respond only with the summary, no extra text.
    `;

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: prompt, contextPath: [] }),
    });

    const data = await res.json();
    const summaryText = data.answer || "";

    return { title: "Summary", description: summaryText || "(No summary generated)" };
  } catch (err) {
    console.error("Error generating node summary:", err);
    return { title: "Summary", description: "(Error generating summary)" };
  }
}
