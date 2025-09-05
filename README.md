# 🌌 Perplexity Prism

**Perplexity Prism** is an intelligent **visual research copilot** that blends a clean **Chat UI** with a **graph-based research tree** (React Flow).  
All intelligence is powered **solely by the Perplexity API** — no GPT or other LLMs.

---

## 🔥 TL;DR

- Ask questions via **Chat** or **Graph**.  
- Each node holds **Q/A + editable TL;DR** (short summary).  
- **Follow-ups** become child nodes and **inherit full root→path context**.  
- **Chat ↔ Graph stay in sync**.  
- Built with **React, React Flow, Tailwind, Zustand**.  
- **Perplexity API** is the only model backend.

---

## ✨ Key Features

- **Dual Interfaces**
  - 🗨️ **Chat UI** — linear, fast iteration (Perplexity-style).
  - 🌳 **Graph UI (React Flow)** — draggable nodes, edges, minimap, zoom/pan.

- **Contextual Follow-ups**
  - Each follow-up **collects context from the root to the current node**, then calls Perplexity with that full path.

- **Node Model**
  - **Question + Answer**
  - **Editable TL;DR** (short summary per node)
  - (Planned) **Notes, tags, file attachments**, reorder/move across parents.

- **Sync**
  - Messages in **Chat** create/update nodes in **Graph**.
  - Graph actions reflect in the Chat timeline.

- **Export** (Planned)
  - Export full tree or sub-tree to **Markdown/PDF**.

- **Design**
  - Clean, minimal **Perplexity-inspired** UX.
  - TailwindCSS, responsive layout.

---

## 🧠 Intelligence Layer

- API: `POST https://api.perplexity.ai/chat/completions`
- Model: `sonar-pro` (configurable)
- **Prompt Strategy (per follow-up)**:
  1. Traverse up from the current node to the root, collecting **Q/A pairs**.
  2. Build a contextual prompt block (root → … → current).
  3. Append the **new question**.
  4. Send to Perplexity; store **Answer** and update **TL;DR** (editable by user).

**Example payload (frontend `fetch`):**
```js
const res = await fetch('https://api.perplexity.ai/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_PERPLEXITY_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'sonar-pro',
    messages: [
      { role: 'system', content: 'You are a concise research assistant. Prefer citations when helpful.' },
      { role: 'user', content: `Context:\n${contextText}\n\nQuestion:\n${question}` }
    ]
  })
});
const data = await res.json();
```
# 🏗️ Tech Stack

| Layer         | Tools                                 |
|---------------|---------------------------------------|
| Frontend      | React + Vite                          |
| Canvas        | React Flow                            |
| Styling       | TailwindCSS                           |
| State         | Zustand                               |
| Intelligence  | Perplexity API                        |
| Storage       | Supabase (planned)                    |
| Hosting       | Vercel                                |
| Export        | html2pdf.js / react-markdown (planned)|

---

# 🚀 Getting Started

### 1) Install & Run
```bash
npm install
npm run dev
Visit: [http://localhost:5173](http://localhost:5173)
```
---

## 2) Environment Variables

Create `.env`:
```bash
VITE_PERPLEXITY_API_KEY=your_perplexity_api_key
🔐 **In production**, proxy the API via a serverless endpoint instead of exposing the key to the client.
```
---

## 3) Build

```bash
npm run build
```
🔗 **Chat ↔ Graph Sync**

- Chat UI creates/updates nodes behind the scenes.  
- Graph UI actions (new question, follow-up) append to Chat history.  
- Both share the same underlying store (**Zustand**) for a single source of truth.  

---

🌳 **Context Traversal (Root → Path → Current)**

**Goal:** Ensure every follow-up includes the full contextual history.

**Algorithm (pseudocode):**
```js
function getPathContext(nodes, edges, currentNodeId) {
  const parentMap = new Map(); // child -> parent
  edges.forEach(e => parentMap.set(e.target, e.source));

  const path = [];
  let cursor = currentNodeId;
  while (cursor) {
    const node = nodes.find(n => n.id === cursor);
    if (node) path.push(node); else break;
    cursor = parentMap.get(cursor);
  }
  return path.reverse(); // root → ... → current
}

function buildContextText(path) {
  return path.map((n, i) => {
    const q = n.data?.question ?? n.data?.label ?? '(no question)';
    const a = n.data?.answer ?? '(no answer yet)';
    const s = n.data?.tldr ? `TL;DR: ${n.data.tldr}\n` : '';
    return `#${i+1}\nQ: ${q}\n${s}A: ${a}\n`;
  }).join('\n');
}
```


Each node supports editable TL;DR which is included in context to keep follow-ups concise and focused.

---

✍️ **Editable TL;DRs**

- Every node includes a TL;DR field (short human summary).  
- Users can edit TL;DRs at any time.  
- TL;DRs are included in the context block for follow-ups to guide the model efficiently.  

**Best practices:**
- Keep TL;DR ≤ 1–2 lines.  
- Summarize the answer and the direction you want follow-ups to take.  

---

🧪 **Troubleshooting**

**Tailwind v4 + PostCSS (ESM)**  
Install plugin:
```bash
npm i -D @tailwindcss/postcss
```

`postcss.config.js` (ESM):
```js
import tailwindcss from '@tailwindcss/postcss';
export default { plugins: [ tailwindcss({ config: './tailwind.config.js' }) ] };
```

**Nodes not draggable**  
- Ensure no overlay with `pointer-events: none` is capturing events.  
- React Flow nodes are draggable by default; verify custom node markup doesn’t block dragging.  

---

🗺️ **Roadmap**
- Supabase persistence for trees, nodes (Q/A, TL;DR, notes, tags)  
- Export sub-tree / full tree to Markdown / PDF  
- Search across nodes  
- Node version history  
- Multi-user collaboration (presence, locking, merge)  
- Serverless proxy for Perplexity key in production  

---

🤝 **Acknowledgments**
- Built by Suraj.  
- Powered by the Perplexity API.  
- Inspired by Perplexity’s elegant research UX.  
