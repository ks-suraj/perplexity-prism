import React, { useState } from 'react';

const InputForm = ({ onAnalyze, loading }) => {
  const [answer, setAnswer] = useState('');
  const [citations, setCitations] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const citationUrls = citations.split('\n').map(s => s.trim()).filter(Boolean);
    onAnalyze(answer, citationUrls);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto p-4">
      <textarea
        rows={6}
        placeholder="Paste Perplexity answer here..."
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        rows={4}
        placeholder="Enter citation URLs, one per line"
        value={citations}
        onChange={e => setCitations(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
};

export default InputForm;
