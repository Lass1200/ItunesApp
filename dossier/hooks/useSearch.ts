// Custom hook : isole toute la logique de recherche.
// Le composant SearchScreen n'a plus qu'à appeler ce hook.


import { useState, useCallback } from 'react';
import { Track, SearchMode } from '../types';
import { searchTracks } from '../services/itunesService';

interface UseSearchReturn {
  results: Track[];
  loading: boolean;
  error: string | null;
  search: (query: string, mode: SearchMode) => Promise<void>;
  clearResults: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // useCallback évite de recréer la fonction à chaque render
  const search = useCallback(async (query: string, mode: SearchMode) => {
    // On ne lance pas une recherche si le champ est vide
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const tracks = await searchTracks(query, mode);
      setResults(tracks);
    } catch (err) {
      // On transforme l'erreur inconnue en string lisible
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      setResults([]);
    } finally {
      // finally s'exécute toujours, succès ou erreur
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clearResults };
};
