import { createContext, useContext } from 'react';
import type { AcademiaDataContextValue } from './academia.types';

export const AcademiaDataContext = createContext<AcademiaDataContextValue | undefined>(undefined);

export function useAcademiaData() {
  const context = useContext(AcademiaDataContext);

  if (!context) {
    throw new Error('useAcademiaData deve ser usado dentro de AcademiaDataProvider');
  }

  return context;
}
