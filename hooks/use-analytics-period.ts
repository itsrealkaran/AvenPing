import { useState } from 'react';

export function useAnalyticsPeriod() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  return {
    selectedPeriod,
    setSelectedPeriod,
  };
} 