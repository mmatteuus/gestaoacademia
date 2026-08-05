import { createContext, useContext } from 'react';
import type { InsightsDataContextValue } from './insights.types';

export const InsightsDataContext = createContext<InsightsDataContextValue | undefined>(undefined);

export function useInsightsData() {
  const context = useContext(InsightsDataContext);

  if (!context) {
    throw new Error('useInsightsData deve ser usado dentro de InsightsDataProvider');
  }

  return context;
}
