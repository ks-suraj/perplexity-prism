import React, { useState } from 'react';
import SupportIndicator from './SupportIndicator';

const SentenceViewer = ({ sentences }) => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-4">
      {sentences.map((s, i) => (
        <div key={i} className="border p-4 rounded">
          <p>{s.sentence}</p>
          <SupportIndicator support_strength={s.support_strength} confidence={s.confidence_score} />
          {expanded === i ? (
            <div className="mt-2 text-sm italic bg-gray-100 p-2 rounded">
              {s.evidence_quotes.map((quote, idx) => (
                <p key={idx}>“{quote}”</p>
              ))}
              <button onClick={() => setExpanded(null)} className="text-blue-600 underline mt-1">Hide evidence</button>
            </div>
          ) : (
            <button onClick={() => setExpanded(i)} className="text-blue-600 underline mt-1">Show evidence</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SentenceViewer;
