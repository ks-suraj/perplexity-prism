import React from 'react';
import SentenceViewer from './SentenceViewer';

const AnalysisResults = ({ data, onReset }) => (
  <div className="max-w-4xl mx-auto p-4">
    <button onClick={onReset} className="mb-4 px-3 py-1 border rounded">← Back</button>
    <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
    <SentenceViewer sentences={data.sentences} />
    {/* Citation panel can be added here later */}
  </div>
);

export default AnalysisResults;
