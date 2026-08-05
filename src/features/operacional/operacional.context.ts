import { createContext, useContext } from 'react';
import type { OperacionalDataContextValue } from './operacional.types';

export const OperacionalDataContext = createContext<OperacionalDataContextValue | undefined>(undefined);

export function useOperacionalData() {
  const context = useContext(OperacionalDataContext);

  if (!context) {
    throw new Error('useOperacionalData deve ser usado dentro de OperacionalDataProvider');
  }

  return context;
}
