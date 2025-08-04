import React from 'react';
import { supportColors, formatConfidence } from '../utils/helpers';

const SupportIndicator = ({ support_strength, confidence }) => (
  <span className={`inline-block px-2 py-1 rounded border font-semibold ${supportColors[support_strength]}`}>
    {support_strength.toUpperCase()} ({formatConfidence(confidence)})
  </span>
);

export default SupportIndicator;
