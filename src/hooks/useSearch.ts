import { useContext } from 'react';

import { SearchContext } from '../App';
import type { SearchContextType } from '../types/search';

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === null) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
