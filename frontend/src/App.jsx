import React, { useState } from 'react';
import InputForm from './components/InputForm';
import AnalysisResults from './components/AnalysisResults';
import ResearchTree from './components/ResearchTree';
import { analyzeSupport } from './utils/api';

const App = () => {
  const [mode, setMode] = useState('clarity'); // 'clarity' or 'exploration'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (answer, citations) => {
    setLoading(true);
    try {
      const data = await analyzeSupport(answer, citations);
      setResult(data);
    } catch (err) {
      alert('Error during analysis');
    }
    setLoading(false);
  };

  const handleReset = () => setResult(null);

  return (
    <div className="p-8">
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${mode === 'clarity' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setMode('clarity')}
        >
          Clarity Mode
        </button>
        <button
          className={`px-4 py-2 rounded ${mode === 'exploration' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setMode('exploration')}
        >
          Exploration Mode
        </button>
      </div>

      {mode === 'clarity' && (
        !result ? <InputForm onAnalyze={handleAnalyze} loading={loading} />
                : <AnalysisResults data={result} onReset={handleReset} />
      )}

      {mode === 'exploration' && <ResearchTree />}
    </div>
  );
};

export default App;
