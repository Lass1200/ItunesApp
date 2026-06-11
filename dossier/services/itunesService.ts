
// Toute la logique réseau est isolée ici.


import {
  iTunesSearchResponse,
  iTunesRawResult,
  Track,
  SearchMode,
} from '../types';

// URL de base de l'API iTunes Search
const BASE_URL = 'https://itunes.apple.com/search';




 // C'est ici qu'on transforme les données le plus tôt possible
  // (comme recommandé dans le cours).
 
const mapRawResultToTrack = (raw: iTunesRawResult): Track => ({
  id: raw.trackId,
  title: raw.trackName,
  artist: raw.artistName,
  album: raw.collectionName ?? 'Album inconnu',
  // On remplace 100x100 par 600x600 pour avoir une meilleure qualité
  artwork: raw.artworkUrl100.replace('100x100', '600x600'),
  previewUrl: raw.previewUrl ?? null,
  storeUrl: raw.trackViewUrl,
  genre: raw.primaryGenreName,
  // On extrait juste l'année depuis "2023-04-01T00:00:00Z"
  releaseYear: new Date(raw.releaseDate).getFullYear(),
  // Conversion ms → secondes
  durationSeconds: Math.round((raw.trackTimeMillis ?? 0) / 1000),
});

//Fonction principale de recherche

/**
 * Recherche des morceaux sur l'API iTunes.
 *
 * @param query   - Le texte saisi par l'utilisateur
 * @param mode    - 'artist' ou 'track'
 * @param limit   - Nombre max de résultats (défaut : 20)
 * @returns       - Un tableau de Track normalisés
 */
export const searchTracks = async (
  query: string,
  mode: SearchMode,
  limit: number = 20
): Promise<Track[]> => {
  // On construit les query params selon le mode
  const params = new URLSearchParams({
    term: query,
    media: 'music',
    entity: 'song',
    // Pour chercher par artiste on filtre avec artistTerm,
    // pour chercher par titre on utilise le term général
    attribute: mode === 'artist' ? 'artistTerm' : 'songTerm',
    limit: String(limit),
    country: 'FR', // Résultats adaptés à la France
  });

  const url = `${BASE_URL}?${params.toString()}`;

  //  Appel asynchrone avec async/await 
  const response = await fetch(url);

  // On vérifie que la requête s'est bien passée
  if (!response.ok) {
    throw new Error(`Erreur réseau : ${response.status} ${response.statusText}`);
  }

  const data: iTunesSearchResponse = await response.json();

  // On filtre les résultats sans trackId (certains sont des albums)
  // puis on transforme chaque résultat brut en Track propre
  return data.results
    .filter((r) => r.trackId !== undefined)
    .map(mapRawResultToTrack);
};

// Utilitaire : formater la durée 

/**
 * Convertit un nombre de secondes en "mm:ss".
 * Exemple : 213 → "3:33"
 */
export const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};
