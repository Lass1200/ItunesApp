
// Gestion des favoris : ajout, suppression, notation.(asyncstorage)



import { useState, useEffect, useCallback } from 'react';
import { Track, Favorite } from '../types';

// Clé utilisée pour stocker dans AsyncStorage
const STORAGE_KEY = '@itunes_favorites';

const mockStorage: Record<string, string> = {};
const AsyncStorage = {
  getItem: async (key: string) => mockStorage[key] ?? null,
  setItem: async (key: string, value: string) => { mockStorage[key] = value; },
};

interface UseFavoritesReturn {
  favorites: Favorite[];
  addFavorite: (track: Track, rating: number) => Promise<void>;
  removeFavorite: (trackId: number) => Promise<void>;
  updateRating: (trackId: number, rating: number) => Promise<void>;
  isFavorite: (trackId: number) => boolean;
}

// Hook personnalisé pour gérer la liste de favoris.

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  //Chargement initial depuis le stockage local 
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          // On parse le JSON récupéré depuis le stockage
          setFavorites(JSON.parse(stored) as Favorite[]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des favoris :', err);
      }
    };

    loadFavorites();
  }, []); // [] = s'exécute une seule fois au montage du composant

  //Helper : sauvegarder dans AsyncStorage 
  const persist = useCallback(async (updated: Favorite[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setFavorites(updated);
  }, []);

  //Ajouter un favori
  const addFavorite = useCallback(
    async (track: Track, rating: number) => {
      // On vérifie qu'il n'est pas déjà dans les favoris
      if (favorites.some((f) => f.track.id === track.id)) return;

      const newFavorite: Favorite = {
        track,
        rating,
        addedAt: new Date().toISOString(),
      };

      await persist([...favorites, newFavorite]);
    },
    [favorites, persist]
  );

  // Supprimer un favori 
  const removeFavorite = useCallback(
    async (trackId: number) => {
      const updated = favorites.filter((f) => f.track.id !== trackId);
      await persist(updated);
    },
    [favorites, persist]
  );

  // Modifier la note d'un favori
  const updateRating = useCallback(
    async (trackId: number, rating: number) => {
      const updated = favorites.map((f) =>
        f.track.id === trackId ? { ...f, rating } : f
      );
      await persist(updated);
    },
    [favorites, persist]
  );

  // Vérifier si un track est dans les favoris 
  const isFavorite = useCallback(
    (trackId: number): boolean => favorites.some((f) => f.track.id === trackId),
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, updateRating, isFavorite };
};
